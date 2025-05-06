import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import BackgroundFetch from "react-native-background-fetch";
import { handleBackgroundExport } from "./hooks/useScheduledExport";

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context("./app"); //Path with src folder
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);

const HeadlessTask = async (event) => {
  const taskId = event.taskId;
  const isTimeout = event.timeout;
  console.log("Headless task called", event);
  await handleBackgroundExport(taskId, isTimeout);
};

// Register your BackgroundFetch HeadlessTask
BackgroundFetch.registerHeadlessTask(HeadlessTask);
