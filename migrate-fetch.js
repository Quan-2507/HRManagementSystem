const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'frontend/apps/web/src/app');

function walkSync(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      filelist = walkSync(filepath, filelist);
    } else if (file.endsWith('.tsx') && file !== 'page.tsx' && file !== 'layout.tsx') {
        // actually only interested in page.tsx inside subfolders
    }
    if (file === 'page.tsx' && dir !== directoryPath) {
        filelist.push(filepath);
    }
  }
  return filelist;
}

const files = walkSync(directoryPath);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('fetch(') || content.includes('localStorage.getItem(\'token\')')) {
    // skip login page
    if (file.includes('login')) return;

    // Add import if not exists
    if (!content.includes('fetchApi')) {
      content = content.replace(/import React/, "import { fetchApi } from '@/lib/api';\nimport React");
    }

    // Replace fetch( with fetchApi(
    content = content.replace(/await fetch\(/g, 'await fetchApi(');
    
    // Remove token header logic
    content = content.replace(/const token = localStorage\.getItem\('token'\);/g, '');
    content = content.replace(/'Authorization': `Bearer \$\{token\}`/g, '');
    content = content.replace(/'Authorization': `Bearer \$\{localStorage\.getItem\('token'\)\}`/g, '');
    
    // Clean up empty headers or trailing commas left by the regex
    content = content.replace(/headers:\s*{\s*(?:'Content-Type':\s*'application\/json',\s*)?},?/g, '');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
