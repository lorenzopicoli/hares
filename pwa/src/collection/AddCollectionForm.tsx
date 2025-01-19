import { Stack, TextInput, MultiSelect, Button } from "@mantine/core";
import type React from "react";
import { useState } from "react";
import { useTrackers } from "../database/tracker";
import type { Collection } from "../database/models";

function AddCollectionForm({
  onSubmit,
}: {
  onSubmit: (collection: Collection) => void;
}) {
  const { allTrackers } = useTrackers();
  const [name, setName] = useState("");
  const [selectedTrackers, setSelectedTrackers] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && selectedTrackers.length > 0) {
      const newCollection: Collection = {
        type: "collection",
        name,
        trackers: selectedTrackers,
        isPinned: false,
      };

      onSubmit(newCollection);
      setName("");
      setSelectedTrackers([]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <TextInput
          label="Collection Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Daily Health Check"
        />
        <MultiSelect
          label="Select trackers"
          required
          data={allTrackers.map((tracker) => ({
            value: tracker._id,
            label: tracker.question,
          }))}
          value={selectedTrackers}
          onChange={setSelectedTrackers}
          placeholder="Choose trackers to include"
          searchable
          clearable
        />
        <Button type="submit" disabled={!name || selectedTrackers.length === 0} variant="filled">
          Create Collection
        </Button>
      </Stack>
    </form>
  );
}

export default AddCollectionForm;
