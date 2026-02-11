import { Avatar, Button, Card, Input, TextArea } from '@/components/ui';
import { useAuth } from '@/lib/AuthContext';
import { useContactsStore } from '@/store/contactsStore';
import { Info, LogOut, Save } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();

    const profile = useContactsStore((state) => state.profile);
    const setGlobalInstructions = useContactsStore((state) => state.setGlobalInstructions);
    const setDisplayName = useContactsStore((state) => state.setDisplayName);

    const [instructions, setInstructions] = useState(profile.globalInstructions);
    const [displayName, setDisplayNameLocal] = useState(profile.displayName);
    const [hasChanges, setHasChanges] = useState(false);
    const [saved, setSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

    useEffect(() => {
        setInstructions(profile.globalInstructions);
        setDisplayNameLocal(profile.displayName);
    }, [profile.globalInstructions, profile.displayName]);

    useEffect(() => {
        const changed =
            instructions !== profile.globalInstructions ||
            displayName !== profile.displayName;
        setHasChanges(changed);
        setSaved(false);
    }, [instructions, displayName, profile]);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);

        if (instructions !== profile.globalInstructions) {
            await setGlobalInstructions(user.id, instructions);
        }
        if (displayName !== profile.displayName) {
            await setDisplayName(user.id, displayName);
        }

        setIsSaving(false);
        setHasChanges(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleSignOut = async () => {
        setIsSigningOut(true);
        await signOut();
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="px-4 pt-4 pb-6">
                    <Text className="text-3xl font-bold text-foreground mb-6">Profile</Text>

                    {/* Avatar & Name */}
                    <View className="items-center mb-6">
                        <Avatar name={displayName || 'Me'} size="lg" color="bg-primary" />
                        {user?.email && (
                            <Text className="text-muted text-sm mt-2">{user.email}</Text>
                        )}
                    </View>

                    <Input
                        label="Display Name"
                        value={displayName}
                        onChangeText={setDisplayNameLocal}
                        placeholder="Your name"
                    />
                </View>

                {/* Info Banner */}
                <View className="mx-4 mb-4">
                    <Card className="flex-row items-start gap-3 bg-violet-500/10 border-violet-500/30">
                        <Info size={20} color="#8b5cf6" />
                        <View className="flex-1">
                            <Text className="text-sm text-foreground font-medium">Global Instructions</Text>
                            <Text className="text-sm text-muted mt-1">
                                These instructions apply to all your contacts by default.
                                You can create specific overrides for individual contacts.
                            </Text>
                        </View>
                    </Card>
                </View>

                {/* Instructions Editor */}
                <View className="px-4 gap-4">
                    <TextArea
                        label="Your Instructions"
                        placeholder="Write your communication preferences here...

Example:
• I prefer text messages over calls for non-urgent matters
• Best time to reach me is between 9 AM - 6 PM
• I try to respond within 24 hours"
                        value={instructions}
                        onChangeText={setInstructions}
                        className="min-h-64"
                    />

                    <Button
                        onPress={handleSave}
                        disabled={!hasChanges || isSaving}
                    >
                        <View className="flex-row items-center gap-2">
                            {isSaving ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Save size={18} color="white" />
                            )}
                            <Text className="text-white font-semibold">
                                {saved ? 'Saved!' : isSaving ? 'Saving...' : 'Save Changes'}
                            </Text>
                        </View>
                    </Button>

                    {/* Sign Out */}
                    <View className="mt-6 pt-6 border-t border-border">
                        <Button
                            variant="outline"
                            onPress={handleSignOut}
                            disabled={isSigningOut}
                        >
                            <View className="flex-row items-center gap-2">
                                {isSigningOut ? (
                                    <ActivityIndicator size="small" color="#fafafa" />
                                ) : (
                                    <LogOut size={18} color="#fafafa" />
                                )}
                                <Text className="text-foreground font-semibold">
                                    {isSigningOut ? 'Signing out...' : 'Sign Out'}
                                </Text>
                            </View>
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
