const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Error: MONGODB_URI is not set in your .env file!");
  process.exit(1);
}

// Define the Schema matching our model
const NewsSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  seekTime: { type: Number, default: 2 }
});

const News = mongoose.models.News || mongoose.model('News', NewsSchema);

async function run() {
  console.log("Connecting to MongoDB Atlas...");
  try {
    await mongoose.connect(uri);
    console.log("Connected successfully!");

    // Update news-vid-1 seekTime to 10
    console.log("Updating seekTime for news-vid-1 (Part 1)...");
    const result1 = await News.updateOne(
      { id: 'news-vid-1' },
      { $set: { seekTime: 10 } }
    );
    console.log(`Update result for news-vid-1:`, result1);

    // Set other video seekTimes to 2 if not set
    console.log("Setting default seekTime for other video news items...");
    const resultOthers = await News.updateMany(
      { id: { $ne: 'news-vid-1' }, seekTime: { $exists: false } },
      { $set: { seekTime: 2 } }
    );
    console.log(`Update result for others:`, resultOthers);

    console.log("Database update completed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
}

run();
