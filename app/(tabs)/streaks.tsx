import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { getAchievements } from "@/lib/achievements";
import { Habit } from "@/types/database.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Query } from "react-native-appwrite";
import { Surface, Text } from "react-native-paper";

export default function StreaksScreen() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);

  const fetchHabits = useCallback(async () => {
    if (!user) return;

    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        [Query.equal("user_id", user.$id)]
      );

      setHabits(response.documents as unknown as Habit[]);
    } catch (error) {
      console.error(error);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchHabits();
    }, [fetchHabits])
  );

  const achievements = useMemo(() => getAchievements(habits), [habits]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text variant="headlineSmall" style={styles.title}>
        Achievements
      </Text>
      <Text style={styles.subtitle}>
        You have unlocked {unlockedCount} of {achievements.length} achievements
      </Text>

      {achievements.map((achievement) => (
        <Surface
          key={achievement.id}
          style={[
            styles.card,
            achievement.unlocked ? styles.unlockedCard : styles.lockedCard,
          ]}
          elevation={0}
        >
          <View style={styles.cardContent}>
            <MaterialCommunityIcons
              name={achievement.icon as any}
              size={32}
              color={achievement.unlocked ? "#ff9800" : "#9e9e9e"}
            />
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>{achievement.title}</Text>
              <Text style={styles.cardDescription}>
                {achievement.description}
              </Text>
            </View>
            {achievement.unlocked && (
              <MaterialCommunityIcons
                name="check-decagram"
                size={28}
                color="#4caf50"
              />
            )}
          </View>
        </Surface>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  subtitle: {
    color: "#666",
    marginBottom: 24,
  },
  card: {
    borderRadius: 18,
    marginBottom: 16,
    padding: 16,
  },
  unlockedCard: {
    backgroundColor: "#fff8e1",
  },
  lockedCard: {
    backgroundColor: "#eeeeee",
    opacity: 0.8,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#22223b",
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});