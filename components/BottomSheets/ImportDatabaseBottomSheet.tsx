import { StyleSheet } from "react-native";
import { YStack } from "../Stacks";
import { useColors, type ThemedColors } from "@/contexts/ThemeContext";
import useStyles from "@/hooks/useStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Sizes } from "@/constants/Sizes";
import { ThemedView } from "../ThemedView";
import BottomSheetListItem from "../BottomSheetListItem";
import { Separator } from "../Separator";
import { useRestoreDatabase } from "@/hooks/useRestoreDatabase";

export const IMPORT_DATABASE_BOTTOM_SHEET_HEIGHT = 150;

export default function ImportDatabaseBottomSheet() {
  const { styles } = useStyles(createStyles);
  const { restoreDatabaseSQLite, restoreDatabaseJSON } = useRestoreDatabase();
  const { colors } = useColors();

  return (
    <ThemedView>
      <YStack style={styles.container}>
        <BottomSheetListItem
          title="Import JSON file"
          left={<MaterialCommunityIcons name="file-import" size={20} color={colors.text} />}
          onPress={restoreDatabaseJSON}
        />
        <Separator containerBackgroundColor="transparent" />
        <BottomSheetListItem
          title="Import SQLite file"
          left={<MaterialCommunityIcons name="database-import" size={20} color={colors.text} />}
          onPress={restoreDatabaseSQLite}
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
