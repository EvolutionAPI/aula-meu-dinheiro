"use client"

import { useEffect } from "react"
import {
  useSpring,
  useTransform,
  motion,
  useReducedMotion,
} from "framer-motion"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"

interface AnimatedCounterProps {
  value: number
  className?: string
  style?: React.CSSProperties
  isHidden?: boolean
}

export function AnimatedCounter({
  value,
  className,
  style,
  isHidden,
}: AnimatedCounterProps) {
  const shouldReduceMotion = useReducedMotion()

  const spring = useSpring(0, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  })

  const display = useTransform(spring, (current) => formatCurrency(current))

  useEffect(() => {
    if (shouldReduceMotion) {
      spring.jump(value)
    } else {
      spring.set(value)
    }
  }, [spring, value, shouldReduceMotion])

  if (isHidden) {
    return (
      <span className={cn("tabular-nums", className)} style={style}>R$ ••••••</span>
    )
  }

  if (shouldReduceMotion) {
    return (
      <span className={cn("tabular-nums", className)} style={style}>
        {formatCurrency(value)}
      </span>
    )
  }

  return (
    <motion.span className={cn("tabular-nums", className)} style={style}>
      {display}
    </motion.span>
  )
}
