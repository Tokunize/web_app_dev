import { Button } from "../ui/button";

interface Props {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  style?: React.CSSProperties;
  isHiddenLabel?: boolean; // New prop to hide the label
}

export const CustomButton = ({
  label,
  onClick,
  disabled = false,
  type = "button",
  className = "",
  iconLeft,
  iconRight,
  loading = false,
  style = {},
  isHiddenLabel = false, // Default is false, meaning label is visible
}: Props) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      className={`flex items-center gap-2 ${className}`}
      style={style}
    >
      {loading ? (
        <span className="loader" /> // Here you can add a spinner or similar
      ) : (
        <>
          {iconLeft && <span className="icon-left">{iconLeft}</span>}
          {!isHiddenLabel && <span>{label}</span>} {/* Conditionally render the label */}
          {iconRight && <span className="icon-right">{iconRight}</span>}
        </>
      )}
    </Button>
  );
};