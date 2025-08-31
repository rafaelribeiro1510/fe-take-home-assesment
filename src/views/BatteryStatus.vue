<template>
    <v-container fluid class="fill-height pa-0 ma-0">
        <v-card 
            title="Battery Status" 
            subtitle="See the average battery health of devices, grouped by Academy"
            class="w-100 h-100">
            <v-card-text>
                <v-btn class="mb-2" 
                    @click="batteryStore.fetchAllData" 
                    :loading="batteryStore.loading" 
                    text="Refresh Data" />
                    
                <v-expansion-panels
                        :disabled="batteryStore.loading">
                    <v-expansion-panel 
                        v-for="academy in batteryStore.processedAcademies" 
                        :key="academy.id">
                        <v-expansion-panel-title>
                            <v-row no-gutters>
                                <v-col class="d-flex justify-start" cols="4">
                                    <v-icon icon="mdi-school" start />
                                    {{ academy.id }}
                                </v-col>
                                <v-col class="d-flex justify-start text-medium-emphasis" cols="8">
                                    Unhealthy devices: {{ academy.unhealthyDeviceCount }} out of {{ academy.devices.length }}
                                </v-col>
                            </v-row>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-data-table
                                :items="academy.devices"
                                :headers="headers"
                                hide-default-footer>

                                <template v-slot:item.serialNumber="{ value }">
                                    <div class="text-medium-emphasis">
                                        <v-icon icon="mdi-cellphone-link" start />
                                        <span>{{ value }}</span>
                                    </div>
                                </template>


                                <template v-slot:item.averageDailyUsage="{ value }">
                                    <div :style="{'color': batteryTextColor(value)}">
                                        <span>{{ value === null ? 'Unknown' : (value).toFixed(1) }}</span>
                                        <v-icon :icon="batteryIcon(value)" end />
                                    </div>
                                </template>

                            </v-data-table>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script lang="ts" setup>
import { useBatteryStore } from '@/stores/battery'
import { onMounted } from 'vue'
const batteryStore = useBatteryStore()

const headers = [
    { title: 'Serial Number', value: 'serialNumber' },
    { title: 'Average Daily Usage (%)', value: 'averageDailyUsage' }
]

const batteryIcon = (level: number | null) => {
    if (level === null) return 'mdi-battery-unknown'
    const roundedLevel = Math.floor(level / 10) * 10

    if (roundedLevel < 25) return 'mdi-battery-check'
    else if (roundedLevel < 30) return 'mdi-battery-alert-variant-outline'
    else return 'mdi-battery-remove-outline'
}
const batteryTextColor = (level: number | null) => {
    if (level === null) return 'grey'
    const roundedLevel = Math.floor(level / 10) * 10
    if (roundedLevel < 25) return 'green'
    else if (roundedLevel < 30) return 'orange'
    else return 'red'
}

onMounted(() => {
    batteryStore.fetchAllData()
})
</script>