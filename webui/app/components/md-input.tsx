import clsx from "clsx";
import { HTMLInputTypeAttribute, useState } from "react";

interface MDInputProps {
  className?: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  isUnValid?: boolean;
}

export default function MDInput({
  className,
  value,
  onValueChange,
  placeholder,
  type,
  isUnValid,
}: MDInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (!value) {
      setIsFocused(false);
    }
  };

  return (
    <div className="relative">
      <input
        className={clsx(
          "p-4 bg-surface-container outline-none border-2 focus:border-4 rounded-2xl transition-all ease-in duration-150 w-full",
          isUnValid
            ? "border-error focus:border-error"
            : "border-secondary focus:border-primary",
          className
        )}
        value={value || ''}
        placeholder=""
        onChange={(e) => onValueChange(e.target.value)}
        type={type}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />

      {placeholder && (
        <label
          className={clsx(
            "absolute px-2 pointer-events-none",
            "transition-all ease-in-out duration-200",
            isFocused || value
              ? "left-4 top-0 transform -translate-y-1/2 text-sm bg-surface-container"
              : "left-4 top-1/2 transform -translate-y-1/2 text-base",
            isUnValid
              ? "text-error"
              : isFocused
              ? "text-primary"
              : "text-secondary opacity-70"
          )}
        >
          {placeholder}
        </label>
      )}
    </div>
  );
}
