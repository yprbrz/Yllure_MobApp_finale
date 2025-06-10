import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Heart, Instagram, RotateCcw } from 'lucide-react-native';

import { colors, fonts, spacing, shadows } from '@/constants/theme';
import type { Dress, User } from '@/types';

interface DressCardProps {
  dress: Dress;
  onWishlistToggle?: () => void;
  isInWishlist?: boolean;
  user?: User | null;
  showRemoveOnly?: boolean;
}

export default function DressCard({ 
  dress, 
  onWishlistToggle, 
  isInWishlist = false, 
  user,
  showRemoveOnly = false
}: DressCardProps) {
  const [showBackImage, setShowBackImage] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleWishlistPress = () => {
    onWishlistToggle?.();
  };

  const handleImageToggle = () => {
    setShowBackImage(!showBackImage);
  };

  const handleRentNow = async () => {
    try {
      const instagramUrl = 'https://www.instagram.com/by.yllure';
      const canOpen = await Linking.canOpenURL(instagramUrl);
      
      if (canOpen) {
        await Linking.openURL(instagramUrl);
      } else {
        Alert.alert(
          'Instagram',
          'Follow us @by.yllure on Instagram to rent this dress!',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Contact Us',
        'Visit @by.yllure on Instagram or contact us at contact@yllure.com to rent this dress!',
        [{ text: 'OK' }]
      );
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getImageSource = (image: any) => {
    if (typeof image === 'string') {
      return { uri: image };
    }
    return image;
  };

  const currentImage = showBackImage ? dress.backImage : dress.frontImage;
  const hasMultipleImages = dress.backImage && dress.backImage !== dress.frontImage;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.card}
        onPress={handleRentNow}
        activeOpacity={0.95}
      >
        <View style={styles.imageContainer}>
          <Image
            source={getImageSource(currentImage)}
            style={styles.image}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            resizeMode="cover"
          />
          
          {imageLoading && (
            <View style={styles.loadingOverlay}>
              <View style={styles.loadingSpinner} />
            </View>
          )}
          
          {hasMultipleImages && (
            <TouchableOpacity 
              style={styles.imageToggleButton}
              onPress={handleImageToggle}
              activeOpacity={0.8}
            >
              <RotateCcw color={colors.charcoal} size={16} strokeWidth={2} />
            </TouchableOpacity>
          )}
          
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
          
          {!dress.available && (
            <View style={styles.unavailableOverlay}>
              <View style={styles.unavailableBadge}>
                <Text style={styles.unavailableText}>Unavailable</Text>
              </View>
            </View>
          )}
        </View>
        
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
                style={styles.rentButton}
                onPress={handleRentNow}
                activeOpacity={0.8}
              >
                <Instagram color={colors.ivory} size={16} strokeWidth={2} />
                <Text style={styles.rentButtonText}>Rent Now</Text>
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
  rentButton: {
    backgroundColor: colors.taupe,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    ...shadows.subtle,
  },
  rentButtonText: {
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '500',
    color: colors.ivory,
  },
});