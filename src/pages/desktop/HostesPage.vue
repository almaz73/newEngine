<template>
  <main>
    <br>
    {{ currentUser.organization ? currentUser.organization.name : '' }} &nbsp; &nbsp; / &nbsp; &nbsp;
    {{ currentUser.department ? currentUser.department.name : '' }}
    <br><br>
    <el-button type="success" style="padding: 25px 60px"> Регистрация клиента</el-button>

    <div class="hostes-div">
      <div style="width: 45%; max-width: 600px">

        <h2> Данные о клиенте </h2>
        <div>
          <label class="label l_300">Тип клиента</label>
          <el-select
              style="width: 220px"
              v-model="newWorkflow.lead.leadType"
              filterable>
            <el-option v-for="item in LeadType" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </div>

        <div style="display: flex; align-items: center">
          <label class="label l_300">Клиент</label>
          <div style="white-space: nowrap;">
            <el-input v-model="newWorkflow.lead.personFullTitle" style=" margin-right: 5px" @input="changeFio"/>
            <el-button @click="isShowFio=!isShowFio">:</el-button>
          </div>
        </div>
        <div>
          <label class="label l_300">Контактный телефон</label>
          <el-input v-model="newWorkflow.lead.person.phone"/>
        </div>

        <div>
          <label class="label l_300">Примечание</label>
          <el-input v-model="newWorkflow.description" type="textarea"/>
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
              v-model="currentUser.communicationType"
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
              v-model="newWorkflow.workflowLeadType"
              filterable>
            <el-option v-for="item in Hostes" :key="item.value" :label="item.title" :value="item.value"/>
          </el-select>
        </div>

        <div>

          <label class="label l_300">Марка</label>
          <el-select
              style="width: 200px"
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
              style="width: 200px"
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
              filterable>
            <el-option v-for="item in storages" :key="item.value" :label="item.title" :value="item.value"/>
          </el-select>
        </div>

        <div>
          <label class="label l_300">Продавец</label>
          <el-select
              style="width: 220px"
              v-model="currentUser.dealType"
              filterable>
            <el-option v-for="item in dealTypes" :key="item.value" :label="item.title" :value="item.value"/>
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

    <br><br>
    <div>
      <el-table
          size="small"
          :data="tableData"
          row-key="id"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column label="ФИО" prop="employeeTitle"/>
        <el-table-column label="Обращения-выкуп, %" prop="onCommissionProc"/>
      </el-table>
    </div>
  </main>
</template>

<style>
.hostes-div {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 30px;
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
import {LeadType, CommunicationTypes, Hostes} from "@/utils/globalConstants";
import {ref} from "vue";


const globalStore = useGlobalStore()
const newWorkflow = ref({lead: {person: {}}})
const desktopStore = useDesktopStore()
const currentUser = ref([])
const isShowFio = ref(false)
const tableData = ref([])
const dealTypes = ref([])
const brands = ref([])
const models = ref([])
const storages = ref([])

globalStore.getBrands().then(res => brands.value = res)
desktopStore.getDepartmentsByPolicy().then(res => {
  console.log('res--', res)
  storages.value = res
})

function changeFio(sentence) {
  let words = sentence.split(' ')
  newWorkflow.value.lead.person.firstName = words[0]
  newWorkflow.value.lead.person.lastName = words[1]
  newWorkflow.value.lead.person.middleName = words[2]
}

function changeBrand(id) {
  globalStore.getModels(id).then((res) => models.value = res)
}

// function openClient() {
//   console.log('openClient')
// }

desktopStore.getHostess().then(res => {
  console.log('res', res)
  currentUser.value = res
})


</script>