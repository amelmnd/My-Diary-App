import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../auth/AuthContext";

export const LoginScreen = () => {
  const { signInWithGoogle, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ color: "white", marginTop: 8 }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Diary App</Text>
      <Text style={styles.subtitle}>
        Connecte-toi avec Google pour accéder à ton journal
      </Text>

      <TouchableOpacity
        style={[styles.button, styles.googleButton]}
        onPress={signInWithGoogle}
      >
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#0f172a",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
  title: {
    fontSize: 32,
    color: "white",
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#cbd5f5",
    marginBottom: 32,
    textAlign: "center",
  },
  button: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    marginBottom: 12,
  },
  googleButton: {
    backgroundColor: "#4285F4",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
