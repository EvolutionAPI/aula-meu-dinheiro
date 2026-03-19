# Story 2.3: Componente de Counter Animation

Status: done

**Depends on:** Story 1.1 (formatCurrency, tipos), Story 2.2 (HeroCard usa este componente)

## Story

As a usuario,
I want ver os valores monetarios animando de 0 ate o valor real,
So that a experiencia visual seja premium e impressionante.

## Acceptance Criteria

1. **Given** um componente AnimatedCounter recebe um valor numerico **When** o componente e renderizado ou o valor muda **Then** o numero anima de 0 (ou valor anterior) ate o valor real em ~500ms com easing spring (NFR8) **And** o valor e formatado como moeda BRL durante a animacao (R$ X.XXX,XX) **And** usa font-variant-numeric: tabular-nums para alinhamento

2. **Given** o usuario tem prefers-reduced-motion ativado **When** o counter e renderizado **Then** o valor aparece instantaneamente sem animacao (NFR17)

3. **Given** o componente AnimatedCounter **When** implementado **Then** usa Framer Motion com "use client" **And** a animacao roda a 60fps sem jank (NFR6) **And** e reutilizavel em qualquer lugar que exiba valores monetarios

## Tasks / Subtasks

- [x] Task 1 (AC: #1, #3) Criar componente AnimatedCounter
  - [x] 1.1 Criar src/components/animated-counter.tsx como Client Component ("use client")
  - [x] 1.2 Props: value (number), className? (string), isHidden? (boolean)
  - [x] 1.3 Usar Framer Motion useSpring + useTransform para animar o valor
  - [x] 1.4 Animacao: de 0 (ou valor anterior) ate value em ~500ms
  - [x] 1.5 Spring config: { stiffness: 100, damping: 30, mass: 1 } (ajustar para ~500ms)
  - [x] 1.6 Formatar durante animacao com formatCurrency() de src/lib/format.ts
  - [x] 1.7 font-variant-numeric: tabular-nums (evita "pular" de largura entre numeros)
  - [x] 1.8 Se isHidden = true: mostrar "R$ ••••••" sem animacao
- [x] Task 2 (AC: #2) Implementar prefers-reduced-motion
  - [x] 2.1 Usar useReducedMotion() do Framer Motion
  - [x] 2.2 Se reduced motion: valor aparece instantaneamente (spring.jump)
  - [x] 2.3 Formatar com formatCurrency() normalmente
- [x] Task 3 (AC: #3) Otimizar performance
  - [x] 3.1 Usar useSpring (MotionValue) + useTransform (nao re-render React a cada frame)
  - [x] 3.2 Formatar via useTransform callback (roda fora do React render cycle)
  - [x] 3.3 Performance otimizada via Framer Motion MotionValue pattern
  - [x] 3.4 Componente leve e reutilizavel

## Dev Notes

### Architecture & Patterns
- Client Component obrigatorio — Framer Motion requer "use client"
- useMotionValue + useTransform do Framer Motion — NAO useState + setInterval
- A animacao roda fora do ciclo de render do React (melhor performance)
- formatCurrency() de src/lib/format.ts para formatar durante animacao
- Componente reutilizavel — usado no HeroCard, potencialmente em transacoes

### Implementation Pattern
```typescript
"use client"

import { useEffect, useRef } from "react"
import { useSpring, useTransform, motion, useReducedMotion } from "framer-motion"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"

interface AnimatedCounterProps {
  value: number
  className?: string
  isHidden?: boolean
}

export function AnimatedCounter({ value, className, isHidden }: AnimatedCounterProps) {
  const shouldReduceMotion = useReducedMotion()

  const spring = useSpring(0, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  })

  const display = useTransform(spring, (current) =>
    formatCurrency(current)
  )

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  if (isHidden) {
    return (
      <span className={cn("tabular-nums", className)}>
        R$ ••••••
      </span>
    )
  }

  if (shouldReduceMotion) {
    return (
      <span className={cn("tabular-nums", className)}>
        {formatCurrency(value)}
      </span>
    )
  }

  return (
    <motion.span className={cn("tabular-nums", className)}>
      {display}
    </motion.span>
  )
}
```

### Framer Motion Notes
- useSpring: cria um MotionValue com physics-based spring animation
- useTransform: transforma o MotionValue (numero) em string formatada
- motion.span: renderiza o MotionValue sem re-render React
- useReducedMotion: respeita prefers-reduced-motion do sistema
- Spring config { stiffness: 100, damping: 30, mass: 1 } = ~500ms de animacao suave
- Ajustar stiffness/damping para obter exatamente o feel desejado

### Performance Notes
- useMotionValue/useSpring NAO causa re-renders React — anima via DOM direto
- useTransform roda o callback a cada frame de animacao (fora do React)
- formatCurrency() dentro de useTransform deve ser leve (Intl.NumberFormat e cached)
- Testar com Chrome DevTools Performance: gravar durante animacao, verificar 60fps
- Se houver jank: considerar cachear o Intl.NumberFormat formatter

### CSS Requirement
```css
/* Garantir que numeros nao "pulem" de largura */
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
```
Ou via Tailwind: `tabular-nums` (utility class ja existe no Tailwind)

### Visual Design
- Font: text-3xl font-bold tracking-tight (display size) — no HeroCard
- Cor: text-zinc-50 (branco)
- tabular-nums para alinhamento consistente
- Quando oculto: "R$ ••••••" no mesmo tamanho de fonte
- Transicao ocultar: fade 200ms (CSS transition)

### File Structure
```
src/components/
└── animated-counter.tsx    # AnimatedCounter (NOVO)
```

### CRITICO - Nao Fazer
- NAO usar useState + setInterval para animar — usar Framer Motion useSpring
- NAO criar animacao com CSS @keyframes — Framer Motion tem spring physics
- NAO esquecer prefers-reduced-motion — acessibilidade obrigatoria (NFR17)
- NAO esquecer tabular-nums — sem isso os numeros "pulam" de largura durante animacao
- NAO fazer re-render React a cada frame — usar useMotionValue pattern
- NAO criar formatter Intl.NumberFormat dentro do useTransform (cachear fora)

### Testing Checklist
- [ ] Valor anima de 0 ao valor alvo em ~500ms
- [ ] Formato "R$ X.XXX,XX" durante toda a animacao
- [ ] Numeros nao "pulam" de largura (tabular-nums)
- [ ] Com prefers-reduced-motion: valor aparece instantaneamente
- [ ] isHidden=true mostra "R$ ••••••"
- [ ] 60fps no Chrome DevTools Performance panel
- [ ] Quando valor muda: anima do valor anterior ao novo

### References
- [Source: architecture.md#Frontend Architecture] Client Components com Framer Motion
- [Source: epics.md#Story 2.3] Acceptance criteria
- [Source: ux-design-specification.md#Feedback Patterns] Counter animation 500ms spring
- [Source: ux-design-specification.md#Accessibility] prefers-reduced-motion

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6 (1M context)

### Debug Log References
- Build successful com Next.js 16.2.0 (Turbopack)

### Completion Notes List
- AnimatedCounter criado com Framer Motion useSpring + useTransform
- Spring config: stiffness 100, damping 30, mass 1 (~500ms)
- formatCurrency() via useTransform callback (fora do React render cycle)
- useReducedMotion() para acessibilidade — spring.jump() quando reduced motion
- isHidden mostra "R$ ••••••" sem animacao
- tabular-nums para alinhamento consistente de numeros
- motion.span para renderizacao sem re-render React

### Change Log
- 2026-03-19: Story 2.3 implementada — AnimatedCounter com spring animation e acessibilidade

### File List
- src/components/animated-counter.tsx (NOVO)
