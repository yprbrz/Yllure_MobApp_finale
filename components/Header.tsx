import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, User } from 'lucide-react-native';
import { router } from 'expo-router';

import { useUserStore } from '@/store/userStore';
import { colors, fonts, spacing, shadows } from '@/constants/theme';

export function Header() {
  const { user } = useUserStore();

  const navigateToSearch = () => {
    router.push('/search');
  };

  const navigateToProfile = () => {
    router.push('/(tabs)/profile');
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.ivory} />
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={navigateToSearch}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Search color={colors.charcoal} size={24} strokeWidth={2} />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Text style={styles.logo}>Yllure</Text>
            <Text style={styles.tagline}>Elegance in Every Curve</Text>
          </View>

          <TouchableOpacity 
            onPress={navigateToProfile}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <User 
              color={user ? colors.taupe : colors.charcoal} 
              size={24} 
              strokeWidth={2} 
            />
            {user && <View style={styles.authenticatedIndicator} />}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.ivory,
    borderBottomWidth: 1,
    borderBottomColor: colors.champagne,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 60,
  },
  logoContainer: {
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    fontFamily: fonts.heading,
    fontSize: 28,
    fontWeight: '600',
    color: colors.charcoal,
    letterSpacing: -0.5,
  },
  tagline: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.taupe,
    fontStyle: 'italic',
    letterSpacing: 0.5,
    marginTop: -2,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    position: 'relative',
    ...shadows.subtle,
  },
  authenticatedIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.taupe,
  },
});