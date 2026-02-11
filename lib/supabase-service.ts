import { getRandomColor } from '@/types';
import { supabase } from './supabase';

// ---- Profile ----

export interface ProfileData {
    display_name: string;
    global_instructions: string;
    email?: string;
    updated_at?: string;
}

export async function fetchProfile(userId: string) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data;
}

export async function upsertProfile(userId: string, updates: Partial<ProfileData>) {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// ---- Contacts ----

export interface ContactData {
    name: string;
    relation: string;
    status?: string;
    color?: string;
    specific_instructions?: string;
}

export async function fetchContacts(userId: string) {
    const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function addContact(userId: string, contact: ContactData) {
    const { data, error } = await supabase
        .from('contacts')
        .insert({
            user_id: userId,
            name: contact.name,
            relation: contact.relation,
            status: 'pending',
            color: contact.color || getRandomColor(),
            specific_instructions: '',
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateContact(contactId: string, updates: Partial<ContactData>) {
    const { data, error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', contactId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteContact(contactId: string) {
    const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);

    if (error) throw error;
}

// ---- Invitations ----

export async function createInvitation(userId: string, contactId: string) {
    // Check if invitation already exists for this contact
    const { data: existing } = await supabase
        .from('invitations')
        .select('*')
        .eq('contact_id', contactId)
        .single();

    if (existing) {
        return existing;
    }

    const { data, error } = await supabase
        .from('invitations')
        .insert({
            user_id: userId,
            contact_id: contactId,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function fetchInvitationByToken(token: string) {
    const { data, error } = await supabase
        .from('invitations')
        .select(`
            *,
            contacts (*),
            profiles:user_id (*)
        `)
        .eq('token', token)
        .single();

    if (error) throw error;
    return data;
}

export async function acceptInvitation(token: string) {
    const { data: invitation, error: fetchError } = await supabase
        .from('invitations')
        .select('*')
        .eq('token', token)
        .single();

    if (fetchError) throw fetchError;

    // Update invitation
    const { error: updateInvError } = await supabase
        .from('invitations')
        .update({ accepted_at: new Date().toISOString() })
        .eq('id', invitation.id);

    if (updateInvError) throw updateInvError;

    // Update contact status
    const { error: updateContactError } = await supabase
        .from('contacts')
        .update({ status: 'accepted' })
        .eq('id', invitation.contact_id);

    if (updateContactError) throw updateContactError;
}
