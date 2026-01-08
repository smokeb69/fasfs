import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

interface DialogTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

interface DialogContentProps {
  className?: string
  children: React.ReactNode
}

interface DialogHeaderProps {
  className?: string
  children: React.ReactNode
}

interface DialogTitleProps {
  className?: string
  children: React.ReactNode
}

const DialogContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
}>({
  open: false,
  setOpen: () => {},
})

const Dialog: React.FC<DialogProps> = ({ open: controlledOpen, onOpenChange, children }) => {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

const DialogTrigger: React.FC<DialogTriggerProps> = ({ children, asChild }) => {
  const { setOpen } = React.useContext(DialogContext)

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: () => setOpen(true),
    })
  }

  return (
    <button onClick={() => setOpen(true)}>
      {children}
    </button>
  )
}

const DialogContent: React.FC<DialogContentProps> = ({ className, children }) => {
  const { open, setOpen } = React.useContext(DialogContext)

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/80"
        onClick={() => setOpen(false)}
      />
      {/* Content */}
      <div className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg",
        className
      )}>
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </>
  )
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ className, children }) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}>
    {children}
  </div>
)

const DialogTitle: React.FC<DialogTitleProps> = ({ className, children }) => (
  <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>
    {children}
  </h2>
)

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
}
