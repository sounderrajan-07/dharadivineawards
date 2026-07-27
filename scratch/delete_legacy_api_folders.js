const fs = require('fs');
const path = require('path');

const folders = [
  path.join(__dirname, '..', 'api', 'models'),
  path.join(__dirname, '..', 'api', 'lib')
];

folders.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Deleted folder: ${dir}`);
  }
});
