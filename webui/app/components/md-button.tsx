import clsx from "clsx";
import { useMemo } from "react";

interface MDButtonProps {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "error";
}

export default function MDButton({
  className,
  onClick,
  variant,
  children,
}: MDButtonProps) {
  const buttonStyle = useMemo(() => {
    if (variant === "primary") {
      return "bg-primary";
    } else if (variant === "secondary") {
      return "bg-secondary";
    } else if (variant === "error") {
      return "bg-error";
    }
    return "bg-primary";
  }, [variant]);

  return (
    <button
      className={clsx(
        buttonStyle,
        " p-2 rounded-2xl text-on-primary font-semibold cursor-pointer active:scale-95 transition-all ease-in-out",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
