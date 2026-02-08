import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface TextAreaProps extends TextInputProps {
    label?: string;
    error?: string;
}

export function TextArea({ label, error, className = '', ...props }: TextAreaProps) {
    return (
        <View className="gap-2">
            {label && (
                <Text className="text-sm font-medium text-foreground">{label}</Text>
            )}
            <TextInput
                className={`bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted min-h-32 ${error ? 'border-destructive' : ''} ${className}`}
                placeholderTextColor="#71717a"
                multiline
                textAlignVertical="top"
                {...props}
            />
            {error && (
                <Text className="text-sm text-destructive">{error}</Text>
            )}
        </View>
    );
}
