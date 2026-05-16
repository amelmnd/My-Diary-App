import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../src/auth/AuthContext';
import { LoginScreen } from '../src/screens/LoginScreen';
import TabViewScreen from '../src/tabs/TabViewScreen';

export default function Index() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return user ? <TabViewScreen /> : <LoginScreen />;
}
