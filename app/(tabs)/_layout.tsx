import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Home, Search, Heart, User } from 'lucide-react-native';
import { colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.ivory,
          borderTopColor: colors.champagne,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 88,
        },
        tabBarActiveTintColor: colors.taupe,
        tabBarInactiveTintColor: colors.greige,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <View style={{ padding: 4 }}>
              <Home color={color} size={size} strokeWidth={2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Catalog',
          tabBarIcon: ({ color, size }) => (
            <View style={{ padding: 4 }}>
              <Search color={color} size={size} strokeWidth={2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Wishlist',
          tabBarIcon: ({ color, size }) => (
            <View style={{ padding: 4 }}>
              <Heart color={color} size={size} strokeWidth={2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <View style={{ padding: 4 }}>
              <User color={color} size={size} strokeWidth={2} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}