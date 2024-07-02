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
              @change="chosenVin(newDeal.auto.vin)"
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
          <el-form-item prop="mileageAuto" style="display: table-cell"
                        :rules="{required: true, message: 'Пробег автомобиля', trigger: ['change']}">
            <el-input v-model="newDeal.mileageAuto" placeholder="Введите пробег"
                      maxlength="6"
                      type="number"
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
              <el-form-item prop="auto['bodyColorId']" style="display: inline-block; margin: 0 !important;"
                            :rules="{required: true, message: 'Цвет', trigger: ['change']}">
                <el-select
                  style="width: 200px"
                  v-model="newDeal.auto.bodyColorId"
                  :filterable="!globalStore.isMobileView"
                  clearable
                  @change="changeColor(newDeal.auto.bodyColorId)"
                >
                  <el-option v-for="color in colors" :key="color.id" :label="color.colorName" :value="color.id" />
                </el-select>
              </el-form-item>
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
              <el-form-item prop="dealType" style="display: inline-block; margin: 0 !important;"
                            :rules="{required: true, message: 'Тип оценки', trigger: ['change']}">
                <el-select
                  style="width: 200px"
                  v-model="newDeal.dealType"
                  placeholder="Выберите тип оценки">
                  <el-option v-for="item in dealType" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </div>

            <div>
              <label class="label-right l_150">Двигатель родной</label>
              <el-form-item prop="auto['isNativeEngine']" style="display: inline-block; margin: 0 !important;"
                            :rules="{required: true, message: 'Двигатель родной', trigger: ['change']}">
                <el-radio-group v-model="newDeal.auto.isNativeEngine" @change="changeEngine()"
                                size="small">
                  <el-radio-button label="Да" value="true" />
                  <el-radio-button label="Нет" value="false" />
                </el-radio-group>
              </el-form-item>
            </div>

            <div>
              <label class="label-right l_150">Двиг.Зарегистрирован</label>
              <el-form-item prop="auto['isRegisteredEngine']" style="display: inline-block; margin: 0 !important;"
                            :rules="{required: true, message: 'Двиг.Зарегистрирован', trigger: ['change']}">
                <el-radio-group v-model="newDeal.auto.isRegisteredEngine" size="small">
                  <el-radio-button label="Да" value="true" />
                  <el-radio-button label="Нет" value="false" />
                </el-radio-group>
              </el-form-item>
            </div>

            <div>
              <label class="label-right l_150">Категория автомобиля</label>
              <el-select
                style="width: 200px"
                v-model="newDeal.auto.categoryAuto"
                placeholder="Выберите поколение">
                <el-option v-for="item in CategoryAuto" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </div>

            <div>
              <label class="label-right l_150">Руль</label>
              <el-form-item prop="auto['steeringWheelType']" style="display: inline-block; margin: 0 !important;"
                            :rules="{required: true, message: 'Руль', trigger: ['change']}">
                <el-select
                  style="width: 200px"
                  v-model="newDeal.auto.steeringWheelType"
                  placeholder="Выберите поколение">
                  <el-option v-for="item in SteeringWheelType" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </div>

            <div>
              <label class="label-right l_150">Электронный ПТС?</label>
              <el-checkbox v-model="newDeal.auto.Elpts" />
            </div>

            <div v-if="!newDeal.auto.Elpts">
              <label class="label-right l_150">Номер ПТС</label>
              <el-form-item prop="auto['certificateNumber']" style="display: inline-block; margin: 0 !important;"
                            :rules="{required: true, message: 'Номер ПТС', trigger: ['change']}">
                <el-input v-model="newDeal.auto.certificateNumber" />
              </el-form-item>
            </div>

            <div v-if="!newDeal.auto.Elpts">
              <label class="label-right l_150">Дата выдачи ПТС</label>
              <el-date-picker
                class="auto-panel"
                v-model="newDeal.auto.issuedDateText"
                placeholder="Дату выдачи"
                :clearable="false"
              />
            </div>


            <div v-if="newDeal.auto.Elpts">
              <label class="label-right l_150">Номер ЭПТС</label>
              <el-input v-model="newDeal.auto.elCertificateNumber" />
            </div>

            <div v-if="newDeal.auto.Elpts">
              <label class="label-right l_150">Дата выдачи ЭПТС</label>
              <el-date-picker
                class="auto-panel"
                v-model="newDeal.auto.elCertificateIssuedDateText"
                placeholder="Дату выдачи"
                :clearable="false"
              />
            </div>


            <div>
              <label class="label-right l_150">ПТС выдан</label>
              <el-input v-model="newDeal.auto.issuedBy" />
            </div>

            <div>
              <label class="label-right l_150">Кол-во хозяев по ПТС
              </label>
              <el-form-item prop="auto['countHostsByVC']" style="display: inline-block; margin: 0 !important;"
                            :rules="{required: true, message: 'Количество хозяев по ПТС', trigger: ['change']}">
                <el-select
                  style="width: 200px"
                  v-model="newDeal.auto.countHostsByVC"
                  placeholder="Выберите количество">
                  <el-option v-for="item in [1,2,3,4,5,6,7,8,9,10]" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </div>

            <div>
              <label class="label-right l_150">Мощность л.с. по ПТС</label>
              <el-input v-model="newDeal.auto.enginePowerVC" />
            </div>

            <div>
              <label class="label-right l_150">Мощность л.с. по ПТС</label>
              <el-input v-model="newDeal.auto.enginePowerInKWByVC" />
            </div>

            <div>
              <label class="label-right l_150">Кол-во св. мест в ПТС</label>
              <el-input v-model="newDeal.auto.countFreeHostsByVC" />
            </div>

            <div>
              <label class="label-right l_150">ПТС оригинальный</label>
              <el-form-item prop="auto['isOriginalVC']" style="display: inline-block; margin: 0 !important;"
                            :rules="{required: true, message: 'ПТС оригинальный', trigger: ['change']}">
                <el-radio-group v-model="newDeal.auto.isOriginalVC" size="small">
                  <el-radio-button label="Да" value="true" />
                  <el-radio-button label="Нет" value="false" />
                </el-radio-group>
              </el-form-item>
            </div>

            <div>
              <label class="label-right l_150">Certified Pre-Owned</label>
              <el-form-item prop="auto['isCertifiedPreOwned']" style="display: inline-block; margin: 0 !important;"
                            :rules="{required: true, message: 'Certified Pre-Owned', trigger: ['change']}">
                <el-radio-group v-model="newDeal.auto.isCertifiedPreOwned" size="small">
                  <el-radio-button label="Да" value="true" />
                  <el-radio-button label="Нет" value="false" />
                </el-radio-group>
              </el-form-item>
            </div>


            <div>
              <el-input v-model="newDeal.auto.additionalInformation" type="textarea"
                        placeholder="Дополнительная информация" />
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
import { useAppealStore } from '@/stores/appealStore'
import { ElMessage, ElMessageBox } from 'element-plus'
import { checkEmptyFields, vetRegNumber } from '@/utils/globalFunctions'
import { CategoryAuto, SteeringWheelType } from '@/utils/globalConstants'

