<template>
  <div v-if="dealStore.deal  && dealStore.deal.auto">

    <h3>
      {{ dealStore.deal.auto.carBrand }} {{ dealStore.deal.auto.carModel }}, {{ dealStore.deal.auto.yearReleased }} г.в.
      ( VIN: {{ dealStore.deal.auto.vin }} )

    </h3>


    <!--    <button-->
    <!--      user-permission="dealGeneral.historyAutoDeals"-->
    <!--      ng-show="historyAutoDealsCount && dealStore.deal.type==2"-->
    <!--      class="a-button-circle-red"-->
    <!--      data-uk-modal="{target:'#historyAutoDeals', center:true}"-->
    <!--    >-->
    <!--      <span ng-model="historyAutoDealsCount">{{historyAutoDealsCount}}</span>-->
    <!--    </button>-->

    <div class="deal_two_col">
      <MStatus />


      <div class="info-filed">
        <label class="label l_200">Тип workflow</label>
        {{ dealStore.deal.typeTitle }}
      </div>

      <div class="info-filed">
        <label class="label l_200">Тип оценки</label>
        {{ dealStore.deal.dealTypeTitle }}
      </div>

      <div class="info-filed">
        <label class="label l_200">Тип направления</label>
        {{ dealStore.deal.dealStatus }}
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

      </div>

      <div class="info-filed">
        <label class="label l_200">Гос.номер</label>
        {{ dealStore.deal.auto.registrationMark }}
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
        <div class="category-auto"
             :style="{background:['#518468', '#c6e0cc', '#f0d089', '#c0c5ce', '#d84e4e'][dealStore.deal.auto.categoryAuto-1]}">
          {{
            dealStore.deal.auto.categoryAuto && categoryAutos.find((el => el.id === dealStore.deal.auto.categoryAuto)).name
          }}
        </div>
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
      <MainInfoEvents />
    </div>
    <div style="clear: both"></div>


    <el-collapse class="big-collapse no-color-collapse" @change="changeCollapse">
      <el-collapse-item title="Дополниельная информация" name="1">
        {{ dealStore.deal.auto.additionalInformation }}
      </el-collapse-item>

      <div style="border-top: 1px solid #ddd">
        <h4 style="padding-left: 30px; color: #999">Клиент</h4>
        <div class="info-filed">
          <label class="label l_200"><small>ФИО</small></label>
          {{ dealStore.deal.leadFullName }}
          <img alt="" src="@/assets/icons/icon-pencil-gray.png">
        </div>
        <div class="info-filed">
          <label class="label l_200"><small>Контактный телефон</small></label>
          {{ dealStore.deal.lead.person.phone }}
        </div>
      </div>

      <el-collapse-item title="Финансовый расчет" name="3"
      >
        <div class="info-filed">
          <label class="label l_200">Максимальная цена выкупа</label>
          {{ dealStore.deal.auto.maxPriceBought || '_' }}₽
        </div>

        <div class="info-filed">
          <label class="label l_200">Комиссионное вознаграждение</label>
          {{ dealStore.deal.auto.commissionFee || '_' }}₽
        </div>
      </el-collapse-item>

      <el-collapse-item title="Порядок расчета" name="4" />

      <el-collapse-item title="Собственник" name="5">
        <div class="info-filed">
          <label class="label l_200">Собственник</label>
          {{ getOwnerTitle(dealStore.deal.autoOwner) }}
        </div>
      </el-collapse-item>

      <el-collapse-item title="ПТС" name="6">
        <div class="info-filed">
          <label class="label l_200">Гос. номер</label>
          {{ dealStore.deal.auto.registrationMark }}
        </div>

        <div class="info-filed">
          <label class="label l_200">Номер номер</label>
          {{ dealStore.deal.auto.certificateNumber }}
        </div>

        <div class="info-filed">
          <label class="label l_200">Количество хозяев по ПТС</label>
          {{ dealStore.deal.auto.countHostsByVC }}
        </div>

        <div class="info-filed">
          <label class="label l_200">ПТС оригинальный</label>
          {{ dealStore.deal.auto.isOriginalVC ? 'Да' : 'Нет' }}
        </div>
      </el-collapse-item>

      <el-collapse-item title="Фото, Видео, Файлы" name="7">


      </el-collapse-item>

      <el-collapse-item title="Комментарии" name="8">


      </el-collapse-item>

      <el-collapse-item title="Проверка ТС" name="9">
        <C_InspectionGibdd ref="c_InspectionGibdd" />

      </el-collapse-item>

      <el-collapse-item title="Лист осмотра" name="8">
        <C_InspectionList ref="c_InspectionList" />
      </el-collapse-item>

    </el-collapse>


  </div>
</template>
<style>
.info-filed {
  height: 30px;
}
</style>
<script setup lang="ts">


import MStatus from '@/pages/deal/tabs/status/MStatus.vue'
import { bodyTypes, categoryAutos, driveTypies, EngineType, GearboxType } from '@/utils/globalConstants'
import { ref } from 'vue'
import C_InspectionList from '@/pages/deal/tabs/collapses/C_InspectionList.vue'
import MainInfoEvents from '@/pages/deal/tabs/MainInfoEvents.vue'
import { useDealStore } from '@/stores/dealStore'
import C_InspectionGibdd from '@/pages/deal/tabs/collapses/C_InspectionGibdd.vue'

const dealStore = useDealStore()
const c_InspectionList = ref(null)
const c_InspectionGibdd = ref(null)

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
  if (node.includes('8')) c_InspectionList.value.open() // Лист осмотра
  if (node.includes('9')) c_InspectionGibdd.value.open() // Проверка ТС (данные с Гибдд)
}

</script>
