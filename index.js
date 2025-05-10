import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import * as TaskManager from "expo-task-manager";
import * as BackgroundTask from "expo-background-task";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context("./app"); //Path with src folder
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);

// const HeadlessTask = async (event) => {
//   const taskId = event.taskId;
//   const isTimeout = event.timeout;
//   console.log("Headless task called", event);
//   await handleBackgroundExport(taskId, isTimeout);
// };

// // Register your BackgroundFetch HeadlessTask
// BackgroundFetch.registerHeadlessTask(HeadlessTask);

// const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";
// TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error, executionInfo }) => {
//   console.log("Received a notification task payload!");
//   console.log("Data", data);
//   console.log("Error", error);
//   console.log("ExecutionInfo", executionInfo);
//   console.log(await AsyncStorage.setItem("bla", new Date().toISOString()));
// });

// Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

// Register the task outside of the component
TaskManager.defineTask("BG_TASK", async () => {
  try {
    console.log("LETS FUCKING GOOOOOOOOOOOOOOOOOOOO");
    await AsyncStorage.setItem("bla", new Date().toISOString());
  } catch (error) {
    console.error("Failed to save the last fetch date", error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
  return BackgroundTask.BackgroundTaskResult.Success;
});

BackgroundTask.registerTaskAsync("BG_TASK", {});
