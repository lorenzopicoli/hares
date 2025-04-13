import { Sizes } from "@/constants/Sizes";
import useStyles from "@/hooks/useStyles";
import { StyleSheet, Modal, Pressable, View } from "react-native";
import ThemedButton from "./ThemedButton";
import { ThemedView } from "./ThemedView";
import type { ThemedColors } from "./ThemeProvider";
import type { PropsWithChildren } from "react";

interface Props {
  visible: boolean;
  hideDismiss?: boolean;
  hideConfirm?: boolean;
  confirmText?: string;
  dismissText?: string;
  fullWidthButton?: boolean;
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
  } = props;
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onDismiss}>
      <Pressable onPress={onDismiss} style={styles.backdrop} />
      <ThemedView style={styles.modalView}>
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
      marginBottom: "50%",
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
    backdrop: {
      position: "absolute",
      left: 0,
      top: 0,
      height: "100%",
      width: "100%",
      backgroundColor: "black",
      opacity: 0.5,
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
