import { Stack, TextInput, Tabs, ActionIcon, Box, Container, Notification, Modal } from "@mantine/core";
import { IconCheck, IconSearch, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useAddTracker, useTrackers, useUpdateTrackers } from "../database/tracker";
import { useAddCollection, useCollections, useCollectionTrackers, useUpdateCollection } from "../database/collection";
import type { Collection, Entry, Tracker, TrackerDoc } from "../database/models";
import { useAddEntries } from "../database/entry";
import AddEntryForm from "../entry/AddEntryForm";
import { TrackersGrid } from "./TrackersGrid";
import { FloatingActionButton } from "./FloatingActionButton";
import AddCollectionForm from "../collection/AddCollectionForm";
import AddTrackerForm from "../tracker/AddTrackerForm";

export function CollectionsView() {
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string | null>("all");
  const [addNewModalOpen, setAddNewModalOpen] = useState<boolean>(false);
  const { allTrackers } = useTrackers();
  const { allCollections } = useCollections();
  const { addEntries } = useAddEntries();
  const { addTracker } = useAddTracker();
  const { updateTrackers } = useUpdateTrackers();
  const { updateCollection } = useUpdateCollection();
  const { addCollection } = useAddCollection();
  const [selectedTracker, setSelectedTracker] = useState<TrackerDoc | null>(null);
  const [optimisticTrackers, setOptimisticTrackers] = useState<TrackerDoc[]>([]);

  const currentCollection = activeTab === "all" ? undefined : allCollections.find((c) => c._id === activeTab);
  const { collectionTrackers } = useCollectionTrackers(currentCollection);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // If collection trackers updated, that means that we are in a collection tab
    // and hence we can reset the optimistic result
    setOptimisticTrackers([]);
  }, [collectionTrackers]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // If "allTrackers" change and we are in the "all" tab, reset the optimist result because
    // it means that sorting is done
    if (activeTab === "all") {
      setOptimisticTrackers([]);
    }
  }, [allTrackers]);

  const handleCancelSearch = () => {
    setSearchQuery("");
  };
  const handleTrackerClick = (tracker: TrackerDoc) => {
    setSelectedTracker(tracker);
  };

  const handleAddNewTracker = (tracker: Tracker) => {
    addTracker(tracker);
    setAddNewModalOpen(false);
  };

  const handleAddNewCollection = (collection: Collection) => {
    addCollection(collection);
    setAddNewModalOpen(false);
  };
  const handleAddEntries = async (data: Entry[]) => {
    await addEntries(data);
    setNotification({ show: true, message: "Tracker entry created!" });
    setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 3000);
  };

  const handleSortedTrackers = async (trackers: TrackerDoc[]) => {
    setOptimisticTrackers(trackers);
    if (currentCollection) {
      await updateCollection(currentCollection?._id, { trackers: trackers.map((t) => t._id) });
    } else {
      const updatedOrderTrackers = trackers.map((t, i) => ({ ...t, order: i }));
      await updateTrackers(updatedOrderTrackers);
    }
  };

  const tabs = [{ name: "All", _id: "all" }, ...allCollections];

  const getDisplayedTrackers = () => {
    if (optimisticTrackers.length > 0) {
      return optimisticTrackers;
    }

    const baseTrackers = activeTab === "all" || searchQuery !== "" ? allTrackers : collectionTrackers;
    return searchQuery
      ? baseTrackers.filter((tracker) => tracker.question.toLowerCase().includes(searchQuery.toLowerCase()))
      : baseTrackers;
  };

  return (
    <Container p={0}>
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Box bg={"var(--mantine-color-dark-9)"} pos={"sticky"} top={0} style={{ zIndex: 10 }}>
          <Stack>
            <TextInput
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftSection={<IconSearch size={16} />}
              rightSection={
                <ActionIcon variant="subtle" color="gray" onClick={handleCancelSearch}>
                  <IconX size={16} />
                </ActionIcon>
              }
            />
            <Tabs.List>
              {tabs.map((tab) => (
                <Tabs.Tab key={tab._id} value={tab._id}>
                  {tab.name}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Stack>
        </Box>

        <Box style={{ flexGrow: 1, overflowY: "auto" }}>
          {tabs.map((tab) => (
            <Tabs.Panel key={tab._id} value={tab._id}>
              <TrackersGrid
                trackers={tab._id === activeTab ? getDisplayedTrackers() : []}
                onSort={handleSortedTrackers}
                onClick={handleTrackerClick}
              />
            </Tabs.Panel>
          ))}
        </Box>
      </Tabs>

      <Modal opened={addNewModalOpen} onClose={() => setAddNewModalOpen(false)} title="Add New">
        <Tabs defaultValue="tracker">
          <Tabs.List grow mb="md">
            <Tabs.Tab value="tracker">Tracker</Tabs.Tab>
            <Tabs.Tab value="collection">Collection</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="tracker">
            <AddTrackerForm onSubmit={handleAddNewTracker} />
          </Tabs.Panel>

          <Tabs.Panel value="collection">
            <AddCollectionForm onSubmit={handleAddNewCollection} />
          </Tabs.Panel>
        </Tabs>
      </Modal>

      <Modal
        opened={!!selectedTracker}
        onClose={() => setSelectedTracker(null)}
        size="lg"
        title={selectedTracker?.question}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        {selectedTracker && (
          <AddEntryForm
            tracker={selectedTracker}
            onEntryAdded={(entry) => {
              handleAddEntries([entry]);
              setSelectedTracker(null);
            }}
          />
        )}
      </Modal>

      <FloatingActionButton
        onClick={(): void => {
          setAddNewModalOpen(true);
        }}
      />
      {notification.show && (
        <Notification
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
          }}
          icon={<IconCheck size={20} />}
          color={"green"}
          title={"Success"}
          onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
        >
          {notification.message}
        </Notification>
      )}
    </Container>
  );
}
