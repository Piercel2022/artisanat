import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps {
  id?: string
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  required?: boolean
  className?: string
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({
    id,
    checked,
    defaultChecked,
    onCheckedChange,
    label,
    description,
    size = 'md',
    disabled,
    required,
    className,
    ...props
  }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false)

    const isChecked = checked !== undefined ? checked : internalChecked

    const handleToggle = () => {
      if (disabled) return
      
      const newChecked = !isChecked
      if (checked === undefined) {
        setInternalChecked(newChecked)
      }
      onCheckedChange?.(newChecked)
    }

    const sizeClasses = {
      sm: {
        switch: "h-5 w-9",
        thumb: "h-4 w-4",
        translate: "translate-x-4"
      },
      md: {
        switch: "h-6 w-11",
        thumb: "h-5 w-5",
        translate: "translate-x-5"
      },
      lg: {
        switch: "h-7 w-12",
        thumb: "h-6 w-6",
        translate: "translate-x-5"
      }
    }

    return (
      <div className="flex items-center justify-between w-full">
        {(label || description) && (
          <div className="flex-1 mr-4">
            {label && (
              <label
                htmlFor={id}
                className={cn(
                  "block text-sm font-medium cursor-pointer",
                  disabled ? "text-gray-400" : "text-gray-700"
                )}
              >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            {description && (
              <p className={cn(
                "text-sm",
                disabled ? "text-gray-400" : "text-gray-500"
              )}>
                {description}
              </p>
            )}
          </div>
        )}
        
        <button
          type="button"
          id={id}
          ref={ref}
          role="switch"
          aria-checked={isChecked}
          disabled={disabled}
          onClick={handleToggle}
          className={cn(
            "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent",
            "transition-colors duration-200 ease-in-out",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            sizeClasses[size].switch,
            isChecked ? "bg-blue-600" : "bg-gray-200",
            className
          )}
          {...props}
        >
          <span
            className={cn(
              "pointer-events-none inline-block rounded-full bg-white shadow transform ring-0",
              "transition-transform duration-200 ease-in-out",
              sizeClasses[size].thumb,
              isChecked ? sizeClasses[size].translate : "translate-x-0"
            )}
          />
        </button>
      </div>
    )
  }
)

Switch.displayName = "Switch"

export { Switch }