import { Stack, Text, Paper, Group, ActionIcon, ScrollArea, Button, Box } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import type { EntryDoc } from "../database/models";
import { useTrackers } from "../database/tracker";
import { useEntries, useRemoveEntry } from "../database/entry";
import { useState, useMemo, useCallback } from "react";
import { HEADER_TOP_HEIGHT } from "../constants";

interface GroupedEntries {
  [key: string]: EntryDoc[];
}

const EntryList = () => {
  const { allTrackers } = useTrackers();
  const { removeEntry } = useRemoveEntry();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const { allEntries, hasMore } = useEntries({
    currentPage,
  });

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getTrackerQuestion = (trackerId: string) => {
    const tracker = allTrackers.find((h) => h._id === trackerId);
    return tracker?.question || "Unknown Tracker";
  };

  const formatValue = (entry: EntryDoc) => {
    if (entry.value === undefined || entry.value === null) {
      return "No value";
    }
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

  const getDateKey = useCallback((date: Date): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const entryDate = new Date(date);
    entryDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - entryDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";

    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: today.getFullYear() !== entryDate.getFullYear() ? "numeric" : undefined,
    });
  }, []);

  // This cannot be efficient... need to improve it
  const groupedEntries = useMemo(() => {
    const groups: GroupedEntries = {};
    for (const entry of allEntries) {
      const dateKey = getDateKey(new Date(entry.date));
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(entry);
    }
    return groups;
  }, [allEntries, getDateKey]);

  return (
    <Stack>
      <ScrollArea type="never" pb="md" h={`calc(100vh - ${HEADER_TOP_HEIGHT})`}>
        <Stack gap="xl">
          {Object.entries(groupedEntries).map(([dateKey, entries]) => (
            <Stack key={dateKey} gap="md">
              <Box pt="md">
                <Text size="lg" fw={700} c="dimmed">
                  {dateKey}
                </Text>
              </Box>

              <Stack gap="xs">
                {entries.map((entry) => (
                  <Paper key={entry._id} p="md" withBorder className="transition-all duration-200 hover:shadow-md">
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
                            Time:{" "}
                            <Text span c="dimmed">
                              {entry.exactTime || entry.timeOfDay}
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

                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => removeEntry(entry._id)}
                        className="transition-colors hover:bg-red-900"
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </Stack>
          ))}

          {hasMore && (
            <Button
              variant="light"
              onClick={() => setCurrentPage(currentPage + 1)}
              fullWidth
              className="transition-colors hover:bg-gray-800"
            >
              Load More
            </Button>
          )}
        </Stack>
      </ScrollArea>
    </Stack>
  );
};

export default EntryList;
