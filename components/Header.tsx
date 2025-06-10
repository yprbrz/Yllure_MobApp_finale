import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { router } from 'expo-router';

import { colors, fonts, spacing, shadows } from '@/constants/theme';

export function Header() {
  const navigateToSearch = () => {
    router.push('/search');
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
            <Search color={colors.charcoal} size={20} strokeWidth={2} />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Text style={styles.logo}>Yllure</Text>
            <Text style={styles.tagline}>Elegance in Every Curve</Text>
          </View>

          {/* Empty view for balance */}
          <View style={styles.spacer} />
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
    paddingHorizontal: spacing.md, // Reduced from spacing.lg
    paddingVertical: spacing.sm,   // Reduced from spacing.md
    minHeight: 40,                 // Reduced from 60
  },
  logoContainer: {
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    fontFamily: fonts.heading,
    fontSize: 24,      // Reduced from 28
    fontWeight: '600',
    color: colors.charcoal,
    letterSpacing: -0.5,
  },
  tagline: {
    fontFamily: fonts.body,
    fontSize: 9,       // Reduced from 10
    color: colors.taupe,
    fontStyle: 'italic',
    letterSpacing: 0.5,
    marginTop: -2,
  },
  iconButton: {
    width: 36,         // Reduced from 44
    height: 36,        // Reduced from 44
    borderRadius: 18,  // Reduced from 22
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    ...shadows.subtle,
  },
  spacer: {
    width: 36,         // Same width as iconButton for balance
    height: 36,
  },
});