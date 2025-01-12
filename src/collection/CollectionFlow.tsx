import { useState } from "react";
import { Card, Button, Group, Progress, Stack, Text, Title } from "@mantine/core";
import AddEntryForm from "../entry/AddEntryForm";
import type { CollectionDoc, Entry } from "../database/models";
import { useCollectionTrackers } from "../database/collection";

interface CollectionFlowProps {
  collection: CollectionDoc;
  onComplete: (responses: Entry[]) => void;
  onClose: () => void;
}

function CollectionFlow({ collection, onComplete, onClose }: CollectionFlowProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Entry[]>([]);
  const { collectionTrackers } = useCollectionTrackers(collection);

  console.log("coo", collectionTrackers, collection);
  const currentTracker = collectionTrackers[currentQuestionIndex];
  const progress = (currentQuestionIndex / collectionTrackers.length) * 100;

  const handleResponse = (value: Entry) => {
    const newResponses: Entry[] = [...responses, { ...value, collectionId: collection._id }];

    setResponses(newResponses);

    if (currentQuestionIndex < collectionTrackers.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete(newResponses);
    }
  };

  return (
    <Card p="xl" radius="md" withBorder className="max-w-2xl mx-auto">
      <Stack>
        <Group justify="space-between" mb="md">
          <Title order={2}>{collection.name}</Title>
          <Text size="sm" c="dimmed">
            Question {currentQuestionIndex + 1} of {collectionTrackers.length}
          </Text>
        </Group>

        <Progress value={progress} size="sm" mb="xl" />

        {currentTracker && <AddEntryForm tracker={currentTracker} onEntryAdded={handleResponse} />}

        <Group justify="space-between" mt="xl">
          <Button variant="subtle" onClick={onClose}>
            Cancel
          </Button>
          {currentQuestionIndex > 0 && (
            <Button
              variant="subtle"
              onClick={() => {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
                setResponses(responses.slice(0, -1));
              }}
            >
              Previous
            </Button>
          )}
        </Group>
      </Stack>
    </Card>
  );
}

export default CollectionFlow;
