import { useCallback, type ReactNode } from "react";
import {
  StyleSheet,
  SectionList as RNSectionList,
  type SectionListProps as RNSectionListProps,
  type SectionListData,
  type SectionListRenderItem,
  View,
} from "react-native";
import { Separator } from "./Separator";
import { XStack } from "./Stacks";
import { useColors, type ThemedColors } from "@/contexts/ThemeContext";
import { Sizes } from "@/constants/Sizes";
import useStyles from "@/hooks/useStyles";

export interface ISection {
  data: IRow[];
  right?: JSX.Element;
  title?: JSX.Element;
}

export interface IRow {
  key: string | number;
  render: ReactNode;
}

interface SectionListProps extends RNSectionListProps<IRow, ISection> {
  sections: ISection[];
}

export default function SectionList(props: SectionListProps) {
  const { styles } = useStyles(createStyles);
  const { colors } = useColors();

  const renderItem: SectionListRenderItem<IRow, ISection> = useCallback(
    (props) => {
      const isFirstElement = props.index === 0;
      const isLastElement = props.index === props.section.data.length - 1;

      return (
        <View
          style={[styles.itemContainer, isFirstElement && styles.roundedTop, isLastElement && styles.roundedBottom]}
        >
          {props.item.render}
        </View>
      );
    },
    [styles],
  );

  const renderSectionHeader: (info: {
    section: SectionListData<IRow, ISection>;
  }) => React.ReactElement | null = ({ section: { title, right } }) => {
    return (
      <XStack style={styles.sectionHeader}>
        {title}
        {right}
      </XStack>
    );
  };

  return (
    <RNSectionList
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: Sizes.small }}
      bounces={false}
      onEndReachedThreshold={0.5}
      ItemSeparatorComponent={() => <Separator containerBackgroundColor={colors.secondaryBackground} />}
      {...props}
      keyExtractor={(it) => String(it.key)}
      style={[props.style, styles.list]}
      sections={props.sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
    />
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    list: {
      marginTop: -Sizes.xLarge, // cancels out the first section top margin
    },
    itemContainer: {
      backgroundColor: theme.secondaryBackground,
      overflow: "hidden",
      //   height: Sizes.list.medium,
    },
    roundedTop: {
      borderTopLeftRadius: Sizes.radius.medium,
      borderTopRightRadius: Sizes.radius.medium,
    },
    roundedBottom: {
      borderBottomLeftRadius: Sizes.radius.medium,
      borderBottomRightRadius: Sizes.radius.medium,
    },
    sectionHeader: {
      paddingLeft: Sizes.small,
      paddingBottom: Sizes.small,
      paddingTop: Sizes.xLarge,
    },
  });
