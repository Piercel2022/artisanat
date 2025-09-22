import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarProps {
  mode?: "single" | "multiple" | "range"
  selected?: Date | Date[] | null
  onSelect?: (date: Date | Date[] | null) => void
  disabled?: (date: Date) => boolean
  className?: string
  showOutsideDays?: boolean
  fixedWeeks?: boolean
  numberOfMonths?: number
}

const Calendar = ({
  className,
  mode = "single",
  selected,
  onSelect,
  disabled,
  showOutsideDays = true,
  fixedWeeks = false,
  numberOfMonths = 1,
  ...props
}: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  const today = new Date()
  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
  const startDate = new Date(startOfMonth)
  startDate.setDate(startDate.getDate() - startDate.getDay())

  const weeks = []
  let currentDate = new Date(startDate)

  for (let week = 0; week < 6; week++) {
    const days = []
    for (let day = 0; day < 7; day++) {
      days.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
    weeks.push(days)
    
    if (!fixedWeeks && currentDate > endOfMonth) {
      break
    }
  }

  const isSelected = (date: Date) => {
    if (!selected) return false
    
    if (mode === "single" && selected instanceof Date) {
      return date.toDateString() === selected.toDateString()
    }
    
    if (mode === "multiple" && Array.isArray(selected)) {
      return selected.some(s => s.toDateString() === date.toDateString())
    }
    
    return false
  }

  const isDisabled = (date: Date) => {
    if (disabled) return disabled(date)
    return false
  }

  const isOutsideMonth = (date: Date) => {
    return date.getMonth() !== currentMonth.getMonth()
  }

  const handleDateClick = (date: Date) => {
    if (isDisabled(date) || !onSelect) return

    if (mode === "single") {
      onSelect(date)
    } else if (mode === "multiple") {
      const currentSelected = Array.isArray(selected) ? selected : []
      const isDateSelected = currentSelected.some(s => s.toDateString() === date.toDateString())
      
      if (isDateSelected) {
        onSelect(currentSelected.filter(s => s.toDateString() !== date.toDateString()))
      } else {
        onSelect([...currentSelected, date])
      }
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      if (direction === "prev") {
        newMonth.setMonth(newMonth.getMonth() - 1)
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1)
      }
      return newMonth
    })
  }

  return (
    <div className={cn("p-3", className)} {...props}>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth("prev")}
          className="inline-flex items-center justify-center h-7 w-7 bg-transparent p-0 hover:bg-accent hover:text-accent-foreground"
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <div className="text-sm font-medium">
          {currentMonth.toLocaleDateString('fr-FR', { 
            month: 'long', 
            year: 'numeric' 
          })}
        </div>
        
        <button
          onClick={() => navigateMonth("next")}
          className="inline-flex items-center justify-center h-7 w-7 bg-transparent p-0 hover:bg-accent hover:text-accent-foreground"
          type="button"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <table className="w-full border-collapse space-y-1">
        <thead>
          <tr className="flex">
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
              <th key={day} className="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="space-y-1">
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex} className="flex w-full mt-2">
              {week.map((date, dayIndex) => {
                const isSelectedDay = isSelected(date)
                const isDisabledDay = isDisabled(date)
                const isOutside = isOutsideMonth(date)
                const isToday = date.toDateString() === today.toDateString()

                return (
                  <td key={dayIndex} className="text-center text-sm p-0 relative">
                    <button
                      className={cn(
                        "inline-flex items-center justify-center h-9 w-9 p-0 font-normal",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        isToday && "bg-accent text-accent-foreground",
                        isSelectedDay && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                        isDisabledDay && "text-muted-foreground opacity-50 cursor-not-allowed",
                        isOutside && !showOutsideDays && "text-muted-foreground opacity-50",
                        isOutside && showOutsideDays && "text-muted-foreground"
                      )}
                      onClick={() => handleDateClick(date)}
                      disabled={isDisabledDay}
                      type="button"
                    >
                      {date.getDate()}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export { Calendar }