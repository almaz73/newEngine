<template>
  <div v-if="dealStore.deal  && dealStore.deal.auto" style="line-height: 1.3">

    <div style="display: flex; justify-content: space-between; flex-wrap: wrap">
      <h3>
        {{ dealStore.deal.auto.carBrand }} {{ dealStore.deal.auto.carModel }}, {{ dealStore.deal.auto.yearReleased }}
        г.в.
        ( VIN: {{ dealStore.deal.auto.vin }} )
        &nbsp;
        <RouterLink :to="`/auto/${dealStore.deal.auto.autoId}/edit/${dealStore.deal.dealId}`">
          <EditPensilCtrl/>
        </RouterLink>


      </h3>
      <RightMenuButtons/>
    </div>
    &nbsp; &nbsp;


    <div class="deal_two_col">
      <MStatus/>


      <div class="info-filed">
        <label class="label l_200">Тип workflow</label>
        {{ dealStore.deal.typeTitle }}
      </div>

      <div class="info-filed">
        <label class="label l_200">Тип оценки</label>
        {{ dealStore.deal.dealTypeTitle }}
      </div>

      <div class="info-filed">

        <DealTypeEditorCtrl :deal="dealStore.deal"/>
      </div>


      <div class="info-filed">
        <label class="label l_200">Ответственный</label>
        {{ dealStore.deal.responsibleUserName }}

      </div>

      <div class="info-filed" v-if="dealStore.deal.auto.engineCapacity">
        <label class="label l_200"> Объем двигателя (л)</label>
        {{ dealStore.deal.auto.engineCapacity / 1000 }}
      </div>


      <div class="info-filed" v-if="dealStore.deal.auto.enginePowerHP">
        <label class="label l_200"> Мощность (л.с.) </label>
        {{ dealStore.deal.auto.enginePowerHP }}
      </div>


      <div class="info-filed" v-if="dealStore.deal.auto.driveType">
        <label class="label l_200"> Тип коробки передач </label>
        {{ GearboxType.find(el => el.id === dealStore.deal.auto.gearboxType).name }}
      </div>

      <div class="info-filed" v-if="dealStore.deal.auto.driveType">
        <label class="label l_200">Привод</label>
        {{ driveTypies.find(el => el.id === dealStore.deal.auto.driveType).name }}
      </div>

      <div class="info-filed">
        <label class="label l_200">Цвет</label>
        {{ dealStore.deal.auto.bodyColorName }}
      </div>

      <div class="info-filed">
        <label class="label l_200">Пробег автомобиля</label>
        {{ dealStore.deal.mileageAuto }}

        <span title="Не оригинальный пробег" style="cursor: pointer"
              v-if="!dealStore.deal.additionalAutoInfo.isMileageOriginal">
          ⚠️
        </span>

        <span title="Оригинальный пробег" style="cursor: pointer"
              v-if="dealStore.deal.additionalAutoInfo.isMileageOriginal">
          ✔️
        </span>
      </div>

      <div class="info-filed">
        <label class="label l_200">Гос.номер</label>
        <span style="padding: 0 12px; border: 3px double #ccc; border-radius: 4px; background: white">
        {{ dealStore.deal.auto.registrationMark }}
          </span>
      </div>

      <div class="info-filed">
        <label class="label l_200">Номер ПТС</label>
        {{ dealStore.deal.auto.certificateNumber }}
      </div>

      <div class="info-filed">
        <label class="label l_200">Количество хозяев по ПТС</label>
        {{ dealStore.deal.auto.countHostsByVC }}
      </div>

      <div class="info-filed" v-if="dealStore.deal.auto.countFreeHostsByVC">
        <label class="label l_200" title="Количество свободных мест по ПТС">Кол-во св.мест по ПТС</label>
        {{ dealStore.deal.auto.countFreeHostsByVC }}
      </div>

      <div class="info-filed">
        <label class="label l_200">ПТС оригинальный</label>
        {{ dealStore.deal.auto.isOriginalVC ? 'Да' : 'Нет' }}
      </div>

      <div class="info-filed">

        <label class="label l_200">Место выкупа</label>
        {{ dealStore.deal.location_Name }}
      </div>

      <div class="info-filed" v-if="dealStore.deal.locationName && dealStore.deal.locationName != ' '">
        <label class="label l_200">Место хранения</label>
        {{ dealStore.deal.locationName }}
      </div>

      <div class="info-filed" style="display: flex; margin: 10px 0; align-items: center">
        <label class="label l_200">Категория автомобиля</label>
        <CircleCateforyAvtoCtrl :categoryNumber="dealStore.deal.auto.categoryAuto"/>
      </div>


      <div class="info-filed" v-if="dealStore.deal.auto.bodyType">
        <label class="label l_200">Тип кузова</label>
        {{ bodyTypes.find(el => el.id === dealStore.deal.auto.engineType).name }}
      </div>

      <div class="info-filed" v-if="dealStore.deal.auto.engineType">
        <label class="label l_200">Тип двигателя</label>
        {{ EngineType.find(el => el.id === dealStore.deal.auto.engineType).name }}
      </div>

      <div class="info-filed" v-if="dealStore.deal.auto.steeringWheelType">
        <label class="label l_200">Руль</label>
        {{ dealStore.deal.auto.steeringWheelType === 10 ? 'Левый' : 'Правый' }}
      </div>
    </div>

    <div class="deal_two_col">
      <MainInfoEvents/>
    </div>
    <div style="clear: both"></div>


    <el-collapse class="big-collapse no-color-collapse" @change="changeCollapse">
      <el-collapse-item title="Дополниельная информация" name="1" v-if=" dealStore.deal.auto.additionalInformation">
        {{ dealStore.deal.auto.additionalInformation }}
      </el-collapse-item>

      <div style="border-top: 1px solid #ddd">
        <p style="padding-left: 30px; color: #999">Клиент</p>
        <div class="info-filed">
          <label class="label"><small>ФИО</small></label>
          {{ dealStore.deal.leadFullName }}
          <EditPensilCtrl @click="editClient()"/>
        </div>
        <div class="info-filed">
          <label class="label"><small>Контактный телефон</small></label>
          ☎: {{
            dealStore.deal.lead && dealStore.deal.lead.person && formattingPhone(dealStore.deal.lead.person.phone)
          }}
        </div>
      </div>

      <el-collapse-item title="Финансовый расчет" name="3">
        <C_FinanceCalculation/>
      </el-collapse-item>

      <el-collapse-item title="Порядок расчета" name="4"/>

      <el-collapse-item title="Собственник" name="5">
        <div class="info-filed">
          <label class="label l_200">Собственник</label>
          {{ getOwnerTitle(dealStore.deal.autoOwner) }}
        </div>
      </el-collapse-item>

      <el-collapse-item title="ПТС" name="6">
        <C_PTS :deal="dealStore.deal"/>
      </el-collapse-item>

      <el-collapse-item title="Фото, Видео, Файлы" name="7">


      </el-collapse-item>

      <el-collapse-item title="Комментарии" name="8">
        <C_comments ref="c_comments"/>
      </el-collapse-item>

      <el-collapse-item title="Проверка ТС" name="9">
        <C_InspectionGibdd ref="c_InspectionGibdd"/>

      </el-collapse-item>

      <el-collapse-item title="Лист осмотра" name="10">
        <C_InspectionList ref="c_InspectionList"/>
      </el-collapse-item>

      <el-collapse-item title="Комплектность" name="11" >
        <C_complect ref="c_complect"/>
      </el-collapse-item>

      <el-collapse-item title="Комлпектация" name="12">
        <C_complectation ref="c_complectation"/>
      </el-collapse-item>


    </el-collapse>


  </div>
  <ClientsDirModal ref="clientsDirModal"/>
