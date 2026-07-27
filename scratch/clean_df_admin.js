const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'df-admin');

if (fs.existsSync(targetDir)) {
  console.log(`Removing folder: ${targetDir}`);
  fs.rmSync(targetDir, { recursive: true, force: true });
  console.log('Folder df-admin removed successfully!');
} else {
  console.log('Folder df-admin does not exist.');
}
