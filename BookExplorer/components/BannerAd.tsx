import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AdMobBanner } from 'expo-ads-admob/build/index';
import { AD_UNIT_IDS } from '../services/admob';

interface BannerAdProps {
  style?: object;
}

export default function BannerAd({ style }: BannerAdProps) {
  const [adError, setAdError] = useState(false);

  const handleError = (error: string) => {
    console.error('Banner ad error:', error);
    setAdError(true);
  };

  if (adError) {
    // Return an empty view with the same height to prevent layout shifts
    return <View style={[styles.container, style, { height: 50 }]} />;
  }

  return (
    <View style={[styles.container, style]}>
      <AdMobBanner
        bannerSize="banner"
        adUnitID={AD_UNIT_IDS.BANNER}
        servePersonalizedAds={false}
        onDidFailToReceiveAdWithError={handleError}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});