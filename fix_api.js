const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

let modifiedCount = 0;
walkDir('app', (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('api.get') && !content.includes('import { api }')) {
    // Add import after the first block of imports
    const match = content.match(/^(?:import .*?;?\s*)+/m);
    if (match) {
        content = content.replace(match[0], match[0] + "import { api } from '@/lib/api/client';\n");
        fs.writeFileSync(filePath, content);
        console.log('Fixed', filePath);
        modifiedCount++;
    }
  }
});
console.log('Total files fixed:', modifiedCount);
