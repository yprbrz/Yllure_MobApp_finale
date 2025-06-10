import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Trash2, Mail, ExternalLink } from 'lucide-react-native';

import { Header } from '@/components/Header';
import DressCard from '@/components/DressCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';

import { useWishlistStore } from '@/store/wishlistStore';
import { useUserStore } from '@/store/userStore';
import { colors, fonts, spacing, shadows } from '@/constants/theme';
import type { Dress } from '@/types';

const { width } = Dimensions.get('window');
const numColumns = width > 768 ? 3 : 2;

export default function WishlistScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const { 
    wishlistItems, 
    isLoading,
    removeFromWishlist,
    clearWishlist,
    fetchWishlist 
  } = useWishlistStore();
  
  const { user } = useUserStore();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWishlist();
    setRefreshing(false);
  };

  const handleRemoveFromWishlist = async (dress: Dress) => {
    Alert.alert(
      'Remove from Wishlist',
      `Are you sure you want to remove "${dress.name}" from your wishlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => removeFromWishlist(dress.id)
        },
      ]
    );
  };

  const handleClearWishlist = () => {
    Alert.alert(
      'Clear Wishlist',
      'Are you sure you want to remove all items from your wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: clearWishlist
        },
      ]
    );
  };

  const navigateToCatalog = () => {
    router.push('/(tabs)/catalog');
  };

  const navigateToLogin = () => {
    router.push('/auth/login');
  };

  const renderDressItem = ({ item }: { item: Dress }) => (
    <View style={styles.dressItem}>
      <DressCard
        dress={item}
        onWishlistToggle={() => handleRemoveFromWishlist(item)}
        isInWishlist={true}
        user={user}
        showRemoveOnly={true}
      />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>My Wishlist</Text>
      <Text style={styles.subtitle}>
        Keep track of your favorite dresses for future reference.
      </Text>
      
      {wishlistItems.length > 0 && (
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <Text style={styles.statsText}>
              {wishlistItems.length} {wishlistItems.length === 1 ? 'dress' : 'dresses'} saved
            </Text>
            <TouchableOpacity 
              onPress={handleClearWishlist}
              style={styles.clearButton}
              activeOpacity={0.7}
            >
              <Trash2 color={colors.error} size={16} strokeWidth={2} />
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  const renderFooter = () => {
    if (wishlistItems.length === 0) return null;
    
    return (
      <View style={styles.footerContainer}>
        <View style={styles.ctaContainer}>
          <Text style={styles.ctaTitle}>Ready to rent?</Text>
          <Text style={styles.ctaDescription}>
            Contact us to check availability and schedule your rental.
          </Text>
          
          <View style={styles.ctaButtons}>
            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={() => {/* Handle contact */}}
              activeOpacity={0.8}
            >
              <Mail color={colors.ivory} size={18} strokeWidth={2} />
              <Text style={styles.ctaButtonText}>Contact Us</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.ctaButtonSecondary}
              onPress={navigateToCatalog}
              activeOpacity={0.8}
            >
              <ExternalLink color={colors.taupe} size={18} strokeWidth={2} />
              <Text style={styles.ctaButtonSecondaryText}>Continue Browsing</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.centeredContainer}>
          <EmptyState
            title="Sign In Required"
            description="Please sign in to view and manage your wishlist"
            actionText="Sign In"
            onAction={navigateToLogin}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading && !refreshing) {
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
      
      <FlatList
        data={wishlistItems}
        renderItem={renderDressItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <EmptyState 
            title="Your wishlist is empty"
            description="Start browsing our collection to add dresses you love!"
            actionText="Browse Collection"
            onAction={navigateToCatalog}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.taupe}
            colors={[colors.taupe]}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
      />
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
  },
  headerContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 32,
    fontWeight: '600',
    color: colors.charcoal,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.taupe,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
    marginBottom: spacing.lg,
  },
  statsContainer: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    ...shadows.subtle,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.charcoal,
    fontWeight: '500',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  clearButtonText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.error,
    fontWeight: '500',
  },
  flatListContent: {
    paddingBottom: spacing.xl,
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
    paddingHorizontal: spacing.md,
  },
  dressItem: {
    flex: 1,
    margin: spacing.sm,
    maxWidth: numColumns > 1 ? (width - spacing.lg * 2) / numColumns - spacing.sm * 2 : undefined,
  },
  footerContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  ctaContainer: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.elegant,
  },
  ctaTitle: {
    fontFamily: fonts.heading,
    fontSize: 24,
    fontWeight: '500',
    color: colors.charcoal,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  ctaDescription: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.taupe,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  ctaButtons: {
    flexDirection: 'column',
    gap: spacing.md,
    width: '100%',
  },
  ctaButton: {
    backgroundColor: colors.taupe,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadows.subtle,
  },
  ctaButtonText: {
    fontFamily: fonts.body,
    fontSize: 16,
    fontWeight: '600',
    color: colors.ivory,
  },
  ctaButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.taupe,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.xl - 2,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  ctaButtonSecondaryText: {
    fontFamily: fonts.body,
    fontSize: 16,
    fontWeight: '600',
    color: colors.taupe,
  },
});