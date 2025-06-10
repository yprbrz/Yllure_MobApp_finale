import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Header } from '@/components/Header';
import DressCard from '@/components/DressCard';
import { FilterBar } from '@/components/FilterBar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';

import { useDressStore } from '@/store/dressStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUserStore } from '@/store/userStore';
import { colors, spacing } from '@/constants/theme';
import type { Dress, DressFilters } from '@/types';

const { width } = Dimensions.get('window');
const numColumns = width > 768 ? 3 : 2;

export default function CatalogScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<DressFilters>({});

  const { 
    dresses, 
    filteredDresses,
    isLoading, 
    fetchDresses,
    applyFilters 
  } = useDressStore();
  
  const { 
    addToWishlist, 
    removeFromWishlist,
    isInWishlist 
  } = useWishlistStore();
  
  const { user } = useUserStore();

  useEffect(() => {
    fetchDresses();
  }, []);

  useEffect(() => {
    applyFilters(filters);
  }, [filters, dresses]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDresses();
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

  const handleFilterChange = (newFilters: DressFilters) => {
    setFilters(newFilters);
  };

  const renderDressItem = ({ item }: { item: Dress }) => (
    <View style={styles.dressItem}>
      <DressCard
        dress={item}
        onWishlistToggle={() => handleWishlistToggle(item)}
        isInWishlist={isInWishlist(item.id)}
        user={user}
      />
    </View>
  );

  const renderHeader = () => (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Our Collection</Text>
        <Text style={styles.subtitle}>
          Discover our curated selection of elegant dresses for every occasion.
        </Text>
      </View>
      
      <FilterBar 
        onFilterChange={handleFilterChange}
        totalCount={filteredDresses.length}
      />
    </View>
  );

  const renderFooter = () => {
    if (isLoading && !refreshing) {
      return <LoadingSpinner style={styles.footerLoader} />;
    }
    return <View style={styles.footerSpacer} />;
  };

  if (isLoading && !refreshing && dresses.length === 0) {
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
        data={filteredDresses}
        renderItem={renderDressItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <EmptyState 
            title="No Dresses Found"
            description="Try adjusting your filters or check back later for new arrivals"
            actionText="Clear Filters"
            onAction={() => setFilters({})}
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
  titleContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.charcoal,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.taupe,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
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
  footerLoader: {
    paddingVertical: spacing.xl,
  },
  footerSpacer: {
    height: spacing.xl,
  },
});