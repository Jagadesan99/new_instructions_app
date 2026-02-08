import { Avatar, Button, Card, TextArea } from '@/components/ui';
import { useContactsStore } from '@/store/contactsStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle2, Eye, Save, Send, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ContactDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const contact = useContactsStore((state) => state.getContactById(id));
    const profile = useContactsStore((state) => state.profile);
    const updateContact = useContactsStore((state) => state.updateContact);
    const deleteContact = useContactsStore((state) => state.deleteContact);
    const acceptInvite = useContactsStore((state) => state.acceptInvite);

    const [specificInstructions, setSpecificInstructions] = useState(contact?.specificInstructions || '');
    const [hasChanges, setHasChanges] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (contact) {
            setHasChanges(specificInstructions !== (contact.specificInstructions || ''));
            setSaved(false);
        }
    }, [specificInstructions, contact]);

    if (!contact) {
        return (
            <SafeAreaView className="flex-1 bg-background items-center justify-center">
                <Text className="text-foreground">Contact not found</Text>
                <Button onPress={() => router.back()} variant="ghost">Go Back</Button>
            </SafeAreaView>
        );
    }

    const handleSave = () => {
        updateContact(contact.id, { specificInstructions });
        setHasChanges(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleDelete = () => {
        deleteContact(contact.id);
        router.back();
    };

    const handleResendInvite = () => {
        // Simulate accepting invite for demo
        acceptInvite(contact.id);
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            {/* Header */}
            <View className="flex-row items-center px-4 pt-4 pb-2">
                <Pressable
                    onPress={() => router.back()}
                    className="p-2 -ml-2 rounded-full active:bg-zinc-800"
                >
                    <ArrowLeft size={24} color="#fafafa" />
                </Pressable>
                <Text className="text-xl font-bold text-foreground ml-2">Contact Details</Text>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Contact Header */}
                <View className="items-center py-6">
                    <Avatar name={contact.name} color={contact.color} size="lg" />
                    <Text className="text-2xl font-bold text-foreground mt-3">{contact.name}</Text>
                    <Text className="text-muted">{contact.relation}</Text>
                </View>

                {/* Status Banner */}
                <View className="px-4 mb-4">
                    {contact.status === 'pending' ? (
                        <Card className="flex-row items-center justify-between bg-yellow-500/10 border-yellow-500/30">
                            <View className="flex-row items-center gap-2">
                                <Send size={18} color="#eab308" />
                                <Text className="text-yellow-400 font-medium">Invitation Pending</Text>
                            </View>
                            <Pressable
                                onPress={handleResendInvite}
                                className="bg-yellow-500 px-3 py-1.5 rounded-lg active:bg-yellow-600"
                            >
                                <Text className="text-black font-medium text-sm">Accept (Demo)</Text>
                            </Pressable>
                        </Card>
                    ) : (
                        <Card className="flex-row items-center gap-2 bg-green-500/10 border-green-500/30">
                            <CheckCircle2 size={18} color="#22c55e" />
                            <Text className="text-green-400 font-medium">Invitation Accepted</Text>
                        </Card>
                    )}
                </View>

                {/* Global Instructions Preview */}
                <View className="px-4 mb-4">
                    <Card>
                        <Text className="text-sm font-medium text-muted mb-2">Global Instructions</Text>
                        <Text className="text-foreground" numberOfLines={3}>
                            {profile.globalInstructions || 'No global instructions set. Go to Profile to add them.'}
                        </Text>
                    </Card>
                </View>

                {/* Specific Instructions Editor */}
                <View className="px-4 gap-4">
                    <TextArea
                        label="Specific Instructions for this Contact"
                        placeholder={`Write custom instructions for ${contact.name}...

These will override your global instructions for this contact.`}
                        value={specificInstructions}
                        onChangeText={setSpecificInstructions}
                        className="min-h-40"
                    />

                    <Button onPress={handleSave} disabled={!hasChanges}>
                        <View className="flex-row items-center gap-2">
                            <Save size={18} color="white" />
                            <Text className="text-white font-semibold">
                                {saved ? 'Saved!' : 'Save Instructions'}
                            </Text>
                        </View>
                    </Button>

                    <Button
                        variant="outline"
                        onPress={() => router.push(`/share/${contact.id}`)}
                    >
                        <View className="flex-row items-center gap-2">
                            <Eye size={18} color="#fafafa" />
                            <Text className="text-foreground font-semibold">Preview Contact View</Text>
                        </View>
                    </Button>

                    <Button variant="destructive" onPress={handleDelete}>
                        <View className="flex-row items-center gap-2">
                            <Trash2 size={18} color="white" />
                            <Text className="text-white font-semibold">Delete Contact</Text>
                        </View>
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
