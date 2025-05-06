<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 390: 900"
            :top="40"
            :title="'Редактирование автомобиля'"
            draggable>
    <el-form ref="form" :model="newDeal" class="error-to-message">
      <el-scrollbar :maxHeight="globalStore.isMobileView?'520px':''">
        <div class="edit-car-column" style="display: flex; flex-wrap: wrap; justify-content: space-around">
          <div class="edit-car-column-to">
            <svg class="shadow"
                 xmlns="http://www.w3.org/2000/svg" :width="globalStore.isMobileView?43:73"
                 :height="globalStore.isMobileView?43:73" viewBox="0 0 24 24"

                 style="position: absolute" :style="{fill:svgColor}">
              <path
                d="M23.5 7c.276 0 .5.224.5.5v.511c0 .793-.926.989-1.616.989l-1.086-2h2.202zm-1.441 3.506c.639 1.186.946 2.252.946 3.666 0 1.37-.397 2.533-1.005 3.981v1.847c0 .552-.448 1-1 1h-1.5c-.552 0-1-.448-1-1v-1h-13v1c0 .552-.448 1-1 1h-1.5c-.552 0-1-.448-1-1v-1.847c-.608-1.448-1.005-2.611-1.005-3.981 0-1.414.307-2.48.946-3.666.829-1.537 1.851-3.453 2.93-5.252.828-1.382 1.262-1.707 2.278-1.889 1.532-.275 2.918-.365 4.851-.365s3.319.09 4.851.365c1.016.182 1.45.507 2.278 1.889 1.079 1.799 2.101 3.715 2.93 5.252zm-16.059 2.994c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zm10 1c0-.276-.224-.5-.5-.5h-7c-.276 0-.5.224-.5.5s.224.5.5.5h7c.276 0 .5-.224.5-.5zm2.941-5.527s-.74-1.826-1.631-3.142c-.202-.298-.515-.502-.869-.566-1.511-.272-2.835-.359-4.441-.359s-2.93.087-4.441.359c-.354.063-.667.267-.869.566-.891 1.315-1.631 3.142-1.631 3.142 1.64.313 4.309.497 6.941.497s5.301-.184 6.941-.497zm2.059 4.527c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zm-18.298-6.5h-2.202c-.276 0-.5.224-.5.5v.511c0 .793.926.989 1.616.989l1.086-2z" />
            </svg>


            <div>
              <label class="label-right l_150">VIN</label>
              <el-input
                v-model="newDeal.auto.vin"
                maxlength="17"
                minlength="17"
                clearable
              />
            </div>

            <div>
              <label class="label-right l_150"></label>
              <el-checkbox v-model="newDeal.auto.vinNotExist" label="VIN отсутствует" />
            </div>
            <br>
            <div>
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
            </div>

            <div>
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
            </div>

            <div v-if="newDeal.auto.carBrandId">
              <label class="label-right l_150">Модель</label>
              <el-select
                style="width: 200px"

                v-model="newDeal.auto.carModelId"
                :filterable="!globalStore.isMobileView"
                @change="changeModel(newDeal.auto.carModelId)"
                placeholder="Выберите модель">
                <el-option v-for="item in models" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </div>

            <div>
              <label class="label-right l_150">Год выпуска</label>
              <el-date-picker
                class="auto-panel"
                v-model="newDeal.auto.year"
                placeholder="Выберите год"
                type="year"
                :clearable="false"
              />
            </div>

            <div>
              <label class="label-right l_150">Тип кузова</label>
              <el-select
                style="width: 200px"
                v-model="newDeal.auto.bodyType"
                :filterable="!globalStore.isMobileView"
                placeholder="Выберите тип">
                <el-option v-for="item in bodyTypes" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </div>

            <div>
              <label class="label-right l_150">Кол-во дверей</label>
              <el-input v-model="newDeal.auto.doorsCount" />
            </div>

            <div>
              <label class="label-right l_150">Привод авто</label>
              <el-select
                style="width: 200px"
                v-model="newDeal.auto.driveType"
                :filterable="!globalStore.isMobileView"
                placeholder="Выберите привод">
                <el-option v-for="item in driveTypies" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </div>

            <div>
              <label class="label-right l_150">Тип двигателя</label>
              <el-select
                style="width: 200px"
                v-model="newDeal.auto.engineType"
                :filterable="!globalStore.isMobileView"
                placeholder="Выберите привод">
                <el-option v-for="item in EngineType" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </div>

            <div>
              <label class="label-right l_150">Мощность (л.с.)</label>
              <el-input v-model="newDeal.auto.enginePowerHP" />
            </div>


            <div>
              <label class="label-right l_150">Объем двигателя</label>
              <el-input v-model="newDeal.auto.engineCapacity" />
            </div>

            <div>
              <label class="label-right l_150">Тип КПП</label>
              <el-select
                style="width: 200px"
                v-model="newDeal.auto.gearboxType"
                :filterable="!globalStore.isMobileView"
                placeholder="Выберите привод">
                <el-option v-for="item in kpp" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </div>


            <div>
              <label class="label-right l_150">Пробег (км)</label>
              <el-form-item prop="auto['mileageAuto']" style="display: inline-block"
                            :rules="{required: true, message: 'Пробег автомобиля', trigger: ['change']}">
                <el-input v-model="newDeal.auto.mileageAuto" placeholder="Введите пробег"
                          maxlength="6"
                          type="number"
                          title="Пробег" />
              </el-form-item>
            </div>
            <div style="margin: -10px 0">
              <span class="label-right l_150">Гос номер</span>
              <el-form-item prop="auto['registrationMark']"
                            style="display: inline-block"
                            :rules="{required: true, message: 'Гос номер', trigger: ['change']}">
                <el-input v-model="newDeal.auto.registrationMark"
                          @input="changeRegistartionMark(newDeal.auto.registrationMark)"
                          style="text-transform: uppercase"
                          placeholder="X 000 XX 000"
                          maxlength="12"
                />
              </el-form-item>
            </div>

            <div>
              <label class="label-right l_150">Номер двигателя</label>
              <el-input v-model="newDeal.auto.engineBrandAndNumber" />
            </div>
          </div>

          <div class="edit-car-column-to">
            <div v-if="newDeal.auto.certificate">
              <label class="label-right l_150">Цвет</label>
                <el-select
                  style="width: 200px"
                  v-model="newDeal.auto.certificate.colorVCTitle"
                  :filterable="!globalStore.isMobileView"
                  clearable
                  @change="changeColor(newDeal.auto.certificate.colorVCTitle)"
                >
                  <el-option v-for="color in colors" :key="color.id" :label="color.colorName" :value="color.id" />
                </el-select>
            </div>

            <div>
              <label class="label-right l_150">Руль</label>
              <el-form-item prop="auto['steeringWheel']" style="display: inline-block; margin: 0 !important;"
                            :rules="{required: true, message: 'Руль', trigger: ['change']}">
                <el-select
                  style="width: 200px"
                  v-model="newDeal.auto.steeringWheel"
                  placeholder="Выберите руль">
                  <el-option v-for="item in SteeringWheelType" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </div>

            <div>
              <label class="label-right l_150">Категория</label>
              <el-select
                style="width: 200px"
                v-model="newDeal.auto.category"
                placeholder="Выберите категорию">
                <el-option v-for="item in CategoryAuto" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </div>

            <div v-if="newDeal.auto.certificate">
              <label class="label-right l_150"> Марка по ПТС</label>
              <el-autocomplete
                style="width: 200px"
                v-model="newDeal.auto.certificate.brandVCTitle"
                :fetch-suggestions="getCarBrand"
              />
            </div>

            <div v-if="newDeal.auto.certificate">
              <label class="label-right l_150"> Модель по ПТС</label>
              <el-autocomplete
                style="width: 200px"
                v-model="newDeal.auto.certificate.modelVCTitle"
                :fetch-suggestions="getCarModel"
              />
              <el-button :icon="Plus"
                         title="+ Добавить новую модель"
                         @click="saveNewBrand()"
                         @change="newDeal.auto.bodyColorByVC=''"
                         style="width: 30px; float: right; margin-right: -30px"></el-button>
            </div>

            <div>
              <label class="label-right l_150"> Цвет по ПТС</label>
              <el-autocomplete
                style="width: 200px"
                v-model="newDeal.auto.bodyColorByVC"
                :fetch-suggestions="getBodyColorAuto"
                @change="choseColorVC()"
                placeholder="Введите Цвет"
              />

              <el-button :icon="Plus"
                         title="+ Добавить новый цвет"
                         @click="saveBodycolor(newDeal.auto.bodyColorByVC)"
                         style="width: 30px; float: right; margin-right: -30px"></el-button>
            </div>

            <div>
              <label class="label-right l_150"> Объем двиг. ПТС</label>
              <el-input v-model="newDeal.auto.engineCapacityByVC" />
            </div>


            <div>
              <label class="label-right l_150">Электрон.ПТС?</label>
              <el-checkbox v-model="newDeal.auto.Elpts" />
            </div>

            <div v-if="!newDeal.auto.Elpts">
              <label class="label-right l_150">Номер ПТС</label>
              <el-form-item prop="auto.certificate['certificateNumber']" style="display: inline-block; margin: 0 !important;"
                            :rules="{required: true, message: 'Номер ПТС', trigger: ['change']}">
                <el-input v-model="newDeal.auto.certificate.certificateNumber" />
              </el-form-item>
            </div>

            <div>
              <label class="label-right l_150">Дата выдачи ПТС</label>
              <el-date-picker
                class="auto-panel"
                v-model="newDeal.auto.issuedDate"
                placeholder="Введите дату"
                :clearable="false"
                format="DD.MM.YYYY"
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
              <label class="label-right l_150">Владельцы ПТС
              </label>
              <el-form-item prop="auto['countHostsByVC']" style="display: inline-block; margin: 0 !important;"
                            :rules="{required: true, message: 'Количество хозяев по ПТС', trigger: ['change']}">
                <el-input v-model="newDeal.auto.countHostsByVC" />
              </el-form-item>
            </div>

            <div>
              <label class="label-right l_150">Мощн.ПТС л.с.</label>
              <el-input v-model="newDeal.auto.enginePowerVC" />
            </div>

            <div>
              <label class="label-right l_150">Мощн.ПТС кВт</label>
              <el-input v-model="newDeal.auto.enginePowerInKWByVC" />
            </div>

            <div>
              <label class="label-right l_150">ПТС оригинал</label>
              <el-form-item prop="auto['isOriginalVC']" style="display: inline-block; margin: 0 !important;"
                            :rules="{required: true, message: 'ПТС оригинальный', trigger: ['change']}">
                <el-radio-group v-model="newDeal.auto.isOriginalVC">
                  <el-radio-button label="Да" value="true" />
                  <el-radio-button label="Нет" value="false" />
                </el-radio-group>
              </el-form-item>
            </div>

          </div>
        </div>

        <div style="text-align: center; margin: 30px 0 0 ">
          <el-button type="danger" @click="save()">Сохранить</el-button>
          <el-button @click="$router.back()">Отмена</el-button>
        </div>
      </el-scrollbar>
    </el-form>
  </AppModal>
