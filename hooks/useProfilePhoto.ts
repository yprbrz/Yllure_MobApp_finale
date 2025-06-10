import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

const PROFILE_PHOTO_KEY = 'yllure_profile_photo';

export function useProfilePhoto() {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProfilePhoto();
  }, []);

  const loadProfilePhoto = async () => {
    try {
      const stored = await AsyncStorage.getItem(PROFILE_PHOTO_KEY);
      if (stored) {
        setProfilePhoto(stored);
      }
    } catch (error) {
      console.error('Failed to load profile photo:', error);
    }
  };

  const saveProfilePhoto = async (uri: string) => {
    setIsLoading(true);
    try {
      await AsyncStorage.setItem(PROFILE_PHOTO_KEY, uri);
      setProfilePhoto(uri);
    } catch (error) {
      console.error('Failed to save profile photo:', error);
      Alert.alert('Error', 'Failed to save profile photo');
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      // Request camera permissions
      const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraResult.status !== 'granted') {
        console.log('Camera permission denied');
      }

      // Request media library permissions
      const mediaResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaResult.status !== 'granted') {
        console.log('Media library permission denied');
      }
    }
  };

  const clearProfilePhoto = async () => {
    try {
      await AsyncStorage.removeItem(PROFILE_PHOTO_KEY);
      setProfilePhoto(null);
    } catch (error) {
      console.error('Failed to clear profile photo:', error);
    }
  };

  return {
    profilePhoto,
    isLoading,
    saveProfilePhoto,
    clearProfilePhoto,
    requestPermissions,
  };
}