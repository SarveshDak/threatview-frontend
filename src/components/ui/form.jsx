import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { FormProvider, useFormContext, Controller } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const Form = FormProvider;

/* -----------------------------------------------------
   Form Field Context
------------------------------------------------------ */

const FormFieldContext = React.createContext({});

const FormField = ({ name, children }) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      {children}
    </FormFieldContext.Provider>
  );
};

/* -----------------------------------------------------
   Form Item Context + Hook
------------------------------------------------------ */

const FormItemContext = React.createContext({});

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext || !itemContext) {
    throw new Error("useFormField must be used inside FormField + FormItem.");
  }

  const fieldState = getFieldState(fieldContext.name, formState);

  const id = itemContext.id;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

/* -----------------------------------------------------
   Components
------------------------------------------------------ */

const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-invalid={!!error}
      aria-describedby={
        error
          ? `${formDescriptionId} ${formMessageId}`
          : formDescriptionId
      }
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const message = error ? String(error.message) : null;

    if (!message) return null;

    return (
      <p
        ref={ref}
        id={formMessageId}
        className={cn("text-sm font-medium text-destructive", className)}
        {...props}
      >
        {message}
      </p>
    );
  }
);
FormMessage.displayName = "FormMessage";

/* -----------------------------------------------------
   Export
------------------------------------------------------ */

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
