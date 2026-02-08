import { Avatar, Card } from '@/components/ui';
import { useContactsStore } from '@/store/contactsStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AlertCircle, Clock, Globe, X } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ShareScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const contact = useContactsStore((state) => state.getContactById(id));
    const profile = useContactsStore((state) => state.profile);

    if (!contact) {
        return (
            <SafeAreaView className="flex-1 bg-background items-center justify-center">
                <Text className="text-foreground">Contact not found</Text>
            </SafeAreaView>
        );
    }

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const lastUpdated = Math.max(contact.updatedAt, profile.updatedAt);

    return (
        <SafeAreaView className="flex-1 bg-background">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
                <View className="flex-1" />
                <Pressable
                    onPress={() => router.back()}
                    className="p-2 rounded-full active:bg-zinc-800"
                >
                    <X size={24} color="#fafafa" />
                </Pressable>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* User Branding */}
                <View className="items-center py-6">
                    <Avatar name={profile.displayName} size="lg" color="bg-primary" />
                    <Text className="text-muted mt-3">Instructions from</Text>
                    <Text className="text-2xl font-bold text-foreground">{profile.displayName}</Text>
                </View>

                {/* Contact Name */}
                <View className="items-center mb-6">
                    <Text className="text-lg text-muted">for</Text>
                    <Text className="text-xl font-semibold text-primary">{contact.name}</Text>
                </View>

                {/* Last Updated */}
                <View className="flex-row items-center justify-center gap-2 mb-6">
                    <Clock size={14} color="#71717a" />
                    <Text className="text-sm text-muted">
                        Last updated: {formatDate(lastUpdated)}
                    </Text>
                </View>

                {/* Specific Instructions (Important for You) */}
                {contact.specificInstructions && (
                    <View className="px-4 mb-4">
                        <Card className="bg-primary/10 border-primary/30">
                            <View className="flex-row items-center gap-2 mb-3">
                                <AlertCircle size={18} color="#8b5cf6" />
                                <Text className="text-lg font-semibold text-primary">Important for You</Text>
                            </View>
                            <Text className="text-foreground leading-6">
                                {contact.specificInstructions}
                            </Text>
                        </Card>
                    </View>
                )}

                {/* Global Instructions */}
                {profile.globalInstructions && (
                    <View className="px-4 mb-4">
                        <Card>
                            <View className="flex-row items-center gap-2 mb-3">
                                <Globe size={18} color="#71717a" />
                                <Text className="text-lg font-semibold text-foreground">General Context</Text>
                            </View>
                            <Text className="text-muted leading-6">
                                {profile.globalInstructions}
                            </Text>
                        </Card>
                    </View>
                )}

                {/* Empty State */}
                {!contact.specificInstructions && !profile.globalInstructions && (
                    <View className="px-4">
                        <Card className="items-center py-8">
                            <Text className="text-muted text-center">
                                No instructions have been set yet.
                            </Text>
                        </Card>
                    </View>
                )}

                {/* Footer Branding */}
                <View className="items-center mt-8">
                    <Text className="text-xs text-zinc-600">Powered by</Text>
                    <Text className="text-sm font-semibold text-primary">Contact Instructions</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
