import { Stack, Paper, Group, ActionIcon, Text, Grid, Container, Card, Center } from "@mantine/core";
import { IconNotes, IconPinned, IconPin, IconTrash } from "@tabler/icons-react";
import type { TrackerDoc } from "../database/models";
import { useRemoveTracker, useTrackers, useUpdateTracker } from "../database/tracker";

function TrackersList(props: { searchQuery?: string; onNewEntry: (tracker: TrackerDoc) => void }) {
  const { searchQuery = "", onNewEntry } = props;
  const { allTrackers } = useTrackers();
  const { removeTracker } = useRemoveTracker();
  const { updateTracker } = useUpdateTracker();

  const filteredTrackers = allTrackers.filter((tracker) =>
    tracker.question.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDeleteTracker = (tracker: TrackerDoc) => () => {
    removeTracker(tracker._id);
  };

  console.log("fl", filteredTrackers, allTrackers);

  return (
    <Stack mt="md">
      {filteredTrackers.map((tracker) => (
        <Paper key={tracker._id} p="md" withBorder>
          <Group justify="space-between" align="flex-start">
            <Stack gap="xs" style={{ flex: 1 }}>
              <Text>{tracker.question}</Text>
              <Text size="sm" c="dimmed">
                Type: {tracker.type}
              </Text>
            </Stack>
            <Group>
              <ActionIcon variant="subtle" color="blue" onClick={() => onNewEntry(tracker)} title="New Entry">
                <IconNotes size={16} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="yellow"
                onClick={() => updateTracker(tracker._id, { isPinned: !tracker.isPinned })}
                title={tracker.isPinned ? "Remove from quick access" : "Add to quick access"}
              >
                {tracker.isPinned ? <IconPinned size={16} /> : <IconPin size={16} />}
              </ActionIcon>
              <ActionIcon variant="subtle" color="red" onClick={handleDeleteTracker(tracker)} title="Delete tracker">
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          </Group>
        </Paper>
      ))}
    </Stack>
  );
}

export default TrackersList;

const TrackerCard = ({ tracker, onClick }: { tracker: TrackerDoc; onClick: () => void }) => {
  return (
    <Card
      p="md"
      radius="md"
      h="100%"
      onClick={onClick}
      bg={"var(--mantine-color-dark-8)"}
      style={(theme) => ({
        cursor: "pointer",
        transform: "none",
        borderWidth: "1px",
        borderColor: theme.colors.dark[7],
      })}
      withBorder
    >
      <Center h="100%" mih={60}>
        <Text
          size="sm"
          ta="center"
          fw={500}
          style={(theme) => ({
            color: theme.colors.gray[1],
          })}
        >
          {tracker.question}
        </Text>
      </Center>
    </Card>
  );
};

export function TrackersListV2(props: { trackers: TrackerDoc[]; onClick: (tracker: TrackerDoc) => void }) {
  return (
    <Container fluid m={0} mt={"md"} p={0}>
      <Grid gutter={"sm"} overflow="hidden">
        {props.trackers.map((tracker) => (
          <Grid.Col key={tracker._id} span={4}>
            <TrackerCard tracker={tracker} onClick={() => props.onClick(tracker)} />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}
