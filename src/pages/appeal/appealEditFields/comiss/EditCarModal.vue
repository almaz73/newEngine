<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 390: 900"
            :top="40"
            :title="'Данные автомобиля'"
            draggable>
    <el-form ref="form" :model="auto" class="error-to-message form-validate">
      <el-scrollbar :maxHeight="globalStore.isMobileView?'520px':''">
        <div class="edit-car-column" style="display: flex; flex-wrap: wrap; justify-content: space-around">
          <div class="edit-car-column-to">
            <svg class="shadow"
                 xmlns="http://www.w3.org/2000/svg" :width="globalStore.isMobileView?43:73"
                 :height="globalStore.isMobileView?43:73" viewBox="0 0 24 24"

                 style="position: absolute" :style="{fill:svgColor}">
              <path
                  d="M23.5 7c.276 0 .5.224.5.5v.511c0 .793-.926.989-1.616.989l-1.086-2h2.202zm-1.441 3.506c.639 1.186.946 2.252.946 3.666 0 1.37-.397 2.533-1.005 3.981v1.847c0 .552-.448 1-1 1h-1.5c-.552 0-1-.448-1-1v-1h-13v1c0 .552-.448 1-1 1h-1.5c-.552 0-1-.448-1-1v-1.847c-.608-1.448-1.005-2.611-1.005-3.981 0-1.414.307-2.48.946-3.666.829-1.537 1.851-3.453 2.93-5.252.828-1.382 1.262-1.707 2.278-1.889 1.532-.275 2.918-.365 4.851-.365s3.319.09 4.851.365c1.016.182 1.45.507 2.278 1.889 1.079 1.799 2.101 3.715 2.93 5.252zm-16.059 2.994c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zm10 1c0-.276-.224-.5-.5-.5h-7c-.276 0-.5.224-.5.5s.224.5.5.5h7c.276 0 .5-.224.5-.5zm2.941-5.527s-.74-1.826-1.631-3.142c-.202-.298-.515-.502-.869-.566-1.511-.272-2.835-.359-4.441-.359s-2.93.087-4.441.359c-.354.063-.667.267-.869.566-.891 1.315-1.631 3.142-1.631 3.142 1.64.313 4.309.497 6.941.497s5.301-.184 6.941-.497zm2.059 4.527c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zm-18.298-6.5h-2.202c-.276 0-.5.224-.5.5v.511c0 .793.926.989 1.616.989l1.086-2z"/>
            </svg>


            <div>
              <label class="label-right l_150">VIN</label>
              <el-input
                  v-model="auto.vin"
                  @input="auto.vin.length>16 && chosenVin(auto.vin)"
                  maxlength="17"
                  minlength="17"
                  clearable
              />
            </div>

            <div>
              <label class="label-right l_150"></label>
              <el-checkbox v-model="auto.vinNotExist" label="VIN отсутствует"/>
            </div>
            <br>
            <div>
              <label class="label-right l_150">Тип ТС</label>
              <el-select
                  style="width: 200px"
                  v-model="auto.autoType"
                  :filterable="!globalStore.isMobileView"
                  clearable
              >
                <el-option v-for="type in autoTypes" :key="type.value" :label="type.title" :value="type.value"/>
              </el-select>
            </div>

            <div>
              <label class="label-right l_150">Марка</label>
              <el-form-item prop="brandTitle" class="style-valid"
                            :rules="{required: true, message: 'Марка', trigger: ['change']}">
                <el-select
                    style="width: 200px"
                    placeholder="Выберите бренд"
                    v-model="auto.brandTitle"
                    :filterable="!globalStore.isMobileView"
                    @change="changeBrand(auto.brandTitle)"
                    clearable
                >
                  <el-option v-for="brand in brands" :key="brand.id" :label="brand.name" :value="brand.name"/>
                </el-select>
              </el-form-item>
            </div>

            <div v-if="auto.brandTitle">
              <label class="label-right l_150">Модель</label>
              <el-form-item prop="model" class="style-valid"
                            :rules="{required: true, message: 'Модель', trigger: ['change']}">
                <el-select
                    style="width: 200px"
                    v-model="auto.model"
                    :filterable="!globalStore.isMobileView"
                    @change="changeModel(auto.model)"
                    placeholder="Выберите модель">
                  <el-option v-for="item in models" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
              </el-form-item>
            </div>

            <!--            <div>-->
            <!--              <label class="label-right l_150">Поколение</label>-->
            <!--              <el-select-->
            <!--                  style="width: 200px"-->
            <!--                  v-model="auto.generationId"-->
            <!--                  :filterable="!globalStore.isMobileView"-->
            <!--                  placeholder="Выберите модель">-->
            <!--                <el-option v-for="item in carGenerations" :key="item.id" :label="item.name" :value="item.id"/>-->
            <!--              </el-select>-->
            <!--            </div>-->

            <div>
              <el-form-item prop="year" class="style-valid"
                            :rules="{required: true, message: 'Год выпуска', trigger: ['change']}">
                <label class="label-right l_150">Год выпуска</label>
                <el-date-picker
                    class="auto-panel"
                    v-model="auto.year"
                    placeholder="Выберите год"
                    type="year"
                    :clearable="false"
                />
              </el-form-item>
            </div>

            <div>
              <label class="label-right l_150">Тип кузова</label>
              <el-select
                  style="width: 200px"
                  v-model="auto.bodyType"
                  :filterable="!globalStore.isMobileView"
                  placeholder="Выберите тип">
                <el-option v-for="item in bodyTypes" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </div>

            <div>
              <label class="label-right l_150">Кол-во дверей</label>
              <el-form-item prop="doorsCount" class="style-valid"
                            :rules="{required: true, message: 'Кол-во дверей', trigger: ['change']}">
                <el-input v-model="auto.doorsCount"/>
              </el-form-item>
            </div>

            <div>
              <label class="label-right l_150">Привод авто</label>
              <el-select
                  style="width: 200px"
                  v-model="auto.driveType"
                  :filterable="!globalStore.isMobileView"
                  placeholder="Выберите привод">
                <el-option v-for="item in driveTypies" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </div>

            <div>
              <label class="label-right l_150">Тип двигателя</label>
              <el-form-item prop="engineType" class="style-valid"
                            :rules="{required: true, message: 'Тип двигателя', trigger: ['change']}">
                <el-select
                    style="width: 200px"
                    v-model="auto.engineType"
                    :filterable="!globalStore.isMobileView"
                    placeholder="Выберите привод">
                  <el-option v-for="item in EngineType" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
              </el-form-item>
            </div>

            <div>
              <label class="label-right l_150">Мощность (л.с.)</label>
              <el-input v-model="auto.enginePowerHP"/>
            </div>


            <div>
              <label class="label-right l_150">Объем двигателя</label>
              <el-input v-model="auto.engineCapacity"/>
            </div>

            <div>
              <label class="label-right l_150">Тип КПП</label>
              <el-select
                  style="width: 200px"
                  v-model="auto.gearboxType"
                  :filterable="!globalStore.isMobileView"
                  placeholder="Выберите привод">
                <el-option v-for="item in kpp" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </div>


            <div>
              <label class="label-right l_150">Пробег (км)</label>
              <el-form-item prop="mileage" style="display: inline-block"
                            :rules="{required: true, message: 'Пробег автомобиля', trigger: ['change']}">
                <el-input v-model="auto.mileage" placeholder="Введите пробег" style="border: 1px solid yellow;"
                          title="Пробег"/>

              </el-form-item>
            </div>
            <div style="margin: -10px 0">
              <span class="label-right l_150">Гос номер</span>
              <el-form-item prop="certificate['registrationMark']"
                            style="display: inline-block"
                            :rules="{required: true, message: 'Гос номер', trigger: ['change']}">
                <el-input v-model="auto.certificate.registrationMark"
                          @input="changeRegistartionMark(auto.certificate.registrationMark)"
                          style="text-transform: uppercase"
                          placeholder="X 000 XX 000"
                          maxlength="12"
                />
              </el-form-item>

            </div>

            <div>
              <label class="label-right l_150">Номер двигателя</label>
              <el-input v-model="auto.engineBrandAndNumber"/>
            </div>
          </div>

          <div class="edit-car-column-to">
            <div>

              <label class="label-right l_150">Цвет</label>
              <el-form-item prop="bodyColor" class="style-valid"
                            :rules="{required: true, message: 'Цвет', trigger: ['change']}">
                <el-select
                    style="width: 200px"
                    v-model="auto.bodyColor"
                    :filterable="!globalStore.isMobileView"
                    clearable
                    @change="changeColor(auto.bodyColor)"
                >
                  <el-option v-for="color in colors" :key="color.id" :label="color.colorName" :value="color.id"/>
                </el-select>
              </el-form-item>
            </div>

            <div>
              <label class="label-right l_150">Руль</label>
              <el-form-item prop="steeringWheel" class="style-valid"
                            :rules="{required: true, message: 'Руль', trigger: ['change']}">
                <el-select
                    style="width: 200px"
                    v-model="auto.steeringWheel"
                    placeholder="Выберите руль">
                  <el-option v-for="item in SteeringWheelType" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
              </el-form-item>
            </div>

            <div>
              <label class="label-right l_150">Категория</label>
              <el-select
                  style="width: 200px"
                  v-model="auto.category"
                  placeholder="Выберите категорию">
                <el-option v-for="item in CategoryAuto" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </div>

            <div v-if="auto.certificate">
              <label class="label-right l_150"> Марка по ПТС</label>
              <el-autocomplete
                  style="width: 200px"
                  v-model="auto.certificate.brandVCTitle"
                  :fetch-suggestions="getCarBrand"
              />
            </div>

            <div v-if="auto.certificate">
              <label class="label-right l_150"> Модель по ПТС</label>
              <el-autocomplete
                  style="width: 200px"
                  v-model="auto.certificate.modelVCTitle"
                  :fetch-suggestions="getCarModel"
              />
              <el-button :icon="Plus"
                         title="+ Добавить новую модель"
                         @click="addModelVS()"
                         style="width: 30px; float: right; margin-right: -30px"></el-button>
            </div>

            <div>
              <label class="label-right l_150"> Цвет по ПТС</label>
              <el-form-item prop="certificate['colorVCTitle']" class="style-valid"
                            :rules="{required: true, message: 'Цвет по ПТС', trigger: ['change']}">
                <el-autocomplete
                    style="width: 200px"
                    v-model="auto.certificate.colorVCTitle"
                    :fetch-suggestions="getBodyColorAuto"
                    @change="choseColorVC()"
                    placeholder="Введите Цвет"
                />
              </el-form-item>

              <el-button :icon="Plus"
                         title="+ Добавить новый цвет"
                         @click="saveBodycolor(auto.certificate.colorVCTitle)"
                         style="width: 30px; float: right; margin-right: -30px"></el-button>
            </div>

            <div>
              <label class="label-right l_150"> Объем двиг. ПТС</label>
              <el-input v-model="auto.certificate.engineCapacityByVC"/>
            </div>


            <div>
              <label class="label-right l_150">Электрон.ПТС?</label>
              <el-checkbox v-model="auto.certificate.isElpts"/>
            </div>

            <div v-if="!auto.certificate.isElpts">
              <label class="label-right l_150">Номер ПТС</label>
              <el-form-item prop="certificate['certificateNumber']" class="style-valid"
                            :rules="{required: true, message: 'Номер ПТС', trigger: ['change']}">
                <el-input v-model="auto.certificate.certificateNumber"/>
              </el-form-item>
            </div>

            <div>
              <label class="label-right l_150">Дата выдачи ПТС</label>
              <el-date-picker
                  class="auto-panel"
                  v-model="auto.certificate.issuedDate"
                  placeholder="Введите дату"
                  :clearable="false"
                  format="DD.MM.YYYY"
              />
            </div>


            <div v-if="auto.certificate.isElpts">
              <label class="label-right l_150">Номер ЭПТС</label>
              <el-input v-model="auto.certificate.elCertificateNumber"/>
            </div>

            <div v-if="auto.certificate.isElpts">
              <label class="label-right l_150">Дата выдачи ЭПТС</label>
              <el-date-picker
                  class="auto-panel"
                  v-model="auto.certificate.elCertificateIssuedDate"
                  placeholder="Дату выдачи"
                  :clearable="false"
              />
            </div>


            <div>
              <label class="label-right l_150">ПТС выдан</label>
              <el-input v-model="auto.certificate.issuedBy"/>
            </div>

            <div>
              <label class="label-right l_150">Владельцы ПТС</label>
              <el-form-item prop="certificate['countOfHosts']" class="style-valid"
                            :rules="{required: true, message: 'Количество хозяев по ПТС', trigger: ['change']}">
                <el-input v-model="auto.certificate.countOfHosts"/>
              </el-form-item>
            </div>

            <div>
              <label class="label-right l_150">Мощн.ПТС л.с.</label>
              <el-form-item
                  prop="enginePowerVC" class="style-valid"
                  :rules="{required: true, message: 'Мощн.ПТС л.с.', trigger: ['change']}">
                <el-input v-model="auto.enginePowerVC"/>
              </el-form-item>
            </div>

            <div>
              <label class="label-right l_150">Мощн.ПТС кВт</label>
              <el-input v-model="auto.certificate.enginePowerInKWByVC"/>
            </div>

            <div>
              <label class="label-right l_150">ПТС оригинал</label>
              <el-form-item
                  prop="certificate['isOriginalVC']" class="style-valid"
                  :rules="{required: true, message: 'ПТС оригинальный', trigger: ['change']}">
                <el-radio-group v-model="auto.certificate.isOriginalVC">
                  <el-radio-button label="Да" value="true"/>
                  <el-radio-button label="Нет" value="false"/>
                </el-radio-group>
              </el-form-item>
            </div>

          </div>
        </div>

        <div style="text-align: center; margin: 30px 0 0 ">
          <el-button type="danger" @click="save()">Сохранить</el-button>
          <el-button @click="isOpen = false">Отмена</el-button>
        </div>
      </el-scrollbar>
    </el-form>
  </AppModal>
