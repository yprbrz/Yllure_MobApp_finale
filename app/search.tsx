import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Search, X } from 'lucide-react-native';

import { DressCard } from '@/components/DressCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';

import { useDressStore } from '@/store/dressStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUserStore } from '@/store/userStore';
import { colors, fonts, spacing } from '@/constants/theme';
import type { Dress } from '@/types';

const { width } = Dimensions.get('window');
const numColumns = width > 768 ? 3 : 2;

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Dress[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { dresses, searchDresses } = useDressStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { user } = useUserStore();

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, dresses]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Search through local dresses for demo
      const filtered = dresses.filter(dress =>
        dress.name.toLowerCase().includes(query.toLowerCase()) ||
        dress.description.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
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

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const goBack = () => {
    router.back();
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
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Search Dresses</Text>
      {searchQuery && (
        <Text style={styles.resultsText}>
          {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "{searchQuery}"
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={goBack}
          activeOpacity={0.7}
        >
          <ArrowLeft color={colors.charcoal} size={24} strokeWidth={2} />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Search color={colors.greige} size={20} strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for dresses..."
            placeholderTextColor={colors.greige}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} activeOpacity={0.7}>
              <X color={colors.greige} size={20} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      {isSearching ? (
        <LoadingSpinner />
      ) : searchQuery.trim() === '' ? (
        <EmptyState
          title="Start Your Search"
          description="Enter a dress name or description to find your perfect rental"
          icon={<Search color={colors.champagne} size={64} strokeWidth={1.5} />}
        />
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderDressItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <EmptyState
              title="No Dresses Found"
              description={`Sorry, we couldn't find any dresses matching "${searchQuery}". Try a different search term.`}
              actionText="Clear Search"
              onAction={clearSearch}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
          columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ivory,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.champagne,
    gap: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.ivory,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.charcoal,
  },
  headerContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 28,
    fontWeight: '500',
    color: colors.charcoal,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  resultsText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.taupe,
    textAlign: 'center',
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
});