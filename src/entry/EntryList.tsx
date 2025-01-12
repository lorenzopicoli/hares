import { Stack, Text, Paper, Group, ActionIcon, ScrollArea } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import type { EntryDoc } from "../database/models";
import { useTrackers } from "../database/tracker";
import { useEntries, useRemoveEntry } from "../database/entry";

const EntryList = () => {
  const { allTrackers } = useTrackers();
  const { allEntries } = useEntries();
  const { removeEntry } = useRemoveEntry();
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getTrackerQuestion = (trackerId: string) => {
    const tracker = allTrackers.find((h) => h._id === trackerId);
    return tracker?.question || "Unknown Tracker";
  };

  const formatValue = (entry: EntryDoc) => {
    switch (entry.trackerType) {
      case "boolean":
        return (entry.value as boolean) ? "Yes" : "No";
      case "text_list":
        return (entry.value as string[]).join(", ");
      case "scale":
        return `${entry.value}/10`;
      default:
        return entry.value.toString();
    }
  };

  return (
    <Stack>
      <Text size="xl">Tracker Entries</Text>
      <ScrollArea h="calc(100vh - 180px)">
        <Stack gap="md">
          {allEntries.map((entry) => (
            <Paper key={entry._id} p="md" withBorder>
              <Group justify="space-between" align="flex-start">
                <Stack gap="xs" style={{ flex: 1 }}>
                  <Group justify="space-between" align="center">
                    <Text fw={500}>{getTrackerQuestion(entry.trackerId)}</Text>
                  </Group>

                  <Group gap="lg">
                    <Text size="sm" fw={500}>
                      Value:{" "}
                      <Text span c="dimmed">
                        {formatValue(entry)}
                      </Text>
                    </Text>

                    {entry.timeOfDay && (
                      <Text size="sm" fw={500}>
                        Time of day:{" "}
                        <Text span c="dimmed">
                          {entry.timeOfDay}
                        </Text>
                      </Text>
                    )}
                  </Group>

                  <Group gap="lg">
                    <Text size="sm" fw={500}>
                      Date:{" "}
                      <Text span c="dimmed">
                        {new Date(entry.date).toLocaleDateString()}
                        {entry.exactTime && ` at ${entry.exactTime}`}
                      </Text>
                    </Text>

                    <Text size="sm" c="dimmed">
                      Logged: {formatDate(entry.createdAt)}
                    </Text>
                  </Group>

                  {entry.collectionId && (
                    <Text size="sm" c="blue">
                      Part of survey
                    </Text>
                  )}
                </Stack>

                <ActionIcon variant="subtle" color="red" onClick={() => removeEntry(entry._id)}>
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

export default EntryList;
