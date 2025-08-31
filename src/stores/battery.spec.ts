import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useBatteryStore } from './battery'
import * as api from '@/api/battery'

const mockLogs = [
  {
    academyId: 1234,
    batteryLevel: 1,
    employeeId: 'E1',
    serialNumber: 'SERIAL_1',
    timestamp: '2023-01-01T09:00:00Z'
  },
  {
    academyId: 1234,
    batteryLevel: 0.9,
    employeeId: 'E2',
    serialNumber: 'SERIAL_1',
    timestamp: '2023-01-01T21:00:00Z'
  },
  {
    academyId: 1234,
    batteryLevel: 0.8,
    employeeId: 'E2',
    serialNumber: 'SERIAL_1',
    timestamp: '2023-01-02T21:00:00Z'
  }
]

describe('battery store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.spyOn(api, 'getAllData').mockResolvedValue(mockLogs)
  })

  it('fetches and organizes data', async () => {
    const store = useBatteryStore()
    await store.fetchAllData()
    expect(store.logs.length).toBe(3)
    expect(Object.keys(store.auxiliaryDataPerDevice)).toContain('SERIAL_1')
    expect(store.academies[0].id).toBe(1234)
    expect(store.academies[0].devices).toContain('SERIAL_1')
  })

  it('computes processedAcademies', async () => {
    const store = useBatteryStore()
    await store.fetchAllData()

    const auxiliaryData = store.auxiliaryDataPerDevice
    expect(Object.keys(auxiliaryData)).toContain('SERIAL_1')
    expect(auxiliaryData['SERIAL_1'].totalSpentBatteryPercentage).toBe(20)
    expect(auxiliaryData['SERIAL_1'].totalPassedHours).toBe(36)

    const processed = store.processedAcademies
    expect(processed.length).toBe(1)
    expect(processed[0].id).toBe(1234)
    expect(processed[0].devices[0].serialNumber).toBe('SERIAL_1')
    expect(processed[0].devices[0].averageDailyUsage.toFixed(1)).toBe('13.3')
  })
})