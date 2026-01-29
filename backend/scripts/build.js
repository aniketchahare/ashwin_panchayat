const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '../build');
const publicDir = path.join(__dirname, '../public');
const buildPublicDir = path.join(buildDir, 'public');

console.log('Building backend...');
console.log('Build directory:', buildDir);

// Create build directory structure
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
  console.log('✓ Created build directory');
}

// Create public directory in build
if (!fs.existsSync(buildPublicDir)) {
  fs.mkdirSync(buildPublicDir, { recursive: true });
  console.log('✓ Created build/public directory');
}

// Create uploads directory in build/public
const buildUploadsDir = path.join(buildPublicDir, 'uploads');
if (!fs.existsSync(buildUploadsDir)) {
  fs.mkdirSync(buildUploadsDir, { recursive: true });
  fs.writeFileSync(path.join(buildUploadsDir, '.gitkeep'), '');
  console.log('✓ Created build/public/uploads directory');
}

// Copy necessary files to build directory
const filesToCopy = [
  { src: '../server.js', dest: 'server.js' },
  { src: '../package.json', dest: 'package.json' },
  { src: '../.env.example', dest: '.env.example', optional: true },
];

filesToCopy.forEach(({ src, dest, optional }) => {
  const srcPath = path.join(__dirname, src);
  const destPath = path.join(buildDir, dest);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✓ Copied ${dest}`);
  } else if (!optional) {
    console.warn(`⚠ Warning: ${src} not found`);
  }
});

// Copy directories
const dirsToCopy = [
  { src: '../routes', dest: 'routes' },
  { src: '../models', dest: 'models' },
  { src: '../middleware', dest: 'middleware' },
  { src: '../utils', dest: 'utils' },
];

dirsToCopy.forEach(({ src, dest }) => {
  const srcPath = path.join(__dirname, src);
  const destPath = path.join(buildDir, dest);
  
  if (fs.existsSync(srcPath)) {
    copyDirectory(srcPath, destPath);
    console.log(`✓ Copied ${dest}/ directory`);
  }
});

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('\n✅ Backend build completed!');
console.log(`📦 Build output: ${buildDir}`);
console.log('🚀 Ready for production deployment');

