import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { useDB, type HabitDoc, type SurveyDoc, type LogDoc } from "./useDb";
import type { Habit, Survey, HabitLog } from "./types";

export function useSync() {
  const { db, deviceId } = useDB();
  const [changeCount, setChangeCount] = useState(v4());
  const [habits, setHabits] = useState<HabitDoc[]>([]);
  const [surveys, setSurveys] = useState<SurveyDoc[]>([]);
  const [logs, setLogs] = useState<LogDoc[]>([]);
  // Habit operations
  const addHabit = async (habit: Omit<Habit, "id">) => {
    try {
      const doc: HabitDoc = {
        _id: v4(),
        type: "habit",
        deviceId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        question: habit.question,
        habitType: habit.type,
        defaultTime: habit.defaultTime,
        options: habit.options,
        isPinned: false,
      };

      await db.put(doc);
    } catch (err) {
      console.error("Error adding habit:", err);
      throw err;
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      const doc = await db.get(habitId);
      await db.remove(doc);
    } catch (err) {
      console.error("Error deleting habit:", err);
      throw err;
    }
  };

  const toggleHabitPin = async (habitId: string, isPinned: boolean) => {
    try {
      const doc = (await db.get(habitId)) as HabitDoc;
      doc.isPinned = isPinned;
      doc.updatedAt = Date.now();
      await db.put(doc);
    } catch (err) {
      console.error("Error toggling habit pin:", err);
      throw err;
    }
  };

  // Survey operations
  const addSurvey = async (survey: Omit<Survey, "id">) => {
    try {
      const doc: SurveyDoc = {
        _id: v4(),
        type: "survey",
        deviceId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        name: survey.name,
        habits: survey.habits,
        isPinned: survey.isPinned || false,
      };

      await db.put(doc);
    } catch (err) {
      console.error("Error adding survey:", err);
      throw err;
    }
  };

  const deleteSurvey = async (surveyId: string) => {
    try {
      const doc = await db.get(surveyId);
      await db.remove(doc);
    } catch (err) {
      console.error("Error deleting survey:", err);
      throw err;
    }
  };

  const toggleSurveyPin = async (surveyId: string, isPinned: boolean) => {
    try {
      const doc = (await db.get(surveyId)) as SurveyDoc;
      doc.isPinned = isPinned;
      doc.updatedAt = Date.now();
      await db.put(doc);
    } catch (err) {
      console.error("Error toggling survey pin:", err);
      throw err;
    }
  };

  // Log operations
  const addLog = async (log: Omit<HabitLog, "id">) => {
    try {
      const doc: LogDoc = {
        _id: v4(),
        type: "log",
        deviceId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        habitId: log.habitId,
        value: log.value,
        valueType: log.valueType,
        timeType: log.timeType,
        generalTime: log.generalTime,
        exactTime: log.exactTime,
        date: log.date,
        surveyId: log.surveyId,
        mealType: log.mealType,
      };

      await db.put(doc);
    } catch (err) {
      console.error("Error adding log:", err);
      throw err;
    }
  };

  const deleteLog = async (logId: string) => {
    try {
      const doc = await db.get(logId);
      await db.remove(doc);
    } catch (err) {
      console.error("Error deleting log:", err);
      throw err;
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    db.find({
      selector: {
        type: "habit",
        createdAt: { $gt: null },
      },
      //   sort: [{ createdAt: 'desc' }],
    }).then((r) => setHabits(r.docs as HabitDoc[]));
    db.find({
      selector: {
        type: "survey",
        createdAt: { $gt: null },
      },
      //   sort: [{ createdAt: 'desc' }],
    }).then((r) => {
      console.log("Got new surveys", r);
      setSurveys(r.docs as SurveyDoc[]);
    });

    db.find({
      selector: {
        type: "log",
        createdAt: { $gt: null },
      },
      //   sort: [{ createdAt: 'desc' }],
    }).then((r) => setLogs(r.docs as LogDoc[]));
  }, [db, changeCount]);

  useEffect(() => {
    const changes = db
      .changes({
        since: "now",
        live: true,
        include_docs: true,
      })
      .on("change", async (e) => {
        console.log("Change aa", e);
        // Reload all data when any change occurs
        // await loadAllData()
        setChangeCount(v4());
      })
      .on("error", (err) => {
        console.error("Changes feed error:", err);
        // setLastSyncFailed(true)
      });

    return () => {
      changes.cancel();
    };
  }, [db]);

  return {
    habits,
    surveys,
    logs,
    addHabit,
    deleteHabit,
    toggleHabitPin,
    addSurvey,
    deleteSurvey,
    toggleSurveyPin,
    addLog,
    deleteLog,
  };
}
