import {
  Button,
  TextInput,
  Select,
  Group,
  Paper,
  Stack,
  Combobox,
  Pill,
  PillsInput,
  useCombobox,
  CheckIcon,
  SegmentedControl,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { IconCalendar, IconClock } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import type { Entry, TimeOfDay, TrackerDoc } from "../database/models";

function AddEntryForm({
  tracker,
  onEntryAdded,
}: {
  tracker: TrackerDoc;
  onEntryAdded: (entry: Entry) => void;
}) {
  const [value, setValue] = useState<Entry["value"] | null>(null);
  const [timeType, setTimeType] = useState<"general" | "exact">("general");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [generalTime, setGeneralTime] = useState<TimeOfDay>("all_day");

  // For creatable multi-select
  const [search, setSearch] = useState("");
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  // Load previously used options from localStorage
  const storageKey = `tracker-${tracker._id}-options`;
  const [options, setOptions] = useState<string[]>(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : tracker.options || [];
  });

  // For multi-select values
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  // Save options to localStorage when they change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(options));
  }, [options, storageKey]);

  const handleValueSelect = (val: string) => {
    setSearch("");

    if (val === "$create") {
      const newValue = search.trim();
      if (!options.includes(newValue)) {
        setOptions((current) => [...current, newValue]);
      }
      setSelectedValues((current) => [...current, newValue]);
      setValue([...selectedValues, newValue]);
    } else {
      const newValues = selectedValues.includes(val)
        ? selectedValues.filter((v) => v !== val)
        : [...selectedValues, val];
      setSelectedValues(newValues);
      setValue(newValues);
    }
  };

  const handleValueRemove = (val: string) => {
    const newValues = selectedValues.filter((v) => v !== val);
    setSelectedValues(newValues);
    setValue(newValues);
  };

  const handleSubmit = () => {
    if (value !== null) {
      const now = new Date();
      const baseDate = selectedDate || now;

      // Set time if exact time tracking is selected
      if (timeType === "exact" && selectedTime) {
        const [hours, minutes] = selectedTime.split(":").map(Number);
        baseDate.setHours(hours || 0);
        baseDate.setMinutes(minutes || 0);
      }

      const entry: Entry = {
        type: "trackerEntry",
        trackerId: tracker._id,
        value,
        trackerType: tracker.trackerType,
        date: baseDate,
        ...(timeType === "general" && { generalTime }),
        ...(timeType === "exact" && { exactTime: selectedTime }),
        // ...(tracker.trackerType === "food" && mealType && { mealType: mealType as MealType }),
      };

      onEntryAdded(entry);
      // Reset form
      setValue(null);
      setSelectedValues([]);
      setSelectedTime("");
      setGeneralTime("all_day");
      setSelectedDate(null);
      //   setMealType("");
    }
  };

  const renderMultiSelect = () => {
    const values = selectedValues.map((item) => (
      <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
        {item}
      </Pill>
    ));

    const comboboxOptions = options
      .filter((item) => item.toLowerCase().includes(search.trim().toLowerCase()))
      .map((item) => (
        <Combobox.Option value={item} key={item} active={selectedValues.includes(item)}>
          <Group gap="sm">
            {selectedValues.includes(item) ? <CheckIcon size={12} /> : null}
            <span>{item}</span>
          </Group>
        </Combobox.Option>
      ));

    const exactOptionMatch = options.some((item) => item.toLowerCase() === search.trim().toLowerCase());

    return (
      <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false}>
        <Combobox.DropdownTarget>
          <PillsInput onClick={() => combobox.openDropdown()}>
            <Pill.Group>
              {values}
              <Combobox.EventsTarget>
                <PillsInput.Field
                  onFocus={() => combobox.openDropdown()}
                  onBlur={() => combobox.closeDropdown()}
                  value={search}
                  placeholder={"Search options"}
                  onChange={(event) => {
                    combobox.updateSelectedOptionIndex();
                    setSearch(event.currentTarget.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Backspace" && search.length === 0) {
                      event.preventDefault();
                      handleValueRemove(selectedValues[selectedValues.length - 1]);
                    }
                  }}
                />
              </Combobox.EventsTarget>
            </Pill.Group>
          </PillsInput>
        </Combobox.DropdownTarget>

        <Combobox.Dropdown>
          <Combobox.Options>
            {comboboxOptions}

            {!exactOptionMatch && search.trim().length > 0 && (
              <Combobox.Option value="$create">+ Create {search.trim()}</Combobox.Option>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    );
  };

  const renderInput = () => {
    switch (tracker.trackerType) {
      case "number":
        return (
          <TextInput
            type="number"
            value={value?.toString() || ""}
            onChange={(e) => setValue(Number(e.target.value))}
            placeholder="Enter a number"
          />
        );
      case "scale":
        return (
          <Select
            value={value?.toString()}
            onChange={(val) => setValue(Number(val))}
            data={[
              { value: "0", label: "0" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "4", label: "4" },
              { value: "5", label: "5" },
              { value: "6", label: "6" },
              { value: "7", label: "7" },
              { value: "8", label: "8" },
              { value: "9", label: "9" },
              { value: "10", label: "10" },
            ]}
          />
        );
      case "boolean":
        return (
          <Group>
            <Button variant={value === true ? "filled" : "outline"} onClick={() => setValue(true)}>
              Yes
            </Button>
            <Button variant={value === false ? "filled" : "outline"} onClick={() => setValue(false)}>
              No
            </Button>
          </Group>
        );
      case "text_list":
        return renderMultiSelect();
      default:
        return null;
    }
  };

  const renderTimeInput = () => {
    return (
      <Stack gap="xs">
        <SegmentedControl
          fullWidth
          data={[
            { value: "general", label: "Time of Day" },
            { value: "exact", label: "Specific Time" },
          ]}
          value={timeType}
          onChange={(value) => setTimeType(value as "general" | "exact")}
        />

        <Stack>
          {timeType === "exact" ? (
            <TimeInput
              label="Time"
              value={selectedTime}
              onChange={(event) => setSelectedTime(event.currentTarget.value)}
              leftSection={<IconClock size={16} />}
            />
          ) : (
            <Select
              label="When did this happen?"
              value={generalTime}
              onChange={(v) => setGeneralTime((v ?? "anytime") as TimeOfDay)}
              data={[
                { value: "anytime", label: "Anytime" },
                { value: "morning", label: "Morning ☀️" },
                { value: "afternoon", label: "Afternoon 🌤️" },
                { value: "night", label: "Night 🌙" },
              ]}
            />
          )}

          <DatePickerInput
            label="Date"
            placeholder="Today"
            value={selectedDate}
            onChange={setSelectedDate}
            leftSection={<IconCalendar size={16} />}
            clearable
            maxDate={new Date()}
          />
        </Stack>
      </Stack>
    );
  };

  const isSubmitDisabled = () => {
    if (value === null || value === undefined) return true;
    return false;
  };

  return (
    <Paper p="md">
      <Stack>
        {renderInput()}
        {renderTimeInput()}
        <Button onClick={handleSubmit} disabled={isSubmitDisabled()}>
          Entry
        </Button>
      </Stack>
    </Paper>
  );
}

export default AddEntryForm;
