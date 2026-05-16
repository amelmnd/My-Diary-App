// src/auth/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

type AuthContextType = {
  user: User | null;
  initializing: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  const signingInRef = useRef(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      /*console.log(
        "onAuthStateChanged user:",
        firebaseUser?.uid,
        firebaseUser?.email
      );*/
      setUser(firebaseUser);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    if (signingInRef.current) {
      console.log("signInWithGoogle déjà en cours, ...");
      return;
    }
    signingInRef.current = true;

    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo = await GoogleSignin.signIn();

      const tokens = await GoogleSignin.getTokens();

      const idToken = tokens.idToken;
      if (!idToken) {
        throw new Error("Pas d'idToken renvoyé par Google");
      }

      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
      console.log("Firebase signInWithCredential OK");
    } catch (error: any) {
      console.log("Erreur signInWithGoogle:", error);

      if (
        error.code === statusCodes.IN_PROGRESS ||
        error.message?.includes("previous promise did not settle")
      ) {
        return;
      }

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return;
      }

      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log(
          "Erreur Google Play Services",
          "Google Play Services n'est pas disponible ou pas à jour sur cet appareil."
        );
        return;
      }

      console.log(
        "Erreur",
        "Impossible de se connecter avec Google. Regarde la console pour plus de détails."
      );
    } finally {
      signingInRef.current = false;
    }
  };

  const logout = async () => {
    try {
      await GoogleSignin.signOut();
      await firebaseSignOut(auth);
    } catch (error) {
      console.log("Erreur logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        initializing,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
