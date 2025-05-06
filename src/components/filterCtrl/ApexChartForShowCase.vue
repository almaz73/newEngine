<template>
  <div style="margin-left: 22px" v-if="chartOptions.series.length">
    <apexchart
      type="donut"
      width="450"
      height="530"
      :options="chartOptions"
      :series="chartOptions.series">
    </apexchart>
  </div>
</template>


<script setup lang="ts">

import { onMounted, ref, watchEffect } from 'vue'

const { currentDataForDiagram } = defineProps(['currentDataForDiagram'])
const chartOptions = ref({
  dataLabels: { enabled: false },
  chart: { type: 'donut' },
  stroke: { width: 0 },
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          name: {
            formatter: function(val: string) {
              if (val === 'Total') val = 'Всего'
              return val
            }
          },
          total: {
            showAlways: true, show: true
          }
        }
      }
    }
  },
  series: ref([]),
  theme: { palette: 'palette7' },
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    markers: {
      size: 5,
      strokeWidth: 0,
      offsetX: -3
    }
  }
})


watchEffect(() => {
  getData(currentDataForDiagram)
})



function getData(data: any) {
  chartOptions.value.labels = []
  chartOptions.value.series = []

  setTimeout(() => {
    data && data.length && data.forEach(el => {
      chartOptions.value.labels.push(el.name)
      chartOptions.value.series.push(el.count)
    })
  })
}

onMounted(() => {
  getData()
})

</script>