<template>
  <!--  :title="'Автомобиль: '+auto.carBrand+ ' ' + auto.carModel"-->
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 360: 390"
            :top="50"
            :title="'Автомобиль. Детали.'"
            :subtitle="subtitle"
            draggable>
    <el-scrollbar :maxHeight="globalStore.isMobileView?'500px':'600px'">
      <el-form ref="form" :model="newDeal" class="error-to-message">
        <svg xmlns="http://www.w3.org/2000/svg" :width="globalStore.isMobileView?43:73"
             :height="globalStore.isMobileView?43:73" viewBox="0 0 24 24"
             style="position: absolute" :style="{fill:svgColor}">
          <path
            d="M23.5 7c.276 0 .5.224.5.5v.511c0 .793-.926.989-1.616.989l-1.086-2h2.202zm-1.441 3.506c.639 1.186.946 2.252.946 3.666 0 1.37-.397 2.533-1.005 3.981v1.847c0 .552-.448 1-1 1h-1.5c-.552 0-1-.448-1-1v-1h-13v1c0 .552-.448 1-1 1h-1.5c-.552 0-1-.448-1-1v-1.847c-.608-1.448-1.005-2.611-1.005-3.981 0-1.414.307-2.48.946-3.666.829-1.537 1.851-3.453 2.93-5.252.828-1.382 1.262-1.707 2.278-1.889 1.532-.275 2.918-.365 4.851-.365s3.319.09 4.851.365c1.016.182 1.45.507 2.278 1.889 1.079 1.799 2.101 3.715 2.93 5.252zm-16.059 2.994c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zm10 1c0-.276-.224-.5-.5-.5h-7c-.276 0-.5.224-.5.5s.224.5.5.5h7c.276 0 .5-.224.5-.5zm2.941-5.527s-.74-1.826-1.631-3.142c-.202-.298-.515-.502-.869-.566-1.511-.272-2.835-.359-4.441-.359s-2.93.087-4.441.359c-.354.063-.667.267-.869.566-.891 1.315-1.631 3.142-1.631 3.142 1.64.313 4.309.497 6.941.497s5.301-.184 6.941-.497zm2.059 4.527c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zm-18.298-6.5h-2.202c-.276 0-.5.224-.5.5v.511c0 .793.926.989 1.616.989l1.086-2z" />
        </svg>


        <small>
          <label class="label-right l_150">VIN</label>

          <el-form-item prop="auto['vin']"
                        style="display: table-cell"
                        :rules="{required: true, message: 'VIN', trigger: ['change']}">
            <el-input
              v-model="newDeal.auto.vin"
              @keyup.enter="chosenVin(newDeal.auto.vin)"
              maxlength="17"
              minlength="17"
              clearable
            />
          </el-form-item>
        </small>

        <small>
          <label class="label-right l_150"></label>
          <el-checkbox v-model="newDeal.auto.vinNotExist" label="VIN отсутствует" />
        </small>
        <br>
        <small>
          <label class="label-right l_150">Тип ТС</label>
          <el-select
            style="width: 200px"
            v-model="newDeal.auto.autoType"
            :filterable="!globalStore.isMobileView"
            @change="changeBrand(newDeal.auto.carBrandId)"
            clearable
          >
            <el-option v-for="type in autoTypes" :key="type.value" :label="type.title" :value="type.value" />
          </el-select>
        </small>

        <small>
          <label class="label-right l_150">Марка</label>
          <el-select
            style="width: 200px"
            placeholder="Выберите бренд"
            v-model="newDeal.auto.carBrandId"
            :filterable="!globalStore.isMobileView"
            @change="changeBrand(newDeal.auto.carBrandId)"
            clearable
          >
            <el-option v-for="brand in brands" :key="brand.id" :label="brand.name" :value="brand.id" />
          </el-select>
        </small>

        <small v-if="newDeal.auto.carBrandId">
          <label class="label-right l_150">Модель</label>
          <el-select
            style="width: 200px"

            v-model="newDeal.auto.carModelId"
            :filterable="!globalStore.isMobileView"
            @change="chanheModel(newDeal.auto.carModelId)"
            placeholder="Выберите модель">
            <el-option v-for="item in models" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </small>


        <small>
          <label class="label-right l_150">Год выпуска</label>
          <el-date-picker
            class="auto-panel"
            v-model="newDeal.auto.yearReleased"
            placeholder="Выберите год"
            type="year"
            :clearable="false"
          />
        </small>


        <small>
          <label class="label-right l_150">Пробег автомобиля</label>
          <el-form-item prop="mileageAuto"
                        style="display: table-cell"
                        :rules="{required: true, message: 'Пробег автомобиля', trigger: ['change']}">
            <el-input v-model="newDeal.mileageAuto" placeholder="Введите пробег"
                      title="Пробег" />
          </el-form-item>
        </small>

        <small>
          <span class="label-right l_150">Гос номер</span>
          <el-form-item prop="auto['registrationMark']"
                        style="display: table-cell"
                        :rules="{required: true, message: 'Гос номер', trigger: ['change']}">
            <el-input v-model="newDeal.auto.registrationMark"
                      @input="changeRegistartionMark(newDeal.auto.registrationMark)"
                      style="text-transform: uppercase"
                      placeholder="X 000 XX 000"
                      maxlength="12"
            />
          </el-form-item>
        </small>


        <el-collapse class="no-color-collapse">
          <el-collapse-item title=" &nbsp Детали . . . " name="1">


            <div>
              <label class="label-right l_150">Цвет</label>
              <el-select
                style="width: 200px"
                v-model="newDeal.auto.bodyColorId"
                :filterable="!globalStore.isMobileView"
                clearable
                @change="changeColor(newDeal.auto.bodyColorId)"
              >
                <el-option v-for="color in colors" :key="color.id" :label="color.colorName" :value="color.id" />
              </el-select>
            </div>

            <div v-if="newDeal.auto.carModelId">
              <label class="label-right l_150">Поколение</label>
              <el-select
                style="width: 200px"
                v-model="newDeal.auto.generationId"
                @change="getModifications(newDeal.auto.generationId)"
                placeholder="Выберите поколение">
                <el-option v-for="item in carGenerations" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </div>

            <div>
              <label class="label-right l_150">Модификация</label>
              <el-select
                style="width: 200px"
                v-model="newDeal.auto.modificationId"
                placeholder="Выберите поколение">
                <el-option v-for="item in carModifications" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </div>

            <div>
              <label class="label-right l_150">Тип оценки</label>
              <el-select
                style="width: 200px"
                v-model="newDeal.dealType"
                placeholder="Выберите поколение">
                <el-option v-for="item in dealType" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </div>

            <div>
              <label class="label-right l_150">Двигатель родной</label>
              <el-radio-group v-model="newDeal.auto.isNativeEngine" size="small">
                <el-radio-button label="Да" value="true" />
                <el-radio-button label="Нет" value="false" />
              </el-radio-group>
            </div>

            <div>
              <label class="label-right l_150">Двигатель зарегистрирован</label>
              <el-radio-group v-model="newDeal.auto.isRegisteredEngine" size="small">
                <el-radio-button label="Да" value="true" />
                <el-radio-button label="Нет" value="false" />
              </el-radio-group>
            </div>


            <div>
              <el-input v-model="smsText" type="textarea" placeholder="Дополнительная информация" />
            </div>


          </el-collapse-item>

        </el-collapse>


        <br>
      </el-form>
    </el-scrollbar>
    <div style="text-align: right">
      <el-button type="danger" @click="save()">Сохранить</el-button>
      <el-button type="info" @click="clear()">Отмена</el-button>
    </div>
  </AppModal>
