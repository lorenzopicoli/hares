import { Text, Stack, Paper, Group, ActionIcon } from "@mantine/core";
import { IconPinned, IconPin, IconTrash, IconPlayerPlay } from "@tabler/icons-react";
import type { CollectionDoc } from "../database/models";
import { useCollections, useRemoveCollection, useUpdateCollection } from "../database/collection";

function CollectionList(props: { onStartCollection: (collection: CollectionDoc) => void }) {
  const { onStartCollection } = props;
  const { allCollections } = useCollections();
  const { updateCollection } = useUpdateCollection();
  const { removeCollection } = useRemoveCollection();

  const handleTogglePin = (collection: CollectionDoc) => () => {
    updateCollection(collection._id, { isPinned: !collection.isPinned });
  };

  const handleDelete = (collection: CollectionDoc) => () => {
    removeCollection(collection._id);
  };

  return (
    <Stack mt="md">
      {allCollections.map((collection) => (
        <Paper key={collection._id} p="md" withBorder>
          <Group justify="space-between" align="flex-start">
            <div>
              <Text fw={500}>{collection.name}</Text>
              <Text size="sm" c="dimmed">
                Trackers: {collection.trackers.length}
              </Text>
            </div>
            <Group>
              <ActionIcon
                variant="subtle"
                color="yellow"
                onClick={handleTogglePin(collection)}
                title={collection.isPinned ? "Remove from quick access" : "Add to quick access"}
              >
                {collection.isPinned ? <IconPinned size={16} /> : <IconPin size={16} />}
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => onStartCollection(collection)}
                title="Start Collection"
              >
                <IconPlayerPlay size={16} />
              </ActionIcon>
              <ActionIcon variant="subtle" color="red" onClick={handleDelete(collection)} title="Delete survey">
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          </Group>
        </Paper>
      ))}
    </Stack>
  );
}

export default CollectionList;
