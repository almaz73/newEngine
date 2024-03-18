<template>
  <!--  :title="'Автомобиль: '+auto.carBrand+ ' ' + auto.carModel"-->
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 360: 410"
            :top="73"
            :title="'Автомобиль'"
            :subtitle="' vin: '+ auto?auto.vin:'' "
            draggable>
    <el-scrollbar :maxHeight="globalStore.isMobileView?'500px':'680px'">
      <svg xmlns="http://www.w3.org/2000/svg" width="73" height="73" viewBox="0 0 24 24"
           style="position: absolute; left: 10px; " :style="{fill:svgColor}">
        <path
            d="M23.5 7c.276 0 .5.224.5.5v.511c0 .793-.926.989-1.616.989l-1.086-2h2.202zm-1.441 3.506c.639 1.186.946 2.252.946 3.666 0 1.37-.397 2.533-1.005 3.981v1.847c0 .552-.448 1-1 1h-1.5c-.552 0-1-.448-1-1v-1h-13v1c0 .552-.448 1-1 1h-1.5c-.552 0-1-.448-1-1v-1.847c-.608-1.448-1.005-2.611-1.005-3.981 0-1.414.307-2.48.946-3.666.829-1.537 1.851-3.453 2.93-5.252.828-1.382 1.262-1.707 2.278-1.889 1.532-.275 2.918-.365 4.851-.365s3.319.09 4.851.365c1.016.182 1.45.507 2.278 1.889 1.079 1.799 2.101 3.715 2.93 5.252zm-16.059 2.994c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zm10 1c0-.276-.224-.5-.5-.5h-7c-.276 0-.5.224-.5.5s.224.5.5.5h7c.276 0 .5-.224.5-.5zm2.941-5.527s-.74-1.826-1.631-3.142c-.202-.298-.515-.502-.869-.566-1.511-.272-2.835-.359-4.441-.359s-2.93.087-4.441.359c-.354.063-.667.267-.869.566-.891 1.315-1.631 3.142-1.631 3.142 1.64.313 4.309.497 6.941.497s5.301-.184 6.941-.497zm2.059 4.527c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zm-18.298-6.5h-2.202c-.276 0-.5.224-.5.5v.511c0 .793.926.989 1.616.989l1.086-2z"/>
      </svg>


      <small>
        <label class="label-right l_150">Марка:</label>
        <el-select
            style="width: 200px"
            v-model="auto.carBrandId"
            :filterable="!globalStore.isMobileView"
            @change="changeBrand(auto.carBrandId)"
            clearable
        >
          <el-option v-for="brand in brands" :key="brand.id" :label="brand.name" :value="brand.id"/>
        </el-select>
      </small>

      <small>
        <label class="label-right l_150">Модель:</label>
        <el-select
            style="width: 200px"
            v-model="auto.carModelId"
            :filterable="!globalStore.isMobileView"
            placeholder="Модель">
          <el-option v-for="item in models" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </small>

      <small>
        <label class="label-right l_150">Цвет:</label>
        <el-select
            style="width: 200px"
            v-model="auto.bodyColorId"
            :filterable="!globalStore.isMobileView"
            clearable
            @change="changeColor(auto.bodyColorId)"
        >
          <el-option v-for="color in colors" :key="color.id" :label="color.colorName" :value="color.id"/>
        </el-select>
      </small>

      <small>
        <label class="label-right l_150">Год выпуска:</label>
        <el-date-picker
            class="auto-panel"
            v-model="auto.yearReleased"
            type="year"
            :clearable="false"
        />
      </small>
      <small>
        <label class="label-right l_150">Пробег:</label>
        <el-input title="Пробег" v-model="auto.lastName"/>
      </small>

      <small>
        <label class="label-right l_150">Тип кузова:</label>
        <el-select
            style="width: 200px"
            v-model="smsTemplate"
            :filterable="!globalStore.isMobileView"
            clearable
            @change="changeTeplate()"
        >
          <el-option v-for="tmpl in smsTemplates" :key="tmpl.id" :label="tmpl.title" :value="tmpl.id"/>
        </el-select>
      </small>
      <small>
        <label class="label-right l_150">Тип двигателя:</label>
        <el-select
            style="width: 200px"
            v-model="smsTemplate"
            :filterable="!globalStore.isMobileView"
            clearable
            @change="changeTeplate()"
        >
          <el-option v-for="tmpl in smsTemplates" :key="tmpl.id" :label="tmpl.title" :value="tmpl.id"/>
        </el-select>
      </small>
      <small>
        <label class="label-right l_150">Объем двигателя:</label>
        <el-select
            style="width: 200px"
            v-model="smsTemplate"
            :filterable="!globalStore.isMobileView"
            clearable
            @change="changeTeplate()"
        >
          <el-option v-for="tmpl in smsTemplates" :key="tmpl.id" :label="tmpl.title" :value="tmpl.id"/>
        </el-select>
      </small>
      <small>
        <label class="label-right l_150">Тип КПП:</label>
        <el-select
            style="width: 200px"
            v-model="smsTemplate"
            :filterable="!globalStore.isMobileView"
            clearable
            @change="changeTeplate()"
        >
          <el-option v-for="tmpl in smsTemplates" :key="tmpl.id" :label="tmpl.title" :value="tmpl.id"/>
        </el-select>
      </small>
      <small>
        <label class="label-right l_150">Тип привода:</label>
        <el-select
            style="width: 200px"
            v-model="smsTemplate"
            :filterable="!globalStore.isMobileView"
            clearable
            @change="changeTeplate()"
        >
          <el-option v-for="tmpl in smsTemplates" :key="tmpl.id" :label="tmpl.title" :value="tmpl.id"/>
        </el-select>
      </small>
      <small>
        <label class="label-right l_150">Салон:</label>
        <el-select
            style="width: 200px"
            v-model="smsTemplate"
            :filterable="!globalStore.isMobileView"
            clearable
            @change="changeTeplate()"
        >
          <el-option v-for="tmpl in smsTemplates" :key="tmpl.id" :label="tmpl.title" :value="tmpl.id"/>
        </el-select>
      </small>
      <small>
        <label class="label-right l_150">Комфорт:</label>
        <el-select
            style="width: 200px"
            v-model="smsTemplate"
            :filterable="!globalStore.isMobileView"
            clearable
            @change="changeTeplate()"
        >
          <el-option v-for="tmpl in smsTemplates" :key="tmpl.id" :label="tmpl.title" :value="tmpl.id"/>
        </el-select>
      </small>
      <div><br>
        <el-input v-model="smsText" type="textarea" placeholder="Комлпектация"/>
      </div>
      <br>
    </el-scrollbar>
    <div style="text-align: right">
      <el-button type="danger" @click="save()">Сохранить</el-button>
      <el-button type="info" @click="clear()">Отменить</el-button>
    </div>
  </AppModal>
