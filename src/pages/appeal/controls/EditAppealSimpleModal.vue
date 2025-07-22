<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 360: 480"
            :top="50"
            :title="'Редактирование обращения'"
            draggable>
    <div>
      <label class="label l_200">Марка</label>
      <el-select
          style="width: 220px"
          placeholder="Выберите бренд"
          v-model="appealEditModal.carModel.brand"
          :filterable="!globalStore.isMobileView"
          @change="changeBrand(appealEditModal.carModel.brand)"
      >
        <el-option v-for="brand in brands" :key="brand.id" :label="brand.name" :value="brand.id"/>
      </el-select>
    </div>

    <div v-if="appealEditModal.carModel.brand">
      <label class="label l_200">Модель</label>
      <el-select
          style="width: 220px"
          v-model="appealEditModal.carModel.id"
          :filterable="!globalStore.isMobileView"
          placeholder="Выберите модель">
        <el-option v-for="item in models" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
    </div>
    <div v-if="!editByResponsible()">
      <label class="label l_200">Место хранения</label>
      <el-select
          style="width: 220px"
          placeholder="Введите место"
          v-model="appealEditModal.location.id"
          filterable>
        <el-option v-for="item in locations" :key="item.id" :label="item.title" :value="item.id"/>
      </el-select>
    </div>

    <div v-if="!editByResponsible() && appealEditModal.buyCategory">
      <label class="label l_200">Вид выкупа</label>
      <el-select
          style="width: 220px"
          placeholder="Выберите вид"
          v-model="appealEditModal.buyCategory"
      >
        <el-option v-for="type in BuyCategoryTypes" :key="type.id" :label="type.title" :value="type.id"/>
      </el-select>
    </div>

    <div v-if="!editByResponsible() && appealEditModal.tradeInDirectionType">
      <label class="label l_200">Тип направления</label>
      <el-select
          style="width: 220px"
          placeholder="Выберите тип"
          v-model="appealEditModal.tradeInDirectionType">
        <el-option v-for="type in tradeinDirectionTypes" :key="type.id" :label="type.title" :value="type.value"/>
      </el-select>
    </div>

    <div v-if="!editByResponsible()">
      <label class="label l_200">Ответственный</label>
      <el-select style="width: 220px" v-model="appealEditModal.responsible.id" filterable>
        <el-option v-for="item in responsible" :key="item.id"
                   :label="item.person.lastName +' '+ item.person.firstName"
                   :value="item.id"/>
      </el-select>
    </div>

    <div v-if="!editByResponsible()">
      <label class="label l_200">Подменный номер ☎</label>
      <el-input v-model="appealEditModal.swapPhone" placeholder="Введите номер"/>
    </div>


    <div>
      <label class="label l_200">Ссылка</label>
      <el-input v-model="appealEditModal.communicationLink" placeholder="Добавьте ссылку"/>
      <a v-if="appealEditModal.communicationLink" :href="appealEditModal.communicationLink" target="_blank"> сайт</a>
    </div>

    <div>
      <label class="label l_200">Год</label>
      <el-select placeholder="Год выпуска"
                 style="width: 150px"
                 v-model="appealEditModal.year">
        <el-option v-for="item in Years" :key="item.name" :label="item.name" :value="item.name"/>
      </el-select>
    </div>

    <div>
      <label class="label l_200">Цвет кузова</label>
      <el-select placeholder="Цвет кузова"

                 style="width: 150px"
                 v-model="appealEditModal.bodyColorCode">
        <el-option v-for="item in colors" :key="item.id" :label="item.colorName" :value="item.colorCode"/>
      </el-select>
      <div
          style="display: inline-block;border-radius:50%;width:25px;height:25px;margin: 0 0 -7px 8px; border: 1px solid #bbb"
          :style="{'background': appealEditModal.bodyColorCode}">
      </div>
    </div>

    <br>
    <div>
      <el-button type="danger" @click="save()">Сохранить</el-button>
      <el-button type="info" @click="clear()">Отмена</el-button>
    </div>
  </AppModal>
</template>

<style>
.auto-panel .el-input__wrapper {
  width: 180px;
}

</style>


<script setup lang="ts">
import AppModal from '@/components/AppModal.vue'
import {ref} from 'vue'
import {useGlobalStore} from '@/stores/globalStore'
import {useReportStore} from '@/stores/reportStore'
import {useAppealStore} from '@/stores/appealStore'
import {useDesktopStore} from '@/stores/desktopStore'
import {Years} from "@/utils/globalConstants.ts";
import {ElMessage} from "element-plus";

