import {
  ComponentProps,
  forwardRef,
  HTMLAttributes,
  Ref,
  useCallback,
  useState,
} from "react";
import { cn } from "@/utils/lib";
import Popover from "@/components/ui-test/Popover";
import Skeleton from "react-loading-skeleton";

type Props = {
  /**
   * Placeholder trigger content when no options is selected
   */
  placeholder: string;

  /**
   * List of options that will be displayed on the dropdown content, accepts string only
   */
  options: readonly string[];

  /**
   * Display error message and shows an indicator, useful for forms
   */
  errorMessage?: string;

  /**
   * Sends data about the open/close state of the component
   */
  onOpenChange?: (value: boolean) => void;

  /**
   * Allows parent component to control the open/close state of the component
   */
  open?: boolean;

  /**
   * Closes the dropdown when user selects an options
   * WARNING : this prop will not work when `open` is used to control the component
   */
  closeOnSelect?: boolean;

  /**
   * Replaces the component with a loading skeleton
   */
  isLoading?: boolean;
};

type ChangeCallback =
  | {
      /**
       * Allows user to select multiple inputs
       */
      multiple: true;
      /**
       * Callback that sends a string[] when `multiple` is true and a string[] when it is false
       */
      onChange?: (values: string[]) => void;

      /**
       * Allows user to control the component from outside, value will depend of the `multiple` prop, string[] when true or string otherwise.
       */
      value?: string[];
    }
  | {
      multiple?: false | undefined;
      onChange?: (values: string) => void;
      value?: string;
    };

type DropdownProps = Props &
  ChangeCallback &
  Omit<ComponentProps<typeof Popover.Container>, "onChange"> &
  Omit<HTMLAttributes<HTMLDivElement>, "onChange">;

function Dropdown(
  {
    placeholder,
    options,
    multiple = false,
    onChange = () => {},
    errorMessage,
    closeOnSelect = false,
    isLoading,
    value,
    ...props
  }: DropdownProps,
  ref: Ref<HTMLDivElement>
) {
  /**
   * Keeps track of the selected items
   */
  const [selected, setSelected] = useState<string[]>([]);

  /**
   * Keeps track of the component's open state
   */
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Retrieves the corresponding value when the component becomes controlled (`value` props is inserted)
   */
  const getSelected = useCallback(() => {
    if (typeof value === "undefined") return selected;
    if (multiple) return value as string[];
    return [value] as string[];
  }, [selected, value, multiple]);

  /**
   * Stores the logic for inserting / removing an item to the selected list
   */
  const handleSelect = useCallback(
    (item: string) => () => {
      let newValue = getSelected();

      // Remove the item from the list of they already exist
      if (getSelected().includes(item)) {
        newValue = getSelected().filter((current) => item !== current);
      } else {
        // Appends an item on multiple mode, change the item on single mode.
        newValue = multiple ? [item, ...getSelected()] : [item];
      }

      // The return value should be an array when the `multiple` prop is set to true
      setSelected(newValue);
      if (!onChange) return;
      if (multiple) {
        // [HELP NEEDED] : Are there better ways?
        onChange(newValue as string[] & string);
      } else {
        // [HELP NEEDED] : Are there better ways?
        onChange(newValue[0] as string[] & string);
      }

      // Closes the component when user selects a value (toggleable via props)
      if (closeOnSelect) setIsOpen(false);
    },
    [closeOnSelect, multiple, onChange, getSelected]
  );

  /**
   * Retrieves and formats the selected value in a presentable string format, used to display the contents of the dropdown trigger.
   */
  const getSelectedValue = useCallback(() => {
    return getSelected().length > 1
      ? getSelected().join(", ")
      : getSelected()[0];
  }, [getSelected]);

  return (
    <Popover.Container
      {...props}
      ref={ref}
      open={isOpen}
      onOpenChange={(value) => {
        if (!isLoading) setIsOpen(value);
      }}
      triggerContentGap={6}
    >
      {!isLoading ? (
        <Popover.Trigger
          className={cn(
            "border truncate border-slate-300 rounded-sm px-3 py-2 cursor-pointer flex justify-between hover:bg-slate-50 transition",
            errorMessage && "border-red-400"
          )}
        >
          <p className={cn(errorMessage && "text-red-400")}>
            {getSelectedValue() || placeholder}
          </p>
          <svg
            className={cn("transition", isOpen && "rotate-180")}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path>
          </svg>
        </Popover.Trigger>
      ) : (
        <Skeleton height={"2.5rem"} containerClassName="block leading-0" />
      )}
      {errorMessage && (
        <div className="flex items-center gap-2 mt-1">
          <svg
            className="text-red-400 fill-red-400"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM12 20c-4.411 0-8-3.589-8-8s3.567-8 7.953-8C16.391 4 20 7.589 20 12s-3.589 8-8 8z"></path>
            <path d="M11 7h2v7h-2zm0 8h2v2h-2z"></path>
          </svg>
          <p className="text-red-400">{errorMessage}</p>
        </div>
      )}
      <Popover.Content className="p-1 border border-slate-300 shadow-xl shadow-slate-100 rounded-sm grid gap-1 bg-white">
        {options.map((item, i) => {
          const isSelected = getSelected().includes(item);
          return (
            <div
              key={i}
              className={cn(
                "rounded-sm py-2 px-2 transition hover:bg-slate-50 cursor-pointer text-slate-500",
                isSelected && "bg-slate-100 text-bg-slate-500"
              )}
              onClick={handleSelect(item)}
            >
              {item}
            </div>
          );
        })}
      </Popover.Content>
    </Popover.Container>
  );
}

export default forwardRef(Dropdown);
