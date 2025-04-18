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
        clearable
      >
        <el-option v-for="brand in brands" :key="brand.id" :label="brand.name" :value="brand.id" />
      </el-select>
    </div>

    <div v-if="appealEditModal.carModel.brand">
      <label class="label l_200">Модель</label>
      <el-select
        style="width: 220px"
        v-model="appealEditModal.carModel.id"
        :filterable="!globalStore.isMobileView"
        placeholder="Выберите модель">
        <el-option v-for="item in models" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </div>

    <div>
      <label class="label l_200">Место хранения</label>
      <el-select
        style="width: 220px"
        placeholder="Введите место хранения/выкупа"
        v-model="appealEditModal.location.id"
        filterable
        clearable>
        <el-option v-for="item in locations" :key="item.id" :label="item.title" :value="item.id" />
      </el-select>
    </div>

    <div>
      <label class="label l_200">Вид выкупа</label>
      <el-select
        style="width: 220px"
        placeholder="Выберите бренд"
        v-model="appealEditModal.buyCategory"
        clearable
      >
        <el-option v-for="type in BuyCategoryTypes" :key="type.id" :label="type.title" :value="type.id" />
      </el-select>
    </div>

    <div>
      <label class="label l_200">Ответственный</label>
      <el-select style="width: 220px" v-model="appealEditModal.responsible.id" filterable>
        <el-option v-for="item in responsible" :key="item.id" :label="item.person.lastName +' '+ item.person.firstName"
                   :value="item.id" />
      </el-select>
    </div>

    <div>
      <label class="label l_200">Подменный номер ☎</label>
      <el-input v-model="appealEditModal.swapPhone" placeholder="Ваше имя" />
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
import { ref } from 'vue'
import { useGlobalStore } from '@/stores/globalStore'
import { useReportStore } from '@/stores/reportStore'
import { useAppealStore } from '@/stores/appealStore'
import { useDesktopStore } from '@/stores/desktopStore'

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
const appealEditModal = ref({ carModel: {}, location: {}, responsible: {} })
const locations = ref([])
const BuyCategoryTypes = ref([
  { id: 10, title: 'Свободный выкуп' },
  { id: 20, title: 'Выездной выкуп' },
  { id: 30, title: 'Регион' },
  { id: 40, title: 'Fleet' }
])


function clear() {
  smsTemplate.value = null
  smsText.value = ''
  smsDate.value = null
  isOpen.value = false
}


function save() {
  appealStore.saveEditAppealSimple(appealEditModal.value).then(res => {
    if (res.status === 200) location.reload()
  })
}

function open(appeal) {
  isOpen.value = true

  console.log('appeal', appeal)
  appealEditModal.value.id = appeal.id

  appealEditModal.value.carModel.brand = appeal.auto.carBrandId
  appealEditModal.value.carModel.id = appeal.auto.carModelId

  appealEditModal.value.swapPhone = appeal.swapPhone
  appealEditModal.value.responsible = appeal.responsibleUser.id
  appealEditModal.value.buyCategory = appeal.buyCategory
  appealEditModal.value.location.id = appeal.locationId


  globalStore.getBrands().then(res => {
    brands.value = res
    if (appealEditModal.value.carModel.brand) changeBrand(appealEditModal.value.carModel.brand)
  })
  reportStore.getLocation({ types: 10 }).then(res => locations.value = res.items)
  appealStore.getResponsible(appeal.locationId).then(res => responsible.value = res.items)

}


function changeBrand(id: number) {
  id && globalStore.getModels(id).then(res => models.value = res)
}

defineExpose({ open })

</script>