
import { defineStore } from 'pinia'

import { getAllData } from '@/api/battery'

export interface LogEntry {
	academyId: number
	batteryLevel: number
	employeeId: string
	serialNumber: string
	timestamp: string
}

export interface Academy {
	id: number
	devices: string[]
    unhealthyDeviceCount: number
}

export interface ProcessedAcademy {
    id: number
    devices: { serialNumber: string; averageDailyUsage: number }[]
    unhealthyDeviceCount: number
}

type LogsBySerialNumber = Record<string, LogEntry[]>

export const useBatteryStore = defineStore('battery', {
	state: () => ({
		logs: [] as LogEntry[],
		logsBySerialNumber: {} as LogsBySerialNumber,
		academies: [] as Academy[],
		averageDailyUsageBySerial: {} as Record<string, number>,
		loading: false,
        // lastTimestamp: null as string | null,
	}),
    getters: {
        processedAcademies: (state) => {
            return state.academies
                .map(academy => ({
                    ...academy,
                    devices: academy.devices.map(serialNumber => ({
                        serialNumber,
                        averageDailyUsage: state.averageDailyUsageBySerial[serialNumber]
                    }))
                }))
                .sort((a, b) => b.unhealthyDeviceCount - a.unhealthyDeviceCount) as ProcessedAcademy[]
        }
    },
	actions: {
        // TODO fetchDataAfterLastTimestamp()
        // Realistically, this would be used to fetch new data after the last known timestamp,
        // avoiding unnecessary data transfer and updating already cached and processed past data

		async fetchAllData() {
			this.loading = true
			this.logs = await getAllData()
			this.organizeData()
			this.loading = false
		},

		organizeData() {
			const logsBySerialNumber: LogsBySerialNumber = {}
			const academyDeviceMap: Record<number, Set<string>> = {}

			for (const log of this.logs) {
				if (!logsBySerialNumber[log.serialNumber]) 
                    logsBySerialNumber[log.serialNumber] = []
				logsBySerialNumber[log.serialNumber].push(log)

				if (!academyDeviceMap[log.academyId]) 
                    academyDeviceMap[log.academyId] = new Set()
				academyDeviceMap[log.academyId].add(log.serialNumber)
			}
			this.logsBySerialNumber = logsBySerialNumber

            // Calculate averageDailyUsage for each device
			this.averageDailyUsageBySerial = Object.keys(logsBySerialNumber).reduce((acc, serial) => {
				acc[serial] = 0 // placeholder value
				return acc
			}, {})

            // Merge academy data with its' devices' averageDailyUsage and calculate unhealthyDeviceCount
			this.academies = Object.entries(academyDeviceMap).map(([academyId, devices]) => {
                const devicesArr = Array.from(devices)
                return {
                    id: Number(academyId),
                    devices: devicesArr,
                    unhealthyDeviceCount: devicesArr.filter(serial => this.averageDailyUsageBySerial[serial] >= 30).length
                }
			})
		},
	},
})
