import ThemedScrollView from "@/components/ThemedScrollView";
import { StyleSheet, View } from "react-native";
import ThemedButton from "@/components/ThemedButton";
import { ThemedSafeAreaView, ThemedView } from "@/components/ThemedView";
import { Sizes } from "@/constants/Sizes";
import { TrackerType, type EntryDateInformation, type NewTrackerEntry, type PeriodOfDay } from "@/db/schema";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { useCallback, useEffect, useMemo } from "react";
import type { ThemedColors } from "@/components/ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { FormThemedToggleButtons } from "@/components/ThemedToggleButtons";
import { Spacing } from "@/components/Spacing";
import { FormEntryDateSelection } from "@/components/EntryDateSelection";
import EntriesListRow from "@/components/EntriesList/EntriesListRow";
import { FormEntryNumberInput } from "@/components/EntryInputs/EntryNumberInput";
import { FormEntrySliderInput } from "@/components/EntryInputs/EntrySliderInput";
import { ChipGroup } from "@/components/Chip";
import { useEntries } from "@/hooks/data/useEntries";
import { useTracker } from "@/hooks/data/useTracker";
import { useForm } from "react-hook-form";
import { useLazyEntry } from "@/hooks/data/useEntry";
import { useUpsertEntry } from "@/hooks/data/useUpsertEntry";
import { FormThemedInput } from "@/components/ThemedInput";
import { Separator } from "@/components/Separator";
import { YStack } from "@/components/Stacks";
import ActionableListItem from "@/components/ActionableListItem";
import SectionList from "@/components/SectionList";

interface FormInputs {
  dateInformation: EntryDateInformation;
  numberValue?: number;
  yesOrNo?: boolean;
  textList?: string[];
  comment?: string;
}

