import { Stack, TextInput, Tabs, ActionIcon, Box, Container, Notification, Modal } from "@mantine/core";
import { IconCheck, IconSearch, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useTrackers } from "./database/tracker";
import { useCollections, useCollectionTrackers } from "./database/collection";
import { TrackersListV2 } from "./tracker/TrackersList";
import type { Entry, TrackerDoc } from "./database/models";
import { useAddEntries } from "./database/entry";
import AddEntryForm from "./entry/AddEntryForm";

export function CollectionsView() {
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string | null>("all");
  const { allTrackers } = useTrackers();
  const { allCollections } = useCollections();
  const { addEntries } = useAddEntries();
  const [selectedTracker, setSelectedTracker] = useState<TrackerDoc | null>(null);

  const currentCollection = activeTab === "all" ? undefined : allCollections.find((c) => c._id === activeTab);
  const { collectionTrackers } = useCollectionTrackers(currentCollection);

  const handleCancelSearch = () => {
    setSearchQuery("");
  };
  const handleTrackerClick = (tracker: TrackerDoc) => {
    setSelectedTracker(tracker);
  };

  const handleAddEntries = async (data: Entry[]) => {
    await addEntries(data);
    setNotification({ show: true, message: "Tracker entry created!" });
    setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 3000);
  };

  const tabs = [{ name: "All", _id: "all" }, ...allCollections];

  const filteredAllTrackers = allTrackers.filter((tracker) =>
    tracker.question.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
              <TrackersListV2
                trackers={
                  tab._id === "all" || searchQuery !== ""
                    ? filteredAllTrackers
                    : tab._id === activeTab
                      ? collectionTrackers
                      : []
                }
                onClick={handleTrackerClick}
              />
            </Tabs.Panel>
          ))}
        </Box>
      </Tabs>

      <Modal
        centered
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
