<template>
  <div>
    <div class="boxes">
      <div>
        <el-checkbox v-model="gibdd.type10">
          Сведения о периодах регистрации
        </el-checkbox>
        <div v-if="gibdd.text10" v-html="gibdd.text10"></div>
        <br>
      </div>
      <div>
        <el-checkbox v-model="gibdd.type20">
          Проверка на участие в ДТП"
        </el-checkbox>
        <div v-if="gibdd.text20" v-html="gibdd.text20"></div>
        <br>
      </div>
      <div>
        <el-checkbox v-model="gibdd.type30">
          Сведения о розыске"
        </el-checkbox>
        <div v-if="gibdd.text30" v-html="gibdd.text30"></div>
        <br>
      </div>
      <div>
        <el-checkbox v-model="gibdd.type40">
          Сведения об ограничениях"
        </el-checkbox>
        <div v-if="gibdd.text40" v-html="gibdd.text40"></div>
        <br>
      </div>
    </div>
    <el-button type="primary" @click="getCapcha()"> Получить данные</el-button>
    <br/><br/>
  </div>
  <C_InspectionGibddModal ref="c_InspectionGibddModal" :gibdd="gibdd"/>
</template>

<style scoped>
.boxes {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap
}

.boxes > div {
  border: 4px solid #ddd;
  width: 300px;
  padding: 5px 20px;
  margin-bottom: 12px;
}
</style>

<script setup lang="ts">
import {ref} from 'vue'
import {useDealStore} from '@/stores/dealStore'
import C_InspectionGibddModal from '@/pages/deal/tabs/collapses/C_InspectionGibddModal.vue'
import {ElMessage} from 'element-plus'

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


// отментим поля с неимеющимися данными по гибдд

function getFieldsWithoutData(data: any, type: number) {
  gibdd.value['type' + type] = !data || !data.vin
}

function putData(res: any, type: number) {
  let data = res.data
  if (!data) {
    if (res.code === 'ERR_BAD_RESPONSE') gibdd.value['type' + type] = true
    return false
  }

  if (!data.vin && !data.requestResult && data.message) return ElMessage.warning(data.message)

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


function getCapcha(upd: string) {

  let count = 0;
  [10, 20, 30, 40].forEach(type => gibdd.value['type' + type] && count++)
  if (!count) return ElMessage({message: 'Ничего не выбрано для обновления', type: 'warning'})


  if (upd || !gibdd.value.captcha) {
    gibdd.value.captcha = ''
    gibdd.value.token = ''

    dealStore.getGibddCaptcha().then(res => {
      let {base64jpg, token} = res.data
      gibdd.value.captcha = base64jpg
      gibdd.value.token = token
    })
  }

  c_InspectionGibddModal.value.open(getGibddDataWithVin, getCapcha)
}

// получить сохранные на сервере данные гибдд
function getGibddMemory() {
  [10, 20, 30, 40].forEach(type => {
    dealStore.getGibddCache(type, dealStore.deal.auto.vin).then(res => {
      putData(res, type)
      getFieldsWithoutData(res.data, type)
    })
  })
}

function getGibddDataWithVin() {
  [10, 20, 30, 40].forEach(type => {
    if (gibdd.value['type' + type]) {  // данные запрашиваем если галочка
      let params = {
        vin: dealStore.deal.auto.vin,
        type,
        captcha: gibdd.value.captcha_num,
        captchaToken: gibdd.value.token
      }

      dealStore.getDataByParams(params).then(res => {
        putData(res, type)
        getFieldsWithoutData(res.data, type)
      })
    }
  })
}


defineExpose({open})

</script>
