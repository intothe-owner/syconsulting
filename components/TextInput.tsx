"use client";

import React from "react";

type CommonProps = {
  label: string;
  bg?: string;
  fullWidth?: boolean;
  containerClassName?: string;
  className?: string;
  labelClassName?: string;
  showRequiredMark?: boolean;
};

type InputVariantProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "placeholder"
> & {
  as?: "input";
};

type TextareaVariantProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "placeholder"
> & {
  as: "textarea";
};

type TextFieldProps = CommonProps & (InputVariantProps | TextareaVariantProps);

export const TextField = ({
  as = "input",
  label,
  bg = "#EFF6FF",
  fullWidth = true,
  containerClassName = "",
  className = "",
  labelClassName = "",
  showRequiredMark = true,
  id,
  required,
  ...props
}: TextFieldProps) => {
  const isTextarea = as === "textarea";
  const Field = isTextarea ? "textarea" : "input";

  const fieldBase = [
    "peer w-full rounded-md border border-black/20",
    "px-3 text-sm",
    "bg-[var(--field-bg)]",
    "outline-none focus:outline-none focus:ring-0 focus:border-blue-600",
  ];

  const inputOnly = [
    "pt-5 pb-2",
    "placeholder-shown:pt-4 placeholder-shown:pb-4",
    "autofill:pt-5 autofill:pb-2",
    "[&:-webkit-autofill]:shadow-[0_0_0_1000px_var(--field-bg)_inset]",
    "[&:-webkit-autofill]:[-webkit-text-fill-color:inherit]",
  ];

  const textareaOnly = [
    "pt-5 pb-2",
    "min-h-[120px]",
    "resize-y", // 필요하면 resize-none으로 변경
  ];

  const labelPlaceholderPos = isTextarea
    ? "peer-placeholder-shown:top-4 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm"
    : "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm";

  return (
    <div
      className={[
        "relative",
        fullWidth ? "w-full" : "inline-block",
        containerClassName,
      ].join(" ")}
      style={{ ["--field-bg" as any]: bg }}
    >
      <Field
        id={id}
        required={required}
        placeholder=" "
        className={[
          ...fieldBase,
          ...(isTextarea ? textareaOnly : inputOnly),
          className,
        ].join(" ")}
        {...(props as any)}
      />

      <label
        htmlFor={id}
        className={[
          "pointer-events-none absolute left-3",
          "top-2 translate-y-0 text-xs text-black/60",
          "bg-[var(--field-bg)] px-1",
          "transition-all duration-200",
          labelPlaceholderPos,
          "peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-600",
          "peer-[:autofill]:top-2 peer-[:autofill]:translate-y-0 peer-[:autofill]:text-xs",
          labelClassName,
        ].join(" ")}
      >
        {label}
        {required && showRequiredMark ? (
          <span className="ml-0.5 text-red-500">*</span>
        ) : null}
      </label>
    </div>
  );
};

export default TextField;
