import { Habit } from "@/types/database.type";
import { Achievement } from "@/types/achievement.type";

export function getAchievements(habits: Habit[]): Achievement[] {
  const totalHabits = habits.length;
  const maxStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak_count)) : 0;
  const completedHabits = habits.filter((h) => h.last_completed).length;

  return [
    {
      id: "first-complete",
      title: "First Flame",
      description: "Complete your first habit",
      icon: "fire",
      unlocked: completedHabits >= 1,
    },
    {
      id: "streak-3",
      title: "3 Day Streak",
      description: "Reach a 3-day streak on any habit",
      icon: "fire-circle",
      unlocked: maxStreak >= 3,
    },
    {
      id: "streak-7",
      title: "7 Day Warrior",
      description: "Reach a 7-day streak on any habit",
      icon: "trophy",
      unlocked: maxStreak >= 7,
    },
    {
      id: "streak-30",
      title: "Consistency Master",
      description: "Reach a 30-day streak on any habit",
      icon: "medal",
      unlocked: maxStreak >= 30,
    },
    {
      id: "habit-5",
      title: "Builder",
      description: "Create 5 habits",
      icon: "check-circle",
      unlocked: totalHabits >= 5,
    },
    {
      id: "habit-10",
      title: "Habit Architect",
      description: "Create 10 habits",
      icon: "star-circle",
      unlocked: totalHabits >= 10,
    },
  ];
}