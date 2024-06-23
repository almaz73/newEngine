<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 360: 500"
            :top="40"
            :title="'Обращения'"
            draggable>
    <el-scrollbar>

      <span class="modal-fields">
        <el-form ref="form" :model="model" @change="isDirty=true">
          <el-button-group style="vertical-align: center">
            <template v-for="flow in Workflows" :key="flow.value">
            <el-button v-if="flow.value<11"
                       @click.stop="changeType(flow)"
                       :type="flow.title!==currentButton.title?'success':''">
              {{ flow.title }}
            </el-button>
              </template>
          </el-button-group>
          <br><br>
            <small>
               <label class="label-right l_100">Источник *</label>
              <el-form-item prop="treatmentSourceId" style="display: inline-block; width: 220px"
                            :rules="{required: true, message: '', trigger: ['blur', 'change']}">
              <el-select
                v-model="model.treatmentSourceId"
                filterable>
                <el-option v-for="item in treatmentSources" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
              </el-form-item>
            </small>

            <br>
            <small v-if="currentButton.title==='Выкуп'">
               <label class="label-right l_100">Вид выкупа</label>
              <el-form-item prop="BuyCategory" style="display: inline-block; width: 220px"
                            :rules="{required: true, message: '', trigger: ['blur', 'change']}">
                <el-select
                  v-model="model.BuyCategory"
                  filterable>
                  <el-option v-for="item in BuyCategoryTypes" :key="item.id" :label="item.title" :value="item.id" />
                </el-select>
              </el-form-item>
            </small>
            <br>
             <small>
               <label class="label-right l_100">Ответственный</label>
                 <el-select
                   style="width: 220px"
                   v-model="model.managerId"
                   filterable>
                <el-option v-for="item in managers" :key="item.id" :label="item.title" :value="item.id" />
              </el-select>
            </small>
          <el-divider />
          Автомобиль<br>
          <small>
                 <label class="label-right l_100">Объявления</label>
                 <el-input v-model="model.description" />
          </small><br>
          <small>
               <label class="label-right l_100">Марка</label>
               <el-form-item prop="carBrand" style="display: inline-block"
                             :rules="{required: true, message: '', trigger: ['blur']}">
                  <el-select
                    style="width: 110px"
                    v-model="model.carBrand"
                    @change="changeBrand(model.carBrand)"
                    :filterable="!globalStore.isMobileView"
                    clearable
                  >
                    <el-option v-for="brand in brands" :key="brand.id" :label="brand.name" :value="brand.id" />
                  </el-select>
               </el-form-item>
          </small>
          <small>
            <label class="label-right l_100">Модель</label>
            <el-form-item prop="carModelId" style="display: inline-block"
                          :rules="{required: true, message: '', trigger: ['blur']}">
              <el-select
                :disabled="!model.carBrand"
                style="width: 110px"
                v-model="model.carModelId"
                :filterable="!globalStore.isMobileView"
                placeholder="Модель">
                <el-option v-for="item in models" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </small><br>
          <small>
            <label class="label-right l_100">Год выпуска</label>
            <el-form-item prop="carModelId" style="display: inline-block"
                          :rules="{required: true, message: '', trigger: ['blur']}">
                <el-select placeholder="Год выпуска"
                           clearable
                           style="width: 110px"
                           v-model="model.yearReleased">
                    <el-option v-for="item in Years" :key="item.name" :label="item.name" :value="item.name" />
                  </el-select>
            </el-form-item>
          </small>

          <el-divider />

          Клиент<br>

          <small>
               <label class="label-right l_100">Тип клиента</label>
                <el-select
                  :disabled="isClientChosen"
                  style="width: 200px"
                  v-model="model.leadType"
                  filterable>
              <el-option v-for="item in LeadType" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            </small>
          <br>
            <small>
               <label class="label-right l_100">Фамилия</label>
               <el-input v-model="model.lead.person.lastName" :disabled="isClientChosen" />
            </small><br>
            <small>
              <label class="label-right l_100">Имя</label>
              <el-form-item prop="lead.person['firstName']" style="display: inline-block"
                            :rules="{required: true, message: '', trigger: ['blur']}">
                 <el-input v-model="model.lead.person.firstName" :disabled="isClientChosen" />
              </el-form-item>
            </small><br>
          <small>
               <label class="label-right l_100">Отчество</label>
               <el-input v-model="model.lead.person.middleName" :disabled="isClientChosen" />
            </small><br>

          <small>
               <label class="label l_200">Контактный телефон *</label>
            
            <el-form-item prop="lead.person['phone']" style="display: inline-block"
                          :rules="{required: true, message: '', trigger: ['blur']}">
               <el-autocomplete
                 v-model="model.lead.person.phone"
                 :disabled="isClientChosen"
                 :formatter="(value) =>value && formattingPhone(value, (val)=>model.lead.person.phone=val)"
                 :fetch-suggestions="telChanged"
                 :trigger-on-focus="false"
                 @select="handlePhone"
                 clearable
                 placeholder="Введите телефон"
               />
            </el-form-item>


          </small>
          <small>

             <label class="label l_200">Контактная эл.почта</label>
               <el-input placeholder="Email"
                         :disabled="isClientChosen"
                         @change="emailValidate(model.lead.person.email)"
                         title="Email" v-model="model.lead.person.email" />
            </small><br>



          <span class="modal-buttons-bottom">
            <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
            <el-button type="info" @click="isOpen = false; resetForm()">Отмена</el-button>
          </span>
        </el-form>
      </span>
    </el-scrollbar>
  </AppModal>
  <UsersDirModal_History ref="modalHistory" />
