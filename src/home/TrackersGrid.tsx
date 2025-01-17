import { useState } from "react";
import { Text, Card, Center, Container, Grid } from "@mantine/core";
import type { TrackerDoc } from "../database/models";
import {
  DndContext,
  closestCenter,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  type DragCancelEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable, rectSortingStrategy, arrayMove } from "@dnd-kit/sortable";

const SortableTrackerCard = ({
  tracker,
  onClick,
  isDragging,
  isDraggingSomething,
}: {
  tracker: TrackerDoc;
  onClick: () => void;
  isDragging?: boolean;
  isDraggingSomething?: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: tracker._id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition,
        opacity: isDragging ? 0.5 : 1,
        height: "100%",
      }
    : {
        height: "100%",
      };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        p="md"
        radius="md"
        h="100%"
        onClick={onClick}
        bg={"var(--mantine-color-dark-8)"}
        style={(theme) => ({
          cursor: isDragging ? "grabbing" : "pointer",
          transform: "none",
          borderWidth: "1px",
          borderColor: theme.colors.dark[7],
          opacity: isDraggingSomething && !isDragging ? 0.4 : undefined,
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
    </div>
  );
};

export function TrackersGrid({
  trackers,
  onClick,
  onSort,
}: {
  trackers: TrackerDoc[];
  onClick: (tracker: TrackerDoc) => void;
  onSort: (newTrackers: TrackerDoc[]) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = trackers.findIndex((t) => t._id === active.id);
      const newIndex = trackers.findIndex((t) => t._id === over.id);
      const sortedTrackers = arrayMove(trackers, oldIndex, newIndex);
      onSort(sortedTrackers);
    }

    setActiveId(null);
  };

  const handleDragCancel = (event: DragCancelEvent) => {
    setActiveId(null);
  };

  const activeTracker = activeId ? trackers.find((t) => t._id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <Container fluid m={0} mt="md" p={0}>
        <Grid gutter="sm" overflow="hidden">
          <SortableContext items={trackers.map((t) => t._id)} strategy={rectSortingStrategy}>
            {trackers.map((tracker) => (
              <Grid.Col key={tracker._id} span={4}>
                <SortableTrackerCard
                  tracker={tracker}
                  onClick={() => onClick(tracker)}
                  isDragging={tracker._id === activeId}
                  isDraggingSomething={activeId !== null}
                />
              </Grid.Col>
            ))}
          </SortableContext>
        </Grid>

        <DragOverlay>
          {activeTracker ? (
            <Card
              p="md"
              radius="md"
              h="100%"
              bg={"var(--mantine-color-dark-8)"}
              style={(theme) => ({
                transform: "none",
                borderWidth: "1px",
                borderColor: theme.colors.dark[7],
                // width: "calc(33.333% - 8px)", // Approximate the grid column width
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
                  {activeTracker.question}
                </Text>
              </Center>
            </Card>
          ) : null}
        </DragOverlay>
      </Container>
    </DndContext>
  );
}
