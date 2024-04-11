<template>
  <main>
    <br>
    {{ currentUser.organization ? currentUser.organization.name : '' }} &nbsp; &nbsp; / &nbsp; &nbsp;
    {{ currentUser.department ? currentUser.department.name : '' }}
    <br><br>
    <el-button type="success" style="padding: 25px 60px" @click="isFieldsOpen=!isFieldsOpen"> Регистрация клиента
      &nbsp; <img
          alt=""
          class="filter-button"
          :class="{ open: isFieldsOpen }"
          src="@/assets/icons/icon-menu-arrow-down.png"
      />
    </el-button>
    <div class="grid-opener" :style="{gridTemplateRows:isFieldsOpen?'1fr':'0fr'}">
      <div class="hostes-div">
        <div style="width: 45%; max-width: 600px">

          <h2> Данные о клиенте </h2>
          <div>
            <label class="label l_300">Тип клиента</label>
            <el-select
                style="width: 200px"
                v-model="newWorkflow.lead.leadType"
                filterable>
              <el-option v-for="item in LeadType" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </div>

          <div style="display: flex; align-items: center">
            <label class="label l_300">Клиент</label>
            <div style="white-space: nowrap;">
              <el-input v-model="newWorkflow.lead.personFullTitle" style=" margin-right: 5px" @input="changeFio"/>
              <el-button @click="isShowFio=!isShowFio" :icon="MoreFilled"/>
            </div>
          </div>
          <div>
            <label class="label l_300">Контактный телефон</label>
            <el-input placeholder="Телефон" title="Телефон" clearable
                      :formatter="(value) =>value && formattingPhone(value, (val)=>newWorkflow.lead.person.phone=val)"
                      v-model="newWorkflow.lead.person.phone"/>
          </div>

          <div>
            <label class="label l_300">Примечание</label>
            <el-input v-model="newWorkflow.description" type="textarea" style="width: 250px"/>
          </div>


          <div v-if="isShowFio">
            <div>
              <label class="label l_300">Имя</label>
              <el-input v-model="newWorkflow.lead.person.firstName"/>
            </div>

            <div>
              <label class="label l_300">Фамилия</label>
              <el-input v-model="newWorkflow.lead.person.lastName"/>
            </div>
            <div>
              <label class="label l_300">Отчество</label>
              <el-input v-model="newWorkflow.lead.person.middleName"/>
            </div>
          </div>


        </div>
        <div>
          <h2> Регистрация контакта </h2>
          <div>
            <label class="label l_300">Вид коммуникации</label>
            <el-select
                style="width: 220px"
                v-model="newWorkflow.type"
                filterable>
              <el-option v-for="item in CommunicationTypes" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </div>

          <div>
            <label class="label l_300">Время события</label>
            <el-date-picker
                format="DD.MM.YYYY  hh:mm"
                value-format="DD.MM.YYYY"
                :clearable="false"
                v-model="newWorkflow.lowCreateDatePeriod"
            />
          </div>

          <h2>Обращение </h2>
          <div>
            <label class="label l_300">Цель обращения</label>
            <el-select
                style="width: 220px"
                @change="changeWorkflowLeadType()"
                v-model="newWorkflow.workflowLeadType"
                filterable>
              <el-option v-for="item in Hostes" :key="item.value" :label="item.title" :value="item.value"/>
            </el-select>
          </div>

          <div v-if="newWorkflow.workflowLeadType === 2">
            <label class="label l_300">Вид выкупа</label>
            <el-select
                style="width: 220px"
                v-model="newWorkflow.buyCategory"
                filterable>
              <el-option v-for="item in buyCategoryTypes" :key="item.id" :label="item.title" :value="item.id"/>
            </el-select>
          </div>

          <div>
            <label class="label l_300">Марка</label>
            <el-select
                style="width: 220px"
                v-model="newWorkflow.carBrandId"
                @change="changeBrand(newWorkflow.carBrandId)"
                clearable
            >
              <el-option v-for="brand in brands" :key="brand.id" :label="brand.name" :value="brand.id"/>
            </el-select>
          </div>

          <div>
            <label class="label l_300">Модель</label>
            <el-select
                style="width: 220px"
                v-model="newWorkflow.carModelId"
                placeholder="Модель">
              <el-option v-for="item in models" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </div>

          <div>
            <label class="label l_300">Автосалон</label>
            <el-select
                style="width: 220px"
                v-model="newWorkflow.locationId"
                @change="changeLocation()"
                filterable>
              <el-option v-for="item in storages" :key="item.id" :label="item.title" :value="item.id"/>
            </el-select>
          </div>

          <div>
            <label class="label l_300">Продавец</label>
            <el-select
                style="width: 220px"
                v-model="newWorkflow.managerId"
                filterable>
              <el-option v-for="item in managers" :key="item.id" :label="item.title" :value="item.id"/>
            </el-select>
          </div>

          <div>
            <label class="label l_300">Статус клиента</label>
            <el-select
                style="width: 220px"
                v-model="currentUser.dealType"
                filterable>
              <el-option v-for="item in dealTypes" :key="item.value" :label="item.title" :value="item.value"/>
            </el-select>
          </div>


        </div>


      </div>
    </div>
    <div style="margin: 40px 0 80px 0">
      <span style="float: left">
        <el-button type="danger">Не завершенные</el-button>
        <span class="a-search custom">
        <el-button @click.prevent="isFilterOpen=!isFilterOpen">
          <img
              alt=""
              class="filter-button"
              :class="{ open: isFilterOpen }"
              src="@/assets/icons/icon-menu-arrow-down.png"
          />

        </el-button>
          </span>
      </span>
      <span style="float: right" v-if="isFieldsOpen">
        <el-button type="danger" :icon="Plus" @click="save()">Добавить </el-button>
        <el-button type="info">Очистить</el-button>
      </span>
    </div>

    <div class="grid-opener" :style="{gridTemplateRows:isFilterOpen?'1fr':'0fr'}">
      <div style="overflow: hidden">
        Тут еще несколько фильтров<br>
        <el-button>фильтры</el-button>
      </div>
    </div>

    <el-table
        size="small"
        :data="tableData"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column label="↑" prop="hours" width="50"/>
      <el-table-column label="↓" prop="onCommissionProc" width="40"/>
      <el-table-column label="Дата" prop="date"/>
      <el-table-column label="Вид клиента" prop="clientStatus"/>
      <el-table-column label="Клиент" prop="client">
        <template #default="scope">
          {{ scope.row.client }}<br> {{ scope.row.clientPhone ? '☎:' + formattingPhone(scope.row.clientPhone) : '' }}
        </template>
      </el-table-column>
      <el-table-column label="Менеджер">
        <template #default="scope">
          <span style="white-space: nowrap; overflow: hidden" :title="scope.row.manager">
            {{ scope.row.manager }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Авто" prop="auto"/>
      <el-table-column label="Обращение" prop="workflowLeadType"/>
      <el-table-column label="Кто создал" prop="created"/>

      <el-table-column label="Тест-драйв">
        <template #default="scope">{{ scope.row.testDrive ? '✅' : '' }}</template>
      </el-table-column>
      <el-table-column label="Презентация">
        <template #default="scope">{{ scope.row.presentation ? '✅' : '' }}</template>
      </el-table-column>
    </el-table>
  </main>
</template>

<style>
.grid-opener {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.5s ease-in-out;
}

.hostes-div {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 30px;
  overflow: hidden;
}

@media (width < 1000px) {
  .hostes-div .l_300 {
    width: 120px;
  }
}

</style>

<script setup>
import {useGlobalStore} from "@/stores/globalStore";
import {useDesktopStore} from "@/stores/desktopStore";
import {CommunicationTypes, Hostes, LeadType} from "@/utils/globalConstants";
import {onMounted, ref} from "vue";
import {MoreFilled, Plus} from "@element-plus/icons-vue";
import {formattingPhone} from "@/utils/globalFunctions";
import {ElMessageBox} from "element-plus";

const globalStore = useGlobalStore()
const newWorkflow = ref({lead: {person: {}, leadType: 10}, workflowLeadType: null})
const desktopStore = useDesktopStore()
const currentUser = ref([])
const isShowFio = ref(false)
const tableData = ref([])
const dealTypes = ref([])
const managers = ref([])
const brands = ref([])
const models = ref([])
const storages = ref([])
const isFieldsOpen = ref(false)
const isFilterOpen = ref(false)
const userStorage = ref(null)
const buyCategoryTypes = [{id: 10, title: 'Свободный выкуп'}, {id: 20, title: 'Выездной выкуп'}]
const allstorages = []
let defaultLocation = null
let allmanagers = [];

globalStore.getBrands().then(res => brands.value = res)
desktopStore.getDepartmentsByPolicy().then(res => storages.value = res)

function changeFio(sentence) {
  sentence = sentence.trim()
  sentence = sentence.replaceAll('  ', '')
  let words = sentence.split(' ')
  newWorkflow.value.lead.person.firstName = words[0]
  newWorkflow.value.lead.person.lastName = words[1]
  newWorkflow.value.lead.person.middleName = words[2]
}

function changeBrand(id) {
  globalStore.getModels(id).then((res) => models.value = res)
}

function changeLocation() {
  managers.value = [];
  allmanagers.forEach(value => {
    if (value.storage === newWorkflow.value.locationId) managers.value.push(value);
  })
}

function getDefaultLocationTitle() {
  storages.value.forEach(value => {
    if (value.id === userStorage.value) {
      newWorkflow.value.locationTitle = value.title;
    }
  })
}

desktopStore.getHostessUser().then(res => {
  currentUser.value = res
  userStorage.value = res.location.id

  desktopStore.getLocation().then(data => {
    data.items.forEach(value => {
      if (value.type === 10 || value.type === 60) allstorages.push(value);
    })

    defaultLocation = localStorage.getItem('hostesDesktopDefaultLocationId');

    if (defaultLocation !== undefined) {
      // newWorkflow.value.locationId = defaultLocation;
      getDefaultLocationTitle();
    } else if (currentUser.value.location.id !== null) {
      localStorage.setItem('hostesDesktopDefaultLocationId', currentUser.value.location.id);
      defaultLocation = currentUser.value.location.id;
      newWorkflow.value.locationId = currentUser.value.location.id;
      getDefaultLocationTitle();
    }

    desktopStore.getByPolicy({roles: [50, 51, 52, 20, 21, 120, 150]}).then(data => allmanagers = data.items)
  })
})

function getData() {
  desktopStore.getHostess().then(res => {
    tableData.value = res.items
    tableData.value.map(el => {
      let hh = new Date(el.event.created).getHours()
      let mm = new Date(el.event.created).getMinutes()
      el.hours = ('0' + hh).slice(-2) + ":" + ('0' + mm).slice(-2)
      return el
    })
  })
}

getData()


function changeWorkflowLeadType() {
  managers.value = [];
  storages.value = [];
  allstorages.forEach(storage => {
    if (
        newWorkflow.value.workflowLeadType === 2 ||
        newWorkflow.value.workflowLeadType === 5 ||
        newWorkflow.value.workflowLeadType === 8
    ) {
      if (storage.type === 10) {
        storages.value.push(storage);
      }
    } else if (
        newWorkflow.value.workflowLeadType === 1 ||
        newWorkflow.value.workflowLeadType === 4 ||
        newWorkflow.value.workflowLeadType === 7 ||
        newWorkflow.value.workflowLeadType === 9
    ) {
      if (storage.type === 60) {
        storages.value.push(storage);
      }
    } else if (newWorkflow.value.workflowLeadType === 3) {
      if (storage.type === 30 || storage.type === 40) {
        storages.value.push(storage);
      }
    }
  })
}

function check() {
  /*    фиксим космическое влияние на код (глюк)    */
  var appeal = newWorkflow.value;
  let errors = []
  if (appeal.lead.leadType === 10 || appeal.lead.leadType === 20) {
    errors = [];
    if (appeal.locationId == null || appeal.locationId === 0) errors.push('Не указано место хранения');
    if (appeal.type == null) errors.push('Не указан вид коммуникации');
    if (appeal.lead.leadType === 10 && appeal.lead.person.firstName == null) errors.push('Не указано имя клиента');
    if (appeal.locationId == null) errors.push('Не не выбран ДЦ');
    if (appeal.workflowLeadType === 2 && appeal.buyCategory == null) errors.push('Не выбран вид выкупа');
    if (appeal.managerId == null) errors.push('Не указан продавец');
    if (appeal.workflowLeadType == null) errors.push('Не указан тип обращения');
    if (appeal.lead.leadType === 20) {
      if (!appeal.lead.legalEntity.name) errors.push('Не указано наименование организации');
      if (!appeal.lead.legalEntity.person.phone) errors.push('Не указан контактный телефон');
      if (!appeal.lead.legalEntity.person.firstName) errors.push('Не указано имя клиента');
      if (!appeal.lead.legalEntity.inn) errors.push('Не указан ИНН');
      if (appeal.lead.legalEntity.inn && (appeal.lead.legalEntity.inn.length !== 10 && appeal.lead.legalEntity.inn.length !== 12)) errors.push('Неверное значение ИНН');
    }

    if (errors.length) {
      let html = ''
      errors.forEach(el => html += `<div> &nbsp; &nbsp;  &nbsp;  👉 ${el}</div>`)
      ElMessageBox.alert(html, 'Ошибка добавления', {dangerouslyUseHTMLString: true, closeOnPressEscape: true})
    }
  }
  return errors.length
}

function save() {
  if (check()) return false
  console.log('СОХРАНЯЕМСЯ  = ', newWorkflow.value)
  desktopStore.saveHostess(newWorkflow.value).then(res => {
    console.log('res', res)
    getData()
  })
}

onMounted(() => {
  globalStore.setTitle('Хостес')
  globalStore.steps = []
})

</script>