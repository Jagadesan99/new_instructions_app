import React from 'react';
import { Text, View } from 'react-native';

interface AvatarProps {
    name: string;
    color?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ name, color = 'bg-primary', size = 'md' }: AvatarProps) {
    const initial = name.charAt(0).toUpperCase();

    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    const textSizes = {
        sm: 'text-sm',
        md: 'text-xl',
        lg: 'text-2xl',
    };

    return (
        <View className={`${sizes[size]} ${color} rounded-full items-center justify-center`}>
            <Text className={`${textSizes[size]} font-bold text-white`}>{initial}</Text>
        </View>
    );
}
