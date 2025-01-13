import { useState } from 'react'
import {
  Stack,
  TextInput,
  Tabs,
  Paper,
  Group,
  Text,
  ActionIcon,
  Menu,
  Modal,
  Transition,
  Box,
} from '@mantine/core'
import {
  IconSearch,
  IconDotsVertical,
  IconTrash,
  IconArrowsUpDown,
  IconPlus,
  IconPinned,
  IconGripVertical,
} from '@tabler/icons-react'
import {
  DndContext,
  type DragEndEvent,
  closestCenter,
  type DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import AddTrackerForm from './tracker/AddTrackerForm'
import AddCollectionForm from './collection/AddCollectionForm'

interface Item {
  id: string
  type: 'tracker' | 'collection'
  title: string
  isPinned: boolean
}

const SortableItem = ({
  item,
  onPin,
  onDelete,
  onStart,
  isReordering,
}: {
  item: Item
  onPin: () => void
  onDelete: () => void
  onStart: () => void
  isReordering: boolean
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Paper ref={setNodeRef} style={style} withBorder p="md" className="mb-2">
      <Group justify="space-between" align="center">
        <Group gap="sm">
          {isReordering && (
            <ActionIcon
              variant="subtle"
              color="gray"
              {...attributes}
              {...listeners}
            >
              <IconGripVertical size={16} />
            </ActionIcon>
          )}
          <Stack gap={4}>
            <Text size="sm" fw={500}>
              {item.title}
            </Text>
            <Text size="xs" c="dimmed">
              {item.type}
            </Text>
          </Stack>
        </Group>

        <Group>
          <Menu position="bottom-end" shadow="md">
            <Menu.Target>
              <ActionIcon variant="subtle">
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                color="yellow"
                leftSection={<IconPinned size={14} />}
                onClick={onPin}
              >
                {item.isPinned ? 'Unpin' : 'Pin'}
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={<IconTrash size={14} />}
                onClick={onDelete}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </Paper>
  )
}

// This is used for the drag overlay
const ItemPreview = ({ item }: { item: Item }) => {
  return (
    <Paper withBorder p="md" className="mb-2">
      <Group justify="space-between" align="center">
        <Group gap="sm">
          <ActionIcon variant="subtle" color="gray">
            <IconGripVertical size={16} />
          </ActionIcon>
          <Stack gap={4}>
            <Text size="sm" fw={500}>
              {item.title}
            </Text>
            <Text size="xs" c="dimmed">
              {item.type}
            </Text>
          </Stack>
        </Group>
      </Group>
    </Paper>
  )
}

function UnifiedManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<string | null>('pinned')
  const [trackerModalOpen, setTrackerModalOpen] = useState(false)
  const [isReordering, setIsReordering] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  // Mock data - replace with real data later
  const [items, setItems] = useState<Item[]>([
    { id: '1', type: 'tracker', title: 'Water Intake', isPinned: true },
    { id: '2', type: 'collection', title: 'Morning Routine', isPinned: true },
    { id: '3', type: 'tracker', title: 'Sleep Hours', isPinned: false },
    { id: '4', type: 'tracker', title: 'Mood', isPinned: false },
    { id: '5', type: 'collection', title: 'Evening Check-in', isPinned: false },
  ])

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    if (activeTab === 'pinned') return item.isPinned && matchesSearch
    if (activeTab === 'trackers')
      return item.type === 'tracker' && matchesSearch
    if (activeTab === 'collections')
      return item.type === 'collection' && matchesSearch
    return matchesSearch
  })

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over) return

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)

      const newItems = [...items]
      const [removed] = newItems.splice(oldIndex, 1)
      newItems.splice(newIndex, 0, removed)

      setItems(newItems)
    }
  }

  const activeItem = activeId
    ? items.find((item) => item.id === activeId)
    : null

  return (
    <Stack>
      <TextInput
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        leftSection={<IconSearch size={16} />}
      />

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List grow>
          <Tabs.Tab value="pinned">Pinned</Tabs.Tab>
          <Tabs.Tab value="trackers">Trackers</Tabs.Tab>
          <Tabs.Tab value="collections">Collections</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={activeTab || 'pinned'}>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          >
            <SortableContext
              items={filteredItems}
              strategy={verticalListSortingStrategy}
            >
              <Stack mt="md">
                {filteredItems.map((item) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    isReordering={isReordering}
                    onPin={() => {
                      const newItems = items.map((i) =>
                        i.id === item.id ? { ...i, isPinned: !i.isPinned } : i
                      )
                      setItems(newItems)
                    }}
                    onDelete={() => {
                      setItems(items.filter((i) => i.id !== item.id))
                    }}
                    onStart={() => {
                      console.log('Start tracking:', item.title)
                    }}
                  />
                ))}
              </Stack>
            </SortableContext>

            <DragOverlay>
              {activeItem ? <ItemPreview item={activeItem} /> : null}
            </DragOverlay>
          </DndContext>
        </Tabs.Panel>
      </Tabs>

      <FloatingActionButton
        isReordering={isReordering}
        onToggleReorder={() => setIsReordering(!isReordering)}
        onAdd={() => setTrackerModalOpen(true)}
      />

      <Modal
        opened={trackerModalOpen}
        onClose={() => setTrackerModalOpen(false)}
        title="Add New"
      >
        <Tabs defaultValue="tracker">
          <Tabs.List grow mb="md">
            <Tabs.Tab value="tracker">Tracker</Tabs.Tab>
            <Tabs.Tab value="collection">Collection</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="tracker">
            <AddTrackerForm onSubmit={() => setTrackerModalOpen(false)} />
          </Tabs.Panel>

          <Tabs.Panel value="collection">
            <AddCollectionForm onSubmit={() => setTrackerModalOpen(false)} />
          </Tabs.Panel>
        </Tabs>
      </Modal>
    </Stack>
  )
}

function FloatingActionButton({
  isReordering,
  onToggleReorder,
  onAdd,
}: {
  isReordering: boolean
  onToggleReorder: () => void
  onAdd: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const handleMainButtonClick = () => {
    if (isReordering) {
      onToggleReorder()
    } else {
      setIsExpanded(!isExpanded)
    }
  }
  return (
    <Box
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
      }}
    >
      <Transition
        mounted={isExpanded}
        transition="slide-up"
        duration={200}
        timingFunction="ease"
      >
        {(styles) => (
          <Stack
            gap={8}
            style={{
              ...styles,
              position: 'absolute',
              bottom: '60px',
              right: '0px',
            }}
          >
            <ActionIcon
              variant="filled"
              size="xl"
              radius="xl"
              onClick={() => {
                onToggleReorder()
                setIsExpanded(false)
              }}
              className="shadow-lg"
            >
              <IconArrowsUpDown size={24} />
            </ActionIcon>
            <ActionIcon
              variant="filled"
              size="xl"
              radius="xl"
              onClick={() => {
                onAdd()
                setIsExpanded(false)
              }}
              className="shadow-lg"
            >
              <IconPlus size={24} />
            </ActionIcon>
          </Stack>
        )}
      </Transition>

      <ActionIcon
        variant="filled"
        size="xl"
        radius="xl"
        onClick={handleMainButtonClick}
        className="shadow-lg"
        style={{
          transform: isExpanded ? 'rotate(45deg)' : 'none',
          transition: 'transform 0.2s ease',
        }}
      >
        {isReordering ? <IconArrowsUpDown size={24} /> : <IconPlus size={24} />}
      </ActionIcon>
    </Box>
  )
}

export default UnifiedManagement
