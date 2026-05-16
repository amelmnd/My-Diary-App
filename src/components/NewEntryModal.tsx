import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";

import { useAuth } from "../auth/AuthContext";
import { emotionList } from "../constants/emotionList";
import { createEntry } from "../services/entryService";
import { e_Emotion } from "../types/e_Emotion";
import EmotionItem from "./EmotionItem";

export default function NewEntryModal({ onSaved }: { onSaved: () => void }) {
  const { user } = useAuth();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [feeling, setFeeling] = useState<e_Emotion>(e_Emotion.HAPPY);
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<{ title?: string; content?: string }>(
    {}
  );
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isValid =
    title.trim().length > 0 &&
    content.trim().length > 0;

  const onChangeDate = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  useEffect(() => {
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = "Le titre est requis.";
    if (!content.trim()) newErrors.content = "Le contenu est requis.";
    setErrors(newErrors);
  }, [title, content]);

  useEffect(() => {
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setFocusedField(null);
    });
    return () => hideSubscription.remove();
  }, []);

  const handleSubmit = async () => {
    if (isLoading)
      return;
    
    setIsLoading(true);
    if (!isValid) return;

    const entry = {
      userEmail: user?.email ?? "anonyme",
      date: date.toISOString().slice(0, 10),
      title,
      feeling,
      content,
    };

    const success = await createEntry(entry);
    if (success) {
      setTitle("");
      setFeeling(e_Emotion.HAPPY);
      setContent("");
      setDate(new Date());
      setIsModalVisible(false);
      onSaved();
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        style={styles.openButton}
      >
        <Text style={styles.buttonText}>+ Nouvelle entrée</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalContent}
            >
              <ScrollView
                contentContainerStyle={{ paddingBottom: 30 }}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={styles.dateButton}
                >
                  <Text style={styles.dateText}>
                    {date.toISOString().slice(0, 10)}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onChangeDate}
                  />
                )}

                <TextInput
                  placeholder="Titre"
                  value={title}
                  onChangeText={setTitle}
                  style={[
                    styles.input,
                    focusedField === "title" && styles.inputFocused,
                  ]}
                  onFocus={() => setFocusedField("title")}
                  onBlur={() => setFocusedField(null)}
                />
                {errors.title && (
                  <Text style={styles.error}>{errors.title}</Text>
                )}

                <TextInput
                  placeholder="Contenu"
                  value={content}
                  onChangeText={setContent}
                  multiline
                  numberOfLines={4}
                  style={[
                    styles.input,
                    focusedField === "content" && styles.inputFocused,
                  ]}
                  onFocus={() => setFocusedField("content")}
                  onBlur={() => setFocusedField(null)}
                />
                {errors.content && (
                  <Text style={styles.error}>{errors.content}</Text>
                )}

                <View style={styles.emotionContainer}>
                  {emotionList.map((emotion) => (
                    <EmotionItem
                      key={emotion.value}
                      emotion={emotion}
                      onPress={(value) => {
                        setFeeling(value);
                        Keyboard.dismiss();
                      }}
                      isSelected={feeling === emotion.value}
                    />
                  ))}
                </View>

                <View style={{ marginVertical: 10 }}>
                  <TouchableOpacity onPress={handleSubmit} >
                    <Text style={isValid && !isLoading ? styles.btnActive: styles.btnDisabled}>Enregistrer</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                  <Text style={styles.cancelText}>Annuler</Text>
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    paddingVertical: 10 
  },
  openButton: {
    backgroundColor: "#052547ff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { 
    color: "white", 
    fontWeight: "600" 
  },
  btnActive : {
    fontWeight: "600",
    color: "#052547ff",
    textAlign: "center",
    marginTop: 10,
  },
  btnDisabled: {
    fontWeight: "600",
    color: "#807e7eff",
    textAlign: "center",
    marginTop: 10,

  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
  },
  dateButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    color: "#111827",
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 8,
    paddingVertical: 4,
    fontSize: 16,
  },
  inputFocused: {
    borderColor: "#ccdcecff",
    borderWidth: 2,
  },
  error: { 
    color: "red", 
    marginBottom: 5 
  },
  emotionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cancelText: {
    color: "gray",
    textAlign: "center",
    marginTop: 10,
  },
});
