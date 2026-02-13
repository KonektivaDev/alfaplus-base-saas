import { ReactNode } from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { PasswordInput } from "../ui/password-input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Switch } from "../ui/switch";
import { XIcon } from "lucide-react";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "../ui/combobox";

type FormControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = {
  name: TName;
  label: ReactNode;
  description?: ReactNode;
  control: ControllerProps<TFieldValues, TName, TTransformedValues>["control"];
};

type FormBaseProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = FormControlProps<TFieldValues, TName, TTransformedValues> & {
  horizontal?: boolean;
  controlFirst?: boolean;
  controlEnd?: boolean;
  children: (
    field: Parameters<
      ControllerProps<TFieldValues, TName, TTransformedValues>["render"]
    >[0]["field"] & {
      "aria-invalid": boolean;
      id: string;
    },
  ) => ReactNode;
};

type FormControlFunc<
  ExtraProps extends Record<string, unknown> = Record<never, never>,
> = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>(
  props: FormControlProps<TFieldValues, TName, TTransformedValues> & ExtraProps,
) => ReactNode;

function FormBase<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  children,
  control,
  label,
  name,
  description,
  controlFirst,
  controlEnd,
  horizontal,
}: FormBaseProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const labelElement = (
          <>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          </>
        );
        const control = children({
          ...field,
          id: field.name,
          "aria-invalid": fieldState.invalid,
        });
        const errorElem = fieldState.invalid && (
          <FieldError errors={[fieldState.error]} />
        );
        const descriptionElem = description && !fieldState.invalid && (
          <FieldDescription>{description}</FieldDescription>
        );

        return (
          <Field
            data-invalid={fieldState.invalid}
            orientation={horizontal ? "horizontal" : undefined}
          >
            {controlFirst ? (
              <>
                {control}
                <FieldContent>
                  {labelElement}
                  {descriptionElem}
                  {errorElem}
                </FieldContent>
              </>
            ) : controlEnd ? (
              <>
                <FieldContent>
                  {labelElement}

                  {descriptionElem}
                  {errorElem}
                </FieldContent>
                {control}
              </>
            ) : (
              <>
                <FieldContent>{labelElement}</FieldContent>
                {control}
                {descriptionElem}
                {errorElem}
              </>
            )}
          </Field>
        );
      }}
    />
  );
}

export const FormInput: FormControlFunc<
  Omit<React.ComponentProps<"input">, "name" | "id" | "aria-invalid">
> = (props) => {
  const { name, label, description, control, ...inputProps } = props;
  return (
    <FormBase
      name={name}
      label={label}
      description={description}
      control={control}
    >
      {(field) => (
        <Input {...field} {...inputProps} value={field.value ?? ""} />
      )}
    </FormBase>
  );
};

export const FormPasswordInput: FormControlFunc<
  Omit<
    React.ComponentProps<typeof PasswordInput>,
    "name" | "id" | "aria-invalid"
  >
> = (props) => {
  const { name, label, description, control, ...inputProps } = props;
  return (
    <FormBase
      name={name}
      label={label}
      description={description}
      control={control}
    >
      {(field) => (
        <PasswordInput {...field} {...inputProps} value={field.value ?? ""} />
      )}
    </FormBase>
  );
};

export const FormTextarea: FormControlFunc<
  Omit<React.ComponentProps<"textarea">, "name" | "id" | "aria-invalid">
> = (props) => {
  const { name, label, description, control, ...textareaProps } = props;
  return (
    <FormBase
      name={name}
      label={label}
      description={description}
      control={control}
    >
      {(field) => (
        <Textarea {...field} {...textareaProps} value={field.value ?? ""} />
      )}
    </FormBase>
  );
};

export type FormSelectOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

const CLEAR_SELECT_VALUE = "__clear__";

export const FormSelect: FormControlFunc<
  Omit<
    React.ComponentProps<typeof SelectTrigger>,
    "id" | "aria-invalid" | "onBlur" | "children"
  > & {
    options: FormSelectOption[];
    placeholder?: ReactNode;
    canClear?: boolean;
    renderOption?: (option: FormSelectOption) => ReactNode;
    renderValue?: (
      option: FormSelectOption | undefined,
      value: string | undefined,
    ) => ReactNode;
  }
