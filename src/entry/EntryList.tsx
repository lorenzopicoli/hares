import { useState, useMemo, useCallback } from "react";
import { Stack, Text, Group, ActionIcon, ScrollArea, Button, Box, Card, Container } from "@mantine/core";
import { IconTrash, IconChevronLeft, IconChevronRight, IconCalendar, IconArrowsShuffle } from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";
import type { EntryDoc } from "../database/models";
import { useTrackers } from "../database/tracker";
import { useEntries, useRemoveEntry } from "../database/entry";
import { HEADER_TOP_HEIGHT } from "../constants";

const EntryList = () => {
  const { allTrackers } = useTrackers();
  const { removeEntry } = useRemoveEntry();
  const [currentDay, setCurrentDay] = useState(new Date());
  const [datePickerOpened, setDatePickerOpened] = useState(false);

  // Get entries for the current day
  const { allEntries } = useEntries({
    pageSize: 100,
    keepOldPages: false,
  });

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
        return entry.value ? "Yes" : "No";
      case "text_list":
        return Array.isArray(entry.value) ? entry.value.join(", ") : entry.value;
      case "scale":
        return `${entry.value}/10`;
      default:
        return entry.value.toString();
    }
  };

  const navigateDay = (direction: "prev" | "next") => {
    const newDate = new Date(currentDay);
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDay(newDate);
  };

  const jumpToRandomDay = () => {
    const oldestEntry = allEntries[allEntries.length - 1];
    const newestEntry = allEntries[0];

    if (!oldestEntry || !newestEntry) return;

    const oldestDate = new Date(oldestEntry.date);
    const newestDate = new Date(newestEntry.date);
    const timeDiff = newestDate.getTime() - oldestDate.getTime();
    const randomTime = oldestDate.getTime() + Math.random() * timeDiff;
    setCurrentDay(new Date(randomTime));
  };

  const dayEntries = useMemo(() => {
    return allEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate.toDateString() === currentDay.toDateString();
    });
  }, [allEntries, currentDay]);

  // Group entries by time of day
  const groupedEntries = useMemo(() => {
    const groups: Record<string, EntryDoc[]> = {
      morning: [],
      afternoon: [],
      night: [],
      all_day: [],
    };

    for (const entry of dayEntries) {
      const timeGroup = entry.timeOfDay || "all_day";
      groups[timeGroup].push(entry);
    }

    return groups;
  }, [dayEntries]);

  const formatDate = useCallback((date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: today.getFullYear() !== date.getFullYear() ? "numeric" : undefined,
    });
  }, []);

  const renderEntry = (entry: EntryDoc) => (
    <Card key={entry._id} p="md" radius="md" className="transition-all duration-200 hover:shadow-md" withBorder>
      <Group justify="space-between" align="flex-start">
        <Stack gap="xs" style={{ flex: 1 }}>
          <Text fw={500} size="lg">
            {getTrackerQuestion(entry.trackerId)}
          </Text>

          <Group gap="lg">
            <Text fw={500}>{formatValue(entry)}</Text>
            {entry.exactTime && (
              <Text size="sm" c="dimmed">
                at {entry.exactTime}
              </Text>
            )}
          </Group>

          {entry.collectionId && (
            <Text size="sm" c="blue">
              Part of collection
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
    </Card>
  );

  const renderTimeSection = (title: string, entries: EntryDoc[]) => {
    if (entries.length === 0) return null;

    return (
      <Stack gap="md">
        <Text fw={700} c="dimmed" tt="uppercase" size="sm">
          {title}
        </Text>
        <Stack gap="md">{entries.map(renderEntry)}</Stack>
      </Stack>
    );
  };

  return (
    <Container size="md" px="md">
      <Stack>
        {/* Date Navigation */}
        <Card withBorder>
          <Group justify="space-between">
            <Group>
              <ActionIcon variant="light" onClick={() => navigateDay("prev")} size="lg">
                <IconChevronLeft size={20} />
              </ActionIcon>

              <Button
                variant="subtle"
                leftSection={<IconCalendar size={20} />}
                onClick={() => setDatePickerOpened(true)}
              >
                {formatDate(currentDay)}
              </Button>

              <ActionIcon variant="light" onClick={() => navigateDay("next")} size="lg">
                <IconChevronRight size={20} />
              </ActionIcon>
            </Group>

            <Button variant="light" leftSection={<IconArrowsShuffle size={20} />} onClick={jumpToRandomDay}>
              Random Day
            </Button>
          </Group>

          {/* Hidden date picker that shows on button click */}
          {datePickerOpened && (
            <Box mt="md">
              <DatePickerInput
                value={currentDay}
                onChange={(date) => {
                  if (date) {
                    setCurrentDay(date);
                    setDatePickerOpened(false);
                  }
                }}
                onClose={() => setDatePickerOpened(false)}
                popoverProps={{ opened: datePickerOpened }}
                maxDate={new Date()}
              />
            </Box>
          )}
        </Card>

        {/* Entries List */}
        <ScrollArea h={`calc(100vh - ${HEADER_TOP_HEIGHT})`} type="never">
          <Stack gap="xl">
            {renderTimeSection("Morning", groupedEntries.morning)}
            {renderTimeSection("Afternoon", groupedEntries.afternoon)}
            {renderTimeSection("Night", groupedEntries.night)}
            {renderTimeSection("All Day", groupedEntries.all_day)}

            {dayEntries.length === 0 && (
              <Card withBorder p="xl">
                <Stack align="center" gap="md">
                  <Text size="lg" fw={500} c="dimmed" ta="center">
                    No entries for this day
                  </Text>
                  <Button variant="light" onClick={jumpToRandomDay}>
                    Try another day
                  </Button>
                </Stack>
              </Card>
            )}
          </Stack>
        </ScrollArea>
      </Stack>
    </Container>
  );
};

export default EntryList;
