import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Search } from 'lucide-react-native';

import { colors, fonts, spacing, shadows } from '@/constants/theme';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({ 
  title, 
  description, 
  actionText, 
  onAction,
  icon 
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {icon || <Search color={colors.champagne} size={64} strokeWidth={1.5} />}
      </View>
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      
      {actionText && onAction && (
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onAction}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 24,
    fontWeight: '500',
    color: colors.charcoal,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.taupe,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
    maxWidth: 300,
  },
  actionButton: {
    backgroundColor: colors.taupe,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    ...shadows.subtle,
  },
  actionButtonText: {
    fontFamily: fonts.body,
    fontSize: 16,
    fontWeight: '600',
    color: colors.ivory,
  },
});