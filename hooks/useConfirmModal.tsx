import { Spacing } from "@/components/Spacing";
import ThemedModal from "@/components/ThemedModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState, useCallback } from "react";

type ConfirmOptions = {
  confirmText: string;
  dismissText: string;
  title: string;
  description: string;
};

export function useConfirmModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [promiseHandlers, setPromiseHandlers] = useState<{
    resolve: (result: boolean) => void;
  } | null>(null);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    setIsVisible(true);

    return new Promise<boolean>((resolve) => {
      setPromiseHandlers({ resolve });
    });
  }, []);

  const handleConfirm = () => {
    promiseHandlers?.resolve(true);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    promiseHandlers?.resolve(false);
    setIsVisible(false);
  };

  return {
    confirm,
    ConfirmModal: options ? (
      <ThemedModal
        visible={isVisible}
        onConfirm={handleConfirm}
        onDismiss={handleDismiss}
        confirmText={options.confirmText}
        dismissText={options.dismissText}
        size="small"
      >
        <ThemedView>
          <Spacing size="xSmall" />
          <ThemedText type="title">{options.title}</ThemedText>
          <Spacing size="xSmall" />
          <ThemedText>{options.description}</ThemedText>
        </ThemedView>
      </ThemedModal>
    ) : null,
  };
}
