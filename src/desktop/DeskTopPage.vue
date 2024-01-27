<template>
  <main>
    <el-form ref="form" :model="appeal">
      <div class="main__flex">
        <div>
          <div class="desk">

            <el-button-group v-model="appeal.lead.leadType" class="group-button">
              <div>Клиент</div>
              <br>
              <el-button @click="appeal.lead.leadType=10" :class="{active:appeal.lead.leadType==10}">
                Физ.лицо
              </el-button>
              <el-button @click="appeal.lead.leadType=20" :class="{active:appeal.lead.leadType==20}">
                Юр.лицо
              </el-button>
            </el-button-group>

            <div class="fields">

              <div class="fields__in">
                <div v-if="appeal.lead.leadType==10">Юридическое лицо</div>
                <div v-if="appeal.lead.leadType==20">Физическое лицо</div>
                <br>

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
                <br>
                <br>
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
              <el-button v-for="workflow in workflows"
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

                <el-input placeholder="Основной телефон" v-model="appeal.lead.person.phone"
                          style="position: relative"></el-input>
                <div v-if="appeal.lead.person.phone" class="desk__label">Основной телефон</div>
                <el-input placeholder="Подменный телефон" v-model="appeal.workflow.swapPhone"></el-input>
                <div v-if="appeal.workflow.swapPhone" class="desk__label">Подменный телефон</div>
                <el-input placeholder="Эл.почта" v-model="appeal.lead.person.email"></el-input>
              </div>
              <div class="fields__in">
                <br>
                <br>
                <el-input placeholder="Имя" v-model="appeal.lead.person.firstName"></el-input>
                <el-input placeholder="Отчество" v-model="appeal.lead.person.middleName"></el-input>
                <el-input placeholder="Фамилия" v-model="appeal.lead.person.lastName"></el-input>
              </div>
            </div>
          </div>
        </div>

        <div class="field_left " style="background: none">
          <div style="margin: 17px 0">Иссточник обращения</div>

          <el-select
              placeholder="Входящий звонок"
              v-model="appeal.lead.person.lastName"
              @change="()=>{}"
              :filterable="!globalStore.isMobileView"
              clearable>
            <el-option v-for="(item, ind) in []" :key="ind" :label="item.name" :value="item.id"/>
          </el-select>

          <el-select
              placeholder="Call-center"
              v-model="appeal.lead.person.lastName"
              @change="()=>{}"
              :filterable="!globalStore.isMobileView"
              clearable>
            <el-option v-for="(item, ind) in []" :key="ind" :label="item.name" :value="item.id"/>
          </el-select>


          <el-input placeholder="Имя" v-model="appeal.lead.person.firstName"></el-input>

          <br><br><br>
          <el-button @click="save()">Сохранить новое обращение</el-button>
          <br> <br>

          <el-button @click="submitForm(form)"> Проверка</el-button>
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
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";

const form = ref(null)
const globalStore = useGlobalStore()
const workflows = [
  {id: 2, value: 2, title: 'Выкуп'},
  {id: 1, value: 1, title: 'Продажа'},
  {id: 3, value: 3, title: 'Сервис'},
  {id: 4, value: 4, title: 'КСО'},
  {id: 5, value: 5, title: 'Fleet'},
  {id: 7, value: 7, title: 'Доп.оборуд.'},
  {id: 8, value: 8, title: 'Комиссия'},
  {id: 9, value: 9, title: 'Подбор авто'},
  {id: 10, value: 10, title: 'Сделка через салон'},
]

let appeal = reactive({
  lead: {
    leadType: 10,
    person: {phone: '', email: '', firstName: '', lastName: '', middleName: ''}
  },
  workflow: {swapPhone: '', workflowLeadType: 2},
  communication: {}
})

const submitForm = formEl => formEl && formEl.validate(valid => !valid)
const resetForm = formEl => formEl && formEl.resetFields()
function save() {
  if (!appeal.lead.person.phone) {
    ElMessage({message: 'Поле "Основной телефон" обязателен для заполнения!', type: 'error',})
  }

  submitForm(form.value).then(res => {
    if (res) console.log('>>> appeal', appeal)
  })
}

globalStore.setTitle('Новое обращение')
globalStore.steps = []
</script>