import { Sizes } from "@/constants/Sizes";
import useStyles from "@/hooks/useStyles";
import { StyleSheet, Modal, Pressable, View } from "react-native";
import ThemedButton from "./ThemedButton";
import { ThemedView } from "./ThemedView";
import type { ThemedColors } from "@/contexts/ThemeContext";
import type { PropsWithChildren } from "react";

interface Props {
  visible: boolean;
  hideDismiss?: boolean;
  hideConfirm?: boolean;
  confirmText?: string;
  dismissText?: string;
  fullWidthButton?: boolean;
  size?: "large" | "small";
  onDismiss?: () => void;
  onConfirm?: () => void;
}

export default function ThemedModal(props: PropsWithChildren<Props>) {
  const { styles } = useStyles(createStyles);
  const {
    visible,
    hideDismiss,
    hideConfirm,
    confirmText,
    dismissText,
    onDismiss,
    onConfirm,
    fullWidthButton,
    children,
    size = "large",
  } = props;
  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onDismiss}>
      <Pressable onPress={onDismiss} style={styles.backdrop} />
      <ThemedView style={[styles.modalView, size === "small" && styles.small, size === "large" && styles.large]}>
        {children}
        <View style={styles.buttonsContainer}>
          {hideDismiss ? null : (
            <ThemedButton
              style={[!fullWidthButton && styles.buttonWidth]}
              fullWidth={fullWidthButton}
              title={dismissText ?? "Cancel"}
              onPress={onDismiss}
              mode="ghost"
            />
          )}
          {hideConfirm ? null : (
            <ThemedButton
              style={[!fullWidthButton && styles.buttonWidth]}
              fullWidth={fullWidthButton}
              title={confirmText ?? "Done"}
              onPress={onConfirm}
            />
          )}
        </View>
      </ThemedView>
    </Modal>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    modalView: {
      marginTop: "50%",
      marginHorizontal: "10%",
      padding: Sizes.medium,
      borderRadius: Sizes.radius.medium,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    large: {
      maxHeight: 400,
    },
    small: {
      maxHeight: 250,
    },
    backdrop: {
      position: "absolute",
      left: 0,
      top: 0,
      height: "100%",
      width: "100%",
      backgroundColor: "black",
      opacity: 0.8,
    },
    buttonsContainer: {
      width: "100%",
      gap: Sizes.small,
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    buttonWidth: {
      width: 90,
    },
  });
