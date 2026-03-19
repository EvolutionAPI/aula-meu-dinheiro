import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import {
  getMonthRange,
  getWeekRange,
  getTodayRange,
  formatDate,
} from "@/lib/date"

describe("date helpers", () => {
  beforeEach(() => {
    // Fix date to Wednesday, March 19, 2026 at 14:00
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 2, 19, 14, 0, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe("getMonthRange", () => {
    it("returns start and end of current month", () => {
      const { start, end } = getMonthRange()
      expect(start.getFullYear()).toBe(2026)
      expect(start.getMonth()).toBe(2) // March
      expect(start.getDate()).toBe(1)
      expect(start.getHours()).toBe(0)

      expect(end.getFullYear()).toBe(2026)
      expect(end.getMonth()).toBe(2)
      expect(end.getDate()).toBe(31)
      expect(end.getHours()).toBe(23)
      expect(end.getMinutes()).toBe(59)
    })
  })

  describe("getWeekRange", () => {
    it("returns Monday to Sunday of current week", () => {
      const { start, end } = getWeekRange()
      // March 19 2026 is Thursday, Monday is March 16
      expect(start.getDate()).toBe(16)
      expect(start.getDay()).toBe(1) // Monday
      expect(start.getHours()).toBe(0)

      expect(end.getDate()).toBe(22) // Sunday
      expect(end.getDay()).toBe(0)
      expect(end.getHours()).toBe(23)
    })
  })

  describe("getTodayRange", () => {
    it("returns start and end of today", () => {
      const { start, end } = getTodayRange()
      expect(start.getDate()).toBe(19)
      expect(start.getHours()).toBe(0)
      expect(start.getMinutes()).toBe(0)

      expect(end.getDate()).toBe(19)
      expect(end.getHours()).toBe(23)
      expect(end.getMinutes()).toBe(59)
    })
  })

  describe("formatDate", () => {
    it("formats Date object", () => {
      const result = formatDate(new Date(2026, 2, 19))
      expect(result).toContain("19")
      expect(result).toMatch(/mar/i)
    })

    it("formats ISO string", () => {
      const result = formatDate("2026-03-19T14:00:00.000Z")
      expect(result).toContain("19")
    })
  })
})
