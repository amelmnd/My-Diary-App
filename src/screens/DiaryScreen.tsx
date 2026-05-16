import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../auth/AuthContext";
import NewEntryModal from "../components/NewEntryModal";
import { emotionList } from "../constants/emotionList";
import {
  deleteEntry,
  subscribeToUserEntries,
} from "../services/entryService";
import { i_Entry } from "../types/i_Entry";

const formatDateFR = (isoDate: string): string => {
  const [year, month, day] = isoDate.split("-").map(Number);
  const d = new Date(year, (month || 1) - 1, day || 1);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const DiaryScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [entries, setEntries] = useState<i_Entry[]>([]);

  useEffect(() => {
    if (!user?.email) return;
    const unsubscribe = subscribeToUserEntries(user.email, setEntries);
    return unsubscribe;
  }, [user?.email]);

  const totalEntries = entries.length;

  const lastTwoEntries = useMemo(
    () => entries.slice(0, 2),
    [entries]
  );

  const feelingsStats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of entries) {
      counts[e.feeling] = (counts[e.feeling] || 0) + 1;
    }
    return emotionList.map((emotion) => {
      const count = counts[emotion.value] || 0;
      const percentage =
        totalEntries > 0 ? Math.round((count / totalEntries) * 100) : 0;
      return { ...emotion, count, percentage };
    });
  }, [entries, totalEntries]);

  const handlePressEntry = (entry: i_Entry) => {
    Alert.alert(
      entry.title,
      `${formatDateFR(entry.date)}\n\n${entry.content}`,
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

  const renderLastEntryCard = ({ item }: { item: i_Entry }) => {
    const emotion = emotionList.find((e) => e.value === item.feeling);

    return (
      <TouchableOpacity
        style={styles.lastEntryCard}
        onPress={() => handlePressEntry(item)}
      >
        <View style={styles.lastEntryRow}>
          <View>
            <Text style={styles.lastEntryDay}>{formatDateFR(item.date)}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.lastEntryTitle}>{item.title}</Text>
          </View>
          {emotion && (
            <Image source={emotion.image} style={styles.lastEntryEmotion} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header avec avatar + nom */}
        <View style={styles.headerArea}>
          <View style={styles.avatarWrapper}>
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitials}>
                  {user?.email?.[0]?.toUpperCase() ?? "U"}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.userName}>
            {user?.displayName ?? user?.email}
          </Text>

          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.block}>
          <View style={styles.blockHeader}>
            <Text style={styles.blockHeaderText}>
              Tes dernières entrées de journal
            </Text>
          </View>

          {lastTwoEntries.length === 0 ? (
            <View style={styles.blockBody}>
              <Text style={styles.emptyText}>
                Aucune entrée pour le moment.
              </Text>
            </View>
          ) : (
            <View style={styles.blockBody}>
              <FlatList
                data={lastTwoEntries}
                keyExtractor={(item) => item.id ?? item.date + item.title}
                renderItem={renderLastEntryCard}
                scrollEnabled={false}
              />
            </View>
          )}
        </View>

        <View style={styles.block}>
          <View style={styles.blockHeader}>
            <Text style={styles.blockHeaderText}>
              Tes émotions sur {totalEntries} entrées
            </Text>
          </View>

          <View style={styles.blockBody}>
            {totalEntries === 0 ? (
              <Text style={styles.emptyText}>
                Pas encore de données à afficher.
              </Text>
            ) : (
              feelingsStats.map((emotion) => (
                <View
                  key={emotion.value}
                  style={styles.feelingRow}
                >
                  <View style={styles.feelingLeft}>
                    <Image
                      source={emotion.image}
                      style={styles.feelingImage}
                    />
                    <Text style={styles.feelingLabel}>{emotion.label}</Text>
                  </View>
                  <Text style={styles.feelingPercentage}>
                    {emotion.percentage}%
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={styles.newEntryWrapper}>
          <NewEntryModal onSaved={() => {}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 32,
  },

  headerArea: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatarWrapper: {
    borderWidth: 4,
    borderColor: "#052547ff",
    borderRadius: 80,
    padding: 4,
    marginBottom: 8,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    backgroundColor: "#052547ff",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitials: {
    color: "white",
    fontWeight: "700",
    fontSize: 32,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginTop: 4,
  },

  logoutButton: {
    position: "absolute",
    right: 0,
    top: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#ef4444",
    borderRadius: 999,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },

  block: {
    backgroundColor: "#052547ff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  blockHeader: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  blockHeaderText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  blockBody: {
    backgroundColor: "#e9f7ffff",
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 4,
  },

  emptyText: {
    color: "#6b7280",
    textAlign: "center",
    paddingVertical: 8,
  },

  lastEntryCard: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#052547ff",
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 8,
  },
  lastEntryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  lastEntryDay: {
    fontSize: 12,
    color: "#6b7280",
  },
  lastEntryTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  lastEntryEmotion: {
    width: 24,
    height: 24,
  },

  feelingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#cbd5e1",
  },
  feelingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  feelingImage: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  feelingLabel: {
    fontSize: 14,
    color: "#111827",
  },
  feelingPercentage: {
    fontWeight: "600",
    color: "#111827",
  },

  newEntryWrapper: {
    marginTop: 8,
  },
});
