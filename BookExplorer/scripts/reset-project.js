/**
 * Script to reset the project and clean caches
 * Run with: npm run reset-project
 */
const { execSync } = require('child_process');
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

console.log(`${colors.cyan}🧹 Starting project cleanup...${colors.reset}`);

try {
  // Delete cache directories
  const cacheDirs = [
    path.resolve(__dirname, '../node_modules/.cache'),
    path.resolve(__dirname, '../.expo'),
    path.resolve(__dirname, '../.babel-cache'),
    path.resolve(__dirname, '../.yarn-cache'),
  ];
  
  for (const dir of cacheDirs) {
    if (fs.existsSync(dir)) {
      console.log(`${colors.yellow}Removing ${dir}${colors.reset}`);
      execSync(`rm -rf "${dir}"`);
    }
  }
  
  // Clean temp files that might cause issues
  const tempDirs = [
    path.resolve(__dirname, '../node_modules/expo-ads-admob/build/AdMob.js'),
    path.resolve(__dirname, '../node_modules/expo-ads-admob/build/index.js'),
  ];
  
  for (const file of tempDirs) {
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      console.log(`${colors.yellow}Found directory where file should be, removing: ${file}${colors.reset}`);
      execSync(`rm -rf "${file}"`);
    }
  }
  
  // Clear watchman watches if available
  try {
    console.log(`${colors.yellow}Clearing Watchman watches...${colors.reset}`);
    execSync('watchman watch-del-all');
  } catch (e) {
    console.log(`${colors.yellow}Watchman not available, skipping...${colors.reset}`);
  }
  
  // Clear Metro bundler cache
  console.log(`${colors.yellow}Cleaning Metro bundler cache...${colors.reset}`);
  try {
    execSync('npx react-native start --reset-cache --no-interactive', { stdio: 'ignore', timeout: 5000 });
  } catch (e) {
    // This command often times out, which is normal
    console.log(`${colors.yellow}Metro cache cleared (or timed out, which is normal)${colors.reset}`);
  }
  
  // Fix potential issues with node_modules
  console.log(`${colors.yellow}Fixing potential issues with expo-ads-admob...${colors.reset}`);
  try {
    // Ensure the build directory exists
    const buildDir = path.resolve(__dirname, '../node_modules/expo-ads-admob/build');
    if (!fs.existsSync(buildDir)) {
      fs.mkdirSync(buildDir, { recursive: true });
    }
    
    // Check if AdMob.js and index.js are directories instead of files, which causes EISDIR errors
    const filesToCheck = ['AdMob.js', 'index.js', 'AdMobBanner.js', 'AdMobInterstitial.js'];
    
    for (const file of filesToCheck) {
      const filePath = path.join(buildDir, file);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        console.log(`${colors.red}Found directory instead of file: ${filePath}, removing it...${colors.reset}`);
        fs.rmSync(filePath, { recursive: true, force: true });
      }
    }
  } catch (e) {
    console.error(`${colors.red}Error fixing expo-ads-admob: ${e.message}${colors.reset}`);
  }
  
  // Finished successfully
  console.log(`${colors.green}✅ Project cleanup complete!${colors.reset}`);
  console.log(`${colors.cyan}ℹ️  Now run 'npx expo start --clear' to start the project with a clean state.${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}❌ Error during cleanup:${colors.reset}`, error);
  process.exit(1);
}
