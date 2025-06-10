import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react-native';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useUserStore } from '@/store/userStore';
import { colors, fonts, spacing, shadows } from '@/constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading, error, clearError, isAuthenticated } = useUserStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  // Clear error when user starts typing
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [email, password]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      const success = await login(email.trim(), password);
      if (success) {
        // Navigation will be handled by the useEffect above
        console.log('✅ Login successful, redirecting...');
      }
      // Error handling is now managed by the store
    } catch (error) {
      console.error('❌ Login error in component:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@yllure.com');
    setPassword('password123');
  };

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={goBack}
              activeOpacity={0.7}
            >
              <ArrowLeft color={colors.charcoal} size={24} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to access your profile and wishlist
              </Text>
            </View>

            <View style={styles.form}>
              {/* Error Message */}
              {error && (
                <View style={styles.errorContainer}>
                  <AlertTriangle color={colors.error || '#EF4444'} size={20} strokeWidth={2} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={[styles.inputWrapper, error && styles.inputWrapperError]}>
                  <Mail color={colors.greige} size={20} strokeWidth={2} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.greige}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                    returnKeyType="next"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={[styles.inputWrapper, error && styles.inputWrapperError]}>
                  <Lock color={colors.greige} size={20} strokeWidth={2} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.greige}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                  >
                    {showPassword ? (
                      <EyeOff color={colors.greige} size={20} strokeWidth={2} />
                    ) : (
                      <Eye color={colors.greige} size={20} strokeWidth={2} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity 
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <LoadingSpinner size="small" />
                    <Text style={styles.loadingText}>Signing in...</Text>
                  </View>
                ) : (
                  <Text style={styles.loginButtonText}>Sign In</Text>
                )}
              </TouchableOpacity>

              {/* Demo Notice */}
              <View style={styles.demoNotice}>
                <Text style={styles.demoNoticeTitle}>Demo Mode</Text>
                <Text style={styles.demoNoticeText}>
                  Enter any email and password to sign in, or use the demo account below.
                </Text>
                <TouchableOpacity 
                  style={styles.demoButton}
                  onPress={handleDemoLogin}
                  activeOpacity={0.7}
                >
                  <Text style={styles.demoButtonText}>Fill Demo Credentials</Text>
                </TouchableOpacity>
              </View>

              {/* Additional Info */}
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  This is a demo application showcasing a dress rental platform.
                  All data is simulated for demonstration purposes.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ivory,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl * 2,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 32,
    fontWeight: '500',
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
  },
  form: {
    gap: spacing.xl,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  errorText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    color: '#DC2626',
    lineHeight: 20,
  },
  inputContainer: {
    gap: spacing.sm,
  },
  inputLabel: {
    fontFamily: fonts.body,
    fontSize: 16,
    fontWeight: '500',
    color: colors.charcoal,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: colors.champagne,
    ...shadows.subtle,
  },
  inputWrapperError: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  input: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.charcoal,
  },
  loginButton: {
    backgroundColor: colors.taupe,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.elegant,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontFamily: fonts.body,
    fontSize: 18,
    fontWeight: '600',
    color: colors.ivory,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    fontFamily: fonts.body,
    fontSize: 16,
    fontWeight: '500',
    color: colors.ivory,
  },
  demoNotice: {
    backgroundColor: colors.champagne,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    gap: spacing.sm,
  },
  demoNoticeTitle: {
    fontFamily: fonts.body,
    fontSize: 16,
    fontWeight: '600',
    color: colors.charcoal,
  },
  demoNoticeText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.charcoal,
    textAlign: 'center',
    lineHeight: 20,
  },
  demoButton: {
    backgroundColor: colors.taupe,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    marginTop: spacing.sm,
  },
  demoButtonText: {
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '500',
    color: colors.ivory,
  },
  infoContainer: {
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.champagne,
  },
  infoText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.greige,
    textAlign: 'center',
    lineHeight: 18,
  },
});