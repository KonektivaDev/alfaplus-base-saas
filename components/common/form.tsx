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
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Switch } from "../ui/switch";

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

export const FormSelect: FormControlFunc<{ children: ReactNode }> = ({
  children,
  ...props
}) => {
  return (
    <FormBase {...props}>
      {({ onChange, onBlur, ...field }) => (
        <Select {...field} onValueChange={onChange}>
          <SelectTrigger
            aria-invalid={field["aria-invalid"]}
            id={field.id}
            onBlur={onBlur}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>{children}</SelectContent>
        </Select>
      )}
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