</template>


<script setup lang="ts">

import { ref } from 'vue'
import AppModal from '@/components/AppModal.vue'
import { useGlobalStore } from '@/stores/globalStore'
import { useAdminStore } from '@/stores/adminStore'
import { useDesktopStore } from '@/stores/desktopStore'
import { ElMessage, ElMessageBox } from 'element-plus'
import { checkEmptyFields, vetRegNumber } from '@/utils/globalFunctions'

const closeModal = () => isOpen.value = false
const globalStore = useGlobalStore()
const adminStore = useAdminStore()
const smsText = ref('')
const smsTemplates = ref([])
const smsTemplate = ref(null)
const smsDate = ref(null)
const isOpen = ref(false)
const newDeal = ref({auto:{ yearReleased: '' }})
const brands = ref([])
const models = ref([])
const colors = ref([])
const svgColor = ref('white')
const autoTypes = ref(null)
const subtitle = ref('')
const carGenerations = ref([])
const carModifications = ref([])
const serverTime = ref('')
const form = ref(null)
const dealType = [
  { id: 20, name: 'Trade-in' },
  { id: 40, name: 'Выкуп у физ. лица' },
  { id: 50, name: 'Выкуп у юр. лица' },
  { id: 60, name: 'A/м через салон' }
]
let cb = null

