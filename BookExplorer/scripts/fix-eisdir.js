/**
 * Script to fix EISDIR errors
 * Run with: node scripts/fix-eisdir.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

console.log(`${colors.cyan}🔍 Searching for potential EISDIR issues...${colors.reset}`);

// These are common paths that can cause EISDIR errors
const problematicPaths = [
  'node_modules/expo-ads-admob/build/AdMob.js',
  'node_modules/expo-ads-admob/build/index.js',
  'node_modules/expo-ads-admob/build/AdMobBanner.js',
  'node_modules/expo-ads-admob/build/AdMobInterstitial.js',
  'node_modules/react-native/index.js',
];

let fixed = 0;
let skipped = 0;

for (const relativePath of problematicPaths) {
  const fullPath = path.resolve(__dirname, '..', relativePath);
  
  try {
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        console.log(`${colors.yellow}⚠️ Found directory instead of file: ${relativePath}${colors.reset}`);
        console.log(`${colors.yellow}   Removing directory...${colors.reset}`);
        
        // Remove the directory
        fs.rmSync(fullPath, { recursive: true, force: true });
        
        // Get the directory containing the file
        const dirPath = path.dirname(fullPath);
        
        // Make sure package is reinstalled to recreate files
        console.log(`${colors.yellow}   Reinstalling package...${colors.reset}`);
        
        const packageName = relativePath.split('/')[0];
        execSync(`npm install ${packageName} --force`, { stdio: 'ignore' });
        
        fixed++;
        console.log(`${colors.green}✅ Fixed: ${relativePath}${colors.reset}`);
      } else {
        skipped++;
      }
    }
  } catch (error) {
    console.error(`${colors.red}❌ Error checking ${relativePath}: ${error.message}${colors.reset}`);
  }
}

console.log(`${colors.cyan}📊 Results: Fixed ${fixed} issues, ${skipped} paths were already correct.${colors.reset}`);

if (fixed > 0) {
  console.log(`${colors.green}✅ Successfully fixed EISDIR issues!${colors.reset}`);
  console.log(`${colors.cyan}ℹ️  Now run 'npx expo start --clear' to start the project with a clean state.${colors.reset}`);
} else {
  console.log(`${colors.yellow}⚠️ No EISDIR issues found to fix.${colors.reset}`);
  console.log(`${colors.cyan}ℹ️  The issue might be elsewhere. Try running 'npm run reset-project' or reinstalling node_modules.${colors.reset}`);
} 