/**
 * Script to fix nanoid module resolution issues
 * Run with: node scripts/fix-nanoid.js
 */
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

console.log(`${colors.cyan}🔍 Fixing nanoid module...${colors.reset}`);

const nanoidDir = path.join(__dirname, '..', 'node_modules', 'nanoid', 'non-secure');
const packageJsonPath = path.join(nanoidDir, 'package.json');
const indexPath = path.join(nanoidDir, 'index.cjs');
const indexJsPath = path.join(nanoidDir, 'index.js');

try {
  // Check if package.json exists
  if (fs.existsSync(packageJsonPath)) {
    console.log(`${colors.yellow}Found nanoid/non-secure/package.json${colors.reset}`);
    
    // Read the package.json content
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    console.log(`${colors.yellow}Current main field: ${packageJson.main}${colors.reset}`);
    
    // Update the main field to point to index.js instead of index.cjs
    packageJson.main = './index.js';
    
    // Write the updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`${colors.green}Updated package.json to point to ./index.js${colors.reset}`);
    
    // Check if index.cjs exists but index.js doesn't
    if (fs.existsSync(indexPath) && !fs.existsSync(indexJsPath)) {
      // Create a simple adapter index.js that requires the .cjs file
      const adapterContent = `
// This file was created by fix-nanoid.js to resolve module issues
// It's a simple adapter that loads the actual implementation from index.cjs
module.exports = require('./index.cjs');
`;
      fs.writeFileSync(indexJsPath, adapterContent);
      console.log(`${colors.green}Created adapter index.js file${colors.reset}`);
    }
    
    console.log(`${colors.green}✅ nanoid module fix applied successfully!${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ nanoid/non-secure/package.json not found!${colors.reset}`);
  }
  
  // Also create the adapter file in the parent nanoid directory
  const nanoidParentDir = path.join(__dirname, '..', 'node_modules', 'nanoid');
  const nonSecureDir = path.join(nanoidParentDir, 'non-secure');
  
  // Create the directory if it doesn't exist
  if (!fs.existsSync(nonSecureDir)) {
    fs.mkdirSync(nonSecureDir, { recursive: true });
    console.log(`${colors.yellow}Created nanoid/non-secure directory${colors.reset}`);
  }
  
  // Create the index.js file
  const nonSecureIndexPath = path.join(nonSecureDir, 'index.js');
  const nonSecureContent = `
// This file was created by fix-nanoid.js to resolve module issues
// It provides a simple implementation of non-secure nanoid
function nanoid(size = 21) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < size; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

module.exports = { nanoid };
`;
  
  fs.writeFileSync(nonSecureIndexPath, nonSecureContent);
  console.log(`${colors.green}Created nanoid/non-secure/index.js with a simple implementation${colors.reset}`);
  
  // Create a package.json for the non-secure dir if it doesn't exist
  const nonSecurePackageJsonPath = path.join(nonSecureDir, 'package.json');
  if (!fs.existsSync(nonSecurePackageJsonPath)) {
    const packageJson = {
      name: "nanoid-non-secure",
      main: "./index.js",
      version: "1.0.0"
    };
    fs.writeFileSync(nonSecurePackageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`${colors.green}Created nanoid/non-secure/package.json${colors.reset}`);
  }
  
} catch (error) {
  console.error(`${colors.red}❌ Error fixing nanoid module: ${error.message}${colors.reset}`);
}

console.log(`${colors.cyan}ℹ️  Now run 'npx expo start --clear' to start the project with a clean state.${colors.reset}`); 