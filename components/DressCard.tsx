import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Heart, Eye, RotateCcw } from 'lucide-react-native';

import { colors, fonts, spacing, shadows } from '@/constants/theme';
import type { Dress, User } from '@/types';

const { width } = Dimensions.get('window');

interface DressCardProps {
  dress: Dress;
  onWishlistToggle?: () => void;
  isInWishlist?: boolean;
  user?: User | null;
  showRemoveOnly?: boolean;
}

export function DressCard({ 
  dress, 
  onWishlistToggle, 
  isInWishlist = false, 
  user,
  showRemoveOnly = false
}: DressCardProps) {
  const [showBackImage, setShowBackImage] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleWishlistPress = () => {
    // Web-compatible feedback (no haptics)
    onWishlistToggle?.();
  };

  const handleImageToggle = () => {
    setShowBackImage(!showBackImage);
  };

  const handleCardPress = () => {
    router.push(`/dress/${dress.id}`);
  };

  const handleViewDetails = () => {
    router.push(`/dress/${dress.id}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Handle both local assets (require()) and remote URLs
  const getImageSource = (image: any) => {
    if (typeof image === 'string') {
      return { uri: image };
    }
    return image; // This is a require() result
  };

  const currentImage = showBackImage ? dress.backImage : dress.frontImage;
  const hasMultipleImages = dress.backImage && dress.backImage !== dress.frontImage;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.card}
        onPress={handleCardPress}
        activeOpacity={0.95}
      >
        {/* Image Container */}
        <View style={styles.imageContainer}>
          <Image
            source={getImageSource(currentImage)}
            style={styles.image}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            resizeMode="cover"
          />
          
          {/* Loading overlay */}
          {imageLoading && (
            <View style={styles.loadingOverlay}>
              <View style={styles.loadingSpinner} />
            </View>
          )}
          
          {/* Image toggle button */}
          {hasMultipleImages && (
            <TouchableOpacity 
              style={styles.imageToggleButton}
              onPress={handleImageToggle}
              activeOpacity={0.8}
            >
              <RotateCcw color={colors.charcoal} size={16} strokeWidth={2} />
            </TouchableOpacity>
          )}
          
          {/* Wishlist button */}
          {user && (
            <TouchableOpacity 
              style={styles.wishlistButton}
              onPress={handleWishlistPress}
              activeOpacity={0.8}
            >
              <Heart 
                color={isInWishlist ? colors.taupe : colors.charcoal}
                size={20} 
                strokeWidth={2}
                fill={isInWishlist ? colors.taupe : 'none'}
              />
            </TouchableOpacity>
          )}
          
          {/* Unavailable overlay */}
          {!dress.available && (
            <View style={styles.unavailableOverlay}>
              <View style={styles.unavailableBadge}>
                <Text style={styles.unavailableText}>Unavailable</Text>
              </View>
            </View>
          )}
        </View>
        
        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {dress.name}
          </Text>
          
          <View style={styles.details}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{formatPrice(dress.price)}</Text>
              <Text style={styles.size}>Size: {dress.size}</Text>
            </View>
            
            {dress.available && (
              <TouchableOpacity 
                style={styles.detailsButton}
                onPress={handleViewDetails}
                activeOpacity={0.8}
              >
                <Eye color={colors.ivory} size={16} strokeWidth={2} />
                <Text style={styles.detailsButtonText}>View</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    ...shadows.elegant,
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 2/3,
    backgroundColor: colors.champagne,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.champagne,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingSpinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.taupe,
    borderTopColor: 'transparent',
  },
  imageToggleButton: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  wishlistButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(28, 28, 28, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableBadge: {
    backgroundColor: 'rgba(28, 28, 28, 0.9)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    transform: [{ rotate: '-12deg' }],
    borderWidth: 2,
    borderColor: colors.ivory,
  },
  unavailableText: {
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '600',
    color: colors.ivory,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 18,
    fontWeight: '500',
    color: colors.charcoal,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontFamily: fonts.body,
    fontSize: 18,
    fontWeight: '600',
    color: colors.taupe,
    marginBottom: 2,
  },
  size: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.greige,
  },
  detailsButton: {
    backgroundColor: colors.taupe,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    ...shadows.subtle,
  },
  detailsButtonText: {
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '500',
    color: colors.ivory,
  },
});