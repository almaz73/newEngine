<template>
  <main style="margin: 0 8px">
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

          <div v-if="!isFizLitso">
            <div style="display: flex; align-items: center">
              <label class="label l_300">ИНН *</label>
              <div style="white-space: nowrap;">
                <el-input v-model="newWorkflow.lead.legalEntity.inn"
                          maxlength="12"
                          style=" margin-right: 5px" @input="changeFio"/>
              </div>
            </div>
            <div style="display: flex; align-items: center">
              <label class="label l_300">Наименование организации *</label>
              <div style="white-space: nowrap;">
                <el-input v-model="newWorkflow.lead.legalEntity.name" style=" margin-right: 5px" @input="changeFio"/>
              </div>
            </div>
          </div>

          <div style="display: flex; align-items: center">
            <label class="label l_300">Клиент *</label>
            <div style="white-space: nowrap;">
              <el-input v-if="isFizLitso" v-model="newWorkflow.lead.personFullTitle" style=" margin-right: 5px"
                        @input="changeFio"/>
              <el-input v-if="!isFizLitso" v-model="newWorkflow.lead.legalEntity.personFullTitle"
                        style=" margin-right: 5px" @input="changeFio"/>
              <el-button @click="isShowFio=!isShowFio" :icon="MoreFilled"/>
            </div>
          </div>
          <div>
            <label class="label l_300">Контактный телефон</label>
            <el-input v-if="isFizLitso"
                      placeholder="Телефон" title="Телефон" clearable
                      :formatter="(value) =>value && formattingPhone(value, (val)=>newWorkflow.lead.person.phone=val)"
                      v-model="newWorkflow.lead.person.phone"/>
            <el-input v-if="!isFizLitso"
                      placeholder="Телефон" title="Телефон" clearable
                      :formatter="(value) =>value && formattingPhone(value, (val)=>newWorkflow.lead.legalEntity.person.phone=val)"
                      v-model="newWorkflow.lead.legalEntity.person.phone"/>
          </div>

          <div v-if="isFizLitso">
            <label class="label l_300">Примечание</label>
            <el-input v-model="newWorkflow.description" type="textarea" style="width: 250px"/>
          </div>


          <br>
          <div v-if="isShowFio">
            <div>
              <label class="label l_300">Имя *</label>
              <el-input v-if="isFizLitso" v-model="newWorkflow.lead.person.firstName"/>
              <el-input v-if="!isFizLitso" v-model="newWorkflow.lead.legalEntity.person.firstName"/>
            </div>

            <div>
              <label class="label l_300">Фамилия</label>
              <el-input v-if="isFizLitso" v-model="newWorkflow.lead.person.lastName"/>
              <el-input v-if="!isFizLitso" v-model="newWorkflow.lead.legalEntity.person.lastName"/>

            </div>
            <div>
              <label class="label l_300">Отчество</label>
              <el-input v-if="isFizLitso" v-model="newWorkflow.lead.person.middleName"/>
              <el-input v-if="!isFizLitso" v-model="newWorkflow.lead.legalEntity.person.middleName"/>
            </div>
          </div>


        </div>
        <div>
          <h2> Регистрация контакта </h2>
          <div>
            <label class="label l_300">Вид коммуникации</label>
            <el-select
                style="width: 220px"
                :disabled="isEdit"
                v-model="newWorkflow.type"
                filterable>
              <el-option v-for="item in CommunicationTypes" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </div>

          <!--          <div v-if="isEdit">-->
          <!--            <label class="label l_300">Время события</label>-->
          <!--            <el-date-picker-->
          <!--                format="DD.MM.YYYY  hh:mm"-->
          <!--                value-format="DD.MM.YYYY"-->
          <!--                :clearable="false"-->
          <!--                v-model="newWorkflow.lowCreateDatePeriod"-->
          <!--            />-->
          <!--          </div>-->

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
                :disabled="isEdit"
                filterable>
              <el-option v-for="item in storages" :key="item.id" :label="item.title" :value="item.id"/>
            </el-select>
          </div>

          <div>
            <label class="label l_300">Продавец</label>
            <el-select
                style="width: 220px"
                v-model="newWorkflow.managerId"
                :disabled="isEdit"
                filterable>
              <el-option v-for="item in managers" :key="item.id" :label="item.title" :value="item.id"/>
            </el-select>
          </div>

          <div style="line-height: 2" v-if="isEdit">
            <label class="label l_300">Статус клиента</label>
            {{ newWorkflow.clientStatus }}
          </div>
          <div style="line-height: 2; text-align: right" v-if="isEdit">
            <el-checkbox v-model="newWorkflow.testDrive" label="Тест-драйв" size="large"/>
            <el-checkbox v-model="newWorkflow.presentation" label="Презентация" size="large"/>
          </div>

        </div>


      </div>
    </div>
    <div style="margin: 40px 0 80px 0">
      <span style="float: left">
        <el-select v-model="filterButtonValue"
                   class="red-select"
                   @change="getData"
                   placeholder="Select" style="width: 180px">
        <el-option
            v-for="item in filterButton"
            :key="item.id"

            :label="item.name"
            :value="item.id"
        />
      </el-select>

        &nbsp;
        <span class="a-search custom">
        <el-button @click.prevent="openFilter">
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
        <el-button type="danger" :icon="Plus" @click="save()" v-if="!isEdit">Добавить</el-button>
        <el-button type="danger" :icon="Plus" @click="saveEdit()" v-if="isEdit">Сохранить</el-button>
        <el-button type="info" @click="init(); isFieldsOpen=false">Очистить</el-button>
      </span>
    </div>

    <div class="grid-opener" :style="{gridTemplateRows:isFilterOpen?'1fr':'0fr'}">
      <div style="overflow: hidden">
        <div>
          <label class="hostes-label">Хостес</label>
          <el-select
              style="width: 220px"
              placeholder="Выберите значение"
              v-model="searchFilterAppeals.hostesId"
              filterable>
            <el-option v-for="item in hostesUsers" :key="item.id" :label="item.title" :value="item.id"/>
          </el-select>
        </div>

        <!--        <div>-->
        <!--          <label class="hostes-label">Продавец</label>-->
        <!--          <el-select-->
        <!--              style="width: 220px"-->
        <!--              v-model="newWorkflow.managerId"-->
        <!--              filterable>-->
        <!--            <el-option v-for="item in managers" :key="item.id" :label="item.title" :value="item.id"/>-->
        <!--          </el-select>-->
        <!--        </div>-->

        <div>
          <label class="hostes-label">Дата</label>
          <el-date-picker
              v-model="searchFilterAppeals.date"
              :clearable="false"
          />
        </div>

        <div>
          <label class="hostes-label">Статус клиента</label>
          <el-select
              style="width: 220px"
              placeholder="Выбрать значение"
              v-model="searchFilterAppeals.clientStatus"
              filterable>
            <el-option v-for="item in clientStatusEnums" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </div>
        <br>
        <el-button type="success" @click="toSearchFilter()">Показать</el-button>
        <el-button type="info">Сброс</el-button>
        <br><br>
      </div>
    </div>

    <el-table
        size="small"
        :data="tableData"
    >
      <el-table-column label="↓" prop="hours" width="50"/>
      <el-table-column label="↑" prop="onCommissionProc" width="40">
        <template #default="scope">
          <span @click="fillForm(scope.row)">
            <el-icon style="color: red; font-size: larger; cursor: pointer"><RefreshLeft/></el-icon>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Дата" prop="date"/>
      <el-table-column label="Вид клиента" prop="clientStatus"/>
      <el-table-column label="Клиент" prop="client">
        <template #default="scope">
          <a @click="fillForm(scope.row)">{{ scope.row.client }}</a><br>
          {{ scope.row.clientPhone ? '☎:' + formattingPhone(scope.row.clientPhone) : '' }}
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
        <template #default="scope">
          <el-icon class="galka" v-if="scope.row.testDrive"><Select/></el-icon>
        </template>
      </el-table-column>
      <el-table-column label="Презентация">
        <template #default="scope">
          <el-icon class="galka" v-if="scope.row.presentation"><Select/></el-icon>
        </template>
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

