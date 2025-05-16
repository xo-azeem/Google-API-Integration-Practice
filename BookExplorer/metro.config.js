// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

/** @type {import('expo/metro-config').MetroConfig} */
const defaultConfig = getDefaultConfig(__dirname);

// Add resolver to handle issues with Metro trying to read directories as files
defaultConfig.resolver.blockList = [
  /node_modules\/.*\/node_modules\/react-native\/.*/,
];

// Add a custom file system to handle directory reads
defaultConfig.watchFolders = [path.resolve(__dirname, 'node_modules')];

// Custom transformer to handle EISDIR errors
defaultConfig.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

// Custom resolver to handle common issues
defaultConfig.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'json'];
defaultConfig.resolver.assetExts = ['bmp', 'gif', 'jpg', 'jpeg', 'png', 'psd', 'svg', 'webp', 'ttf', 'otf', 'woff', 'woff2'];

// Override resolver for specific problematic modules
defaultConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle nanoid/non-secure specifically
  if (moduleName === 'nanoid/non-secure') {
    const nanoidPath = path.resolve(__dirname, 'node_modules/nanoid/non-secure/index.js');
    
    // If the .js file doesn't exist, copy from .cjs
    if (!fs.existsSync(nanoidPath) && fs.existsSync(nanoidPath.replace('.js', '.cjs'))) {
      try {
        fs.copyFileSync(nanoidPath.replace('.js', '.cjs'), nanoidPath);
        console.log(`Created ${nanoidPath} from .cjs file`);
      } catch (e) {
        console.error(`Error copying nanoid file: ${e.message}`);
      }
    }
    
    return {
      filePath: nanoidPath,
      type: 'sourceFile',
    };
  }
  
  // Handle other problematic modules here
  
  // Fall back to default resolution
  return context.resolveRequest(context, moduleName, platform);
};

// Override fileSystem to prevent directory reads
defaultConfig.server = {
  ...defaultConfig.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Special handling for nanoid
      if (req.url && req.url.includes('nanoid/non-secure')) {
        // Redirect to index.js file if it exists
        try {
          const nanoidJsPath = path.join(__dirname, 'node_modules/nanoid/non-secure/index.js');
          const nanoidCjsPath = path.join(__dirname, 'node_modules/nanoid/non-secure/index.cjs');
          
          if (!fs.existsSync(nanoidJsPath) && fs.existsSync(nanoidCjsPath)) {
            fs.copyFileSync(nanoidCjsPath, nanoidJsPath);
            console.log(`Created ${nanoidJsPath} from .cjs file via middleware`);
          }
        } catch (e) {
          // Ignore errors
        }
      }
      
      // Handle directory read errors
      if (req.url && req.url.includes('node_modules')) {
        try {
          const parts = req.url.split('?')[0].split('/');
          const potentialPath = path.join(__dirname, ...parts);
          
          if (fs.existsSync(potentialPath) && fs.statSync(potentialPath).isDirectory()) {
            return res.status(404).send('Not found');
          }
        } catch (e) {
          // Ignore errors and let Metro handle it
        }
      }
      
      return middleware(req, res, next);
    };
  }
};

module.exports = defaultConfig; 