> = ({
  options,
  placeholder,
  canClear,
  renderOption,
  renderValue,
  ...props
}) => {
  return (
    <FormBase {...props}>
      {({ onChange, onBlur, value, ...field }) => {
        const rawValue = value ?? null;
        const selectedValue = typeof rawValue === "string" ? rawValue : "";
        const hasSelection = rawValue !== null && rawValue !== "";

        const selectedOption = options.find(
          (option) => option.value === selectedValue,
        );

        return (
          <Select
            {...field}
            value={selectedValue}
            onValueChange={(nextValue) => {
              if (canClear && nextValue === CLEAR_SELECT_VALUE) {
                onChange(null);
                return;
              }
              onChange(nextValue);
            }}
          >
            <SelectTrigger
              aria-invalid={field["aria-invalid"]}
              id={field.id}
              onBlur={onBlur}
              {...props}
            >
              <SelectValue placeholder={placeholder}>
                {renderValue
                  ? renderValue(selectedOption, selectedValue || undefined)
                  : selectedOption?.label}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              {canClear && hasSelection && (
                <SelectItem
                  value={CLEAR_SELECT_VALUE}
                  className="text-destructive"
                >
                  <div className="flex items-center gap-2">
                    <XIcon className="size-3.5" />
                    <span className="text-sm">Clear</span>
                  </div>
                </SelectItem>
              )}

              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {renderOption ? renderOption(option) : option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }}
    </FormBase>
  );
};

export const FormCheckbox: FormControlFunc = (props) => {
  return (
    <FormBase {...props} horizontal controlFirst>
      {({ onChange, value, ...field }) => (
        <Checkbox {...field} checked={value} onCheckedChange={onChange} />
      )}
    </FormBase>
  );
};

export const FormSwitch: FormControlFunc<
  Omit<React.ComponentProps<typeof Switch>, "name" | "id" | "aria-invalid">
> = (props) => {
  const { name, label, description, control, ...checkboxProps } = props;
  return (
    <FormBase
      name={name}
      label={label}
      description={description}
      control={control}
      horizontal
      controlEnd
    >
      {(field) => (
        <Switch
          {...field}
          {...checkboxProps}
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      )}
    </FormBase>
  );
};

export type FormComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export const FormCombobox: FormControlFunc<
  Omit<
    React.ComponentProps<typeof ComboboxInput>,
    "id" | "aria-invalid" | "onBlur"
  > & {
    options: FormComboboxOption[];
    emptyText?: ReactNode;
    canClear?: boolean;
    renderOption?: (option: FormComboboxOption) => ReactNode;
  }
> = ({
  name,
  label,
  description,
  control,
  options,
  emptyText = "No items found.",
  canClear = false,
  renderOption,
  disabled,
  ...inputProps
}) => {
  return (
    <FormBase
      name={name}
      label={label}
      description={description}
      control={control}
    >
      {({ onChange, onBlur, value, ...field }) => {
        const selectedValue = typeof value === "string" ? value : null;
        const selectedOption =
          options.find((option) => option.value === selectedValue) ?? null;

        return (
          <Combobox
            items={options}
            value={selectedOption}
            onValueChange={(nextOption) => {
              onChange(nextOption?.value ?? null);
            }}
            itemToStringLabel={(item) => item.label}
            itemToStringValue={(item) => item.value}
          >
            <ComboboxInput
              {...inputProps}
              id={field.id}
              aria-invalid={field["aria-invalid"]}
              onBlur={onBlur}
              disabled={disabled}
              showClear={canClear && !disabled && selectedOption !== null}
            />

            <ComboboxContent>
              <ComboboxEmpty>{emptyText}</ComboboxEmpty>
              <ComboboxList>
                {(option) => (
                  <ComboboxItem
                    key={option.value}
                    value={option}
                    disabled={option.disabled}
                  >
                    {renderOption ? renderOption(option) : option.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        );
      }}
    </FormBase>
  );
};

export type FormComboboxMultiOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export const FormComboboxMulti: FormControlFunc<
  Omit<
    React.ComponentProps<typeof ComboboxChipsInput>,
    "id" | "aria-invalid" | "onBlur"
  > & {
    options: FormComboboxMultiOption[];
    emptyText?: ReactNode;
    renderOption?: (option: FormComboboxMultiOption) => ReactNode;
    renderChip?: (option: FormComboboxMultiOption) => ReactNode;
    comboboxProps?: Omit<
      React.ComponentProps<typeof Combobox<FormComboboxMultiOption, true>>,
      "items" | "multiple" | "value" | "onValueChange" | "children"
    >;
  }
> = ({
  name,
  label,
  description,
  control,
  options,
  emptyText = "No items found.",
  renderOption,
  renderChip,
  comboboxProps,
  ...chipsInputProps
}) => {
  return (
    <FormBase
      name={name}
      label={label}
      description={description}
      control={control}
    >
      {({ onChange, onBlur, value, ...field }) => {
        const selectedValues = Array.isArray(value)
          ? value.filter((v: string) => typeof v === "string")
          : [];

        const selectedOptions = options.filter((option) =>
          selectedValues.includes(option.value),
        );

        return (
          <Combobox
            items={options}
            multiple
            value={selectedOptions}
            onValueChange={(nextOptions) => {
              onChange(nextOptions.map((option) => option.value));
            }}
            isItemEqualToValue={(item, selected) =>
              item.value === selected.value
            }
            itemToStringLabel={(item) => item.label}
            itemToStringValue={(item) => item.value}
            {...comboboxProps}
          >
            <ComboboxChips aria-invalid={field["aria-invalid"]}>
              <ComboboxValue>
                {selectedOptions.map((option) => (
                  <ComboboxChip key={option.value}>
                    {renderChip ? renderChip(option) : option.label}
                  </ComboboxChip>
                ))}
              </ComboboxValue>

              <ComboboxChipsInput
                {...chipsInputProps}
                id={field.id}
                onBlur={onBlur}
              />
            </ComboboxChips>

            <ComboboxContent>
              <ComboboxEmpty>{emptyText}</ComboboxEmpty>
              <ComboboxList>
                {(option) => (
                  <ComboboxItem
                    key={option.value}
                    value={option}
                    disabled={option.disabled}
                  >
                    {renderOption ? renderOption(option) : option.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        );
      }}
    </FormBase>
  );
};
