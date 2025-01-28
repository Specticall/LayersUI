import {
  createContext,
  forwardRef,
  HTMLAttributes,
  MutableRefObject,
  PropsWithChildren,
  Ref,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/utils/lib";

type Props = {
  /**
   * Sends data about the open/close state of the component
   */
  onOpenChange?: (value: boolean) => void;

  /**
   * Allows parent component to control the open/close state of the component
   */
  open?: boolean;

  /**
   * Sets the gap between the trigger and content component
   */
  triggerContentGap?: number;
};

type PopoverContextValues = {
  isOpen: boolean;
  handleChangeOpen: () => void;
  triggerHeightPx: number;
  setTriggerHeightPx: React.Dispatch<React.SetStateAction<number>>;
  triggerContentGap: number;
};

const PopoverContext = createContext<PopoverContextValues | null>(null);

/**
 * 
 * @example 
* <Popover.Container>
    <Popover.Trigger>Select Item</Popover.Trigger>
    <Popover.Content>
      <p>Content 1</p>
      <p>Content 2</p>
      <p>Content 3</p>
      <p>Content 4</p>
      <p>Content 5</p>
    </Popover.Content>
</Popover.Container>
 */
function Container(
  {
    onOpenChange,
    open,
    triggerContentGap = 0,
    children,
    ...props
  }: PropsWithChildren<Props> & HTMLAttributes<HTMLDivElement>,
  ref: Ref<HTMLDivElement>
) {
  /**
   * Stores the trigger element height, used to automatically calculate the  distance between content and trigger.
   */
  const [triggerHeightPx, setTriggerHeightPx] = useState(0);

  /**
   * Stores the container / top-level element
   */
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  /**
   * Keeps track of the open state of the element
   */
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Handling dropdown opening / closing
   */
  const handleChangeOpen = useCallback(() => {
    setIsOpen((current) => !current);

    // Sends the is open state to the callback
    if (onOpenChange) onOpenChange(!isOpen);
  }, [isOpen, onOpenChange]);

  /**
   * Handles closing when the user clicks outside the dropdown element.
   */
  useEffect(() => {
    if (!dropdownRef.current) return;
    // Closes the dropdown element when the user clicks outiside the component
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && !dropdownRef.current?.contains(e.target as HTMLElement)) {
        setIsOpen((current) => !current);
        if (onOpenChange) onOpenChange(!isOpen);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, onOpenChange]);

  return (
    <PopoverContext.Provider
      // Uses the `open` prop when it is passed in. This will cause the component to ignore the `isOpen` state
      value={{
        isOpen: typeof open === "undefined" ? isOpen : open,
        handleChangeOpen,
        triggerHeightPx,
        setTriggerHeightPx,
        triggerContentGap,
      }}
    >
      <div
        ref={(elRef) => {
          // Passing internal dropdown ref used to click outside
          dropdownRef.current = elRef;

          // Passing forward ref
          if (ref && "current" in ref && elRef) {
            (ref as MutableRefObject<HTMLDivElement>).current = elRef;
          }
        }}
        {...props}
        className={cn("relative", props.className)}
      >
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

function Trigger(
  props: PropsWithChildren<HTMLAttributes<HTMLButtonElement>>,
  ref: Ref<HTMLButtonElement>
) {
  const context = useContext(PopoverContext);
  if (!context) return;

  return (
    <button
      {...props}
      ref={(elRef) => {
        // Get the trigger's height and send the to the provider component
        context.setTriggerHeightPx(elRef?.getBoundingClientRect().height || 0);

        // Passing forward ref
        if (ref && "current" in ref && elRef) {
          (ref as MutableRefObject<HTMLButtonElement>).current = elRef;
        }
      }}
      className={cn("cursor-pointer w-full text-start", props.className)}
      onClick={(e) => {
        // Preserve onClick events sent by parent component
        if (props.onClick) props.onClick(e);

        context.handleChangeOpen();
      }}
    >
      {props.children}
    </button>
  );
}

function Content(
  props: PropsWithChildren<HTMLAttributes<HTMLDivElement>>,
  ref: Ref<HTMLDivElement>
) {
  const context = useContext(PopoverContext);
  if (!context) return;

  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        "opacity-0 invisible scale-95 transition-[visibility,opacity,scale] duration-200 cursor-pointer z-20 absolute left-0 right-0",
        context.isOpen && "opacity-100 scale-100 visible ",
        props.className
      )}
      style={{
        top: `${context.triggerHeightPx + context.triggerContentGap}px`,
      }}
    >
      {props.children}
    </div>
  );
}

export default {
  Container: forwardRef(Container),
  Trigger: forwardRef(Trigger),
  Content: forwardRef(Content),
};