</template>

<script setup lang="ts">


import MStatus from '@/pages/deal/tabs/status/MStatus.vue'
import {bodyTypes, driveTypies, EngineType, GearboxType} from '@/utils/globalConstants'
import {ref} from 'vue'
import C_InspectionList from '@/pages/deal/tabs/collapses/C_InspectionList.vue'
import MainInfoEvents from '@/pages/deal/tabs/MainInfoEvents.vue'
import {useDealStore} from '@/stores/dealStore'
import C_InspectionGibdd from '@/pages/deal/tabs/collapses/C_InspectionGibdd.vue'
import C_FinanceCalculation from '@/pages/deal/tabs/collapses/C_FinanceCalculation.vue'
import CircleCateforyAvtoCtrl from '@/controls/CircleCateforyAvtoCtrl.vue'
import DealTypeEditorCtrl from '@/controls/DealTypeEditorCtrl.vue'
import C_PTS from '@/pages/deal/tabs/collapses/C_PTS.vue'
import {formattingPhone} from '@/utils/globalFunctions'
import RightMenuButtons from '@/pages/deal/RightMenuButtons.vue'
import EditPensilCtrl from '@/controls/EditPensilCtrl.vue'
import C_comments from "@/pages/deal/tabs/collapses/C_comments.vue";
import C_complect from "@/pages/deal/tabs/collapses/C_complect.vue";
import C_complectation from "@/pages/deal/tabs/collapses/C_complectation.vue";
import ClientsDirModal from '@/pages/admin/dirs/ClientsDirModal.vue'

const dealStore = useDealStore()
const c_InspectionList = ref(null)
const c_InspectionGibdd = ref(null)
const c_comments = ref(null)
const c_complect = ref(null)
const c_complectation = ref(null)
const clientsDirModal = ref(null)


function getOwnerTitle(owner: any) {
  let title = ''
  if (owner) {
    if (owner.leadType == 10) {
      let lastName = owner.person.lastName || ''
      let firstName = owner.person.firstName || ''
      let middleName = owner.person.middleName || ''

      title = lastName + ' ' + firstName + ' ' + middleName
    }
    if (owner.leadType == 20) {
      if (owner.legalEntity.typeOfCompany != 0) {
        title = owner.legalEntity.name + ', ' + owner.legalEntity.typeOfCompanyTitle
      } else {
        title = owner.legalEntity.name
      }
    }
  }
  return title
}

function changeCollapse(node: string[]) {
  if (node.includes('8')) c_comments.value.open()
  if (node.includes('9')) c_InspectionGibdd.value.open() // Проверка ТС (данные с Гибдд)
  if (node.includes('10')) c_InspectionList.value.open() // Лист осмотра
  if (node.includes('11')) c_complect.value.open()
  if (node.includes('12')) c_complectation.value.open()

}

function editClient() {
  clientsDirModal.value.open(dealStore.deal.leadId)
}

</script>
