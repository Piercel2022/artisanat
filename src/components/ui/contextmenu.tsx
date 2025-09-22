import * as React from "react"
import { cn } from "@/lib/utils"

interface ContextMenuContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
  position: { x: number; y: number }
  setPosition: (position: { x: number; y: number }) => void
}

const ContextMenuContext = React.createContext<ContextMenuContextType | undefined>(undefined)

interface ContextMenuSubContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ContextMenuSubContext = React.createContext<ContextMenuSubContextType | undefined>(undefined)

const useContextMenu = () => {
  const context = React.useContext(ContextMenuContext)
  if (!context) {
    throw new Error("useContextMenu must be used within a ContextMenu")
  }
  return context
}

const useContextMenuSub = () => {
  const context = React.useContext(ContextMenuSubContext)
  if (!context) {
    throw new Error("useContextMenuSub must be used within a ContextMenuSub")
  }
  return context
}

interface ContextMenuProps {
  children: React.ReactNode
}

const ContextMenu = ({ children }: ContextMenuProps) => {
  const [open, setOpen] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })

  return (
    <ContextMenuContext.Provider value={{ 
      open, 
      onOpenChange: setOpen, 
      position, 
      setPosition 
    }}>
      <div className="relative">
        {children}
      </div>
    </ContextMenuContext.Provider>
  )
}

const ContextMenuTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, onContextMenu, ...props }, ref) => {
  const { onOpenChange, setPosition } = useContextMenu()

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setPosition({ x: e.clientX, y: e.clientY })
    onOpenChange(true)
    onContextMenu?.(e)
  }

  return (
    <div
      ref={ref}
      className={className}
      onContextMenu={handleContextMenu}
      {...props}
    >
      {children}
    </div>
  )
})
ContextMenuTrigger.displayName = "ContextMenuTrigger"

const ContextMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    alignOffset?: number
    avoidCollisions?: boolean
  }
>(({ className, alignOffset = 4, avoidCollisions = true, ...props }, ref) => {
  const { open, onOpenChange, position } = useContextMenu()
  const contentRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        onOpenChange(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, onOpenChange])

  // Adjust position to avoid viewport overflow
  const adjustedPosition = React.useMemo(() => {
    if (!open || !contentRef.current) return position

    const rect = contentRef.current.getBoundingClientRect()
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    let { x, y } = position

    if (avoidCollisions) {
      // Adjust horizontal position
      if (x + rect.width > viewport.width) {
        x = viewport.width - rect.width - alignOffset
      }

      // Adjust vertical position
      if (y + rect.height > viewport.height) {
        y = viewport.height - rect.height - alignOffset
      }

      // Ensure minimum distance from edges
      x = Math.max(alignOffset, x)
      y = Math.max(alignOffset, y)
    }

    return { x, y }
  }, [position, open, alignOffset, avoidCollisions])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50"
      style={{ pointerEvents: open ? 'auto' : 'none' }}
    >
      <div
        ref={contentRef}
        className={cn(
          "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
          className
        )}
        style={{
          left: adjustedPosition.x,
          top: adjustedPosition.y,
        }}
        {...props}
      />
    </div>
  )
})
ContextMenuContent.displayName = "ContextMenuContent"

const ContextMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    inset?: boolean
    disabled?: boolean
  }
>(({ className, inset, disabled, onClick, ...props }, ref) => {
  const { onOpenChange } = useContextMenu()

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return
    onClick?.(e)
    onOpenChange(false)
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
        inset && "pl-8",
        disabled 
          ? "pointer-events-none opacity-50" 
          : "focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
        className
      )}
      onClick={handleClick}
      {...props}
    />
  )
})
ContextMenuItem.displayName = "ContextMenuItem"

const ContextMenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
    disabled?: boolean
  }
