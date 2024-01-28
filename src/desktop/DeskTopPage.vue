<template>
  <main>
    <el-form ref="form" :model="appeal">
      <div class="main__flex">
        <div>
          <div class="desk" style="margin-bottom: -40px;">
            <el-button-group class="group-button" v-if="!globalStore.isMobileView || appeal.lead.leadType==10">
            </el-button-group>

            <div class="fields yourPlace">
              <div v-if="appeal.lead.leadType==10">Физическое лицо</div>
              <div v-if="appeal.lead.leadType==20">Юридическое лицо</div>
              <br><br>
              <el-form-item
                  v-if="appeal.lead.leadType==20"
                  style="min-width: calc(100% - 35px)"
                  prop="lead.legalEntity['name']"
                  :rules="{required: true, message: 'Введите название организации', trigger: ['blur', 'change']}">
                <el-input
                    :style="{minWidth:globalStore.isMobileView? '183%':'100%' }"
                    v-model.number="appeal.lead.legalEntity.name" placeholder="* Название организации"/>
              </el-form-item>
            </div>
          </div>

          <div class="desk">
            <el-button-group v-model="appeal.lead.leadType" class="group-button">
              <div>Клиент</div>
              <br>
              <el-button @click="appeal.lead.leadType=10" :class="{active:appeal.lead.leadType==10}">
                Физ. лицо
              </el-button>
              <el-button @click="appeal.lead.leadType=20" :class="{active:appeal.lead.leadType==20}">
                Юр. лицо
              </el-button>
            </el-button-group>

            <div class="fields">
              <div class="fields__in">
                <el-form-item prop="lead.person['phone']"
                              :rules="{required: true, message: 'Введите номер телефона', trigger: ['blur', 'change']}">
                  <el-input v-model.number="appeal.lead.person.phone" placeholder="* Основной телефон"/>
                </el-form-item>

                <el-form-item>
                  <el-input placeholder="Подменный телефон" v-model="appeal.workflow.swapPhone"></el-input>
                </el-form-item>

                <el-form-item>
                  <el-input placeholder="Эл.почта" v-model="appeal.lead.person.email"></el-input>
                </el-form-item>
              </div>
              <div class="fields__in">
                <el-form-item prop="lead.person['firstName']"
                              :rules="{required: true, message: 'Пожалуйста, введите имя', trigger: ['blur', 'change']}">
                  <el-input placeholder="* Имя" v-model="appeal.lead.person.firstName"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input placeholder="Отчество" v-model="appeal.lead.person.middleName"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input placeholder="Фамилия" v-model="appeal.lead.person.lastName"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>

          <div class="desk">
            <el-button-group v-model="appeal.lead.leadType" class="group-button">
              <div>Обращение</div>
              <br>
              <el-button v-for="workflow in Workflows"
                         :key="workflow.id"
                         @click="appeal.workflow.workflowLeadType=workflow.value"
                         :class="{active:workflow.value == appeal.workflow.workflowLeadType}">
                {{ workflow.title }}
              </el-button>
            </el-button-group>

            <div class="fields">
              <div class="fields__in">
                <div v-if="appeal.lead.leadType==10">Юридическое лицо</div>
                <div v-if="appeal.lead.leadType==20">Физическое лицо</div>
                <br>

                <el-form-item prop="workflow.auto['vin']"
                              :rules="[{  min: 17, max: 17, message: 'Не менее 17 знаков', trigger: ['blur', 'change']}]">
                  <el-input placeholder="VIN 17 символов" v-model="appeal.workflow.auto.vin"/>
                </el-form-item>

                <el-form-item>
                  <el-select
                      v-model="appeal.workflow.brandId"
                      @change="changeBrand(appeal.workflow.brandId)"
                      placeholder="Марка"
                  >
                    <el-option v-for="item in brands"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id"/>
                  </el-select>
                </el-form-item>

                <el-form-item>
                  <el-select v-model="appeal.workflow.carModelId" placeholder="Модель">
                    <el-option v-for="item in models"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id"/>
                  </el-select>
                </el-form-item>

                <el-form-item>
                  <el-select v-model="appeal.workflow.yearReleased" placeholder="Год выпуска">
                    <el-option v-for="item in Years"
                               :key="item.name"
                               :label="item.name"
                               :value="item.name"/>
                  </el-select>
                </el-form-item>

                <el-form-item>
                  <el-input placeholder="Пробег автомобиля" type="number" v-model="appeal.workflow.mileageAuto"/>
                </el-form-item>

                <el-form-item>
                  <el-select v-model="appeal.workflow.bodyColorId" placeholder="Цвет кузова">
                    <el-option v-for="item in colors"
                               :key="item.id"
                               :label="item.colorName"
                               :value="item.id"/>
                  </el-select>
                </el-form-item>

              </div>
              <div class="fields__in">
                <br>
                <br>
                <el-form-item>
                  <el-select v-model="appeal.workflow.BuyCategory" placeholder="Вид выкупа">
                    <el-option v-for="item in BuyCategoryTypes"
                               :key="item.id"
                               :label="item.title"
                               :value="item.id"/>
                  </el-select>
                </el-form-item>


                <el-form-item>
                  <el-select v-model="appeal.workflow.locationId" placeholder="Салон">
                    <el-option v-for="item in places"
                               :key="item.id"
                               :label="item.title"
                               :value="item.id"/>
                  </el-select>
                </el-form-item>


                <el-form-item>
                  <el-select v-model="appeal.workflow.managerId" placeholder="Ответственный">
                    <el-option v-for="item in managers"
                               :key="item.id"
                               :label="item.title"
                               :value="item.id"/>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>

        <div class="field_left " style="background: none">
          <div style="margin: 17px 0">Источник обращения</div>
          <el-form-item>
            <el-select v-model="appeal.communication.type">
              <el-option v-for="item in CommunicationTypes" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select v-model="appeal.communication.sourceId">
              <el-option v-for="item in sources" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select v-model="appeal.communication.city" placeholder="Город" :filterable="!globalStore.isMobileView">
              <el-option v-for="(item, ind) in cities" :key="ind" :label="item" :value="item"/>
            </el-select>
          </el-form-item>


          <el-input placeholder="Описание" v-model="appeal.communication.description"></el-input>

          <br><br><br>
          <el-button @click="save()">+ Сохранить новое обращение</el-button>
          <br><br>
          <el-button @click="resetForm(form)">Сброс</el-button>
        </div>

      </div>
    </el-form>

  </main>
