import { Grid, Paper, Text, ActionIcon, Group, Container } from "@mantine/core";
import { IconPinnedOff } from "@tabler/icons-react";
import type { TrackerDoc } from "../database/models";

interface TrackersQuickAccessGridProp {
  pinnedTrackers: TrackerDoc[];
  onTogglePin: (tracker: TrackerDoc) => void;
  onSelectTracker: (tracker: TrackerDoc) => void;
}

function TrackersQuickAccessGrid({ pinnedTrackers, onTogglePin, onSelectTracker }: TrackersQuickAccessGridProp) {
  return (
    <Container fluid m={0} p={0}>
      <Grid gutter="md" m={0}>
        {pinnedTrackers.map((tracker) => (
          <Grid.Col key={tracker._id} m={0} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
            <Paper
              p="md"
              withBorder
              className="hover:bg-gray-800 transition-colors cursor-pointer"
              onClick={() => onSelectTracker(tracker)}
            >
              <Group justify="space-between" mb="xs">
                <Text size="lg" fw={500} lineClamp={2}>
                  {tracker.question}
                </Text>
                <ActionIcon
                  variant="subtle"
                  color="yellow"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePin(tracker);
                  }}
                >
                  <IconPinnedOff size={16} />
                </ActionIcon>
              </Group>
              <Text size="sm" c="dimmed">
                Type: {tracker.type}
              </Text>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}

export default TrackersQuickAccessGrid;
