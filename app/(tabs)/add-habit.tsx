import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { ID } from "react-native-appwrite";
import { Button, SegmentedButtons, TextInput, Text, useTheme } from "react-native-paper";

const FREQUENCIES = ["daily", "weekly", "monthly"];
type Frequency = (typeof FREQUENCIES)[number];

export default function AddHabitScreen() {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [frequency, setFrequency] = useState<Frequency>("daily");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const { user } = useAuth();
    const router = useRouter();
    const theme = useTheme();

    useFocusEffect(
        useCallback(() => {
            // Reset form whenever screen is focused
            setTitle("");
            setDescription("");
            setFrequency("daily");
            setError(null);
        }, [])
    );

    const handleSubmit = async () => {
        if (!user) return;

        if (!trimmedTitle || !trimmedDescription) {
            setError("Title and description are required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await databases.createDocument(DATABASE_ID, HABITS_COLLECTION_ID, ID.unique(), {
                user_id: user.$id,
                title: trimmedTitle,
                description: trimmedDescription,
                frequency,
                streak_count: 0,
                last_completed: null,
                created_at: new Date().toISOString(),
            });

            router.back();
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("There was an error creating the habit");
            }
        } finally {
            setLoading(false);
        }

    }

    return (
        <View style={styles.container}>
            <TextInput label="Title" mode="outlined" onChangeText={setTitle} style={styles.input} />
            <TextInput label="Description" mode="outlined" onChangeText={setDescription} style={styles.input} />
            <View style={styles.frequencyContainer}>
                <SegmentedButtons value={frequency} onValueChange={(value) => setFrequency(value as Frequency)} buttons={FREQUENCIES.map((freq) => ({
                    value: freq, label: freq.charAt(0).toUpperCase() + freq.slice(1),
                }))} />
            </View>
            <Button mode="contained" loading={loading} disabled={loading} onPress={handleSubmit}>Add Habit</Button>
            {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5",
    },

    input: {
        marginBottom: 16,
    },

    frequencyContainer: {
        marginBottom: 24,
    }

});