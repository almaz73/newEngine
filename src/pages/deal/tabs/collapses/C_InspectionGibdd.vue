<template>
  <div style="margin-left: 30px">
    <el-checkbox v-model="gibdd.type10">
      Сведения о периодах регистрации
    </el-checkbox>
    <div v-if="gibdd.text10" v-html="gibdd.text10"></div>
    <br>

    <el-checkbox v-model="gibdd.type20">
      Проверка на участие в ДТП"
    </el-checkbox>
    <div v-if="gibdd.text20" v-html="gibdd.text20"></div>
    <br>

    <el-checkbox v-model="gibdd.type30">
      Сведения о розыске"
    </el-checkbox>
    <div v-if="gibdd.text30" v-html="gibdd.text30"></div>
    <br>

    <el-checkbox v-model="gibdd.type40">
      Сведения об ограничениях"
    </el-checkbox>
    <div v-if="gibdd.text40" v-html="gibdd.text40"></div>
    <br>

    <el-button type="primary" @click="getCapcha()"> Получить данные</el-button>
    <br /><br />
  </div>
  <C_InspectionGibddModal ref="c_InspectionGibddModal" :gibdd="gibdd" />
</template>

<style>
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { useDealStore } from '@/stores/dealStore'
import C_InspectionGibddModal from '@/pages/deal/tabs/collapses/C_InspectionGibddModal.vue'
import { ElMessage } from 'element-plus'

const dealStore = useDealStore()
const gibdd = ref({
  captcha: '', token: '', text10: '',
  text20: '', text30: '', text40: '',
  captcha_num: null, vin: ''
})
const c_InspectionGibddModal = ref(null)

function open() {
  getGibddMemory()


}

// получить сохранные на сервере данные гибдд
function getGibddMemory() {
  [10, 20, 30, 40].forEach(type => {
    dealStore.getGibddCache(type, dealStore.deal.auto.vin).then(res => {
      putData(res.data, type)
      getFieldsWithoutData(res.data, type)
    })
  })
}

// отментим поля с неимеющимися данными по гибдд
function getFieldsWithoutData(data, type) {
  if (!data.vin) {
    gibdd.value['type' + type] = true
  }
}

function putData(data: any, type: number) {
  if (data.status === undefined) return ElMessage.warning(data.message)

  let html10 = '', html20 = '', html30 = '', html40 = ''

  switch (type) {
    case 10: //Сведения о периодах регистрации
      html10 = 'Не найдена информация о регистрации транспортного средства'
      if (data.requestResult && data.requestResult.ownerShipPeriods && data.requestResult.ownerShipPeriods.ownerShipPeriod) {
        html10 = ''
        data.requestResult.ownerShipPeriods.ownerShipPeriod.forEach((el: any) => {
          html10 += 'C ' + new Date(el.from).toLocaleDateString() + (el.to ? '  до ' + new Date(el.to).toLocaleDateString() : ' по настоящее время') +
            ': &nbsp; ' + el.simplePersonType + '<br>'
        })
        if (data.status === 200) html10 += '<span style="color:green">Регистрация действующая</span><br>'
      }
      gibdd.value.text10 = html10 + '<br><small>Aктуальность на: ' + (data.requestTime || '') + '</small>'
      break
    case 20: //Проверка на участие в ДТП
      html20 = 'нет информации<br>'
      if (data.requestResult && data.requestResult.accidents && data.requestResult.accidents.length) {
        html20 = ''
        data.requestResult.accidents.forEach((el: any) => {
          html20 += el.accidentDateTime + ':  '
            + '<span style="color:red">' + el.accidentType + '</span>  (' + el.vehicleDamageState + ') <br>' + el.accidentPlace + '<br>'
        })
      }
      gibdd.value.text20 = html20 + '<small>Aктуальность на: ' + (data.requestTime || '') + '</small>'
      break
    case 30: //Сведения о розыске
      html30 = 'Не найдена информация о розыске транспортного средства.<br>'
      if (data.requestResult && data.requestResult.records) {
        if (data.requestResult.records.length) {
          html30 = '<span style="color:red">Транспортное средство в розыске</span><br>'
        } else html30 = 'Не найдена информация о розыске<br>'
      }
      gibdd.value.text30 = html30 + '<small>Aктуальность на: ' + (data.requestTime || '') + '</small>'
      break
    case 40: //Сведения об ограничениях
      html40 = 'Не найдена информация о наложении ' +
        'ограничений на регистрационные действия с транспортным средством.<br>'
      if (data.requestResult && data.requestResult.records && data.requestResult.records.length) {
        html40 = ''
        data.requestResult.records.forEach((el: any) => {
          html40 += '<span style="color:red">Дата наложения ограничения: ' + el.dateadd + '</span><br>' +
            'Регион инициатора ограничения: ' + el.regname + '<br>' +
            'Телефон инициатора: ' + el.phone + '<br>' +
            'Основание: <i>' + el.osnOgr + '</i><br>'
        })
      }
      gibdd.value.text40 = html40 + '<small>Aктуальность на: ' + (data.requestTime || '') + '</small>'
  }
}


function getCapcha(upd) {
  // gibdd.value.token = 'egCgGpE+A89sCtBFeb0GdKeRW3N8auyFhpLKPr4TMcO8ul3/Vz1TrQ=='
  // gibdd.value.captcha = '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'


  if (upd || !gibdd.value.captcha) {
    gibdd.value.captcha = ''
    gibdd.value.token = ''

    dealStore.getGibddCaptcha().then(res => {
      let { base64jpg, token } = res.data
      gibdd.value.captcha = base64jpg
      gibdd.value.token = token
    })
  }

  c_InspectionGibddModal.value.open(getGibddDataWithVin, getCapcha)
}

function getGibddDataWithVin() {
  // $scope.gibdd.isShowCaptcha = false
  [10, 20, 30, 40].forEach(type => {
    ///if если галочка
    let params = {
      vin: dealStore.deal.auto.vin,
      type,
      captcha: gibdd.value.captcha_num,
      captchaToken: gibdd.value.token
    }

    dealStore.getDataByParams(params).then(res => {
      putData(res.data, type)
    })
  })
}


defineExpose({ open })

</script>
