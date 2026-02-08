import React from 'react';
import { ActivityIndicator, Pressable, PressableProps, Text } from 'react-native';

interface ButtonProps extends PressableProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    children: React.ReactNode;
}

export function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    children,
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'flex-row items-center justify-center rounded-xl';

    const variants = {
        primary: 'bg-primary active:bg-violet-600',
        secondary: 'bg-secondary active:bg-zinc-600',
        outline: 'border border-border bg-transparent active:bg-zinc-800',
        ghost: 'bg-transparent active:bg-zinc-800',
        destructive: 'bg-destructive active:bg-red-600',
    };

    const sizes = {
        sm: 'px-3 py-2',
        md: 'px-4 py-3',
        lg: 'px-6 py-4',
    };

    const textSizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    const textColors = {
        primary: 'text-white',
        secondary: 'text-white',
        outline: 'text-foreground',
        ghost: 'text-foreground',
        destructive: 'text-white',
    };

    return (
        <Pressable
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50' : ''}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color="white" size="small" />
            ) : (
                <Text className={`font-semibold ${textSizes[size]} ${textColors[variant]}`}>
                    {children}
                </Text>
            )}
        </Pressable>
    );
}
