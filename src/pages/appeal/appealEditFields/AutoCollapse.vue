<template>

  <div v-if="appeal.auto">
    <el-collapse v-model="activeCollapse">
      <el-collapse-item :title="'&nbsp; Автомобиль: ' +
     ''+appeal.auto.carBrand +' ' +(appeal.auto.carModel||'')+ '  '+ appeal.auto.yearReleased+ '&nbsp;г. '+
                      (appeal.auto.vin?'  &nbsp; &nbsp; &nbsp;  vin: '+appeal.auto.vin:'')"
                        name="1" style="position: relative">
        <div style="display: flex; flex-wrap: wrap">
          <span class="button-on-collapse">
            <el-button type="success" size="small" @click="openEditCar()"> Редактировать авто</el-button>
<!--            &nbsp;-->
<!--&lt;!&ndash;            <RouterLink :to="`/auto/deal/add/clientId/${appeal.leadId}/parentId/${appeal.id}`">&ndash;&gt;-->
<!--&lt;!&ndash;              <el-button type="success" :icon="Edit" size="small">Оценивать авто</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;            </RouterLink>&ndash;&gt;-->
          </span>

          <div>
            <el-button type="danger">Принять автомобиль</el-button>
            <div style="display: inline-block; float: right; margin-right: 40px">
              Цвет автомобиля:
              <div
                style="display: inline-block;text-align: center; color: white;
                border: 1px solid gray;width: 120px;height: 25px;border-radius: 4px;text-shadow: 1px 1px 2px black"
                :style="{'background': appeal.auto.bodyColorCode}">
                {{ appeal.auto.bodyColorName }}
              </div>
            </div>
            <div style="clear: both"></div>

            <div style="max-width: 500px; display: flex; flex-wrap: wrap">
              <div v-for="a in [1,2,3,4,5,6]"
                   style="width: 150px; height: 100px; background: #6b6b6b; margin: 2px">
                Салон - приборня доска
              </div>
            </div>
          </div>

          <!--        Параметры-->
          <div style="width: 600px; ">
            <el-collapse accordion v-model="activeCollapseSub">
              <el-collapse-item title="Категория">
                <div style="display: flex; flex-wrap: wrap">
                  <div>
                    <span class="label">Объем двигателя:</span> {{ appeal.auto.engineCapacity }}<br>
                    <span class="label">Мощность дв.(л.с.):</span> {{ appeal.auto.enginePowerHP }} <br>
                    <span class="label">Тип КПП:</span> {{ GearboxTypeEnum[appeal.auto.gearboxType] }} <br>
                    <span class="label">Привод:</span> {{ driveTypiesEnum[appeal.auto.driveType] }}<br>
                    <span class="label">Цвет:</span> {{ appeal.auto.bodyColorName }}<br>
                    <span class="label">Пробег авто (км):</span> {{ appeal.mileageAuto }}<br>
                    <span class="label">Тип кузова:</span> {{ bodyTypesEnum[appeal.auto.bodyType] }}<br>
                  </div>
                  <div>
                    <span class="label">Тип двигателя:</span> {{ EngineTypeEnum[appeal.auto.engineType] }}<br>
                    <span class="label">Номер двигателя:</span> {{ appeal.auto.engineBrandAndNumber }} <br>
                    <span class="label">Номер кузова:</span> {{ appeal.auto.bodyNumber }}<br>
                    <span class="label">Гос. номер:</span> {{ appeal.auto.registrationMark }}<br>
                    <span class="label">Марка по ПТС:</span> {{ appeal.auto.brandByVC }}<br>
                    <span class="label">Модель по ПТС:</span> {{ appeal.auto.modelByVC }}<br>
                    <span class="label">ПТС оригинальный:</span> {{ appeal.auto.isOriginalVC ? 'Да' : 'Нет' }}<br>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="Осмотр">
                <div>
                  Operation feedback: enable the users to clearly perceive their
                  operations by style updates and interactive effects;
                </div>
              </el-collapse-item>
              <el-collapse-item title="Финансовая оценка">
                <div style="width: 400px">
                  <span class="label l_200">Цена клиента:</span>
                  <span class="label l_200">Комиссионное вознаграждение:</span>
                  <span class="label l_200">Цена продажи:</span>

                  <span class="label l_200">Изменить цену:</span>
                  <span class="label l_200">Максимальная цена выкупа:</span>
                  <span class="label l_200">Цена продажи (план):</span>
                </div>
              </el-collapse-item>
              <el-collapse-item title="Собственник" name="4">
                <div>
                  <span class="label">Собственник:</span> {{ appeal.leadName }}
                </div>
              </el-collapse-item>

              <!--              todo есть поле комментариев внизу, только нужно по comissId переделать надо-->
              <!--              <el-collapse-item title="Комментарий">-->
              <!--                <div>-->
              <!--                  <el-button @click="saveComment()"> Добавить комментарий</el-button>-->
              <!--                </div>-->
              <!--              </el-collapse-item>-->
            </el-collapse>
          </div>

        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
<EditCarModal ref="editCarModal"/>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore'
import { ref } from 'vue'
import { bodyTypesEnum, driveTypiesEnum, EngineTypeEnum, GearboxTypeEnum } from '@/utils/globalConstants'
import { useAppealStore } from '@/stores/appealStore'
import EditCarModal from '@/pages/appeal/appealEditFields/EditCarModal.vue'

const appealStore = useAppealStore()
const globalStore = useGlobalStore()
const activeCollapse = ref(['1'])
const activeCollapseSub = ref('4')
const { appeal } = defineProps(['appeal'])
const editCarModal = ref(null)


function openEditCar() {
  editCarModal.value.open(appeal)
}


</script>