export default function AddEntryScreen() {
  const router = useRouter();
  const { styles } = useStyles(createStyles);
  const {
    trackerId: trackerIdParam,
    textListSelections: textListSelectionsParam,
    entryId: entryIdParam,
  } = useLocalSearchParams<{
    trackerId: string;
    entryId?: string;
    textListSelections?: string;
  }>();

  const entryId = useMemo(() => (entryIdParam ? +entryIdParam : undefined), [entryIdParam]);
  const trackerId = useMemo(() => +trackerIdParam, [trackerIdParam]);

  const { entries: lastEntries } = useEntries({ trackerId: trackerId, limit: 10 });
  const { tracker } = useTracker(trackerId);
  const { fetchEntry } = useLazyEntry();
  const { upsertEntry } = useUpsertEntry();

  const yesOrNoOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  const { control, setValue, watch, handleSubmit } = useForm<FormInputs>({
    defaultValues: async () => {
      if (!entryId) {
        return { dateInformation: { now: true } };
      }
      const entry = await fetchEntry(entryId);

      const defaultValues: FormInputs = {
        dateInformation: entry?.date
          ? { date: entry.date }
          : entry?.periodOfDay
            ? { periodOfDay: entry.periodOfDay as PeriodOfDay }
            : { now: true },
        numberValue: entry?.numberValue ?? undefined,
        yesOrNo: entry?.booleanValue ?? undefined,
        textList: entry?.textListValues?.map((v) => v.name),
        comment: entry?.comment ?? undefined,
      };

      return defaultValues;
    },
  });
  const textListValues = watch("textList");
  const chips = useMemo(() => textListValues?.map((t) => ({ label: t, id: t })) ?? [], [textListValues]);

  const handleGoToSelectItems = useCallback(() => {
    router.navigate({
      pathname: "./textListSelection",
      params: {
        trackerId: trackerId,
        entryId,
        preSelectedItems: JSON.stringify(textListValues),
      },
    });
  }, [router, trackerId, entryId, textListValues]);

  const onSubmit = async (data: FormInputs) => {
    const entry: NewTrackerEntry = {
      date:
        data.dateInformation &&
        ("date" in data.dateInformation
          ? data.dateInformation.date
          : "now" in data.dateInformation
            ? new Date()
            : null),
      periodOfDay:
        data.dateInformation && "periodOfDay" in data.dateInformation ? data.dateInformation.periodOfDay : null,
      trackerId: +trackerId,
      numberValue: data.numberValue,
      booleanValue: data.yesOrNo,
      comment: data.comment,
    };

    await upsertEntry({ data: entry, textListValues, existingId: entryId }).catch((e) => {
      console.log("Error on upsertEntry", e);
    });
    router.dismiss();
  };

  useEffect(() => {
    if (textListSelectionsParam) {
      setValue("textList", JSON.parse(textListSelectionsParam));
    }
  }, [textListSelectionsParam, setValue]);

  const renderEntryInput = () => {
    if (!tracker) return null;

    const { type: trackerType, prefix, suffix } = tracker;

    switch (trackerType) {
      case TrackerType.Number:
        return (
          <FormEntryNumberInput
            suffix={suffix}
            prefix={prefix}
            form={{
              control,
              name: "numberValue",
              rules: {
                required: {
                  message: "A value is required",
                  value: true,
                },
              },
            }}
          />
        );

      case TrackerType.Scale:
        return (
          <FormEntrySliderInput
            min={tracker.rangeMin ?? 0}
            max={tracker.rangeMax ?? 100}
            form={{
              control,
              name: "numberValue",
              rules: {
                required: {
                  message: "A value is required",
                  value: true,
                },
                validate: (value) =>
                  value === undefined
                    ? "A value is required"
                    : value < (tracker.rangeMin ?? 0)
                      ? "Value is too low"
                      : value > (tracker.rangeMax ?? 100)
                        ? "Value is too high"
                        : true,
              },
            }}
          />
        );

      case TrackerType.Boolean:
        return (
          <FormThemedToggleButtons
            label=""
            columns={2}
            form={{
              control,
              name: "yesOrNo",
            }}
            options={yesOrNoOptions}
          />
        );

      case TrackerType.TextList:
        return (
          <View style={styles.textListControls}>
            <SectionList
              sections={[
                {
                  data: [
                    {
                      key: "select-items",
                      render: <ActionableListItem title="Select items" onPress={handleGoToSelectItems} />,
                    },
                  ],
                },
              ]}
            />

            {chips.length > 0 ? <ChipGroup chips={chips} /> : null}
          </View>
        );

      default:
        return <ThemedText>Unsupported tracker type: {trackerType}</ThemedText>;
    }
  };

  return (
    <ThemedSafeAreaView>
      <ThemedScrollView>
        {tracker?.description ? (
          <ThemedText>
            <ThemedText style={styles.bold}>Description: </ThemedText>
            {tracker?.description}
          </ThemedText>
        ) : null}
        <ThemedView>{renderEntryInput()}</ThemedView>

        <Spacing size="xSmall" />
        <FormEntryDateSelection
          form={{
            control,
            name: "dateInformation",
          }}
        />
        <Spacing size="xSmall" />
        <FormThemedInput
          form={{
            control,
            name: "comment",
          }}
          label="Comments/Notes"
          autoCapitalize="sentences"
        />
        <Spacing size="small" />
        {lastEntries.length > 0 ? (
          <>
            <ThemedText type="title">Previous entries</ThemedText>
            {lastEntries.map((entry) => (
              <YStack key={entry.id}>
                <EntriesListRow entry={entry} />
                <Separator overrideHorizontalMargin={0} />
              </YStack>
            ))}
          </>
        ) : null}
      </ThemedScrollView>
      <View style={styles.submitButtonContainer}>
        <ThemedButton fullWidth title={entryId ? "Update entry" : "Log entry"} onPress={handleSubmit(onSubmit)} />
      </View>
    </ThemedSafeAreaView>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    bold: {
      fontWeight: 700,
    },
    textListControls: {
      gap: Sizes.medium,
    },
    submitButtonContainer: {
      paddingHorizontal: Sizes.medium,
      marginBottom: Sizes.medium,
    },
  });