>(({ className, children, checked, onCheckedChange, disabled, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors",
      disabled 
        ? "pointer-events-none opacity-50" 
        : "focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
      className
    )}
    onClick={() => !disabled && onCheckedChange?.(!checked)}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      {checked && (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </span>
    {children}
  </div>
))
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem"

const ContextMenuRadioItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string
    checked?: boolean
    onSelect?: (value: string) => void
    disabled?: boolean
  }
>(({ className, children, value, checked, onSelect, disabled, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors",
      disabled 
        ? "pointer-events-none opacity-50" 
        : "focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
      className
    )}
    onClick={() => !disabled && onSelect?.(value)}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      {checked && (
        <div className="h-2 w-2 rounded-full bg-current" />
      )}
    </span>
    {children}
  </div>
))
ContextMenuRadioItem.displayName = "ContextMenuRadioItem"

const ContextMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
ContextMenuLabel.displayName = "ContextMenuLabel"

const ContextMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
ContextMenuSeparator.displayName = "ContextMenuSeparator"

const ContextMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
ContextMenuShortcut.displayName = "ContextMenuShortcut"

const ContextMenuSub = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false)
  
  return (
    <ContextMenuSubContext.Provider value={{ open, onOpenChange: setOpen }}>
      {children}
    </ContextMenuSubContext.Provider>
  )
}

const ContextMenuSubTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    inset?: boolean
    disabled?: boolean
  }
>(({ className, inset, disabled, children, onMouseEnter, onMouseLeave, ...props }, ref) => {
  const { onOpenChange } = useContextMenuSub()
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    onOpenChange(true)
    onMouseEnter?.(e)
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return
    timeoutRef.current = setTimeout(() => {
      onOpenChange(false)
    }, 100)
    onMouseLeave?.(e)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
        inset && "pl-8",
        disabled 
          ? "pointer-events-none opacity-50" 
          : "focus:bg-accent hover:bg-accent data-[state=open]:bg-accent",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
      <svg
        className="ml-auto h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </div>
  )
})
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger"

const ContextMenuSubContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    alignOffset?: number
    avoidCollisions?: boolean
  }
>(({ className, alignOffset = 4, avoidCollisions = true, onMouseEnter, onMouseLeave, ...props }, ref) => {
  const { open, onOpenChange } = useContextMenuSub()
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const contentRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLDivElement>(null)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    if (open && ref && 'current' in ref && ref.current) {
      const trigger = ref.current.previousElementSibling as HTMLElement
      if (trigger) {
        triggerRef.current = trigger as HTMLDivElement
        const triggerRect = trigger.getBoundingClientRect()
        setPosition({
          x: triggerRect.right,
          y: triggerRect.top
        })
      }
    }
  }, [open, ref])

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    onMouseEnter?.(e)
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    timeoutRef.current = setTimeout(() => {
      onOpenChange(false)
    }, 100)
    onMouseLeave?.(e)
  }

  // Adjust position to avoid viewport overflow
  const adjustedPosition = React.useMemo(() => {
    if (!open || !contentRef.current) return position

    const rect = contentRef.current.getBoundingClientRect()
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    let { x, y } = position

    if (avoidCollisions) {
      // If submenu would overflow right, place it on the left side of trigger
      if (x + rect.width > viewport.width && triggerRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect()
        x = triggerRect.left - rect.width
      }

      // Adjust vertical position if needed
      if (y + rect.height > viewport.height) {
        y = viewport.height - rect.height - alignOffset
      }

      // Ensure minimum distance from edges
      x = Math.max(alignOffset, x)
      y = Math.max(alignOffset, y)
    }

    return { x, y }
  }, [position, open, alignOffset, avoidCollisions])

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50"
      style={{ pointerEvents: 'none' }}
    >
      <div
        ref={contentRef}
        className={cn(
          "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
          className
        )}
        style={{
          left: adjustedPosition.x,
          top: adjustedPosition.y,
          pointerEvents: 'auto'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      />
    </div>
  )
})
ContextMenuSubContent.displayName = "ContextMenuSubContent"

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
}