const closeModal = () => isOpen.value = false
const globalStore = useGlobalStore()
const appealStore = useAppealStore()
const adminStore = useAdminStore()
const smsText = ref('')
const smsTemplate = ref(null)
const smsDate = ref(null)
const isOpen = ref(false)
const newDeal = ref({
  dealStatus: 0,
  type: 0,
  lead: { leadType: 10 },
  auto: { vinNotExist: false, yearReleased: null, autoType: 10 },
  arrest: false
})
const brands = ref([])
const models = ref([])
const colors = ref([])
const svgColor = ref('white')
const autoTypes = ref(null)
const subtitle = ref('')
const carGenerations = ref([])
const carModifications = ref([])
const form = ref(null)
const dealType = [
  { id: 20, name: 'Trade-in' },
  { id: 40, name: 'Выкуп у физ. лица' },
  { id: 50, name: 'Выкуп у юр. лица' },
  { id: 60, name: 'A/м через салон' }
]
let cb = null
let row = null

function changeEngine() {
  let en = newDeal.value.auto.isNativeEngine === 'true'
  if (en) newDeal.value.auto.isRegisteredEngine = true
  else newDeal.value.auto.isRegisteredEngine = null
}

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
        newDeal.value.auto.carBrandId = res.carBrandId
        newDeal.value.auto.autoType = res.autoType
        if (res.carBrandId) changeBrand(res.carBrandId)
        newDeal.value.auto.carModelId = res.carModelId
        newDeal.value.auto.bodyColorId = res.bodyColorId
        svgColor.value = res.bodyColorCode
        newDeal.value.auto.categoryAuto = res.categoryAuto
        newDeal.value.auto.certificateNumber = res.certificateNumber
        newDeal.value.auto.countFreeHostsByVC = res.countFreeHostsByVC
        newDeal.value.auto.yearReleased = res.yearReleased
        newDeal.value.auto.vin = res.vin
        newDeal.value.auto.vinNotExist = res.vinNotExist
        newDeal.value.auto.steeringWheelType = res.steeringWheelType
        newDeal.value.auto.registrationMark = res.registrationMark
        newDeal.value.auto.modificationId = res.modificationId
        newDeal.value.auto.issuedDateText = res.issuedDateText
        newDeal.value.auto.issuedBy = res.issuedBy
        newDeal.value.auto.isRegisteredEngine = res.isRegisteredEngine
        newDeal.value.auto.isOriginalVC = res.isOriginalVC
        newDeal.value.auto.isNativeEngine = res.isNativeEngine
        newDeal.value.auto.Elpts = res.isElpts
        newDeal.value.auto.isCertifiedPreOwned = res.isCertifiedPreOwned
        newDeal.value.auto.generationId = res.generationId
        newDeal.value.auto.enginePowerVC = res.enginePowerVC
        newDeal.value.auto.enginePowerInKWByVC = res.enginePowerInKWByVC
        newDeal.value.auto.elCertificateNumber = res.elCertificateNumber
        newDeal.value.auto.elCertificateIssuedDateText = res.elCertificateIssuedDateText
        newDeal.value.auto.countHostsByVC = res.countHostsByVC
        newDeal.value.auto.additionalInformation = res.additionalInformation
      }

    })

  })
}


