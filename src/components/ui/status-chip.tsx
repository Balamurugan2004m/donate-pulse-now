import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusChipVariants = cva(
  "inline-flex items-center justify-center rounded-full text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        pending: "bg-warning-light text-warning-foreground",
        fulfilled: "bg-success-light text-success-foreground",
        urgent: "bg-primary-light text-primary-dark",
        canceled: "bg-muted text-muted-foreground",
        active: "bg-primary text-primary-foreground",
        available: "bg-success text-success-foreground",
        unavailable: "bg-muted text-muted-foreground",
      },
      size: {
        sm: "h-5 px-2 text-xs",
        md: "h-6 px-3 text-sm",
        lg: "h-8 px-4 text-sm",
      },
    },
    defaultVariants: {
      variant: "pending",
      size: "sm",
    },
  }
);

export interface StatusChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusChipVariants> {}

const StatusChip = ({ className, variant, size, ...props }: StatusChipProps) => {
  return (
    <div
      className={cn(statusChipVariants({ variant, size, className }))}
      {...props}
    />
  );
};

export { StatusChip, statusChipVariants };