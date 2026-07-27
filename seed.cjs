const fs = require('fs');

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

const gallery = highlightImages.map((src, idx) => ({
  id: 'gal-high-' + idx,
  src,
  category: 'Highlights',
  caption: 'Dhara Divine Awards - Moments ' + (idx + 1),
  priority: 0,
  featured: idx < 9 // first 9 on home page
}));

// Also grab the videos from EventsActivities
const section1Videos = [
  { id: "FbStAM_Zj2I", title: "Sivachariyar S. Ravi Sivaachariyar", duration: "Sivachariyar Seva", category: "Video" },
  { id: "YfHlnUSwxtY", title: "Bhattacharyar Raju @ Lakshmana Bhattar", duration: "Temple Priest Seva", category: "Video" },
  { id: "EuHZEntcPyE", title: "Amman Worship Exponent - Shri Vasu", duration: "Amman Worship", category: "Video" }
];
const section3Videos = [
  { id: "J6BvffQ1ZKQ", title: "Hon'ble Justice (Retd.) Thiru T.N. Vallinayagam", duration: "Madras HC Judge", category: "Video" },
  { id: "IILqWheG9f4", title: "Yatheeswar Raja - Spiritual Music Director", duration: "Spiritual Music", category: "Video" }
];

const events = [...section1Videos, ...section3Videos].map((v, i) => ({
  id: 'ev-vid-' + i,
  title: v.title,
  type: 'video',
  category: v.duration,
  youtubeId: v.id,
  featured: i < 3 // first 3 on home page
}));

const dbPath = './data/db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

db.gallery = gallery;
db.events = events;

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Done seeding gallery and events!');
