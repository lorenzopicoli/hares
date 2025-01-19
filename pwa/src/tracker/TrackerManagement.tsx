import { Stack, Group, Button, Text, Modal, TextInput, Tabs } from "@mantine/core";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import CollectionList from "../collection/CollectionList";
import AddTrackerForm from "./AddTrackerForm";
import AddCollectionForm from "../collection/AddCollectionForm";
import AddEntryForm from "../entry/AddEntryForm";
import type { TrackerDoc } from "../database/models";
import { useAddTracker } from "../database/tracker";
import { useAddCollection } from "../database/collection";
import { useAddEntries } from "../database/entry";

function TrackerManagement() {
  const { addTracker } = useAddTracker();
  const { addCollection } = useAddCollection();
  const { addEntries } = useAddEntries();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTracker, setSelectedTracker] = useState<TrackerDoc | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>("trackers");

  const [collectionModalOpened, { open: openCollectionModal, close: closeCollectionModal }] = useDisclosure(false);
  const [trackerModalOpened, { open: openTrackerModal, close: closeTrackerModal }] = useDisclosure(false);

  return (
    <Stack>
      <Group justify="space-between">
        <Text size="xl">Manage Trackers & Connections</Text>
        <Group>
          <Button onClick={openTrackerModal}>Add Tracker</Button>
          <Button onClick={openCollectionModal}>Create Collection</Button>
        </Group>
      </Group>

      <TextInput
        placeholder="Search trackers..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        mb="md"
      />

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="trackers">Trackers</Tabs.Tab>
          <Tabs.Tab value="collections">Collections</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="collections">
          <CollectionList onStartCollection={() => {}} />
        </Tabs.Panel>
      </Tabs>

      <Modal opened={trackerModalOpened} onClose={closeTrackerModal} title="Add New Tracker">
        <AddTrackerForm
          onSubmit={(tracker) => {
            addTracker(tracker);
            closeTrackerModal();
          }}
        />
      </Modal>

      <Modal opened={collectionModalOpened} onClose={closeCollectionModal} title="Create New Survey">
        <AddCollectionForm
          onSubmit={(collection) => {
            addCollection(collection);
            closeCollectionModal();
          }}
        />
      </Modal>

      <Modal opened={!!selectedTracker} onClose={() => setSelectedTracker(null)} title="Log entry">
        {selectedTracker && (
          <AddEntryForm
            tracker={selectedTracker}
            onEntryAdded={(entry) => {
              addEntries([entry]);
              setSelectedTracker(null);
            }}
          />
        )}
      </Modal>
    </Stack>
  );
}

export default TrackerManagement;