</template>
<style>


</style>
<script setup lang="ts">
import {useGlobalStore} from "@/stores/globalStore";
import {computed, reactive, ref} from "vue";
import {ElMessage} from "element-plus";

import {Workflows, Years, BuyCategoryTypes, CommunicationTypes} from '@/utils/globalConstants'

const form = ref(null)
const globalStore = useGlobalStore()
const brands = ref([])
const models = ref([])
const colors = ref([])
const cities = ref([])
const places = ref([])
const managers = ref([])
const treatmentSources = ref([])
const sources = computed(() => {
  return treatmentSources.value.filter(el => el.communicationType == appeal.communication.type)
})
const appeal = reactive({
  lead: {
    leadType: 10,
    legalEntity: {name: ''},
    person: {phone: '', email: '', firstName: '', lastName: '', middleName: ''}
  },
  workflow: {
    swapPhone: '', brandId: null, carModelId: null,
    mileageAuto: null, bodyColorId: null, BuyCategory: null,
    yearReleased: null, workflowLeadType: 2, auto: {vin: ''},
    locationId: null, managerId: null
  },
  communication: {type: 10, sourceId: 15, callType: null, city: null, description: ''}
})

globalStore.getBrands().then(res => brands.value = res)
globalStore.getColors().then(res => colors.value = res.items)
globalStore.getPlaces().then(res => {
  cities.value = res.citys
  places.value = res.items
})
globalStore.getUsers().then(res => {
  managers.value = res.items
})

globalStore.getTreatmentSources().then(res => {
  treatmentSources.value = res.items
})

const changeBrand = id => globalStore.getModels(id).then((res) => models.value = res)
const submitForm = formEl => formEl && formEl.validate(valid => !valid)
const resetForm = formEl => formEl && formEl.resetFields()

function save() {
  console.log('--->>> workflow', appeal.workflow)
  console.log('--->>> lead', appeal.lead)
  console.log('--->>> communication', appeal.communication)

  if (!appeal.lead.person.phone) {
    ElMessage({message: 'Поле "Основной телефон" обязателен для заполнения!', type: 'error',})
  }

  submitForm(form.value).then(res => {
    if (res) console.log('Ошибок нет >>>')
    else console.error('ОШИБКА ЗАПОЛНЕНИЯ ФОРМЫ')
  })
}

globalStore.setTitle('Новое обращение')
globalStore.steps = []
</script>