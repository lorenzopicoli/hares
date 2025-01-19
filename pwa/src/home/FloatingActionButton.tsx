import { Box, ActionIcon } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

export function FloatingActionButton({
  onClick,
}: {
  onClick: () => void;
}) {
  const handleMainButtonClick = () => {
    onClick();
  };
  const gradient = { from: "var(--mantine-color-violet-9)", to: "var(--mantine-color-violet-6)", deg: 70 };
  return (
    <Box
      pos={"fixed"}
      bottom={"20px"}
      right={"20px"}
      style={{
        zIndex: 1000,
      }}
    >
      <ActionIcon variant="gradient" gradient={gradient} size="xl" radius="xl" onClick={handleMainButtonClick}>
        <IconPlus size={24} />
      </ActionIcon>
    </Box>
  );
}
