<template>
    <v-container fluid class="fill-height pa-0 ma-0">
        <v-card 
            title="Battery Status" 
            subtitle="See the average battery health of devices, grouped by Academy"
            class="w-100 h-100">
            <v-card-text>
                <v-btn class="mb-2" @click="batteryStore.fetchAllData">Refresh Data</v-btn>
                <v-expansion-panels>
                    <v-expansion-panel v-for="academy in batteryStore.processedAcademies" :key="academy.id">
                        <v-expansion-panel-title>
                            <v-icon icon="mdi-school" start />
                            {{ academy.id }}
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-data-table
                                :items="academy.devices"
                                hide-default-header
                                hide-default-footer>

                                <template v-slot:item.serialNumber="{ value }">
                                    <div class="text-medium-emphasis">
                                        <v-icon icon="mdi-barcode" start />
                                        <span>{{ value }}</span>
                                    </div>
                                </template>


                                <template v-slot:item.batteryHealth="{ value }">
                                    <div :style="{'color': batteryTextColor(value)}">
                                        <v-icon :icon="batteryIcon(value)" start />
                                        <span>{{ value }}</span>
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

const batteryIcon = (level: number) => {
    const roundedLevel = Math.floor(level / 10) * 10
    if (roundedLevel === 0) return 'mdi-battery-outline'
    return `mdi-battery-${roundedLevel}`
}
const batteryTextColor = (level: number) => {
    const roundedLevel = Math.floor(level / 10) * 10
    if (roundedLevel > 75) return 'green'
    else if (roundedLevel > 50) return 'yellow'
    else if (roundedLevel > 25) return 'orange'
    else return 'red'
}

onMounted(() => {
    batteryStore.fetchAllData()
})
</script>