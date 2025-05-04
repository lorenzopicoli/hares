import * as TaskManager from "expo-task-manager";
import * as BackgroundTask from "expo-background-task";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKGROUND_TASK_IDENTIFIER = "background-task";
// Register and create the task so that it is available also when the background task screen
// (a React component defined later in this example) is not visible.
// Note: This needs to be called in the global scope, not in a React component.
TaskManager.defineTask(BACKGROUND_TASK_IDENTIFIER, async () => {
  try {
    const now = Date.now();
    console.log(`Got background task call at date: ${new Date(now).toISOString()}`);

    const lastItem = await AsyncStorage.getItem("executed");
    await AsyncStorage.setItem("executed", String(+(lastItem ?? 0) + 1));
  } catch (error) {
    console.error("Failed to execute the background task:", error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
  return BackgroundTask.BackgroundTaskResult.Success;
});

BackgroundTask.registerTaskAsync(BACKGROUND_TASK_IDENTIFIER, {
  minimumInterval: 15,
});
