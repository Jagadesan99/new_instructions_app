import * as SupabaseService from '@/lib/supabase-service';
import { Contact, getRandomColor } from '@/types';
import { create } from 'zustand';

interface ContactsState {
    contacts: Contact[];
    profile: {
        id: string;
        displayName: string;
        globalInstructions: string;
        email?: string;
        updatedAt: number;
    };
    isLoading: boolean;
    error: string | null;

    // Data loading
    loadData: (userId: string) => Promise<void>;
    clearData: () => void;

    // Contact actions
    addContact: (userId: string, name: string, relation: Contact['relation']) => Promise<void>;
    updateContact: (contactId: string, updates: Partial<Contact>) => Promise<void>;
    deleteContact: (contactId: string) => Promise<void>;
    getContactById: (id: string) => Contact | undefined;

    // Profile actions
    setGlobalInstructions: (userId: string, instructions: string) => Promise<void>;
    setDisplayName: (userId: string, name: string) => Promise<void>;

    // Invite actions
    sendInvite: (userId: string, contactId: string) => Promise<void>;
    acceptInvite: (contactId: string) => Promise<void>;
}

// Map Supabase row to Contact interface
function mapContact(row: any): Contact {
    return {
        id: row.id,
        user_id: row.user_id,
        name: row.name,
        relation: row.relation,
        status: row.status,
        color: row.color,
        specificInstructions: row.specific_instructions || '',
        createdAt: new Date(row.created_at).getTime(),
        updatedAt: new Date(row.updated_at).getTime(),
    };
}

export const useContactsStore = create<ContactsState>()((set, get) => ({
    contacts: [],
    profile: {
        id: '',
        displayName: 'Me',
        globalInstructions: '',
        email: '',
        updatedAt: Date.now(),
    },
    isLoading: false,
    error: null,

    loadData: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
            const [profileData, contactsData] = await Promise.all([
                SupabaseService.fetchProfile(userId),
                SupabaseService.fetchContacts(userId),
            ]);

            set({
                profile: {
                    id: profileData.id,
                    displayName: profileData.display_name || 'Me',
                    globalInstructions: profileData.global_instructions || '',
                    email: profileData.email || '',
                    updatedAt: new Date(profileData.updated_at).getTime(),
                },
                contacts: contactsData.map(mapContact),
                isLoading: false,
            });
        } catch (error: any) {
            set({ isLoading: false, error: error.message });
        }
    },

    clearData: () => {
        set({
            contacts: [],
            profile: {
                id: '',
                displayName: 'Me',
                globalInstructions: '',
                email: '',
                updatedAt: Date.now(),
            },
            isLoading: false,
            error: null,
        });
    },

    addContact: async (userId: string, name: string, relation: Contact['relation']) => {
        try {
            const data = await SupabaseService.addContact(userId, {
                name,
                relation,
                color: getRandomColor(),
            });
            set((state) => ({
                contacts: [mapContact(data), ...state.contacts],
            }));
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    updateContact: async (contactId: string, updates: Partial<Contact>) => {
        try {
            // Map front-end field names to DB column names
            const dbUpdates: any = {};
            if (updates.name !== undefined) dbUpdates.name = updates.name;
            if (updates.relation !== undefined) dbUpdates.relation = updates.relation;
            if (updates.status !== undefined) dbUpdates.status = updates.status;
            if (updates.color !== undefined) dbUpdates.color = updates.color;
            if (updates.specificInstructions !== undefined) {
                dbUpdates.specific_instructions = updates.specificInstructions;
            }

            const data = await SupabaseService.updateContact(contactId, dbUpdates);

            set((state) => ({
                contacts: state.contacts.map((contact) =>
                    contact.id === contactId ? mapContact(data) : contact
                ),
            }));
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    deleteContact: async (contactId: string) => {
        try {
            await SupabaseService.deleteContact(contactId);
            set((state) => ({
                contacts: state.contacts.filter((contact) => contact.id !== contactId),
            }));
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    getContactById: (id: string) => {
        return get().contacts.find((contact) => contact.id === id);
    },

    setGlobalInstructions: async (userId: string, instructions: string) => {
        try {
            await SupabaseService.upsertProfile(userId, {
                global_instructions: instructions,
            });
            set((state) => ({
                profile: {
                    ...state.profile,
                    globalInstructions: instructions,
                    updatedAt: Date.now(),
                },
            }));
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    setDisplayName: async (userId: string, name: string) => {
        try {
            await SupabaseService.upsertProfile(userId, {
                display_name: name,
            });
            set((state) => ({
                profile: {
                    ...state.profile,
                    displayName: name,
                    updatedAt: Date.now(),
                },
            }));
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    sendInvite: async (userId: string, contactId: string) => {
        try {
            await SupabaseService.createInvitation(userId, contactId);
            // Keep status as pending — invitation created in DB
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    acceptInvite: async (contactId: string) => {
        try {
            await SupabaseService.updateContact(contactId, { status: 'accepted' });
            set((state) => ({
                contacts: state.contacts.map((contact) =>
                    contact.id === contactId
                        ? { ...contact, status: 'accepted' as const, updatedAt: Date.now() }
                        : contact
                ),
            }));
        } catch (error: any) {
            set({ error: error.message });
        }
    },
}));
