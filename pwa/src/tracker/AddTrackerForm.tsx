import { Stack, TextInput, Select, Button } from "@mantine/core";
import type React from "react";
import { useState } from "react";
import type { Tracker, TrackerType } from "../database/models";

function AddTrackerForm({
  onSubmit,
}: {
  onSubmit: (tracker: Tracker) => void;
}) {
  const [question, setQuestion] = useState("");
  const [trackerType, setTrackerType] = useState<TrackerType>("number");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type: "tracker",
      question,
      trackerType,
      options: [],
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <TextInput
          label="Question"
          required
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., How many glasses of water did you drink?"
        />

        <Select
          label="Type"
          required
          value={trackerType}
          onChange={(value) => setTrackerType(value as TrackerType)}
          data={[
            { value: "number", label: "Number" },
            { value: "scale", label: "Scale (0-10)" },
            { value: "boolean", label: "Yes/No" },
            { value: "text_list", label: "Multiple Text Selection" },
          ]}
        />

        <Button type="submit">Add Tracker</Button>
      </Stack>
    </form>
  );
}

export default AddTrackerForm;
