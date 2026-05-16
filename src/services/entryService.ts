import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { i_Entry } from "../types/i_Entry";

const COLLECTION_NAME = "entries";

export const fetchEntries = async (
  userEmail: string
): Promise<i_Entry[] | null> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userEmail", "==", userEmail)
    );

    const snapshot = await getDocs(q);
    const entries: i_Entry[] = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<i_Entry, "id">),
    }));

    entries.sort((a, b) => b.date.localeCompare(a.date));

    return entries;
  } catch (error) {
    console.error("Erreur lors de la lecture des entrées :", error);
    return null;
  }
};

export const subscribeToUserEntries = (
  userEmail: string,
  onEntries: (entries: i_Entry[]) => void
): (() => void) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("userEmail", "==", userEmail)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const entries: i_Entry[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<i_Entry, "id">),
      }));

      entries.sort((a, b) => b.date.localeCompare(a.date));
      onEntries(entries);
    },
    (error) => {
      console.error("Erreur dans subscribeToUserEntries :", error);
    }
  );
};

export const subscribeToEntriesByDate = (
  userEmail: string,
  date: string,
  onEntries: (entries: i_Entry[]) => void
): (() => void) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("userEmail", "==", userEmail),
    where("date", "==", date)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const entries: i_Entry[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<i_Entry, "id">),
      }));
      onEntries(entries);
    },
    (error) => {
      console.error("Erreur dans subscribeToEntriesByDate :", error);
    }
  );
};

export const createEntry = async (
  entry: Omit<i_Entry, "id">
): Promise<boolean> => {
  try {
    if (
      !entry.userEmail ||
      !entry.date ||
      !entry.title ||
      !entry.feeling ||
      !entry.content
    ) {
      throw new Error("Données d'entrée incomplètes.");
    }

    await addDoc(collection(db, COLLECTION_NAME), entry);
    console.log("Entry saved in Firestore");
    return true;
  } catch (error) {
    console.error("Erreur lors de la création de l'entrée :", error);
    return false;
  }
};

export const deleteEntry = async (entryId: string): Promise<boolean> => {
  try {
    if (!entryId) throw new Error("ID d'entrée manquant.");
    await deleteDoc(doc(db, COLLECTION_NAME, entryId));
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'entrée :", error);
    return false;
  }
};
