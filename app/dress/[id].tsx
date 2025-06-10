import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Heart, Share2, ShoppingBag } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useDressStore } from '@/store/dressStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUserStore } from '@/store/userStore';
import { colors, fonts, spacing, shadows } from '@/constants/theme';
import type { Dress } from '@/types';

const { width, height } = Dimensions.get('window');

export default function DressDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [dress, setDress] = useState<Dress | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { fetchDress } = useDressStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { user } = useUserStore();

  useEffect(() => {
    loadDress();
  }, [id]);

  const loadDress = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const dressData = await fetchDress(id);
      setDress(dressData);
    } catch (error) {
      console.error('Failed to load dress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!dress || !user) {
      router.push('/auth/login');
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (isInWishlist(dress.id)) {
      await removeFromWishlist(dress.id);
    } else {
      await addToWishlist(dress);
    }
  };

  const handleShare = async () => {
    if (!dress) return;

    try {
      const result = await Share.share({
        message: `Check out this beautiful dress: ${dress.name} - ${formatPrice(dress.price)}`,
        url: dress.frontImage, // On iOS, this will be included
        title: dress.name,
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const goBack = () => {
    router.back();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const toggleImage = () => {
    if (dress?.backImage && dress.backImage !== dress.frontImage) {
      setCurrentImageIndex(currentImageIndex === 0 ? 1 : 0);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (!dress) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Dress Not Found</Text>
          <Text style={styles.errorDescription}>
            Sorry, we couldn't find the dress you're looking for.
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const images = [dress.frontImage];
  if (dress.backImage && dress.backImage !== dress.frontImage) {
    images.push(dress.backImage);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={goBack}
            activeOpacity={0.8}
          >
            <ArrowLeft color={colors.charcoal} size={24} strokeWidth={2} />
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <Share2 color={colors.charcoal} size={24} strokeWidth={2} />
            </TouchableOpacity>

            {user && (
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleWishlistToggle}
                activeOpacity={0.8}
              >
                <Heart 
                  color={isInWishlist(dress.id) ? colors.taupe : colors.charcoal}
                  size={24} 
                  strokeWidth={2}
                  fill={isInWishlist(dress.id) ? colors.taupe : 'none'}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Image Carousel */}
        <View style={styles.imageContainer}>
          <TouchableOpacity 
            onPress={toggleImage}
            activeOpacity={0.9}
            disabled={images.length === 1}
          >
            <Image
              source={{ uri: images[currentImageIndex] }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Image indicators */}
          {images.length > 1 && (
            <View style={styles.imageIndicators}>
              {images.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.indicator,
                    currentImageIndex === index && styles.indicatorActive,
                  ]}
                  onPress={() => setCurrentImageIndex(index)}
                  activeOpacity={0.7}
                />
              ))}
            </View>
          )}

          {/* Unavailable overlay */}
          {!dress.available && (
            <View style={styles.unavailableOverlay}>
              <View style={styles.unavailableBadge}>
                <Text style={styles.unavailableText}>Currently Unavailable</Text>
              </View>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{dress.name}</Text>
            <Text style={styles.price}>{formatPrice(dress.price)}</Text>
          </View>

          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Size:</Text>
              <Text style={styles.detailValue}>{dress.size}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text style={[
                styles.detailValue,
                { color: dress.available ? colors.success : colors.error }
              ]}>
                {dress.available ? 'Available' : 'Unavailable'}
              </Text>
            </View>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{dress.description}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            {dress.available ? (
              <TouchableOpacity 
                style={styles.rentButton}
                onPress={() => {/* Handle rent action */}}
                activeOpacity={0.8}
              >
                <ShoppingBag color={colors.ivory} size={20} strokeWidth={2} />
                <Text style={styles.rentButtonText}>Contact to Rent</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.unavailableButton}>
                <Text style={styles.unavailableButtonText}>Currently Unavailable</Text>
              </View>
            )}

            {!user && (
              <TouchableOpacity 
                style={styles.signInButton}
                onPress={() => router.push('/auth/login')}
                activeOpacity={0.8}
              >
                <Text style={styles.signInButtonText}>Sign In to Add to Wishlist</Text>
              </TouchableOpacity>
            )}
          </View>
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
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    zIndex: 10,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  imageContainer: {
    position: 'relative',
    height: height * 0.6,
    backgroundColor: colors.champagne,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: spacing.lg,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  indicatorActive: {
    backgroundColor: colors.white,
  },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(28, 28, 28, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableBadge: {
    backgroundColor: 'rgba(28, 28, 28, 0.9)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.ivory,
  },
  unavailableText: {
    fontFamily: fonts.body,
    fontSize: 16,
    fontWeight: '600',
    color: colors.ivory,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  titleSection: {
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 28,
    fontWeight: '500',
    color: colors.charcoal,
    marginBottom: spacing.sm,
    lineHeight: 34,
  },
  price: {
    fontFamily: fonts.body,
    fontSize: 24,
    fontWeight: '600',
    color: colors.taupe,
  },
  detailsSection: {
    backgroundColor: colors.ivory,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.taupe,
    fontWeight: '500',
  },
  detailValue: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.charcoal,
    fontWeight: '600',
  },
  descriptionSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 20,
    fontWeight: '500',
    color: colors.charcoal,
    marginBottom: spacing.md,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.charcoal,
    lineHeight: 24,
  },
  actionSection: {
    gap: spacing.md,
  },
  rentButton: {
    backgroundColor: colors.taupe,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadows.elegant,
  },
  rentButtonText: {
    fontFamily: fonts.body,
    fontSize: 18,
    fontWeight: '600',
    color: colors.ivory,
  },
  unavailableButton: {
    backgroundColor: colors.greige,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableButtonText: {
    fontFamily: fonts.body,
    fontSize: 18,
    fontWeight: '600',
    color: colors.ivory,
  },
  signInButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.taupe,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButtonText: {
    fontFamily: fonts.body,
    fontSize: 16,
    fontWeight: '600',
    color: colors.taupe,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  errorTitle: {
    fontFamily: fonts.heading,
    fontSize: 24,
    fontWeight: '500',
    color: colors.charcoal,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  errorDescription: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.taupe,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  backButton: {
    backgroundColor: colors.taupe,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    ...shadows.subtle,
  },
  backButtonText: {
    fontFamily: fonts.body,
    fontSize: 16,
    fontWeight: '600',
    color: colors.ivory,
  },
});