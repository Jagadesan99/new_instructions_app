import { useAuth } from '@/lib/AuthContext';
import { ArrowLeft, ArrowRight, KeyRound, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const { signInWithOtp, verifyOtp } = useAuth();

    const [email, setEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSendOtp = async () => {
        if (!email.trim()) {
            setError('Please enter your email');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError('Please enter a valid email');
            return;
        }

        setIsLoading(true);
        setError('');

        const { error: signInError } = await signInWithOtp(email.trim());

        setIsLoading(false);

        if (signInError) {
            setError(signInError.message);
        } else {
            setSuccessMessage(`Code sent to ${email}`);
            setStep('otp');
        }
    };

    const handleVerifyOtp = async () => {
        if (!otpCode.trim()) {
            setError('Please enter the verification code');
            return;
        }

        if (otpCode.trim().length !== 6) {
            setError('Code must be 6 digits');
            return;
        }

        setIsLoading(true);
        setError('');

        const { error: verifyError } = await verifyOtp(email.trim(), otpCode.trim());

        setIsLoading(false);

        if (verifyError) {
            setError(verifyError.message);
        }
        // If successful, auth state change will redirect automatically
    };

    const handleBack = () => {
        setStep('email');
        setOtpCode('');
        setError('');
        setSuccessMessage('');
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View className="flex-1 justify-center px-6">
                    {/* Branding */}
                    <View className="items-center mb-10">
                        <View className="w-20 h-20 rounded-2xl bg-primary items-center justify-center mb-4"
                            style={{
                                shadowColor: '#8b5cf6',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.4,
                                shadowRadius: 12,
                                elevation: 8,
                            }}
                        >
                            <Text className="text-white text-3xl font-bold">CI</Text>
                        </View>
                        <Text className="text-3xl font-bold text-foreground">
                            Contact Instructions
                        </Text>
                        <Text className="text-muted mt-2 text-center">
                            Your personal communication hub
                        </Text>
                    </View>

                    {/* Email Step */}
                    {step === 'email' && (
                        <View className="gap-4">
                            <View>
                                <Text className="text-sm font-medium text-foreground mb-2">
                                    Email Address
                                </Text>
                                <View className="flex-row items-center bg-card border border-border rounded-xl px-4">
                                    <Mail size={20} color="#71717a" />
                                    <TextInput
                                        className="flex-1 py-3.5 px-3 text-foreground text-base"
                                        placeholder="you@example.com"
                                        placeholderTextColor="#52525b"
                                        value={email}
                                        onChangeText={(text) => {
                                            setEmail(text);
                                            setError('');
                                        }}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        autoFocus
                                    />
                                </View>
                            </View>

                            {error ? (
                                <Text className="text-red-400 text-sm">{error}</Text>
                            ) : null}

                            <Pressable
                                onPress={handleSendOtp}
                                disabled={isLoading}
                                className="bg-primary rounded-xl py-4 items-center flex-row justify-center gap-2 active:bg-violet-600"
                                style={{
                                    opacity: isLoading ? 0.6 : 1,
                                    shadowColor: '#8b5cf6',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 8,
                                    elevation: 8,
                                }}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <Text className="text-white font-semibold text-base">
                                            Send Verification Code
                                        </Text>
                                        <ArrowRight size={20} color="white" />
                                    </>
                                )}
                            </Pressable>

                            <Text className="text-zinc-500 text-center text-sm mt-2">
                                We'll send a 6-digit code to your email
                            </Text>
                        </View>
                    )}

                    {/* OTP Step */}
                    {step === 'otp' && (
                        <View className="gap-4">
                            {successMessage ? (
                                <View className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
                                    <Text className="text-green-400 text-sm text-center">
                                        {successMessage}
                                    </Text>
                                </View>
                            ) : null}

                            <View>
                                <Text className="text-sm font-medium text-foreground mb-2">
                                    Verification Code
                                </Text>
                                <View className="flex-row items-center bg-card border border-border rounded-xl px-4">
                                    <KeyRound size={20} color="#71717a" />
                                    <TextInput
                                        className="flex-1 py-3.5 px-3 text-foreground text-base tracking-widest"
                                        placeholder="000000"
                                        placeholderTextColor="#52525b"
                                        value={otpCode}
                                        onChangeText={(text) => {
                                            // Only allow digits, max 6
                                            const cleaned = text.replace(/\D/g, '').slice(0, 6);
                                            setOtpCode(cleaned);
                                            setError('');
                                        }}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        autoFocus
                                    />
                                </View>
                            </View>

                            {error ? (
                                <Text className="text-red-400 text-sm">{error}</Text>
                            ) : null}

                            <Pressable
                                onPress={handleVerifyOtp}
                                disabled={isLoading}
                                className="bg-primary rounded-xl py-4 items-center flex-row justify-center gap-2 active:bg-violet-600"
                                style={{
                                    opacity: isLoading ? 0.6 : 1,
                                    shadowColor: '#8b5cf6',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 8,
                                    elevation: 8,
                                }}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-semibold text-base">
                                        Verify & Sign In
                                    </Text>
                                )}
                            </Pressable>

                            <Pressable
                                onPress={handleBack}
                                className="flex-row items-center justify-center gap-1 py-2"
                            >
                                <ArrowLeft size={16} color="#71717a" />
                                <Text className="text-muted text-sm">Use different email</Text>
                            </Pressable>

                            <Pressable
                                onPress={handleSendOtp}
                                disabled={isLoading}
                                className="items-center py-2"
                            >
                                <Text className="text-primary text-sm font-medium">
                                    Resend Code
                                </Text>
                            </Pressable>
                        </View>
                    )}
                </View>

                {/* Footer */}
                <View className="items-center pb-6">
                    <Text className="text-xs text-zinc-600">Powered by</Text>
                    <Text className="text-sm font-semibold text-primary">Supabase</Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
