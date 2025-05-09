import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import BackgroundFetch from "react-native-background-fetch";

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context("./app"); //Path with src folder
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);

const MyHeadlessTask = async (event) => {
  // Get task id from event {}:
  const taskId = event.taskId;
  const isTimeout = event.timeout; // <-- true when your background-time has expired.
  if (isTimeout) {
    // This task has exceeded its allowed running-time.
    // You must stop what you're doing immediately finish(taskId)
    console.log("[BackgroundFetch] Headless TIMEOUT:", taskId);
    BackgroundFetch.finish(taskId);
    return;
  }
  console.log("[BackgroundFetch HeadlessTask] start: ", taskId);

  // Perform an example HTTP request.
  // Important:  await asychronous tasks when using HeadlessJS.
  console.log("[BackgroundFetch HeadlessTask] response: ", responseJson);

  // Required:  Signal to native code that your task is complete.
  // If you don't do this, your app could be terminated and/or assigned
  // battery-blame for consuming too much time in background.
  BackgroundFetch.finish(taskId);
};

// Register your BackgroundFetch HeadlessTask
BackgroundFetch.registerHeadlessTask(MyHeadlessTask);
