import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
    return (
        <View className="gap-2">
            {label && (
                <Text className="text-sm font-medium text-foreground">{label}</Text>
            )}
            <TextInput
                className={`bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted ${error ? 'border-destructive' : ''} ${className}`}
                placeholderTextColor="#71717a"
                {...props}
            />
            {error && (
                <Text className="text-sm text-destructive">{error}</Text>
            )}
        </View>
    );
}
