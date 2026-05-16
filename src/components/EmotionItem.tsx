// src/components/EmotionItem.tsx
import React from "react";
import { TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import { i_Emotion } from "../types/i_Emotion";
import { e_Emotion } from "../types/e_Emotion";

type EmotionItemProps = {
  emotion: i_Emotion;
  onPress: (value: e_Emotion) => void;
  isSelected: boolean;
};

export default function EmotionItem({
  emotion,
  onPress,
  isSelected,
}: EmotionItemProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(emotion.value)}
      style={styles.container}
    >
      <Image
        source={emotion.image}
        style={[styles.image, !isSelected && styles.inactiveImage]}
      />
      <Text style={[styles.label, isSelected && styles.activeLabel]}>
        {emotion.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  inactiveImage: {
    opacity: 0.3,
  },
  label: {
    marginTop: 4,
    fontSize: 14,
    color: "#888",
  },
  activeLabel: {
    color: "#000",
    fontWeight: "bold",
  },
});
