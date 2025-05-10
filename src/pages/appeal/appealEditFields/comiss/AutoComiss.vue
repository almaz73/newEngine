<template>

  <div >
    <el-collapse v-model="activeCollapse">

      <el-collapse-item
          v-if="appeal && !appeal.auto"
          :title="'&nbsp; Автомобиль'+(appeal.carBrandModel?': &nbsp; '+appeal.carBrandModel:'')"
          name="2" style="position: relative">
              <span class="button-on-collapse">
                   <el-button v-if="appealStore.comissId" type="success" size="small" @click="openEditCar()"> Заполнить данные авто (комиссия)</el-button>
                </span>
        <div style="width: 310px">
          <span class="label" v-if="appeal.carBrandModel">  Модель: </span>{{ appeal.carBrandModel }}
          <span class="label" v-if="appeal.yearReleased">  Год: </span>{{ appeal.yearReleased }}
          <span class="label" v-if="appeal.mileageAuto">  Пробег: </span>{{ appeal.mileageAuto }}
          <span class="label" v-if="appeal.deal && appeal.deal.dealStatus"> Статус: </span>
          {{ appeal && appeal.deal && statuses.find(el => el.id === appeal.deal.dealStatus).name }}
          <br><br>
        </div>
      </el-collapse-item>

      <el-collapse-item
          v-if="appeal.auto"
          :title="'&nbsp; Автомобиль: ' +
     ''+appeal.auto.brandTitle +' ' +(appeal.auto.modelTitle||'')+ '  '+ appeal.yearReleased+ '&nbsp;г. '+
                      (appeal.auto.vin?'  &nbsp; &nbsp; &nbsp;  vin: '+appeal.auto.vin:'')"
                        name="1" style="position: relative">
        <div style="display: flex; flex-wrap: wrap">
          <span class="button-on-collapse">
            <el-button type="success" size="small" @click="openEditCar()"> Редактировать авто</el-button>

          </span>

          <div>

            <el-button type="danger" v-if="appeal._" @click="clickAction(appeal._.action.value)">
              {{ appeal._.action.title }}
            </el-button>


            <div style="display: inline-block; float: right; margin-right: 40px">
              Цвет авто: &nbsp;
              <div
                style="display: inline-block;text-align: center; color: white; padding: 3px 20px;
                border: 1px solid #ddd;border-radius: 4px;text-shadow: 1px 1px 2px black"
                :style="{'background': appeal.auto.bodyColorCode}">
                {{ appeal.auto.bodyColorTitle }}
              </div>
            </div>
            <div style="clear: both"></div>

            <CarPhotosComiss />

          </div>

          <!--        Параметры-->
          <div style="width: 600px; ">
            <el-collapse accordion>
              <el-collapse-item :title="'Категория '+appeal.auto.categoryTitle">

                <div style="display: flex; flex-wrap: wrap">
                  <div>
                    <span class="label">Объем двигателя:</span> {{ appeal.auto.engineCapacity }}<br>
                    <span class="label">Мощность дв.(л.с.):</span> {{ appeal.auto.enginePowerHP }} <br>
                    <span class="label">Тип КПП:</span> {{ GearboxTypeEnum[appeal.auto.gearboxType] }} <br>
                    <span class="label">Привод:</span> {{ driveTypiesEnum[appeal.auto.driveType] }}<br>
                    <span class="label">Цвет:</span> {{ appeal.auto.bodyColorTitle }}<br>
                    <span class="label">Пробег авто (км):</span> {{ appeal.mileageAuto }}<br>
                    <span class="label">Тип кузова:</span> {{ bodyTypesEnum[appeal.auto.bodyType] }}<br>
                  </div>
                  <div>
                    <span class="label">Тип двигателя:</span> {{ EngineTypeEnum[appeal.auto.engineType] }}<br>
                    <span class="label">Номер двигателя:</span> {{ appeal.auto.engineBrandAndNumber }} <br>
                    <span class="label">Номер кузова:</span> {{ appeal.auto.bodyNumber }}<br>
                    <template v-if="appeal.auto.certificate">
                      <span class="label">Гос. номер:</span> {{ appeal.auto.certificate.registrationMark }}<br>
                      <span class="label">Марка по ПТС:</span> {{ appeal.auto.certificate.brandVCTitle }}<br>
                      <span class="label">Модель по ПТС:</span> {{ appeal.auto.certificate.modelVCTitle }}<br>
                      <span class="label">ПТС оригинальный:</span>
                      {{ appeal.auto.certificate.isOriginalVC ? 'Да' : 'Нет' }}<br>
                    </template>
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
  <EditCarModal ref="editCarModal" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { bodyTypesEnum, driveTypiesEnum, EngineTypeEnum, GearboxTypeEnum } from '@/utils/globalConstants'
import CarPhotosComiss from '@/pages/appeal/appealEditFields/comiss/CarPhotosComiss.vue'
import EditCarModal from "@/pages/appeal/appealEditFields/comiss/EditCarModal.vue";
import {useAppealStore} from "@/stores/appealStore";

const appealStore = useAppealStore()
const activeCollapse = ref(['1'])
const { appeal } = defineProps(['appeal'])
const editCarModal = ref(null)

function openEditCar() {
  editCarModal.value.open(appeal)
}

function clickAction(actionNumber:number) {
  if (actionNumber === 10) {
    console.log('10  action.inspection.add() ', 10)
    /*if ($scope.model.inspection) {
      $location.path('appeal/commission/' + $scope.model.id + '/inspection/' + $scope.model.inspection.id + '/10');
    } else {
      PostService.Post(ControllerEnums.Commission.AddInspection + '/' + $scope.model.id).then(
          function (data) {
            $location.path('appeal/commission/' + $scope.model.id + '/inspection/' + data.id + '/10',);
          },
      );
    }*/
  }
  if (actionNumber === 20) {
    console.log('20  action.auto.take() ', 20)

    /*$scope.load.currentUser();
    GetService.Get(ControllerEnums.Commission.GetLocationSell, { id: $scope.model.id }).then(function ( data ) {
      $scope.sellLocations = data.items;
    });
    GetService.Get(ControllerEnums.Lead.GetCommission, {
      userId: $scope.model.appeal.responsibleId,
    }).then(function (data) {
      $scope.commissionLeads = data.items;
      $scope.isInitProxy = !!$scope.model.proxy;
      $scope.workModel = angular.copy($scope.model);
      UIkit.modal('#setPrice_modal').show();
    });*/

  }
  if (actionNumber === 30) {
    console.log('30  action.prices.open() ', 30)

    // $scope.load.currentUser();
    // UIkit.modal('#setPrice_modal').show();
    // $scope.calculate.sellPercent();
    // $scope.isInitProxy = !!$scope.model.proxy;
    // $scope.workModel = angular.copy($scope.model);

  }


}


</script>