function changeRegistartionMark(name: string) {
  // eslint-disable-next-line vue/no-mutating-props
  newDeal.value.auto.registrationMark = vetRegNumber(name)
}

function chosenVin(vin: string) {
  if (vin.length < 17) return ElMessage.warning('VIN должен иметь не менее 17 знаков')
  useDesktopStore().getAutoVIN(vin).then(res => {
    if (res.autoId) ElMessageBox.confirm('Автомобиль с текущим VIN существует. Заменить?', '', {
      confirmButtonText: 'Да',
      cancelButtonText: 'Нет'
    }).then(yes => {
      if (yes) {
        newDeal.value.auto.autoType = res.autoType
        newDeal.value.auto.bodyColorId = res.bodyColorId
        svgColor.value = res.bodyColorCode
        subtitle.value = res.additionalInformation
        newDeal.value.auto.carBrandId = res.carBrandId
        newDeal.value.auto.carModelId = res.carModelId
        newDeal.value.auto.yearReleased = new Date(res.yearReleased)
      }

    })

  })
}


function open(row: any, cbModal: Function) {
  console.log('row = ', row)
  cb = cbModal

  newDeal.value.auto = row.auto || {}
  if (row.yearReleased) newDeal.value.auto.yearReleased = new Date('' + row.yearReleased)


  isOpen.value = true

  globalStore.getServerTime().then(res => {
    serverTime.value = res.time
  })

  useAdminStore().getAutoTypes().then(res => {
    autoTypes.value = res.items
  })

  function setBrand() {
    if (!newDeal.value.auto.carBrandId && newDeal.value.auto.carBrand) {
      let brand = brands.value.find(el => el.name === newDeal.value.auto.carBrand)
      if (brand) newDeal.value.auto.carBrandId = brand.id
    }
    changeBrand(newDeal.value.auto.carBrandId)
    if (newDeal.value.auto.carModelId) chanheModel(newDeal.value.auto.carModelId)
    if (newDeal.value.auto.generationId) getModifications(newDeal.value.auto.generationId)
  }

  globalStore.getBrands().then(res => brands.value = res).then(i => setBrand())
  globalStore.getColors().then(res => colors.value = res.items)



}

function changeBrand(id: number) {
  id && globalStore.getModels(id).then(res => models.value = res)
}

function chanheModel(modelId: number) {
  useAdminStore().getGenerations(modelId).then(res => carGenerations.value = res)
}

function getModifications(ids) {
  adminStore.getModifications([ids]).then(res => carModifications.value = res)
}


function clear() {
  smsTemplate.value = null
  smsText.value = ''
  smsDate.value = null
  isOpen.value = false
}


function changeTeplate() {
  console.log('030303 todo')
}

function changeColor(colorId: number) {
  if (!colorId) return false
  let c = colors.value.find(el => el.id === colorId)
  if (c) svgColor.value = c.colorCode
}

function check() {
  // if (smsDate.value < new Date()) return ElMessage({message: 'Выбранная дата меньше текущей', type: 'warning'})
}


function save() {
  checkEmptyFields(form.value).then(res => {

    console.log('ЭТО НЕ СОХРАНЯЕТСЯ ПОКА TODO \n newDeal.value', newDeal.value)
  })
}

defineExpose({ open })

</script>