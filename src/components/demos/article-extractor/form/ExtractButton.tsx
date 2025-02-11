
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface ExtractButtonProps {
  isExtracting: boolean;
  disabled: boolean;
  onClick?: () => void;
  type?: "submit" | "button";
  variant?: "default" | "secondary";
  className?: string;
  children: React.ReactNode;
}

export const ExtractButton = ({
  isExtracting,
  disabled,
  onClick,
  type = "submit",
  variant = "default",
  className = "",
  children
}: ExtractButtonProps) => {
  return (
    <Button 
      type={type}
      onClick={onClick}
      className={className}
      disabled={disabled}
      variant={variant}
    >
      {isExtracting ? (
        <>
          <Loader className="w-4 h-4 mr-2 animate-spin" />
          Extracting...
        </>
      ) : children}
    </Button>
  );
};
