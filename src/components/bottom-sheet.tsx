"use client"

import { useEffect, useRef, useCallback } from "react"
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useDragControls,
  type PanInfo,
} from "framer-motion"

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

const DRAG_CLOSE_THRESHOLD = 100

export function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  const shouldReduceMotion = useReducedMotion()
  const sheetRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const dragControls = useDragControls()

  // Save previous focus and move focus to sheet
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      requestAnimationFrame(() => {
        sheetRef.current?.focus()
      })
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
      previousFocusRef.current?.focus()
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Escape to close
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Focus trap
  useEffect(() => {
    if (!isOpen || !sheetRef.current) return

    const sheet = sheetRef.current

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      const focusableElements = sheet.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements.length === 0) return

      const firstFocusable = focusableElements[0]
      const lastFocusable = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault()
          lastFocusable.focus()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault()
          firstFocusable.focus()
        }
      }
    }

    sheet.addEventListener("keydown", handleKeyDown)
    return () => sheet.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  // Drag-to-dismiss handler
  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (info.offset.y > DRAG_CLOSE_THRESHOLD) {
        onClose()
      }
    },
    [onClose]
  )

  const animationDuration = shouldReduceMotion ? 0 : 0.3

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-zinc-950/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: animationDuration }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet — draggable via dragControls triggered by handle */}
          <motion.div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Registrar transacao"
            tabIndex={-1}
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto h-[85vh] max-w-[428px] rounded-t-2xl bg-zinc-900 outline-none"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              duration: animationDuration,
              ease: isOpen ? [0.32, 0.72, 0, 1] : [0.32, 0, 0.67, 0],
            }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={handleDragEnd}
          >
            {/* Drag Handle — triggers drag on the sheet */}
            <div
              className="flex cursor-grab items-center justify-center pb-2 pt-3 active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
              style={{ touchAction: "none" }}
            >
              <div className="h-1 w-10 rounded-full bg-zinc-600" />
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto" style={{ height: "calc(100% - 28px)" }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
