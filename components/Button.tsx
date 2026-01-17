import React from "react";

type ButtonVariant = "primary" | "success" | "warning" | "danger";
type ButtonSize = "lg" | "md" | "s" | "xs";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

const base =
  "inline-flex items-center justify-center rounded-md font-medium select-none " +
  "transition-colors duration-150 " +
  "disabled:opacity-50 disabled:cursor-not-allowed " +
  "focus:outline-none focus:ring-0";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
  success:
    "bg-green-600 text-white hover:bg-green-700 active:bg-green-800",
  warning:
    "bg-yellow-400 text-black hover:bg-yellow-500 active:bg-yellow-600",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
};

const sizes: Record<ButtonSize, string> = {
  lg: "h-12 px-5 text-base",
  md: "h-10 px-4 text-sm",
  s: "h-9 px-3 text-sm",
  xs: "h-8 px-2 text-xs",
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        base,
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "w-auto",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
