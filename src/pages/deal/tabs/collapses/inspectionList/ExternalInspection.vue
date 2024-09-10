<template>
  <div>
    <div v-for="item in listData">
      <div v-if="!(globalStore.showOnlyErrors && item.isNorm)">
        <div style="max-width: 350px ;float: left">
          <el-icon style="color: green" v-if="item.isNorm"><CircleCheckFilled/></el-icon>
          <el-icon style="color: #f56c6c" v-if="!item.isNorm"><RemoveFilled/></el-icon>

          {{ item.name }}
        </div>

        <div style="float: right; cursor: pointer"
             @click="changeItem(item)"
             @mouseover="item.isNorm=!item.isNorm"
             @mouseleave="toMouseLeave(item)"
        >
          <el-button
            :type="!item.isNorm?'danger':'success'" style="width: 150px; pointer-events:none">
            <span>  {{ item.isNorm ? 'Норма' : 'Не норма !' }}</span>

          </el-button>
        </div>

        <div style="clear: both"></div>

        <div v-if="dangerField[item.id]" style="display: flex">

          <div style="display: flex; gap: 12px; float: left;  min-width: 282px">
            <UploadPhoto v-if="item.photos[0]" @setNewPhoto="setNewPhoto" :url="item.photos[0].previewPhotoPath" />
            <UploadPhoto v-if="item.photos[1]" @setNewPhoto="setNewPhoto" :url="item.photos[1].previewPhotoPath" />
          </div>

          <div>
            <el-select

              placeholder="можно несколько"
              style="width: 238px; padding: 4px 0"
              v-model="item.damageTypeArr"
              multiple
              filterable>
              <el-option v-for="item in item.damageItems"
                         :key="item.id"
                         :label="item.damageName"
                         :value="item.id" />
            </el-select>

            <div style="clear: both"></div>
          </div>
        </div>
        <el-divider/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useGlobalStore} from "@/stores/globalStore";
import { ref} from "vue";
import UploadPhoto from '@/components/UploadPhoto.vue'
import {CircleCheckFilled, RemoveFilled} from '@element-plus/icons-vue'

const globalStore = useGlobalStore()
const auto = ref({})
const dangerField = ref({})
const chapok = ref(false)
const dealId = ref(null)
const autoId = ref(null)
const inspectionId = ref(null)
const listData = ref([])

function setNewPhoto(val) {
  console.log('setNewPhoto = ',val)
}


function toMouseLeave(item) {
  if (!chapok.value) item.isNorm = !item.isNorm
  chapok.value = false
}


function changeItem(item) {
  if(chapok.value) item.isNorm = !item.isNorm
  dangerField.value[item.id] = !item.isNorm
  chapok.value = true
}

function open(_listData) {
  console.log('30 ')


  listData.value = _listData
  listData.value.map(el => {
    dangerField.value[el.id] = !el.isNorm // раскрываем поля с ошибками
    if( el.damageType)el.damageTypeArr = el.damageType.split(',').map(Number); // список повреждений
    return el
  })
}

defineExpose({open})
</script>