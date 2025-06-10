import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Heart, Search, ArrowRight } from 'lucide-react-native';

import { Header } from '@/components/Header';
import DressCard from '@/components/DressCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';

import { useDressStore } from '@/store/dressStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUserStore } from '@/store/userStore';
import { colors, fonts, spacing, shadows } from '@/constants/theme';
import type { Dress } from '@/types';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [sloganVisible, setSloganVisible] = useState(false);

  const { 
    featuredDresses, 
    isLoading, 
    fetchFeaturedDresses 
  } = useDressStore();
  
  const { 
    wishlistItems, 
    addToWishlist, 
    removeFromWishlist,
    isInWishlist 
  } = useWishlistStore();
  
  const { user } = useUserStore();

  useEffect(() => {
    fetchFeaturedDresses();
    // Show slogan animation after component mounts
    const timer = setTimeout(() => setSloganVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFeaturedDresses();
    setRefreshing(false);
  };

  const handleWishlistToggle = async (dress: Dress) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (isInWishlist(dress.id)) {
      await removeFromWishlist(dress.id);
    } else {
      await addToWishlist(dress);
    }
  };

  const navigateToCatalog = () => {
    router.push('/(tabs)/catalog');
  };

  const navigateToWishlist = () => {
    router.push('/(tabs)/wishlist');
  };

  const navigateToSearch = () => {
    router.push('/search');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.taupe}
            colors={[colors.taupe]}
          />
        }
      >
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={['rgba(28, 28, 28, 0.7)', 'rgba(28, 28, 28, 0.3)']}
            style={styles.heroGradient}
          />
          <View style={styles.heroContent}>
            <Text 
              style={[
                styles.heroTitle,
                { opacity: sloganVisible ? 1 : 0 }
              ]}
            >
              Elegance in Every Curve
            </Text>
            <Text style={styles.heroSubtitle}>
              Yllure offers premium dress rentals for every occasion.
              Experience luxury fashion without commitment.
            </Text>
            <TouchableOpacity 
              style={styles.heroCta}
              onPress={navigateToCatalog}
              activeOpacity={0.8}
            >
              <Text style={styles.heroCtaText}>Explore Collection</Text>
              <ArrowRight color={colors.ivory} size={18} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={navigateToSearch}
            activeOpacity={0.7}
          >
            <Search color={colors.taupe} size={24} strokeWidth={2} />
            <Text style={styles.quickActionText}>Search Dresses</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={navigateToWishlist}
            activeOpacity={0.7}
          >
            <Heart color={colors.taupe} size={24} strokeWidth={2} />
            <Text style={styles.quickActionText}>My Wishlist</Text>
            {wishlistItems.length > 0 && (
              <View style={styles.wishlistBadge}>
                <Text style={styles.wishlistBadgeText}>
                  {wishlistItems.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Featured Dresses Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured This Week</Text>
            <TouchableOpacity onPress={navigateToCatalog} activeOpacity={0.7}>
              <Text style={styles.sectionLink}>View All</Text>
            </TouchableOpacity>
          </View>

          {isLoading && !refreshing ? (
            <LoadingSpinner />
          ) : featuredDresses.length === 0 ? (
            <EmptyState 
              title="No Featured Dresses"
              description="Check back soon for new arrivals"
              actionText="Browse Catalog"
              onAction={navigateToCatalog}
            />
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
            >
              {featuredDresses.map((dress) => (
                <View key={dress.id} style={styles.featuredDressCard}>
                  <DressCard
                    dress={dress}
                    onWishlistToggle={() => handleWishlistToggle(dress)}
                    isInWishlist={isInWishlist(dress.id)}
                    user={user}
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>About Yllure</Text>
          <Text style={styles.aboutText}>
            Yllure was founded with a simple mission: to provide elegant, 
            high-quality dress rentals for every woman and every occasion.
          </Text>
          <Text style={styles.aboutText}>
            We believe that every woman deserves to feel beautiful and confident. 
            Our curated collection features stunning pieces for every occasion, 
            from formal events to casual gatherings.
          </Text>
          <TouchableOpacity 
            style={styles.aboutCta}
            onPress={navigateToCatalog}
            activeOpacity={0.8}
          >
            <Text style={styles.aboutCtaText}>Explore Collection</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ivory,
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    height: width * 0.8,
    backgroundColor: colors.charcoal,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    zIndex: 1,
  },
  heroTitle: {
    fontFamily: fonts.heading,
    fontSize: 42,
    fontWeight: '300',
    color: colors.ivory,
    textAlign: 'center',
    marginBottom: spacing.lg,
    letterSpacing: -0.5,
    lineHeight: 48,
  },
  heroSubtitle: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ivory,
    textAlign: 'center',
    marginBottom: spacing.xl,
    opacity: 0.9,
    lineHeight: 24,
  },
  heroCta: {
    backgroundColor: colors.taupe,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.elegant,
  },
  heroCtaText: {
    fontFamily: fonts.body,
    fontSize: 16,
    fontWeight: '600',
    color: colors.ivory,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
    gap: spacing.sm,
    position: 'relative',
    ...shadows.subtle,
  },
  quickActionText: {
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '500',
    color: colors.charcoal,
  },
  wishlistBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.taupe,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  wishlistBadgeText: {
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '600',
    color: colors.ivory,
  },
  sectionContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 24,
    fontWeight: '500',
    color: colors.charcoal,
  },
  sectionLink: {
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '500',
    color: colors.taupe,
  },
  horizontalScrollContent: {
    paddingRight: spacing.lg,
  },
  featuredDressCard: {
    width: width * 0.7,
    marginRight: spacing.md,
  },
  aboutSection: {
    backgroundColor: colors.champagne,
    margin: spacing.lg,
    padding: spacing.xl,
    borderRadius: 20,
    ...shadows.subtle,
  },
  aboutTitle: {
    fontFamily: fonts.heading,
    fontSize: 24,
    fontWeight: '500',
    color: colors.charcoal,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  aboutText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.charcoal,
    lineHeight: 24,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  aboutCta: {
    backgroundColor: colors.taupe,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: spacing.md,
    ...shadows.subtle,
  },
  aboutCtaText: {
    fontFamily: fonts.body,
    fontSize: 16,
    fontWeight: '600',
    color: colors.ivory,
  },
});