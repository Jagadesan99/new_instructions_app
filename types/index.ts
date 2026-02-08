export interface Contact {
    id: string;
    name: string;
    relation: 'Family' | 'Friend' | 'Work' | 'Other';
    status: 'pending' | 'accepted';
    color: string;
    specificInstructions?: string;
    createdAt: number;
    updatedAt: number;
}

export interface UserProfile {
    id: string;
    displayName: string;
    globalInstructions: string;
    updatedAt: number;
}

export type RelationType = Contact['relation'];

export const RELATION_TYPES: RelationType[] = ['Family', 'Friend', 'Work', 'Other'];

export const AVATAR_COLORS = [
    'bg-violet-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-cyan-500',
];

export function getRandomColor(): string {
    return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}
