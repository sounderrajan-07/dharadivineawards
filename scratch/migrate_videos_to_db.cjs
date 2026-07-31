const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

async function run() {
  console.log('Starting video migration to database...');

  // 1. Read MongoDB connection URI from .env
  const envPath = path.join(__dirname, '..', '.env');
  let MONGODB_URI = '';
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=([^\r\n]+)/);
    if (match && match[1]) {
      MONGODB_URI = match[1].trim();
    }
  }

  if (!MONGODB_URI) {
    console.error('No MONGODB_URI found in .env');
    return;
  }

  // 2. Read EventsActivities.jsx and extract video arrays
  const eventsPagePath = path.join(__dirname, '..', 'src', 'components', 'EventsActivities.jsx');
  if (!fs.existsSync(eventsPagePath)) {
    console.error('EventsActivities.jsx not found at', eventsPagePath);
    return;
  }

  const content = fs.readFileSync(eventsPagePath, 'utf8');

  // Helper to extract array content
  const extractArray = (arrayName) => {
    const startIdx = content.indexOf(`const ${arrayName} = [`);
    if (startIdx === -1) return [];
    
    // Find the matching closing bracket '];'
    const openBracketIdx = content.indexOf('[', startIdx);
    let closeBracketIdx = -1;
    let bracketCount = 1;
    
    for (let i = openBracketIdx + 1; i < content.length; i++) {
      if (content[i] === '[') bracketCount++;
      if (content[i] === ']') bracketCount--;
      if (bracketCount === 0) {
        closeBracketIdx = i;
        break;
      }
    }

    if (closeBracketIdx === -1) return [];
    const arrayText = content.substring(openBracketIdx, closeBracketIdx + 1);
    try {
      return eval(arrayText);
    } catch (e) {
      console.error(`Failed to parse ${arrayName}:`, e);
      return [];
    }
  };

  const section1 = extractArray('section1Videos');
  const section2 = extractArray('section2Videos');
  const section3 = extractArray('section3Videos');
  const section4 = extractArray('section4Videos');

  console.log(`Extracted:
    - Section 1: ${section1.length} videos
    - Section 2: ${section2.length} videos
    - Section 3: ${section3.length} videos
    - Section 4: ${section4.length} videos`);

  const allVideos = [...section1, ...section2, ...section3, ...section4];
  console.log(`Total hardcoded videos found: ${allVideos.length}`);

  // Create unified database objects
  const eventDbList = allVideos.map((vid, idx) => ({
    id: `ev-vid-${vid.id}-${Math.floor(Math.random() * 100000)}`,
    type: 'video',
    title: vid.title,
    category: vid.duration, // In EventsActivities duration was used to store category (e.g. "Sivachariyar Seva")
    youtubeId: vid.id,
    image: `https://img.youtube.com/vi/${vid.id}/hqdefault.jpg`,
    description: vid.description || 'Dhara Divine Awards video highlight.',
    featured: idx < 3, // mark first 3 as featured/highlight
    priority: 1000 - idx // high priority to keep original order
  }));

  // 3. Update local database file data/db.json
  const dbJsonPath = path.join(__dirname, '..', 'data', 'db.json');
  if (fs.existsSync(dbJsonPath)) {
    try {
      const localDb = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));
      const existingEvents = localDb.events || [];
      const existingYoutubeIds = new Set(existingEvents.map(e => e.youtubeId).filter(Boolean));

      // Append only missing ones to local db
      const newToLocal = eventDbList.filter(vid => !existingYoutubeIds.has(vid.youtubeId));
      localDb.events = [...existingEvents, ...newToLocal];
      
      fs.writeFileSync(dbJsonPath, JSON.stringify(localDb, null, 2));
      console.log(`Updated local data/db.json with ${newToLocal.length} new videos.`);
    } catch (e) {
      console.error('Failed to update local db.json:', e);
    }
  }

  // 4. Update MongoDB database
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Mongoose connected to Atlas successfully.');

    // Define temporary schema to avoid dependency issues
    const EventSchema = new mongoose.Schema({
      id: { type: String, required: true, unique: true },
      type: { type: String, default: 'image' },
      category: { type: String, default: 'Spiritual Seva' },
      title: { type: String, default: 'Dhara Event' },
      image: { type: String, default: '' },
      description: { type: String, default: '' },
      youtubeId: { type: String },
      duration: { type: String },
      featured: { type: Boolean, default: false },
      priority: { type: Number, default: 0 }
    });

    const EventModel = mongoose.models.Event || mongoose.model('Event', EventSchema);

    // Fetch existing database events
    const dbEvents = await EventModel.find({ type: 'video' }).lean();
    const dbYoutubeIds = new Set(dbEvents.map(ev => ev.youtubeId).filter(Boolean));

    let insertCount = 0;
    for (const vid of eventDbList) {
      if (!dbYoutubeIds.has(vid.youtubeId)) {
        await EventModel.create(vid);
        insertCount++;
      }
    }

    console.log(`MongoDB Atlas sync completed! Inserted ${insertCount} new videos.`);
  } catch (err) {
    console.error('Failed to sync with MongoDB Atlas:', err);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
  }
}

run().catch(console.error);
