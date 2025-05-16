import { Platform } from 'react-native';

// Directly import from files to avoid EISDIR errors
import { setTestDeviceIDAsync, requestPermissionsAsync } from 'expo-ads-admob/build/AdMob';
import * as AdMobInterstitial from 'expo-ads-admob/build/AdMobInterstitial';

// These are test ad unit IDs from AdMob documentation
// Replace these with your actual ad unit IDs from AdMob console
const TEST_IDS = {
  BANNER: Platform.select({
    ios: 'ca-app-pub-3940256099942544/2934735716',
    android: 'ca-app-pub-3940256099942544/6300978111',
    default: 'ca-app-pub-3940256099942544/6300978111',
  }),
  INTERSTITIAL: Platform.select({
    ios: 'ca-app-pub-3940256099942544/4411468910',
    android: 'ca-app-pub-3940256099942544/1033173712',
    default: 'ca-app-pub-3940256099942544/1033173712',
  }),
};

// Production ad unit IDs
export const AD_UNIT_IDS = {
  BANNER: __DEV__ ? TEST_IDS.BANNER : 'ca-app-pub-6272103758444942/9849585187',
  INTERSTITIAL: __DEV__ ? TEST_IDS.INTERSTITIAL : 'ca-app-pub-6272103758444942/1468532288',
};

// App ID: ca-app-pub-6272103758444942~4158274800
export async function initializeAdMob() {
  // Request permissions if needed
  await requestPermissionsAsync();
  
  // Set test device ID if in development
  if (__DEV__) {
    await setTestDeviceIDAsync('EMULATOR');
  }
  
  console.log('AdMob initialized');
}

// Function to load and show an interstitial ad
export async function showInterstitialAd() {
  try {
    // Load the interstitial ad
    await AdMobInterstitial.setAdUnitID(AD_UNIT_IDS.INTERSTITIAL);
    await AdMobInterstitial.requestAdAsync();
    
    // Show the ad
    await AdMobInterstitial.showAdAsync();
    return true;
  } catch (error) {
    console.error('Error showing interstitial ad:', error);
    return false;
  }
}

// Function to get banner ad size
export function getBannerAdSize() {
  return 'banner';
}