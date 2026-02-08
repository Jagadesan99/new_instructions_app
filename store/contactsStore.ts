import { Contact, UserProfile, getRandomColor } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ContactsState {
    contacts: Contact[];
    profile: UserProfile;

    // Actions
    addContact: (name: string, relation: Contact['relation']) => void;
    updateContact: (id: string, updates: Partial<Contact>) => void;
    deleteContact: (id: string) => void;
    getContactById: (id: string) => Contact | undefined;

    setGlobalInstructions: (instructions: string) => void;
    setDisplayName: (name: string) => void;

    sendInvite: (id: string) => void;
    acceptInvite: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useContactsStore = create<ContactsState>()(
    persist(
        (set, get) => ({
            contacts: [],
            profile: {
                id: generateId(),
                displayName: 'Me',
                globalInstructions: '',
                updatedAt: Date.now(),
            },

            addContact: (name, relation) => {
                const newContact: Contact = {
                    id: generateId(),
                    name,
                    relation,
                    status: 'pending',
                    color: getRandomColor(),
                    specificInstructions: '',
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                };
                set((state) => ({ contacts: [...state.contacts, newContact] }));
            },

            updateContact: (id, updates) => {
                set((state) => ({
                    contacts: state.contacts.map((contact) =>
                        contact.id === id
                            ? { ...contact, ...updates, updatedAt: Date.now() }
                            : contact
                    ),
                }));
            },

            deleteContact: (id) => {
                set((state) => ({
                    contacts: state.contacts.filter((contact) => contact.id !== id),
                }));
            },

            getContactById: (id) => {
                return get().contacts.find((contact) => contact.id === id);
            },

            setGlobalInstructions: (instructions) => {
                set((state) => ({
                    profile: {
                        ...state.profile,
                        globalInstructions: instructions,
                        updatedAt: Date.now(),
                    },
                }));
            },

            setDisplayName: (name) => {
                set((state) => ({
                    profile: {
                        ...state.profile,
                        displayName: name,
                        updatedAt: Date.now(),
                    },
                }));
            },

            sendInvite: (id) => {
                // In MVP, this just keeps the contact as 'pending'
                // In future, this would trigger SMS/notification
                get().updateContact(id, { status: 'pending' });
            },

            acceptInvite: (id) => {
                get().updateContact(id, { status: 'accepted' });
            },
        }),
        {
            name: 'contact-instructions-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
