import React from "react";
import { Text, StyleSheet, View } from "react-native";

export default function Error() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Something went wrong</Text>
      <Text style={styles.text}>Please try again later</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
    padding: 16,
  },
  text: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
  },
});
