import * as React from "react"
import { cn } from "@/lib/utils"

export interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface RadioGroupProps {
  name: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  options: RadioOption[]
  label?: string
  error?: string
  helperText?: string
  orientation?: 'horizontal' | 'vertical'
  required?: boolean
  disabled?: boolean
  className?: string
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({
    name,
    value,
    defaultValue,
    onValueChange,
    options,
    label,
    error,
    helperText,
    orientation = 'vertical',
    required,
    disabled,
    className,
    ...props
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || '')

    const currentValue = value !== undefined ? value : internalValue

    const handleChange = (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    }

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className={cn(
          "space-y-3",
          orientation === 'horizontal' && "flex flex-wrap gap-6 space-y-0"
        )}>
          {options.map((option) => (
            <div key={option.value} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="radio"
                  id={`${name}-${option.value}`}
                  name={name}
                  value={option.value}
                  checked={currentValue === option.value}
                  onChange={(e) => handleChange(e.target.value)}
                  disabled={disabled || option.disabled}
                  className={cn(
                    "h-4 w-4 border-gray-300 text-blue-600",
                    "focus:ring-2 focus:ring-blue-500 focus:ring-offset-0",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    error && "border-red-500 focus:ring-red-500"
                  )}
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor={`${name}-${option.value}`}
                  className={cn(
                    "font-medium cursor-pointer",
                    error ? "text-red-700" : "text-gray-700",
                    (disabled || option.disabled) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {option.label}
                </label>
                {option.description && (
                  <p className={cn(
                    "text-gray-500",
                    (disabled || option.disabled) && "opacity-50"
                  )}>
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-600">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

RadioGroup.displayName = "RadioGroup"

export { RadioGroup }