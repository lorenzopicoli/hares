import { StyleSheet } from "react-native";
import { YStack } from "../Stacks";
import { useColors, type ThemedColors } from "@/contexts/ThemeContext";
import useStyles from "@/hooks/useStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Sizes } from "@/constants/Sizes";
import { ThemedView } from "../ThemedView";
import BottomSheetListItem from "../BottomSheetListItem";
import { useExportDatabase } from "@/hooks/useExportDatabase";
import { Separator } from "../Separator";

export const EXPORT_DATABASE_BOTTOM_SHEET_HEIGHT = 150;

export default function ExportDatabaseBottomSheet() {
  const { styles } = useStyles(createStyles);
  const { exportDatabaseJSON, exportDatabaseSQLite } = useExportDatabase();
  const { colors } = useColors();

  const handleExportSQL = async () => {
    await exportDatabaseSQLite("hares-backup");
  };

  return (
    <ThemedView>
      <YStack style={styles.container}>
        <BottomSheetListItem
          title="Export in JSON format"
          left={<MaterialCommunityIcons name="file-export" size={20} color={colors.text} />}
          onPress={exportDatabaseJSON}
        />
        <Separator containerBackgroundColor="transparent" />
        <BottomSheetListItem
          title="Export in SQLite format"
          left={<MaterialCommunityIcons name="database-export" size={20} color={colors.text} />}
          onPress={handleExportSQL}
        />
      </YStack>
    </ThemedView>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Sizes.large,
    },
  });
