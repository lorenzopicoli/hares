import { Stack, Modal, Text, Notification } from "@mantine/core";
import { useState } from "react";
import { IconCloudOff, IconCloud } from "@tabler/icons-react";
import AddEntryForm from "../entry/AddEntryForm";
import TrackersQuickAccessGrid from "../tracker/TrackersQuickAccessGrid";
import CollectionList from "../collection/CollectionList";
import type { CollectionDoc, Entry, TrackerDoc } from "../database/models";
import CollectionFlow from "../collection/CollectionFlow";
import { useTrackers, useUpdateTracker } from "../database/tracker";
import { useCollections } from "../database/collection";
import { useAddEntries } from "../database/entry";

function QuickAccess() {
  const { updateTracker } = useUpdateTracker();
  const { pinnedTrackers } = useTrackers();
  const { pinnedCollections } = useCollections();
  const { addEntries } = useAddEntries();
  const [activeCollection, setActiveCollection] = useState<CollectionDoc | null>(null);
  const [selectedTracker, setSelectedTracker] = useState<TrackerDoc | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "warning";
  }>({ show: false, message: "", type: "success" });

  const handleAddEntries = async (data: Entry[]) => {
    await addEntries(data);
    showNotification("Entry created!", "success");
  };

  const showNotification = (message: string, type: "success" | "warning") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 3000);
  };

  return (
    <Stack>
      <Text size="xl">Quick Access</Text>

      <Modal
        opened={!!activeCollection}
        onClose={() => setActiveCollection(null)}
        size="xl"
        padding="xl"
        withinPortal
        fullScreen
      >
        {activeCollection && (
          <CollectionFlow
            collection={activeCollection}
            onComplete={(responses) => {
              handleAddEntries(responses);
              setActiveCollection(null);
            }}
            onClose={() => setActiveCollection(null)}
          />
        )}
      </Modal>

      {pinnedTrackers.length > 0 && (
        <TrackersQuickAccessGrid
          pinnedTrackers={pinnedTrackers}
          onTogglePin={(tracker) => updateTracker(tracker._id, { isPinned: !tracker.isPinned })}
          onSelectTracker={(tracker) => setSelectedTracker(tracker)}
        />
      )}

      {pinnedCollections.length > 0 && (
        <CollectionList
          onStartCollection={(collection) => {
            if (collection) {
              setActiveCollection(collection);
            }
          }}
        />
      )}

      <Modal
        opened={!!selectedTracker}
        onClose={() => setSelectedTracker(null)}
        size="lg"
        title={selectedTracker?.question}
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

      {/* Success Notification */}
      {notification.show && (
        <Notification
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
          }}
          icon={notification.type === "success" ? <IconCloud size={20} /> : <IconCloudOff size={20} />}
          color={notification.type === "success" ? "green" : "yellow"}
          title={notification.type === "success" ? "Success" : "Offline Mode"}
          onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
        >
          {notification.message}
        </Notification>
      )}
    </Stack>
  );
}

export default QuickAccess;
