
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
}

type LogsBySerialNumber = Record<string, LogEntry[]>

export const useBatteryStore = defineStore('battery', {
	state: () => ({
		logs: [] as LogEntry[],
		logsBySerialNumber: {} as LogsBySerialNumber,
		academies: [] as Academy[],
		batteryHealthBySerial: {} as Record<string, number>,
		loading: false,
        // lastTimestamp: null as string | null,
	}),
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
			this.academies = Object.entries(academyDeviceMap).map(([academyId, devices]) => ({
				id: Number(academyId),
				devices: Array.from(devices),
			}))

			this.batteryHealthBySerial = Object.keys(logsBySerialNumber).reduce((acc, serial) => {
				acc[serial] = 0 // placeholder value
				return acc
			}, {})
		},
	},
})
