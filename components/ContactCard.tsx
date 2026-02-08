import { Contact } from '@/types';
import { useRouter } from 'expo-router';
import { CheckCircle2, Clock } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Avatar } from './ui';

interface ContactCardProps {
    contact: Contact;
}

export function ContactCard({ contact }: ContactCardProps) {
    const router = useRouter();

    return (
        <Pressable
            className="flex-row items-center p-4 bg-card border border-border rounded-xl mb-3 active:bg-zinc-800"
            onPress={() => router.push(`/contact/${contact.id}`)}
        >
            <Avatar name={contact.name} color={contact.color} size="md" />

            <View className="flex-1 ml-3">
                <Text className="text-lg font-semibold text-foreground">{contact.name}</Text>
                <Text className="text-sm text-muted">{contact.relation}</Text>
            </View>

            {contact.status === 'pending' ? (
                <View className="flex-row items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                    <Clock size={12} color="#eab308" />
                    <Text className="text-xs font-medium text-yellow-400">Pending</Text>
                </View>
            ) : (
                <View className="flex-row items-center gap-1 bg-green-500/20 px-2 py-1 rounded-full">
                    <CheckCircle2 size={12} color="#22c55e" />
                    <Text className="text-xs font-medium text-green-400">Accepted</Text>
                </View>
            )}
        </Pressable>
    );
}
