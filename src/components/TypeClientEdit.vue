<template>
  <div>
    <div style="text-align: center">
      <h3>Юридическое лицо</h3>
    </div>

    <el-tabs type="card" @tab-click="tabClick" v-model="activeName" style="max-width: 1000px; margin: auto">
      <el-tab-pane label="Общая информация" name="first">
        <el-form ref="form" :model="client" class="error-to-message">

          <div class="edit-car-column">
            <div class="edit-car-column-to">

              <div>
                <label class="label-right l_150">Источник</label>

                <el-select
                  style="width: 220px"
                  v-model="client.treatmentSourceId"
                  filterable>
                  <el-option v-for="item in treatmentSources" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
                <br>
              </div>

              <div>
                <label class="label-right l_150">Наименование организации</label>
                <el-input v-model="client.name" />
              </div>

              <div>
                <label class="label-right l_150">Тип организации</label>

                <el-select
                  style="width: 220px"
                  v-model="client.typeCompany"
                  filterable>
                  <el-option v-for="item in typesCompanies" :key="item.value" :label="item.title" :value="item.value" />
                </el-select>
                <br>
              </div>

              <div>
                <label class="label-right l_150">Тип юр.лица</label>

                <el-select
                  style="width: 220px"
                  v-model="client.typeLegal"
                  filterable>
                  <el-option v-for="item in typesLegal" :key="item.value" :label="item.title" :value="item.value" />
                </el-select>
                <br>
              </div>

              <div>
                <label class="label-right l_150">ИНН</label>
                <el-input v-model="client.inn" />
              </div>

              <div v-if="client.typeCompany!==5">
                <label class="label-right l_150">КПП</label>
                <el-input v-model="client.kpp" />
              </div>

              <div v-if="client.typeCompany!==5">
                <label class="label-right l_150">ОГРН</label>
                <el-input v-model="client.psrn" />
              </div>

              <div>
                <label class="label-right l_150">Адрес регистрации</label>
                <el-autocomplete
                  :title="client.registrationAddress.fias.value"
                  style="width: 200px"
                  v-model="client.registrationAddress.fias.value"
                  :fetch-suggestions="querySearch"
                  clearable
                  placeholder="Введите адрес"
                  @select="addressSelect"
                />
              </div>

              <div>
                <label class="label-right l_150">Почтовый адрес</label>
                <el-input v-model="client.postAddress.fias.value" />
              </div>

              <div>
                <label class="label-right l_150">Телефон</label>
                <el-input v-model="client.phone" />
              </div>

              <div>
                <label class="label-right l_150">Email</label>
                <el-input v-model="client.email" />
              </div>

              <div>
                <label class="label-right l_150">НДС</label>
                <el-checkbox v-model="client.nds" />
              </div>

            </div>

            <div class="edit-car-column-to">

              <label>Ответственное лицо</label>


              <div>
                <label class="label-right l_150">Фамилия</label>
                <el-input v-model="client.person.lastName" />
              </div>

              <div>
                <label class="label-right l_150">Имя</label>
                <el-input v-model="client.person.firstName" />
              </div>


              <div>
                <label class="label-right l_150">Отчество</label>
                <el-input v-model="client.person.middleName" />
              </div>

              <div>
                <label class="label-right l_150">Телефон</label>
                <el-input v-model="client.person.phone" />
              </div>

              <div>
                <label class="label-right l_150">Должность</label>
                <el-select
                  style="width: 220px"
                  v-model="client.positionType"
                  filterable>
                  <el-option v-for="item in positions" :key="item.value" :label="item.title" :value="item.value" />
                </el-select>
              </div>

              <br>
              <label>Счет &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <a href="" style="text-decoration: underline; color: blue">
                  Журнал изменений
                </a>
              </label>
              <br><br>


              <div v-for="bill in banks">
                <div>
                  <label class="label-right l_100">Банк</label>

                  <el-select
                    style="width: 220px"
                    v-model="client.treatmentSourceId"
                    filterable>
                    <el-option v-for="item in treatmentSources" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                  <br>
                </div>

                <div>
                  <label class="label-right l_100">Филиал</label>

                  <el-select
                    style="width: 220px"
                    v-model="client.treatmentSourceId"
                    filterable>
                    <el-option v-for="item in treatmentSources" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                  <br>
                </div>

                <div>
                  <label class="label-right l_100">Расчетный счет</label>
                  <el-input v-model="client.na3me" style="margin-right: 8px" />
                  <el-button>+</el-button>
                  <el-button style="margin: 0">-</el-button>
                </div>


                <br>
              </div>

            </div>


            <div>

            </div>

          </div>
        </el-form>
        <div style="text-align: center; margin: 30px 0 ">
          <el-button type="danger" @click="save()">Сохранить</el-button>
          <el-button @click="$router.back()">Отмена</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Журнал изменений">
        <h3>Журнал изменений</h3>
      </el-tab-pane>
    </el-tabs>


  </div>
</template>

<style>
.edit-car-column {
  margin: 0 auto;
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  max-width: 1000px;
}

.edit-car-column-to {
  flex: 1;
  min-width: 360px;
}
</style>


<script setup lang="ts">

/**
 * Открываться может и из обращения для создания новой оценки и из оценок для редактирования
 */

import { ref } from 'vue'
import { useGlobalStore } from '@/stores/globalStore'
import { useAdminStore } from '@/stores/adminStore'
import { useAppealStore } from '@/stores/appealStore'
import { checkEmptyFields } from '@/utils/globalFunctions'

const globalStore = useGlobalStore()
const appealStore = useAppealStore()
const adminStore = useAdminStore()
const activeName = ref('first')

const client = ref({
  bills: [],
  person: {},
  postAddress: { fias: {} },
  registrationAddress: { fias: {} },
  treatmentSource: {}
})
const brands = ref([])
const models = ref([])
const colors = ref([])
const form = ref(null)
const treatmentSources = ref([])
const typesCompanies = ref([])
const typesLegal = ref([])
const positions = ref([])
const banks = [1]

let row = null

globalStore.getTreatmentSources().then(res => treatmentSources.value = res.items)
globalStore.getTypeCompanies().then(res => typesCompanies.value = res.items)
globalStore.getTypesLegal().then(res => typesLegal.value = res.items)
globalStore.getPositions().then(res => positions.value = res.items)

function tabClick() {
  console.log('tabClick = ')
}

function addressSelect(adr: { value: string, fias_id: number }) {
  client.value.registrationAddress.fias = {
    value: adr.value,
    fiasId: adr.fias_id
  }
}

const querySearch = (queryString: string, cb: any) => {
  globalStore.getFias(queryString).then(res => cb(res.data.items))
}


function save() {
  console.log('client = ', client.value)
  checkEmptyFields(form.value).then(res => {
    console.log('res = ', res)

  })
}


</script>