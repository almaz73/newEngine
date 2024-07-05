<template>
  <div v-if="deal">
    <h3>
      {{ deal.auto.carBrand }} {{ deal.auto.carModel }}, {{ deal.auto.yearReleased }} г.в, ( {{ deal.auto.vin }} )
    </h3>

    <div style="width: 600px">
      <MStatus :deal="deal" />


      <div class="info-filed">
        <label class="label l_200">Тип workflow</label>
        {{ deal.typeTitle }}
      </div>

      <div class="info-filed">
        <label class="label l_200">Тип оценки</label>
        {{ deal.dealTypeTitle }}
      </div>

      <div class="info-filed">
        <label class="label l_200">Тип направления</label>
        {{ deal.dealStatus }}
      </div>


      <div class="info-filed">
        <label class="label l_200">Ответственный</label>
        {{ deal.responsibleUserName }}

      </div>

      <div class="info-filed" v-if="deal.auto.engineCapacity">
        <label class="label l_200"> Объем двигателя (л)</label>
        {{ deal.auto.engineCapacity / 1000 }}
      </div>


      <div class="info-filed" v-if="deal.auto.enginePowerHP">
        <label class="label l_200"> Мощность (л.с.) </label>
        {{ deal.auto.enginePowerHP }}
      </div>


      <div class="info-filed" v-if="deal.auto.driveType">
        <label class="label l_200"> Тип коробки передач </label>
        {{ GearboxType.find(el => el.id === deal.auto.gearboxType).name }}
      </div>

      <div class="info-filed" v-if="deal.auto.driveType">
        <label class="label l_200">Привод</label>
        {{ driveTypies.find(el => el.id === deal.auto.driveType).name }}
      </div>

      <div class="info-filed">
        <label class="label l_200">Цвет</label>
        {{ deal.auto.bodyColorName }}
      </div>

      <div class="info-filed">
        <label class="label l_200">Пробег автомобиля</label>
        {{ deal.mileageAuto }}

      </div>

      <div class="info-filed">
        <label class="label l_200">Гос.номер</label>
        {{ deal.auto.registrationMark }}
      </div>

      <div class="info-filed">
        <label class="label l_200">Номер ПТС</label>
        {{ deal.auto.certificateNumber }}
      </div>

      <div class="info-filed">
        <label class="label l_200">Количество хозяев по ПТС</label>
        {{ deal.auto.countHostsByVC }}
      </div>

      <div class="info-filed">
        <label class="label l_200">ПТС оригинальный</label>
        {{ deal.auto.isOriginalVC ? 'Да' : 'Нет' }}
      </div>

      <div class="info-filed">

        <label class="label l_200">Место выкупа</label>
        {{ deal.location_Name }}
      </div>

      <div class="info-filed" v-if="deal.locationName && deal.locationName != ' '">
        <label class="label l_200">Место хранения</label>
        {{ deal.locationName }}
      </div>

      <div class="info-filed" style="display: flex; margin: 10px 0; align-items: center">
        <label class="label l_200">Категория автомобиля</label>
        <div class="category-auto"
             :style="{background:['#518468', '#c6e0cc', '#f0d089', '#c0c5ce', '#d84e4e'][deal.auto.categoryAuto-1]}">
          {{ deal.auto.categoryAuto && categoryAutos.find((el => el.id === deal.auto.categoryAuto)).name }}
        </div>
      </div>


      <div class="info-filed" v-if="deal.auto.bodyType">
        <label class="label l_200">Тип кузова</label>
        {{ bodyTypes.find(el => el.id === deal.auto.engineType).name }}
      </div>

      <div class="info-filed" v-if="deal.auto.engineType">
        <label class="label l_200">Тип двигателя</label>
        {{ EngineType.find(el => el.id === deal.auto.engineType).name }}
      </div>

      <div class="info-filed" v-if="deal.auto.steeringWheelType">
        <label class="label l_200">Руль</label>
        {{ deal.auto.steeringWheelType === 10 ? 'Левый' : 'Правый' }}
      </div>
    </div>

  </div>
</template>
<style>
.info-filed {
  height: 30px;
}
</style>
<script setup lang="ts">


import MStatus from '@/pages/deal/tabs/status/MStatus.vue'
import { categoryAutos, EngineType, driveTypies, GearboxType, bodyTypes } from '@/utils/globalConstants'

const { deal } = defineProps(['deal'])

</script>
