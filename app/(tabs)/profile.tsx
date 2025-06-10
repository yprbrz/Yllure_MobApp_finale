import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera, User, Settings, Heart, Info, LogOut, Mail, Phone } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { Header } from '@/components/Header';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useUserStore } from '@/store/userStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useProfilePhoto } from '@/hooks/useProfilePhoto';
import { colors, fonts, spacing, shadows } from '@/constants/theme';

export default function ProfileScreen() {
  const [isUpdating, setIsUpdating] = useState(false);

  const { user, isLoading, logout } = useUserStore();
  const { wishlistItems } = useWishlistStore();
  const { 
    profilePhoto, 
    saveProfilePhoto, 
    isLoading: photoLoading,
    requestPermissions 
  } = useProfilePhoto();

  useEffect(() => {
    requestPermissions();
  }, []);

  const handleImagePicker = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose how you would like to update your profile photo',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImage },
      ]
    );
  };

  const takePhoto = async () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        await saveProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const pickImage = async () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        await saveProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            setIsUpdating(true);
            await logout();
            router.replace('/auth/login');
            setIsUpdating(false);
          }
        },
      ]
    );
  };

  const navigateToLogin = () => {
    router.push('/auth/login');
  };

  const navigateToWishlist = () => {
    router.push('/(tabs)/wishlist');
  };

  // Show login prompt if user is not authenticated
  if (!user && !isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.centeredContainer}>
          <View style={styles.loginPromptContainer}>
            <User color={colors.taupe} size={64} strokeWidth={1.5} />
            <Text style={styles.loginPromptTitle}>Welcome to Yllure</Text>
            <Text style={styles.loginPromptDescription}>
              Sign in to access your profile, manage your wishlist, and track your rental history.
            </Text>
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={navigateToLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.photoContainer}>
            <TouchableOpacity 
              onPress={handleImagePicker}
              style={styles.photoWrapper}
              activeOpacity={0.8}
              disabled={photoLoading}
            >
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
              ) : (
                <View style={styles.placeholderPhoto}>
                  <User color={colors.taupe} size={48} strokeWidth={1.5} />
                </View>
              )}
              
              <View style={styles.cameraButton}>
                {photoLoading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <Camera color={colors.ivory} size={16} strokeWidth={2} />
                )}
              </View>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity 
            style={styles.statItem}
            onPress={navigateToWishlist}
            activeOpacity={0.7}
          >
            <Heart color={colors.taupe} size={24} strokeWidth={2} />
            <Text style={styles.statNumber}>{wishlistItems.length}</Text>
            <Text style={styles.statLabel}>Wishlist Items</Text>
          </TouchableOpacity>
          
          <View style={styles.statItem}>
            <Settings color={colors.taupe} size={24} strokeWidth={2} />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Rentals</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToWishlist}
            activeOpacity={0.7}
          >
            <Heart color={colors.charcoal} size={20} strokeWidth={2} />
            <Text style={styles.menuItemText}>My Wishlist</Text>
            {wishlistItems.length > 0 && (
              <View style={styles.menuBadge}>
                <Text style={styles.menuBadgeText}>{wishlistItems.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {/* Handle rental history */}}
            activeOpacity={0.7}
          >
            <Settings color={colors.charcoal} size={20} strokeWidth={2} />
            <Text style={styles.menuItemText}>Rental History</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {/* Handle contact */}}
            activeOpacity={0.7}
          >
            <Mail color={colors.charcoal} size={20} strokeWidth={2} />
            <Text style={styles.menuItemText}>Contact Support</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {/* Handle about */}}
            activeOpacity={0.7}
          >
            <Info color={colors.charcoal} size={20} strokeWidth={2} />
            <Text style={styles.menuItemText}>About Yllure</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Information */}
        <View style={styles.contactContainer}>
          <Text style={styles.contactTitle}>Get in Touch</Text>
          <View style={styles.contactItem}>
            <Mail color={colors.taupe} size={16} strokeWidth={2} />
            <Text style={styles.contactText}>contact@yllure.com</Text>
          </View>
          <View style={styles.contactItem}>
            <Phone color={colors.taupe} size={16} strokeWidth={2} />
            <Text style={styles.contactText}>+1 (555) 123-4567</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
          disabled={isUpdating}
        >
          <LogOut color={colors.error} size={20} strokeWidth={2} />
          <Text style={styles.logoutButtonText}>
            {isUpdating ? 'Signing Out...' : 'Sign Out'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ivory,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  loginPromptContainer: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing.xl * 2,
    alignItems: 'center',
    ...shadows.elegant,
  },
  loginPromptTitle: {
    fontFamily: fonts.heading,
    fontSize: 28,
    fontWeight: '500',
    color: colors.charcoal,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  loginPromptDescription: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.taupe,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  loginButton: {
    backgroundColor: colors.taupe,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl * 2,
    borderRadius: 12,
    ...shadows.subtle,
  },
  loginButtonText: {
    fontFamily: fonts.body,
    fontSize: 16,
    fontWeight: '600',
    color: colors.ivory,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  photoContainer: {
    marginBottom: spacing.lg,
  },
  photoWrapper: {
    position: 'relative',
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.champagne,
  },
  placeholderPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.champagne,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.taupe,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.taupe,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.ivory,
    ...shadows.elegant,
  },
  userName: {
    fontFamily: fonts.heading,
    fontSize: 24,
    fontWeight: '500',
    color: colors.charcoal,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.taupe,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: 20,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    ...shadows.subtle,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
  },
  statNumber: {
    fontFamily: fonts.heading,
    fontSize: 32,
    fontWeight: '600',
    color: colors.charcoal,
  },
  statLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.taupe,
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.xl,
    ...shadows.subtle,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
  },
  menuItemText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.charcoal,
    marginLeft: spacing.md,
    flex: 1,
  },
  menuBadge: {
    backgroundColor: colors.taupe,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  menuBadgeText: {
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '600',
    color: colors.ivory,
  },
  contactContainer: {
    backgroundColor: colors.champagne,
    marginHorizontal: spacing.lg,
    borderRadius: 20,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    ...shadows.subtle,
  },
  contactTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    fontWeight: '500',
    color: colors.charcoal,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    justifyContent: 'center',
  },
  contactText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.charcoal,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.xl * 2,
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutButtonText: {
    fontFamily: fonts.body,
    fontSize: 16,
    fontWeight: '500',
    color: colors.error,
  },
});