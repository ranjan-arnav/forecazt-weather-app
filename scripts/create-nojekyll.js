const fs = require('fs');
const path = require('path');

// Create .nojekyll file in the out directory
const outDir = path.join(process.cwd(), 'out');
const nojekyllPath = path.join(outDir, '.nojekyll');

try {
  // Ensure out directory exists
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
    console.log('✓ Created out directory');
  }
  
  // Create empty .nojekyll file
  fs.writeFileSync(nojekyllPath, '');
  console.log('✓ Created .nojekyll file for GitHub Pages');
} catch (error) {
  console.error('❌ Error creating .nojekyll file:', error.message);
  process.exit(1);
}
