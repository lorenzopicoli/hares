import React, { type ComponentPropsWithRef } from "react";
import { Controller, type ControllerProps, type FieldValues, type Path } from "react-hook-form";
import DateTimePicker from "react-native-ui-datepicker";

type FormDateTimePickerProps<T extends FieldValues, K extends Path<T>> = ComponentPropsWithRef<
  typeof DateTimePicker
> & {
  form: Omit<ControllerProps<T, K, T>, "render">;
};

export default function FormDateTimePicker<T extends FieldValues, K extends Path<T>>(
  props: FormDateTimePickerProps<T, K>,
) {
  const { form, ...inputProps } = props;

  return (
    <Controller
      {...form}
      render={({ field: { onChange, value } }) => {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        return <DateTimePicker {...inputProps} onChange={(d: any) => onChange(d.date)} date={value} />;
      }}
    />
  );
}
