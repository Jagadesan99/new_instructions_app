import { AddContactModal } from '@/components/AddContactModal';
import { ContactCard } from '@/components/ContactCard';
import { useContactsStore } from '@/store/contactsStore';
import { Plus, Search, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ContactsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const contacts = useContactsStore((state) => state.contacts);
  const isLoading = useContactsStore((state) => state.isLoading);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-3xl font-bold text-foreground">Contacts</Text>
          <Pressable
            onPress={() => setShowSearch(!showSearch)}
            className="p-2 rounded-full active:bg-zinc-800"
          >
            <Search size={24} color="#71717a" />
          </Pressable>
        </View>

        {showSearch && (
          <View className="mb-4">
            <TextInput
              className="bg-card border border-border rounded-xl px-4 py-3 text-foreground"
              placeholder="Search contacts..."
              placeholderTextColor="#71717a"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>
        )}
      </View>

      {/* Loading State */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text className="text-muted mt-4">Loading contacts...</Text>
        </View>
      ) : filteredContacts.length > 0 ? (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ContactCard contact={item} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center px-8">
          <View className="bg-card border border-border rounded-full p-6 mb-4">
            <Users size={48} color="#71717a" />
          </View>
          <Text className="text-xl font-semibold text-foreground text-center mb-2">
            No contacts yet
          </Text>
          <Text className="text-muted text-center">
            Add your first contact by tapping the + button below
          </Text>
        </View>
      )}

      {/* FAB */}
      <Pressable
        className="absolute bottom-20 right-4 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg active:bg-violet-600"
        onPress={() => setModalVisible(true)}
        style={{
          shadowColor: '#8b5cf6',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Plus size={28} color="white" />
      </Pressable>

      <AddContactModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}