</template>

<style>
.auto-panel .el-input__wrapper {
  width: 180px;
}

</style>


<script setup>
import AppModal from "@/components/AppModal.vue";
import {ref} from "vue";
import {useGlobalStore} from "@/stores/globalStore";

const closeModal = () => isOpen.value = false
const globalStore = useGlobalStore()
const smsText = ref('')
const smsTemplates = ref([])
const smsTemplate = ref(null)
const smsDate = ref(null)
const isOpen = ref(false)
const auto = ref(null)
const brands = ref([])
const models = ref([])
const colors = ref([])
const svgColor = ref('white')
let cb = null


function changeBrand(id) {
  globalStore.getModels(id).then(res => models.value = res)
}


function clear() {
  smsTemplate.value = null
  smsText.value = ''
  smsDate.value = null
  isOpen.value = false
}


function changeTeplate() {
  console.log('030303 todo')
}

function changeColor(colorId) {
  if (!colorId) return false
  svgColor.value = colors.value.find(el => el.id === colorId).colorCode
}

function check() {
  // if (smsDate.value < new Date()) return ElMessage({message: 'Выбранная дата меньше текущей', type: 'warning'})
}

function save() {
  if (check()) return false
  console.log('ЭТО НЕ СОХРАНЯЕТСЯ ПОКА TODO auto.value', auto.value)
}

function open(row, cbModal) {
  console.log('', row)
  cb = cbModal
  auto.value = row.auto || {}

  if (!auto.value.carBrandId) auto.value.carBrandId = row.carBrandId

  isOpen.value = true

  globalStore.getBrands().then(res => brands.value = res)
  globalStore.getColors().then(res => colors.value = res.items)
  globalStore.getBrands().then(res => brands.value = res)

  setTimeout(() => {
    changeBrand(auto.value.carBrandId)
    changeColor(auto.value.bodyColorId)
  })

}

defineExpose({open});

</script>