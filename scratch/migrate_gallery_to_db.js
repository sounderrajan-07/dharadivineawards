const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

async function run() {
  console.log('Starting gallery migration to database...');

  // 1. Read MongoDB connection URI from .env
  const envPath = path.join(__dirname, '..', '.env');
  let MONGODB_URI = 'mongodb+srv://soundhers38_db_user:MbGcn2fyLnReShxx@cluster0.yripibj.mongodb.net/dhara_db?retryWrites=true&w=majority&appName=Cluster0';
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=([^\r\n]+)/);
    if (match && match[1]) {
      MONGODB_URI = match[1].trim();
    }
  }
  console.log('Connecting to MongoDB...');

  // 2. Extract section images from GalleryPage.jsx dynamically
  const galleryPagePath = path.join(__dirname, '..', 'src', 'components', 'GalleryPage.jsx');
  const content = fs.readFileSync(galleryPagePath, 'utf8');

  // Find defaultGalleryImages starting point
  const startIdx = content.indexOf('const defaultGalleryImages = [');
  if (startIdx === -1) {
    throw new Error('Could not find defaultGalleryImages inside GalleryPage.jsx');
  }

  // Find the first object '{' after highlightImages mapping
  const sectionStartIdx = content.indexOf('{', startIdx + 30);
  const endIdx = content.indexOf('];', sectionStartIdx);
  const sectionImagesText = content.substring(sectionStartIdx, endIdx).trim();

  // Evaluate the section images text to get the raw array
  const sectionImages = eval('[' + sectionImagesText + ']');
  console.log(`Extracted ${sectionImages.length} section images from GalleryPage.jsx`);

  // Generate highlights
  const highlightImages = [
    ...Array.from({ length: 46 }, (_, i) => `/images/Highlights1/Dhara Divine Awards - Highlight  (${i + 1}).png`),
    ...[
      ...Array.from({ length: 53 }, (_, i) => i + 1),
      55, 56, 57, 58, 59,
      67, 68, 69, 70, 71, 72, 73, 74,
      76, 77, 78, 79, 80, 81, 82,
      ...Array.from({ length: 44 }, (_, i) => i + 84)
    ].map(num => `/images/Highlights1/Dhara Divine Awards - Highlight (${num}).png`),
    ...Array.from({ length: 15 }, (_, i) => `/images/Highlights1/E Dhara Divine Awards - Highlight  (${i + 43}).png`)
  ];

  const highlights = highlightImages.map((src, idx) => ({
    src,
    category: 'Highlights',
    caption: 'Dhara Divine Awards - Moments',
    isHighlight: true
  }));

  const allDefaultImages = [...highlights, ...sectionImages];
  console.log(`Total images to migrate: ${allDefaultImages.length}`);

  // Create unified database objects
  const galleryDbList = allDefaultImages.map((img, idx) => {
    let idPrefix = img.category === 'Highlights' ? 'gal-high-' : 'gal-sec-';
    return {
      id: idPrefix + idx + '-' + Math.floor(Math.random() * 100000),
      src: img.src,
      category: img.category,
      caption: img.caption.replace(/Moments\s+\d+/, 'Moments').trim(), // Strip moments numbering if any
      priority: idx,
      featured: img.category === 'Highlights' && idx < 9
    };
  });

  // 3. Update local database file data/db.json
  const dbJsonPath = path.join(__dirname, '..', 'data', 'db.json');
  if (fs.existsSync(dbJsonPath)) {
    try {
      const localDb = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));
      const existingGallery = localDb.gallery || [];
      const existingSrcs = new Set(existingGallery.map(img => img.src));

      // Append only missing ones to local db
      const newToLocal = galleryDbList.filter(img => !existingSrcs.has(img.src));
      localDb.gallery = [...existingGallery, ...newToLocal];
      
      fs.writeFileSync(dbJsonPath, JSON.stringify(localDb, null, 2));
      console.log(`Updated local data/db.json with ${newToLocal.length} new gallery images.`);
    } catch (e) {
      console.error('Failed to update local db.json:', e);
    }
  }

  // 4. Update MongoDB database
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Mongoose connected to Atlas successfully.');

    // Define temporary schema to avoid dependency issues
    const GallerySchema = new mongoose.Schema({
      id: { type: String, required: true, unique: true },
      src: { type: String, required: true },
      category: { type: String, default: 'Award Ceremony' },
      caption: { type: String, default: 'Dhara Divine Awards' },
      priority: { type: Number, default: 0 },
      featured: { type: Boolean, default: false }
    });

    const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);

    // Fetch existing database images
    const dbImages = await Gallery.find({}).lean();
    const dbSrcs = new Set(dbImages.map(img => img.src));

    let insertCount = 0;
    let updateCount = 0;

    for (const img of galleryDbList) {
      if (dbSrcs.has(img.src)) {
        // Strip numbers from existing database moment captions
        if (img.category === 'Highlights') {
          await Gallery.updateOne({ src: img.src }, { $set: { caption: 'Dhara Divine Awards - Moments' } });
          updateCount++;
        }
      } else {
        await Gallery.create(img);
        insertCount++;
      }
    }

    console.log(`MongoDB Atlas sync completed! Inserted ${insertCount} new images, updated ${updateCount} moment captions.`);
  } catch (err) {
    console.error('Failed to sync with MongoDB Atlas:', err);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
  }
}

run().catch(console.error);