.galka svg {
  color: green;
  pointer-events: none;
}

.red-select .el-select__wrapper {
  background: var(--main-color);
  box-shadow: none;
}

.red-select .el-select__wrapper span {
  color: white;
}

.hostes-label {
  display: inline-block;
  font-size: small;
  width: 120px;
}

</style>

<script setup>
import {useGlobalStore} from "@/stores/globalStore";
import {useAppealStore} from "@/stores/appealStore";
import {useDesktopStore} from "@/stores/desktopStore";
import {clientStatusEnums, CommunicationTypes, Hostes, LeadType} from "@/utils/globalConstants";
import {computed, onMounted, ref} from "vue";
import {MoreFilled, Plus, RefreshLeft, Select} from "@element-plus/icons-vue";
import {formatDateDDMMYYYY, formattingPhone} from "@/utils/globalFunctions";
import {ElMessageBox} from "element-plus";

const globalStore = useGlobalStore()
const appealStore = useAppealStore()
const newWorkflow = ref(null)
const filterButtonValue = ref(10)
const newWorkflowInit = {
  lead: {person: {}, leadType: 10, legalEntity: {inn: null, person: {}}},
  workflowLeadType: null
}
const desktopStore = useDesktopStore()
const currentUser = ref([])
const isShowFio = ref(false)
const tableData = ref([])
const managers = ref([])
const brands = ref([])
const models = ref([])
const storages = ref([])
const isFieldsOpen = ref(false)
const isFilterOpen = ref(false)
const userStorage = ref(null)
const buyCategoryTypes = [{id: 10, title: 'Свободный выкуп'}, {id: 20, title: 'Выездной выкуп'}]
const allstorages = []
const isFizLitso = computed(() => newWorkflow.value.lead.leadType === 10)
const lead = ref({personFullTitle: null, clientStatusTooltip: 'не указано'});
const isEdit = ref(false)
const hostesUsers = ref([])
const searchFilterAppeals = ref({date: new Date()})
let defaultLocation = null
let allmanagers = [];
let filterButton = ref([{name: 'Не завершенные', id: 10}, {name: 'Завершенные', id: 20}, {name: 'Все события', id: 30}])