</template>


<script setup>
import AppModal from '@/components/AppModal.vue'
import { useAppealStore } from '@/stores/appealStore'
import { useGlobalStore } from '@/stores/globalStore'
import { LeadType, Workflows, Years } from '@/utils/globalConstants'
import { useAdminStore } from '@/stores/adminStore'
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import UsersDirModal_History from '@/pages/admin/dirs/UsersDirModal_History.vue'
import { emailValidate, formattingPhone } from '@/utils/globalFunctions'

const currentButton = ref({ title: 'Выкуп', value: 2 })
const globalStore = useGlobalStore()
const appealStore = useAppealStore()
const isOpen = ref(false)
const model = ref({})
const treatmentSources = ref([])
const managers = ref([])
const modalHistory = ref(null)
const adminStore = useAdminStore()
const form = ref(null)
const brands = ref([])
const models = ref([])
const submitForm = formEl => formEl && formEl.validate(valid => !valid)
const isClientChosen = ref(false)

globalStore.getBrands().then(res => brands.value = res)

function changeBrand(id) {
  globalStore.getModels(id).then((res) => models.value = res)
}

const resetForm = formEl => {
  formEl && formEl.resetFields()
  model.value = {}
}

let cb
const BuyCategoryTypes = ref([
  { id: 10, title: 'Свободный выкуп' },
  { id: 20, title: 'Выездной выкуп' },
  { id: 30, title: 'Регион' },
  { id: 40, title: 'Fleet' }
])

const closeModal = () => {
  isOpen.value = false
}

function open(row, cbModal) {
  cb = cbModal
  isOpen.value = true
  isClientChosen.value = false
  model.value = { lead: { leadType: 10, person: {} } }
  globalStore.getTreatmentSources().then(res => {
    treatmentSources.value = res.items
  })
  globalStore.getUsers().then(res => {
    managers.value = res.items
  })
}

function changeType(flow) {
  currentButton.value = flow
}

const telChanged = value => {
  if (value.length < 3) return []
  value = value.replace(/\D/g, '')
  return appealStore.getContragent(value).then(res => {
    res = res.map(el => {
      el.value = el.lastName + ' ' + el.firstName + ' ' + el.middleName + ' ( ' + el.phone + ' ) '
      return el
    })
    return res
  })
}

function handlePhone(val) {
  model.value.lead.person = val
  isClientChosen.value = true
}


function checking() {
  if (!model.value.treatmentSourceId) {
    return ElMessage({ message: 'Поле "Источник" обязетелен для заполнения', type: 'warning' })
  }
  if (!model.value.BuyCategory && currentButton.value.title === 'Выкуп') {
    return ElMessage({ message: 'Поле "Вид выкупа" обязетелен для заполнения', type: 'warning' })
  }
  if (!model.value.validTo) {
    return ElMessage({ message: 'Поле "Период действаия, до" обязетелен для заполнения', type: 'warning' })
  }
}

function save() {
  checking()
  submitForm(form.value).then(res => { // проверка заполненности обязательных полей

    console.log('model.value', model.value)

    res && appealStore.saveAppeal(model.value).then(() => {
      ElMessage({ message: 'Категория наценки успешно сохранена', type: 'success' })
      isOpen.value = false
      cb()
    })
  })


}

defineExpose({ open })


</script>