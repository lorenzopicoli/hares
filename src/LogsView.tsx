import { Stack, Text, Paper, Group, ActionIcon, ScrollArea, Badge } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useSync } from "./useSync";
import type { LogDoc } from "./useDb";

const LogsView = () => {
  const { logs, habits, deleteLog } = useSync();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getHabitQuestion = (habitId: string) => {
    const habit = habits.find((h) => h._id === habitId);
    return habit?.question || "Unknown Habit";
  };

  const formatValue = (log: LogDoc) => {
    switch (log.valueType) {
      case "boolean":
        return (log.value as boolean) ? "Yes" : "No";
      case "mood":
      case "food":
      case "text_list":
        return (log.value as string[]).join(", ");
      case "scale":
        return `${log.value}/10`;
      default:
        return log.value.toString();
    }
  };

  const getMealTypeBadge = (mealType?: string) => {
    if (!mealType) return null;

    const colors = {
      breakfast: "yellow",
      lunch: "green",
      dinner: "blue",
      snack: "grape",
    };

    return (
      <Badge color={colors[mealType as keyof typeof colors]} variant="light">
        {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
      </Badge>
    );
  };

  return (
    <Stack>
      <Text size="xl">Habit Logs</Text>
      <ScrollArea h="calc(100vh - 180px)">
        <Stack gap="md">
          {logs.map((log) => (
            <Paper key={log._id} p="md" withBorder>
              <Group justify="space-between" align="flex-start">
                <Stack gap="xs" style={{ flex: 1 }}>
                  <Group justify="space-between" align="center">
                    <Text fw={500}>{getHabitQuestion(log.habitId)}</Text>
                    {log.mealType && getMealTypeBadge(log.mealType)}
                  </Group>

                  <Group gap="lg">
                    <Text size="sm" fw={500}>
                      Value:{" "}
                      <Text span c="dimmed">
                        {formatValue(log)}
                      </Text>
                    </Text>

                    {log.generalTime && (
                      <Text size="sm" fw={500}>
                        Time of day:{" "}
                        <Text span c="dimmed">
                          {log.generalTime}
                        </Text>
                      </Text>
                    )}
                  </Group>

                  <Group gap="lg">
                    <Text size="sm" fw={500}>
                      Date:{" "}
                      <Text span c="dimmed">
                        {new Date(log.date).toLocaleDateString()}
                        {log.timeType === "exact" && ` at ${new Date(log.date).toLocaleTimeString()}`}
                      </Text>
                    </Text>

                    <Text size="sm" c="dimmed">
                      Logged: {formatDate(log.createdAt)}
                    </Text>
                  </Group>

                  {log.surveyId && (
                    <Text size="sm" c="blue">
                      Part of survey
                    </Text>
                  )}
                </Stack>

                <ActionIcon variant="subtle" color="red" onClick={() => deleteLog(log._id)}>
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            </Paper>
          ))}
        </Stack>
      </ScrollArea>
    </Stack>
  );
};

export default LogsView;
