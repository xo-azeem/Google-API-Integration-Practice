import { useState } from 'react';
import { AdMobInterstitial } from 'expo-ads-admob/build/AdMobInterstitial';
import { AD_UNIT_IDS } from '../services/admob';

/**
 * Hook to show an interstitial ad
 * 
 * @returns Object with the showAd function
 */
export function useInterstitialAd() {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Show the interstitial ad
   * @returns Promise<boolean> True if the ad was shown successfully
   */
  const showAd = async (): Promise<boolean> => {
    if (isLoading) return false;
    
    try {
      setIsLoading(true);
      
      // Set the ad unit ID
      await AdMobInterstitial.setAdUnitID(AD_UNIT_IDS.INTERSTITIAL);
      
      // Request and load the ad
      await AdMobInterstitial.requestAdAsync();
      
      // Show the ad
      await AdMobInterstitial.showAdAsync();
      return true;
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { showAd, isLoading };
} 