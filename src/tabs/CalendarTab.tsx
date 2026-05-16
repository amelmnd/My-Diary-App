import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../auth/AuthContext";
import { emotionList } from "../constants/emotionList";
import {
  deleteEntry,
  subscribeToUserEntries,
} from "../services/entryService";
import { i_Entry } from "../types/i_Entry";

const getDatePartsFR = (isoDate: string) => {
  const [year, month, day] = isoDate.split("-").map(Number);
  const d = new Date(year, (month || 1) - 1, day || 1);

  const weekday = d.toLocaleDateString("fr-FR", {
    weekday: "short",
  });
  const formatted = d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
  const [dayPart, monthPart] = formatted.split(" ");

  return {
    weekday,
    day: dayPart,
    month: monthPart,
  };
};

const formatDateFRLong = (isoDate: string): string => {
  const [year, month, day] = isoDate.split("-").map(Number);
  const d = new Date(year, (month || 1) - 1, day || 1);
  return d.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateISO = (d: Date) => d.toISOString().slice(0, 10);

export default function CalendarTab() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>(
    formatDateISO(new Date())
  );
  const [entries, setEntries] = useState<i_Entry[]>([]);

  useEffect(() => {
    if (!user?.email) return;
    const unsubscribe = subscribeToUserEntries(user.email, setEntries);
    return unsubscribe;
  }, [user?.email]);

  const entriesForSelectedDate = useMemo(
    () => entries.filter((e) => e.date === selectedDate),
    [entries, selectedDate]
  );

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    for (const entry of entries) {
      if (!marks[entry.date]) {
        marks[entry.date] = {
          marked: true,
          dotColor: "#af4c96ff",
        };
      }
    }

    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: "#2e3c5cff",
    };

    return marks;
  }, [entries, selectedDate]);

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const handlePressEntry = (entry: i_Entry) => {
    Alert.alert(
      entry.title,
      `${formatDateFRLong(entry.date)}\n\n${entry.content}`,
      [
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            if (!entry.id) return;
            await deleteEntry(entry.id);
          },
        },
        { text: "Fermer", style: "cancel" },
      ]
    );
  };

  const renderEntry = ({ item }: { item: i_Entry }) => {
    const emotion = emotionList.find((e) => e.value === item.feeling);
    const parts = getDatePartsFR(item.date);

    return (
      <TouchableOpacity
        style={styles.entryCard}
        onPress={() => handlePressEntry(item)}
      >
        <View style={styles.entryDateBox}>
          <Text style={styles.entryWeekday}>{parts.weekday}</Text>
          <Text style={styles.entryDay}>{parts.day}</Text>
          <Text style={styles.entryMonth}>{parts.month}</Text>
        </View>

        <View style={styles.entryContentBox}>
          <Text style={styles.entryTitle}>{item.title}</Text>
        </View>

        {emotion && (
          <Image source={emotion.image} style={styles.entryEmotion} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={markedDates}
          initialDate={selectedDate}
          style={styles.calendar}
        />

        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>
            Entrées du {formatDateFRLong(selectedDate)}
          </Text>

          {entriesForSelectedDate.length === 0 ? (
            <Text style={styles.emptyText}>
              Aucune entrée pour cette date.
            </Text>
          ) : (
            <FlatList
              data={entriesForSelectedDate}
              keyExtractor={(item) => item.id ?? item.date + item.title}
              renderItem={renderEntry}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8,
    color: "#111827",
  },
  emptyText: {
    color: "#6b7280",
  },

  entryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#111827",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  entryDateBox: {
    width: 60,
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
    alignItems: "center",
    paddingRight: 8,
    marginRight: 8,
  },
  entryWeekday: {
    fontSize: 11,
    color: "#6c768aff",
  },
  entryDay: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  entryMonth: {
    fontSize: 12,
    color: "#6c768aff",
  },

  entryContentBox: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  entryEmotion: {
    width: 28,
    height: 28,
    marginLeft: 8,
  },
});
