import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Filter, X } from 'lucide-react-native';

import { colors, fonts, spacing, shadows } from '@/constants/theme';
import type { Size, DressFilters } from '@/types';

interface FilterBarProps {
  onFilterChange: (filters: DressFilters) => void;
  totalCount: number;
}

const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function FilterBar({ onFilterChange, totalCount }: FilterBarProps) {
  const [selectedSize, setSelectedSize] = useState<Size | undefined>();
  const [availableOnly, setAvailableOnly] = useState<boolean | undefined>();
  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = (newFilters: Partial<DressFilters>) => {
    const filters: DressFilters = {
      size: selectedSize,
      available: availableOnly,
      ...newFilters,
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof DressFilters] === undefined) {
        delete filters[key as keyof DressFilters];
      }
    });

    onFilterChange(filters);
  };

  const handleSizeSelect = (size: Size) => {
    const newSize = selectedSize === size ? undefined : size;
    setSelectedSize(newSize);
    applyFilters({ size: newSize });
  };

  const handleAvailabilityToggle = () => {
    const newAvailable = availableOnly === true ? undefined : true;
    setAvailableOnly(newAvailable);
    applyFilters({ available: newAvailable });
  };

  const clearFilters = () => {
    setSelectedSize(undefined);
    setAvailableOnly(undefined);
    onFilterChange({});
  };

  const hasActiveFilters = selectedSize || availableOnly;

  return (
    <View style={styles.container}>
      {/* Filter Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.filterToggle}
          onPress={() => setShowFilters(!showFilters)}
          activeOpacity={0.7}
        >
          <Filter color={colors.charcoal} size={20} strokeWidth={2} />
          <Text style={styles.filterToggleText}>Filters</Text>
          {hasActiveFilters && <View style={styles.activeFilterDot} />}
        </TouchableOpacity>

        <Text style={styles.resultCount}>
          {totalCount} {totalCount === 1 ? 'dress' : 'dresses'}
        </Text>

        {hasActiveFilters && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearFilters}
            activeOpacity={0.7}
          >
            <X color={colors.taupe} size={16} strokeWidth={2} />
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Options */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          {/* Size Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Size</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sizeScrollContainer}
            >
              {SIZES.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeChip,
                    selectedSize === size && styles.sizeChipSelected,
                  ]}
                  onPress={() => handleSizeSelect(size)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.sizeChipText,
                      selectedSize === size && styles.sizeChipTextSelected,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Availability Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Availability</Text>
            <TouchableOpacity
              style={[
                styles.availabilityChip,
                availableOnly && styles.availabilityChipSelected,
              ]}
              onPress={handleAvailabilityToggle}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.availabilityChipText,
                  availableOnly && styles.availabilityChipTextSelected,
                ]}
              >
                Available Only
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: 16,
    ...shadows.subtle,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    position: 'relative',
  },
  filterToggleText: {
    fontFamily: fonts.body,
    fontSize: 16,
    fontWeight: '500',
    color: colors.charcoal,
  },
  activeFilterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.taupe,
    position: 'absolute',
    top: -4,
    right: -4,
  },
  resultCount: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.taupe,
    flex: 1,
    textAlign: 'center',
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
    fontWeight: '500',
    color: colors.taupe,
  },
  filtersContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.champagne,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  filterSection: {
    gap: spacing.sm,
  },
  filterSectionTitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '600',
    color: colors.charcoal,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sizeScrollContainer: {
    paddingRight: spacing.lg,
  },
  sizeChip: {
    backgroundColor: colors.champagne,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    marginRight: spacing.sm,
    minWidth: 40,
    alignItems: 'center',
  },
  sizeChipSelected: {
    backgroundColor: colors.taupe,
  },
  sizeChipText: {
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '500',
    color: colors.charcoal,
  },
  sizeChipTextSelected: {
    color: colors.ivory,
  },
  availabilityChip: {
    backgroundColor: colors.champagne,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  availabilityChipSelected: {
    backgroundColor: colors.taupe,
  },
  availabilityChipText: {
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '500',
    color: colors.charcoal,
  },
  availabilityChipTextSelected: {
    color: colors.ivory,
  },
});