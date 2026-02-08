import React from 'react';
import { Text, View } from 'react-native';

interface BadgeProps {
    variant?: 'default' | 'success' | 'warning' | 'destructive';
    children: React.ReactNode;
}

export function Badge({ variant = 'default', children }: BadgeProps) {
    const variants = {
        default: 'bg-zinc-700',
        success: 'bg-green-500/20',
        warning: 'bg-yellow-500/20',
        destructive: 'bg-red-500/20',
    };

    const textColors = {
        default: 'text-zinc-300',
        success: 'text-green-400',
        warning: 'text-yellow-400',
        destructive: 'text-red-400',
    };

    return (
        <View className={`px-2 py-1 rounded-full ${variants[variant]}`}>
            <Text className={`text-xs font-medium ${textColors[variant]}`}>{children}</Text>
        </View>
    );
}
