import * as React from "react"
import { cn } from "@/lib/utils"

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
  error?: string
  indeterminate?: boolean
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, indeterminate, ...props }, ref) => {
    const checkboxRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => checkboxRef.current!)

    React.useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate ?? false
      }
    }, [indeterminate])

    return (
      <div className="w-full">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              ref={checkboxRef}
              className={cn(
                "h-4 w-4 rounded border-gray-300 text-blue-600",
                "focus:ring-2 focus:ring-blue-500 focus:ring-offset-0",
                "disabled:cursor-not-allowed disabled:opacity-50",
                error && "border-red-500 focus:ring-red-500",
                className
              )}
              {...props}
            />
          </div>
          {(label || description) && (
            <div className="ml-3 text-sm">
              {label && (
                <label
                  htmlFor={props.id}
                  className={cn(
                    "font-medium cursor-pointer",
                    error ? "text-red-700" : "text-gray-700",
                    props.disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {label}
                  {props.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              )}
              {description && (
                <p className={cn(
                  "text-gray-500",
                  props.disabled && "opacity-50"
                )}>
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = "Checkbox"

export { Checkbox }