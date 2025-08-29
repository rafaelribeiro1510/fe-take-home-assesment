
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

interface AuxiliaryData {
	lastRecordedBattery: number
	lastRecordedTimestamp: Date

	totalSpentBattery: number
	totalPassedHours: number
}

export const useBatteryStore = defineStore('battery', {
	state: () => ({
		logs: [] as LogEntry[],
		auxiliaryDataPerDevice: {} as Record<string, AuxiliaryData>,
		academies: [] as Academy[],
		averageDailyUsagePerDevice: {} as Record<string, number | null>,
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
							averageDailyUsage: state.averageDailyUsagePerDevice[serialNumber]
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
			this.auxiliaryDataPerDevice = {}
			this.organizeData()
			this.loading = false
		},

		organizeData() {
			const academyDeviceMap: Record<number, Set<string>> = {}
			const auxiliaryDataPerDevice: Record<string, AuxiliaryData> = {}

			for (const log of this.logs) {
				const batteryLevel = log.batteryLevel
				const timestamp = new Date(log.timestamp)

				// First log for this serialNumber
				if (!auxiliaryDataPerDevice[log.serialNumber]) 
					auxiliaryDataPerDevice[log.serialNumber] = {
						lastRecordedBattery: batteryLevel,
						lastRecordedTimestamp: timestamp,
						totalSpentBattery: 0,
						totalPassedHours: 0
				}
				else {
					const batteryDifference = auxiliaryDataPerDevice[log.serialNumber].lastRecordedBattery - batteryLevel
					const timeDifference = (auxiliaryDataPerDevice[log.serialNumber].lastRecordedTimestamp.getTime() - timestamp.getTime()) / 1000 / 60 / 60 // convert to hours

					// If this log is from before last registered timestamp, ignore it
					if (timeDifference < 0) break

					// If this log shows battery decrease from previous,
					// increment spent battery and passed time since last log
					if (batteryDifference > 0) {
						auxiliaryDataPerDevice[log.serialNumber].totalSpentBattery += batteryDifference
						auxiliaryDataPerDevice[log.serialNumber].totalPassedHours += timeDifference
					}

					// Then, update last recorded values
					auxiliaryDataPerDevice[log.serialNumber].lastRecordedBattery = batteryLevel
					auxiliaryDataPerDevice[log.serialNumber].lastRecordedTimestamp = timestamp
				}

				if (!academyDeviceMap[log.academyId]) 
					academyDeviceMap[log.academyId] = new Set()
				academyDeviceMap[log.academyId].add(log.serialNumber)
			}

			// Cache in store state (will be useful for futurely implemented fetchDataAfterLastTimestamp)
			this.auxiliaryDataPerDevice = auxiliaryDataPerDevice

			// Calculate averageDailyUsage for each device
			this.averageDailyUsagePerDevice = Object.entries(auxiliaryDataPerDevice).reduce((acc, [serial, data]) => {
				acc[serial] = data.totalPassedHours > 0 ? data.totalSpentBattery / data.totalPassedHours : null
				return acc
			}, {} as Record<string, number>)

			// Merge academy data with its' devices' averageDailyUsage and calculate unhealthyDeviceCount
			this.academies = Object.entries(academyDeviceMap).map(([academyId, devices]) => {
				const devicesArr = Array.from(devices)
				return {
					id: Number(academyId),
					devices: devicesArr,
					unhealthyDeviceCount: devicesArr.filter(serial => this.averageDailyUsagePerDevice[serial] !== null && this.averageDailyUsagePerDevice[serial] >= 30).length
				}
			})
		},
	},
})
