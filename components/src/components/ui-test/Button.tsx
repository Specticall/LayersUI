import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/lib";
import { forwardRef, Ref } from "react";
import { LoadingSpinner } from "@/components/ui-test/LoadingSpinner";

const buttonVariants = cva(
  "flex items-center justify-center whitespace-nowrap rounded-sm text-sm transition-colors disabled:pointer-events-none px-6 py-3 cursor-pointer transition disabled:bg-slate-500 leading-[100%] items-center",
  {
    variants: {
      variant: {
        primary: "bg-black text-white hover:bg-slate-900",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
    to?: string;
  };

function Button(
  { className, variant, isLoading, children, ...props }: ButtonProps,
  ref: Ref<HTMLButtonElement>
) {
  return (
    <button
      className={cn(buttonVariants({ variant }), className)}
      ref={ref}
      disabled={props.disabled || isLoading}
      onClick={(e) => {
        if (props.onClick) props.onClick(e);
      }}
      {...props}
    >
      {children}
      {isLoading && <LoadingSpinner className="stroke-white ml-2" />}
    </button>
  );
}

Button.displayName = "Button";

export default forwardRef(Button);