function open(_row: any, cbModal: Function) {
  row = _row
  cb = cbModal
  isOpen.value = true

  newDeal.value.parentEntityId = row.id
  if (!newDeal.value.auto) newDeal.value.auto = row.auto || {}

  if (row.yearReleased) newDeal.value.auto.yearReleased = new Date('' + row.yearReleased)
  if (row.carModelId) newDeal.value.auto.carModelId = row.carModelId

  globalStore.getServerTime().then(res => newDeal.value.dealInfoCollectStartTime = res.time)
  adminStore.getAutoTypes().then(res => autoTypes.value = res.items)
  globalStore.getBrands().then(res => brands.value = res).then(i => setBrand())
  globalStore.getColors().then(res => colors.value = res.items)
}

function setBrand() {
  if (!newDeal.value.auto || !newDeal.value.auto.carBrandId && row.carBrand) {
    let brand = brands.value.find(el => el.name === row.carBrand)
    if (brand) newDeal.value.auto.carBrandId = brand.id
  }
  changeBrand(newDeal.value.auto.carBrandId)
}

function changeBrand(id: number) {
  id && globalStore.getModels(id).then(res => {
    models.value = res

    chanheModel(row.carModelId || newDeal.value.auto.carModelId)
  })
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

    res && appealStore.saveCarDetails(newDeal.value).then(res => {
      console.log('???? res', res)
      // todo НУЖНО ОТКРЫТЬ сохраненное обещание
    })
  })
}

defineExpose({ open })

</script>