</template>
<style>
.shadow {
  filter: drop-shadow(2px 2px 4px #999);
}
</style>
<script setup lang="ts">
import AppModal from '@/components/AppModal.vue'
import { ref } from 'vue'
import { useGlobalStore } from '@/stores/globalStore'
import { useAdminStore } from '@/stores/adminStore'
import { useAppealStore } from '@/stores/appealStore'
import { ElMessage } from 'element-plus'
import { checkEmptyFields, formatDateOnlyYear, vetRegNumber } from '@/utils/globalFunctions'
import { CategoryAuto, SteeringWheelType, bodyTypes, driveTypies, EngineType, kpp } from '@/utils/globalConstants'
import { useDealStore } from '@/stores/dealStore'
import { Plus } from '@element-plus/icons-vue'
import { useAppealStoreStatus } from '@/stores/appealStoreStatus'



const appealStoreStatus = useAppealStoreStatus()
const form = ref(null)
const globalStore = useGlobalStore()
const dealStore = useDealStore()
const appealStore = useAppealStore()
const adminStore = useAdminStore()
const isOpen = ref(false)

const closeModal = () => {
  isOpen.value = false
}

const newDeal = ref<any>({
  dealStatus: 0,
  type: 0,
  lead: { leadType: 10 },
  auto: { vinNotExist: false, year: null, autoType: 10, certificate: {} },
  arrest: false
})
const brands = ref([])
const models = ref([])
const colors = ref([])
const svgColor = ref('white')
const autoTypes = ref(null)
const carGenerations = ref([])
const carModifications = ref([])
const dealType = [
  { id: 20, name: 'Trade-in' },
  { id: 40, name: 'Выкуп у физ. лица' },
  { id: 50, name: 'Выкуп у юр. лица' },
  { id: 60, name: 'A/м через салон' }
]



function changeRegistartionMark(name: string) {
  newDeal.value.auto.registrationMark = vetRegNumber(name)
}


function setBrand() {
  changeBrand(newDeal.value.auto.carBrandId)
}

function changeBrand(id: number) {
  id && globalStore.getModels(id).then(res => {
    models.value = res

    changeModel(newDeal.value.auto.carModelId)
  })
}

function changeModel(modelId: number) {
  useAdminStore().getGenerations(modelId).then(res => carGenerations.value = res)
}

function getModifications(ids:number[]) {
  adminStore.getModifications([ids]).then(res => carModifications.value = res)
}


function changeColor(colorId: number) {
  if (!colorId) return false
  let c:any = colors.value.find((el:any) => el.id === colorId)
  if (c) svgColor.value = c.colorCode
}

function prepareBeforeSave() {
  return  {
    'id': newDeal.value.auto.autoId,
    'parentId': appealStore.comissId,
    'vin': newDeal.value.auto.vinNotExist ? '' : newDeal.value.auto.vin,
    'model': newDeal.value.auto.carModelId,
    'brandTitle': newDeal.value.auto.carBrand, //"ВАЗ (LADA)",
    'modelTitle': newDeal.value.auto.carModel, //"Largus",
    'year': formatDateOnlyYear(newDeal.value.auto.year), //1980,
    'bodyType': newDeal.value.auto.bodyType, //5,
    'doorsCount': newDeal.value.auto.doorsCount, //3,
    'driveType': newDeal.value.auto.driveType, //20,
    'engineType': newDeal.value.auto.engineType, //10,
    'enginePowerHP': newDeal.value.auto.enginePowerHP, //1231,
    'engineCapacity': newDeal.value.auto.engineCapacity, // 800,
    'gearboxType': newDeal.value.auto.gearboxType, // 20,
    'bodyColor': newDeal.value.auto.certificate.colorVCTitle, //1,
    'bodyColorTitle': newDeal.value.auto.bodyColorName, // "Бежевый",
    'bodyColorCode': newDeal.value.auto.bodyColorCode, // "#FFEFD5",
    'mileage': newDeal.value.auto.mileageAuto, // 123,
    'steeringWheel': newDeal.value.auto.steeringWheel, // 10,
    'enginePowerVC': newDeal.value.auto.enginePowerVC, // 12,
    'vinNotExist': newDeal.value.auto.vinNotExist,
    // 'steeringWheelType': newDeal.value.auto.steeringWheelType,
    'autoType': newDeal.value.auto.autoType, // 30,
    'category': newDeal.value.auto.category, // 1,
    'engineBrandAndNumber': newDeal.value.auto.engineBrandAndNumber, //"132323",
    'chassisNumber': newDeal.value.auto.chassisNumber,// null,
    'bodyNumber': newDeal.value.auto.bodyNumber,// "34543534dfd53",
    'isCertifiedPreOwned': newDeal.value.auto.isCertifiedPreOwned,//false,
    'generationId': newDeal.value.auto.generationId,//null,
    'modificationId': newDeal.value.auto.modificationId,// null,
    'complectationId': newDeal.value.auto.complectationId,// null,
    'exploitationHistoryType': null,
    'categoryColor': '#518468',
    'certificate': {
      'id': newDeal.value.auto.currentVehicleCertificateId,//132285,
      'registrationMark': newDeal.value.auto.registrationMark,//"В 233 УВ 233",
      'engineCapacityByVC': newDeal.value.auto.engineCapacityByVC,//1212,
      'certificateNumber': newDeal.value.auto.certificate!.certificateNumber,//"12 КА 232323",
      'issuedDate': newDeal.value.auto.issuedDate,// "18.04.2025",
      'issuedBy': newDeal.value.auto.issuedBy,// "увд",
      'modelVC': newDeal.value.auto.modelByVCId,//4820,
      'brandVCTitle': 'ывы',
      'modelVCTitle': newDeal.value.auto.certificate!.modelVCTitle,//"ВАЗ",
      'colorVC': newDeal.value.auto.bodyColorByVCId,
      'colorVCTitle': newDeal.value.auto.bodyColorByVC,//'12121',
      'isOriginalVC': newDeal.value.auto.isOriginalVC,//false,
      'countOfHosts': newDeal.value.auto.countHostsByVC,//1,
      'enginePowerInKWByVC': newDeal.value.auto.enginePowerInKWByVC,//null,
      'isElpts': newDeal.value.auto.Elpts,// false,
      'elCertificateNumber': newDeal.value.auto.elCertificateNumber,//null,
      'elCertificateIssuedDate': newDeal.value.auto.elCertificateIssuedDate// null
    }
  }
}

let colorsVc: any = []

function getBodyColorAuto(color: string, cb: any) {
  appealStore.getBodyColorAuto(color).then(res => {
    colorsVc = res.models
    cb(res.models)
  })
}

function choseColorVC() {
  let colorVC = colorsVc.find((el: any) => el.value === newDeal.value.auto.bodyColorByVC)
  if (colorVC) newDeal.value.auto.bodyColorByVCId = colorVC.id
}

function saveBodycolor(color: string) {
  appealStore.addBodycolor(color).then(res => {
    if (res.status === 200) {
      newDeal.value.auto.bodyColorByVCId = res.data.data.id
      ElMessage.info('Цвет выбран')
    }
  })
}

function saveNewBrand() {
  let params = {
    brand: newDeal.value.auto.certificate.brandVCTitle,
    entityType: 20,
    model: newDeal.value.auto.certificate.modelVCTitle
  }
  adminStore.saveBrands(params).then(() => {
    ElMessage.info('Модель в базу добавлен')
    // todo я бы тут скрыл копку +добавить Если такая модель уже есть в системе
  })
}

function getCarModel(modelName: string, cb: any) {
  let params = `?brand=${newDeal.value.auto.certificate.brandVCTitle}&model=${newDeal.value.auto.certificate.modelVCTitle}`
  appealStore.getCarModel(params).then(res => {
    res.models.map((el: any) => (el.value = el.model))
    cb(res.models)
  })
}

function getCarBrand(modelName: string, cb: any) {
  appealStore.getCarBrand(modelName).then(res => {
    res.items.map((el: any) => (el.value = el.brand))
    cb(res.items)
  })
}


function save() {
  checkEmptyFields(form.value).then(() => {
    let params = prepareBeforeSave()
    
    console.log('params = ',params)

    // appealStore.saveComissionAuto(params).then(res => {
    //   if (res.status === 200) location.reload()
    // })
  })
}


function open(appeal: any) {

  console.log(':::!!! appeal = ',appeal)

  isOpen.value = true
  newDeal.value.auto = appeal.auto

  if (newDeal.value.auto) {
    newDeal.value.auto.mileageAuto = appeal.mileageAuto
    newDeal.value.auto.year = new Date(String(appeal.yearReleased))
    newDeal.value.auto.registrationMark = newDeal.value.auto.certificate!.registrationMark
    if (newDeal.value.auto.vinNotExist) newDeal.value.auto.vin = newDeal.value.auto.vin.slice(6)
    newDeal.value.auto.isOriginalVC = '' + newDeal.value.auto.isOriginalVC
    svgColor.value = newDeal.value.auto.bodyColorCode
  }

  globalStore.getServerTime().then(res => newDeal.value.dealInfoCollectStartTime = res.time)
  adminStore.getAutoTypes().then(res => autoTypes.value = res.items)
  globalStore.getBrands().then(res => brands.value = res).then(() => setBrand())
  globalStore.getColors().then(res => colors.value = res.items)
}

defineExpose({ open })
</script>