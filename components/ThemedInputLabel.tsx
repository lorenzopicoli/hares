import React from "react";
import { Text, StyleSheet } from "react-native";
import type { ThemedColors } from "./ThemeProvider";
import useStyles from "@/hooks/useStyles";

interface ThemedInputLabelProps {
  label?: string;
}

const ThemedInputLabel: React.FC<ThemedInputLabelProps> = ({ label }) => {
  const { styles } = useStyles(createStyles);
  return <Text style={styles.label}>{label}</Text>;
};

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    label: {
      color: theme.secondaryText,
      fontSize: 14,
      marginBottom: 8,
      fontWeight: "500",
    },
  });

export default ThemedInputLabel;