const desktopStore = useDesktopStore()
const appealStore = useAppealStore()
const reportStore = useReportStore()
const closeModal = () => isOpen.value = false
const globalStore = useGlobalStore()
const smsText = ref('')
const smsTemplate = ref(null)
const smsDate = ref(null)
const isOpen = ref(false)
const auto = ref(null)
const brands = ref([])
const models = ref([])
const responsible = ref([])
const appealEditModal = ref({carModel: {}, location: {id: null}, responsible: {}})
const locations = ref([])
const colors = ref(null)
const BuyCategoryTypes = [
  {id: 10, title: 'Свободный выкуп'},
  {id: 20, title: 'Выездной выкуп'},
  {id: 30, title: 'Регион'},
  {id: 40, title: 'Fleet'}
]

const tradeinDirectionTypes = [{"value": 10, "title": "New car"}, {"value": 20, "title": "Used car"}]

globalStore.getColors().then((res) => {
  res.items.map(el => el.name = el.colorName)
  colors.value = res.items
})

function clear() {
  smsTemplate.value = null
  smsText.value = ''
  smsDate.value = null
  isOpen.value = false
}


function editByResponsible() {
  return (
      ['SalesManager', 'SalesEmployee', 'GenManager', 'Agent', 'Admin'].includes(globalStore.account.role)
      && globalStore.account.id == appealEditModal.value.responsible.id
  );
}


function open(appeal: any, communicationLink: any) {
  isOpen.value = true

  appealEditModal.value.id = appeal.id

  if (appeal.auto) {
    appealEditModal.value.carModel.brand = appeal.auto.carBrandId
    appealEditModal.value.carModel.id = appeal.carModelId
  } else {
    appealEditModal.value.carModel.id = appeal.carModelId
  }
  appealEditModal.value.swapPhone = appeal.swapPhone
  appealEditModal.value.responsible = appeal.responsibleUser
  if (!appeal.tradeInDirectionType) appealEditModal.value.buyCategory = appeal.buyCategory
  appealEditModal.value.tradeInDirectionType = appeal.tradeInDirectionType
  appealEditModal.value.communicationLink = communicationLink
  appealEditModal.value.year = appeal.yearReleased
  appealEditModal.value.bodyColorId = appeal.bodyColorId
  appealEditModal.value.bodyColorCode = appeal.bodyColorCode

  if (appeal.locationId) appealEditModal.value.location.id = appeal.locationId

  globalStore.getBrands().then(res => {
    brands.value = res
    let brandEl = brands.value.find(el => el.name === appeal.carBrand)
    if (brandEl) {
      appealEditModal.value.carModel.brand = brandEl.name
      changeBrand(brandEl.id)
    }
  })
  reportStore.getLocation({types: 10}).then(res => locations.value = res.items)
  appealStore.getResponsible(appeal.locationId).then(res => responsible.value = res.items)

}


function changeBrand(id: number) {
  id && globalStore.getModels(id).then(res => {
    models.value = res
  })
}

function save() {
  if (appealEditModal.value.communicationLink
      && !appealEditModal.value.communicationLink.includes('https://')) {
    return ElMessage.warning('Поле "Ссылка" должна начинаться с "https://"')
  }

  if (!appealEditModal.value.bodyColorCode) {
    return  ElMessage.warning('Поле "Цвет кузова" обязателен для заполнения')
  }
  appealEditModal.value.buyCategory = appealEditModal.value.buyCategory || null
  if (!appealEditModal.value.carModel || !appealEditModal.value.carModel.id) {
    return  ElMessage.warning('Поле "Модель" обязателен для заполнения')
  }
  
  let params = {
    buyCategory: appealEditModal.value.buyCategory,
    carModel: appealEditModal.value.carModel,
    id: appealEditModal.value.id,
    location: appealEditModal.value.location,
    responsible: {id: appealEditModal.value.responsible.id},
    swapPhone: appealEditModal.value.swapPhone,
    tradeInDirectionType: appealEditModal.value.tradeInDirectionType,
    communicationLink: appealEditModal.value.communicationLink,
    year: appealEditModal.value.year,
    bodyColorCode: appealEditModal.value.bodyColorCode,
    bodyColorId: colors.value.find(el=>el.colorCode === appealEditModal.value.bodyColorCode).id,
  }

  appealStore.saveEditAppealSimple(params).then(res => {
    if (res.status === 200) location.reload()
  })
}


defineExpose({open})

</script>