</template>
<style>
.style-valid {
  display: inline-block;
  margin: 0 !important;
}

.shadow {
  filter: drop-shadow(2px 2px 4px #999);
}
</style>
<script setup lang="ts">
import AppModal from '@/components/AppModal.vue'
import {ref} from 'vue'
import {useGlobalStore} from '@/stores/globalStore'
import {useAdminStore} from '@/stores/adminStore'
import {useAppealStore} from '@/stores/appealStore'
import {ElMessage, ElMessageBox} from 'element-plus'
import {checkEmptyFields, formatDateOnlyYear, vetRegNumber} from '@/utils/globalFunctions'
import {bodyTypes, CategoryAuto, driveTypies, EngineType, kpp, SteeringWheelType} from '@/utils/globalConstants'
import {useDealStore} from '@/stores/dealStore'
import {Plus} from '@element-plus/icons-vue'
import {useAppealStoreStatus} from '@/stores/appealStoreStatus'
import {useDesktopStore} from "@/stores/desktopStore";


const appealStoreStatus = useAppealStoreStatus()
const form = ref(null)
const globalStore = useGlobalStore()
const dealStore = useDealStore()
const appealStore = useAppealStore()
const adminStore = useAdminStore()
const isOpen = ref(false)
const carGenerations = ref([])
const auto = ref<any>({mileage: 0, certificate: {}})
const brands = ref([])
const models = ref([])
const colors = ref([])
const svgColor = ref('white')
const autoTypes = ref(null)
const carModifications = ref([])

const closeModal = () => isOpen.value = false

function changeModel(modelId: number) {
  modelId && useAdminStore().getGenerations(modelId).then(res => carGenerations.value = res)
}

function changeRegistartionMark(name: string) {
  auto.value.certificate.registrationMark = vetRegNumber(name)
}


function setBrand() {
  changeBrand(auto.value.brandTitle)
}

function changeBrand(name: string) {
  let brand = brands.value.find((el: any) => el.name === name)
  brand && globalStore.getModels(brand.id).then(res => {
    models.value = res
    changeModel(auto.value.model)
  })
}


function getModifications(ids: number[]) {
  adminStore.getModifications([ids]).then(res => carModifications.value = res)
}

function changeColor(colorId: number) {
  if (!colorId) return false
  let c: any = colors.value.find((el: any) => el.id === colorId)
  if (c) svgColor.value = c.colorCode
}

let colorsVc: any = []

function getBodyColorAuto(color: string, cb: any) {
  appealStore.getBodyColorAuto(color).then(res => {
    colorsVc = res.models
    cb(res.models)
  })
}

function choseColorVC() {
  let colorVC = colorsVc.find((el: any) => el.value === auto.value.colorVCTitle)
  if (colorVC) auto.value.certificate.colorVC = colorVC.id
}

function saveBodycolor(color: string) {
  appealStore.addBodycolor(color).then(res => {
    if (res.status === 200) {
      auto.value.colorVC = res.data.data.id
      ElMessage.info('Цвет записан')
    }
  })
}

function addModelVS() {
  let params = {
    brand: auto.value.certificate.brandVCTitle,
    entityType: 20,
    model: auto.value.certificate.modelVCTitle
  }
  adminStore.saveBrands(params).then(() => {
    ElMessage.info('Модель в базу добавлен')
    // todo я бы тут скрыл копку +добавить Если такая модель уже есть в системе
  })
}

function getCarModel(modelName: string, cb: any) {
  let params = `?brand=${auto.value.certificate.brandVCTitle}&model=${modelName}`
  modelName && appealStore.getCarModel(params).then(res => {
    res.models.map((el: any) => (el.value = el.model))
    cb(res.models)
  })
}

function getCarBrand(modelName: string, cb: any) {
  modelName && appealStore.getCarBrand(modelName).then(res => {
    res.items.map((el: any) => (el.value = el.brand))
    cb(res.items)
  })
}

function chosenVin(vin: string) {

  if (vin.length < 17) return ElMessage.warning('VIN должен иметь не менее 17 знаков')
  useDesktopStore().getAutoVIN(vin).then(res => {
    if (res.autoId) {
      ElMessageBox.confirm('Автомобиль с текущим VIN существует. Заменить?', '', {
        confirmButtonText: 'Да',
        cancelButtonText: 'Нет'
      }).then(yes => {
        if (yes) {
          let z = auto.value

          z.autoType = res.autoType
          z.brandTitle = res.carBrand
          if (res.carBrandId) changeBrand(res.carBrandId)
          z.model = res.carModel
          z.bodyColorId = res.bodyColorId
          z.bodyColor = res.bodyColorName

          z.categoryAuto = res.categoryAuto
          z.countFreeHostsByVC = res.countFreeHostsByVC
          z.year = new Date('' + res.yearReleased)
          z.vin = res.vin
          z.vinNotExist = res.vinNotExist
          z.bodyType = res.bodyType
          z.steeringWheel = res.steeringWheelType


          z.certificate.issuedBy = res.issuedBy
          z.certificate.registrationMark = res.registrationMark
          z.certificate.engineCapacityByVC = res.engineCapacityByVC
          z.certificate.certificateNumber = res.certificateNumber
          z.certificate.issuedBy = res.issuedBy
          z.certificate.issuedDate = res.issuedDate
          z.certificate.brandVCTitle = res.brandByVC
          z.certificate.modelVCTitle = res.modelByVC
          z.certificate.colorVC = res.bodyColorByVCId
          z.certificate.colorVCTitle = res.bodyColorByVC
          z.certificate.isOriginalVC = res.isOriginalVC
          z.certificate.countOfHosts = res.countHostsByVC
          z.certificate.enginePowerInKWByVC = res.enginePowerInKWByVC
          z.certificate.isElpts = res.isElpts
          z.certificate.elCertificateNumber = res.certificateNumber
          z.certificate.elCertificateNumber = res.elCertificateNumber
          z.certificate.elCertificateIssuedDate = res.elCertificateIssuedDate


          z.modificationId = res.modificationId
          z.issuedDateText = res.issuedDateText
          z.isRegisteredEngine = res.isRegisteredEngine
          z.isNativeEngine = res.isNativeEngine
          z.isCertifiedPreOwned = res.isCertifiedPreOwned
          z.generationId = res.generationId
          z.enginePowerVC = res.enginePowerVC
          z.enginePowerInKWByVC = res.enginePowerInKWByVC
          // z.elCertificateIssuedDateText = res.elCertificateIssuedDateText
          // z.additionalInformation = res.additionalInformation

          svgColor.value = res.bodyColorCode

          // не все затягивается - доработать надо
        }

      })
    } else ElMessage.info('Не найден автомобиль с таким Vin')

  }).catch(() => {
  })
}


function save() {

  if (!auto.value.certificate.isOriginalVC) return ElMessage.warning('Поле "ПТС оригинал" обязателен для  заполнения')


  checkEmptyFields(form.value).then((res: boolean) => {
    auto.value.year = formatDateOnlyYear(auto.value.year)
    auto.value.parentId = appealStore.comissId
    if (auto.value.vinNotExist) auto.value.vin = ''
    auto.value.certificate.isOriginalVC = auto.value.certificate.isOriginalVC == 'true'
    if (res) {
      globalStore.isWaiting = true

      appealStore.saveComissionAuto(auto.value).then(res => {
        if (res.status === 200) location.reload()
        globalStore.isWaiting = true
      })
    }
  })
}


function open(view_appeal: any) {
  isOpen.value = true

  if (view_appeal.auto) auto.value = view_appeal.auto

  auto.value.parentId = appealStore.comissId
  // auto.value.mileage = appeal.mileage /// пока не приходит в методе
  auto.value.year = new Date(String(view_appeal.yearReleased))
  auto.value.certificate.isOriginalVC = '' + auto.value.certificate.isOriginalVC

  adminStore.getAutoTypes().then(res => autoTypes.value = res.items)
  globalStore.getBrands().then(res => brands.value = res).then(() => setBrand())
  globalStore.getColors().then(res => {
    colors.value = res.items
    changeColor(auto.value.bodyColor)
  })
}

defineExpose({open})
</script>