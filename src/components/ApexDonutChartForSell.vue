<template>
  <div style="max-height: 480px; float: left" v-if="chartOptions.series.length">
    <apexchart
        style="float: left"
        type="donut"
        width="460"
        :options="chartOptions"
        :series="chartOptions.series">

    </apexchart>

    <apexchart
        style="float: left"
        type="donut"
        width="520"
        :options="chartOptions2"
        :series="chartOptions2.series">
    </apexchart>
  </div>
</template>


<script setup lang="ts">

import {onMounted, ref} from "vue";
import {useWarehousStore} from "@/stores/warehousStore";

const warehousStore = useWarehousStore()

const chartOptions = ref({
  dataLabels: {enabled: false},
  chart: {type: 'donut'},
  stroke: {width: 0},
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          name: {
            formatter: function () {
              return 'а/м'
            }
          },
          value: {
            formatter: function (val) {
              return (+val).toLocaleString('ru-RU')
            }
          },
          total: {
            showAlways: true, show: true,
            formatter: function (val) {
              return val.globals.seriesTotals.reduce((a, b) => {
                return a + b
              }, 0).toLocaleString('ru-RU')
            }
          },
        }
      }
    }
  },
  series: ref([]),
  theme: {palette: 'palette7'}
})
const chartOptions2 = ref({
  dataLabels: {enabled: false},
  chart: {type: 'donut'},
  stroke: {width: 0},
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          name: {
            formatter: function () {
              return 'тыс.руб'
            }
          },
          value: {
            formatter: function (val) {
              return (+val).toLocaleString('ru-RU')
            }
          },
          total: {
            showAlways: true, show: true,
            formatter: function (val) {
              return val.globals.seriesTotals.reduce((a, b) => {
                return a + b
              }, 0).toLocaleString('ru-RU')
            }
          },
        }
      }
    }
  },
  series: ref([]),
  theme: {palette: 'palette5'}
})

const data = {
  "chart": {
    "autoCount": 67120,
    "autoPrice": 27519036.0,
    "items": [
      {
        "category": "0-15 дн.",
        "count": 977,
        "price": 397825.0,
        "lowCreateDatePeriod": "07.04.2024",
        "highCreateDatePeriod": "22.04.2024"
      },
      {
        "category": "16-30 дн.",
        "count": 1213,
        "price": 584905.0,
        "lowCreateDatePeriod": "23.03.2024",
        "highCreateDatePeriod": "07.04.2024"
      },
      {
        "category": "31-45 дн.",
        "count": 925,
        "price": 442763.0,
        "lowCreateDatePeriod": "08.03.2024",
        "highCreateDatePeriod": "23.03.2024"
      },
      {
        "category": "46-60 дн.",
        "count": 993,
        "price": 494808.0,
        "lowCreateDatePeriod": "22.02.2024",
        "highCreateDatePeriod": "08.03.2024"
      },
      {
        "category": "60+ дн.",
        "count": 63012,
        "price": 25598735.0,
        "lowCreateDatePeriod": "01.01.2016",
        "highCreateDatePeriod": "22.02.2024"
      }
    ]
  }
}


function getData() {
  warehousStore.getCharts().then(res => {

    chartOptions.value.labels = []
    chartOptions.value.series = []
    chartOptions2.value.labels = []
    chartOptions2.value.series = []

    res.chart && res.chart.items.forEach(el => {
      chartOptions.value.labels.push(el.category + ' &nbsp; &nbsp; <b>' + el.count.toLocaleString('ru-RU') + ' a/м</b>')
      chartOptions.value.series.push(el.count)

      chartOptions2.value.labels.push(el.category + ' &nbsp; &nbsp; <b>' + el.price.toLocaleString('ru-RU') + ' тыс.р</b>')
      chartOptions2.value.series.push(el.price)
    })
  })
}

onMounted(() => {
  getData()
})

</script>