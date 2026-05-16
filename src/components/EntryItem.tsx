// src/components/EntryItem.tsx
import React from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";
import { i_Entry } from "../types/i_Entry";
import { emotionList } from "../constants/emotionList";

type EntryItemProps = {
  entry: i_Entry;
  onDelete: (id?: string) => void;
};

const EntryItem: React.FC<EntryItemProps> = ({ entry, onDelete }) => {
  const emotion = emotionList.find((e) => e.value === entry.feeling);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {entry.date} - {entry.title}
      </Text>

      {emotion ? (
        <Image source={emotion.image} style={styles.emotionImage} />
      ) : (
        <Text style={styles.feeling}>Émotion inconnue</Text>
      )}

      <Text style={styles.content}>{entry.content}</Text>
      <Button title="Supprimer" color={'#c04b4bff'} onPress={() => onDelete(entry.id)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  emotionImage: {
    width: 40,
    height: 40,
    marginBottom: 4,
  },
  feeling: {
    fontStyle: "italic",
    marginVertical: 4,
  },
  content: {
    marginBottom: 8,
  },
});

export default EntryItem;
