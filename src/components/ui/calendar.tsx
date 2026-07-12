import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface MonthPickerProps {
  value?: string
  onSelect?: (date: Date) => void
  disabled?: (date: Date) => boolean
}

export const Calendar = React.forwardRef<HTMLDivElement, MonthPickerProps>(
  ({ value, onSelect, disabled }, ref) => {
    const [year, setYear] = React.useState(new Date().getFullYear())
    const currentDate = value ? new Date(value + "-01") : new Date()

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]

    const handleMonthSelect = (monthIndex: number) => {
      const date = new Date(year, monthIndex, 1)
      if (!disabled || !disabled(date)) {
        onSelect?.(date)
      }
    }

    const handlePrevYear = () => setYear(year - 1)
    const handleNextYear = () => setYear(year + 1)

    const isMonthDisabled = (monthIndex: number) => {
      const date = new Date(year, monthIndex, 1)
      return disabled?.(date) ?? false
    }

    return (
      <div ref={ref} className="p-4 w-full">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevYear}
            className="h-7 w-7 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{year}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextYear}
            className="h-7 w-7 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {months.map((month, index) => {
            const isDisabled = isMonthDisabled(index)
            const isSelected =
              currentDate.getFullYear() === year &&
              currentDate.getMonth() === index

            return (
              <Button
                key={month}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => handleMonthSelect(index)}
                disabled={isDisabled}
                className={cn(
                  "text-xs",
                  isSelected && "bg-primary text-primary-foreground"
                )}
              >
                {month.slice(0, 3)}
              </Button>
            )
          })}
        </div>
      </div>
    )
  }
)

Calendar.displayName = "Calendar"