globalStore.getBrands().then(res => brands.value = res)
desktopStore.getDepartmentsByPolicy().then(res => storages.value = res)

function changeFio(sentence) {
  sentence = sentence.trim()
  sentence = sentence.replaceAll('  ', '')
  let words = sentence.split(' ')

  if (newWorkflow.value.lead.leadType === 10) {
    newWorkflow.value.lead.person.firstName = words[0]
    newWorkflow.value.lead.person.lastName = words[1]
    newWorkflow.value.lead.person.middleName = words[2]
  } else {
    newWorkflow.value.lead.legalEntity.person.firstName = words[0]
    newWorkflow.value.lead.legalEntity.person.lastName = words[1]
    newWorkflow.value.lead.legalEntity.person.middleName = words[2]
  }
}

function changeBrand(id) {
  globalStore.getModels(id).then((res) => models.value = res)
}

function fillForm(val) {
  isFieldsOpen.value = false
  init()
  isEdit.value = true
  appealStore.getAppeal(val.appealId).then(res => {
    newWorkflow.value = res

    if (res.lead.leadType === 20) {
      newWorkflow.value.lead.legalEntity.personFullTitle = (res.lead.legalEntity.person.lastName || '') + ' ' +
          (res.lead.legalEntity.person.firstName || '') + ' ' + (res.lead.legalEntity.person.middleName || '')
    } else {
      newWorkflow.value.lead.personFullTitle = (res.lead.person.lastName || '') + ' ' +
          (res.lead.person.firstName || '') + ' ' + (res.lead.person.middleName || '')
    }

    newWorkflow.value.carBrandId = brands.value.find(el => el.name === res.carBrand).id
    if (newWorkflow.value.carBrandId) changeBrand(newWorkflow.value.carBrandId)
    changeWorkflowLeadType()
    changeLocation()
    isFieldsOpen.value = true
  })

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

    globalStore.getRoles({roles: [50, 51, 52, 20, 21, 120, 150]}).then(data => allmanagers = data.items)
  })
})


function openFilter() {
  isFilterOpen.value = !isFilterOpen.value
  desktopStore.getHostesUser().then(res => hostesUsers.value = res.items)
}

function toSearchFilter() {
  getData(filterButtonValue.value)
}

function getData(mainFilter) {
  globalStore.isWaiting = true
  mainFilter = mainFilter || 10

  let params = {
    date: formatDateDDMMYYYY(searchFilterAppeals.value.date),
    clientStatus: searchFilterAppeals.value.clientStatus,
    hostesId: searchFilterAppeals.value.hostesId,
    mainFilter: mainFilter,
  }
  desktopStore.getHostess(params).then(res => {
    tableData.value = res.items
    globalStore.isWaiting = false
    tableData.value.map(el => {
      let hh = new Date(el.event.created).getHours()
      let mm = new Date(el.event.created).getMinutes()
      el.hours = ('0' + hh).slice(-2) + ":" + ('0' + mm).slice(-2)
      return el
    })
    showRowsNumber(mainFilter, res.totalCount)
  })
}

getData()

function showRowsNumber(mainFilter, totalCount) {
  switch (mainFilter) {
    case 10:
      filterButton.value[0].name = 'Не завершенные ' + totalCount;
      break
    case 20:
      filterButton.value[1].name = 'Завершенные ' + totalCount;
      break
    case 30:
      filterButton.value[2].name = 'Все события ' + totalCount;
      break
  }
}


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
      if (appeal.lead.legalEntity.inn && (appeal.lead.legalEntity.inn.length !== 10 &&
          appeal.lead.legalEntity.inn.length !== 12)) errors.push('Неверное значение ИНН');
    }

    if (errors.length) {
      let html = ''
      errors.forEach(el => html += `<div> &nbsp; &nbsp;  &nbsp;  👉 ${el}</div>`)
      ElMessageBox.alert(html, 'Ошибка добавления', {dangerouslyUseHTMLString: true, closeOnPressEscape: true})
    }
  }
  return errors.length
}

function init() {
  isEdit.value = false
  newWorkflow.value = JSON.parse(JSON.stringify(newWorkflowInit))
}

init()

function save() {
  if (check()) return false
  globalStore.isWaiting = true
  desktopStore.saveHostess(newWorkflow.value).then(() => {
    init()
    getData()
  })
}

function saveEdit() {
  ElMessageBox.confirm('В случае сохранения данных, статус клиента будет изменен на “Упущенный клиент”')
      .then(() => {
        desktopStore.saveEditHostes(newWorkflow.value.lead)
        let t = ('0' + new Date().getHours()).slice(-2) + ':' + ('0' + new Date().getMinutes()).slice(-2)

        let obj = {
          dateEnd: t,
          dateStart: t,
          id: newWorkflow.value.leadId
        }
        desktopStore.saveEditHostesFinish(obj).then(getData)
      })
}

onMounted(() => {
  globalStore.setTitle('Хостес')
  globalStore.steps = []
})

</script>