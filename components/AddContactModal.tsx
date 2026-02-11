import { useAuth } from '@/lib/AuthContext';
import { useContactsStore } from '@/store/contactsStore';
import { RELATION_TYPES, RelationType } from '@/types';
import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';
import { Button, Input } from './ui';

interface AddContactModalProps {
    visible: boolean;
    onClose: () => void;
}

export function AddContactModal({ visible, onClose }: AddContactModalProps) {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [relation, setRelation] = useState<RelationType>('Friend');
    const [error, setError] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const addContact = useContactsStore((state) => state.addContact);

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError('Name is required');
            return;
        }

        if (!user) {
            setError('Not authenticated');
            return;
        }

        setIsAdding(true);
        await addContact(user.id, name.trim(), relation);
        setIsAdding(false);
        setName('');
        setRelation('Friend');
        setError('');
        onClose();
    };

    const handleClose = () => {
        setName('');
        setRelation('Friend');
        setError('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent
            onRequestClose={handleClose}
        >
            <View className="flex-1 bg-black/60 items-center justify-center p-4">
                <View className="bg-card border border-border rounded-2xl w-full max-w-md">
                    {/* Header */}
                    <View className="flex-row items-center justify-between p-4 border-b border-border">
                        <Text className="text-xl font-bold text-foreground">Add Contact</Text>
                        <Pressable onPress={handleClose} className="p-2 rounded-full active:bg-zinc-700">
                            <X size={20} color="#71717a" />
                        </Pressable>
                    </View>

                    {/* Content */}
                    <View className="p-4 gap-4">
                        <Input
                            label="Name"
                            placeholder="Enter contact name"
                            value={name}
                            onChangeText={(text) => {
                                setName(text);
                                setError('');
                            }}
                            error={error}
                            autoFocus
                        />

                        <View className="gap-2">
                            <Text className="text-sm font-medium text-foreground">Relation</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {RELATION_TYPES.map((type) => (
                                    <Pressable
                                        key={type}
                                        onPress={() => setRelation(type)}
                                        className={`px-4 py-2 rounded-xl border ${relation === type
                                            ? 'bg-primary border-primary'
                                            : 'bg-transparent border-border'
                                            }`}
                                    >
                                        <Text
                                            className={`font-medium ${relation === type ? 'text-white' : 'text-foreground'
                                                }`}
                                        >
                                            {type}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Footer */}
                    <View className="flex-row gap-3 p-4 border-t border-border">
                        <View className="flex-1">
                            <Button variant="outline" onPress={handleClose}>
                                Cancel
                            </Button>
                        </View>
                        <View className="flex-1">
                            <Button onPress={handleSubmit} disabled={isAdding}>
                                {isAdding ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    'Add Contact'
                                )}
                            </Button>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
