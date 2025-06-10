import React, { createContext, useContext, useEffect, useState } from 'react';
import { useFonts, CormorantGaramond_400Regular } from '@expo-google-fonts/cormorant-garamond';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

interface FontContextType {
  fontsLoaded: boolean;
  fontError: Error | null;
}

const FontContext = createContext<FontContextType>({
  fontsLoaded: false,
  fontError: null,
});

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [fontsLoaded, fontError] = useFonts({
    CormorantGaramond_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <FontContext.Provider value={{ fontsLoaded, fontError }}>
      {children}
    </FontContext.Provider>
  );
}

export function useFontContext() {
  return useContext(FontContext);
}