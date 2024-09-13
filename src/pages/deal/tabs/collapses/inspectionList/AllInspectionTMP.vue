<template>
  <div>
    <div v-for="item in listData">
      <div v-if="!(globalStore.showOnlyErrors && item.isNorm)">
        <div style="float: left" :style="{'max-width':categoryId!==30?'350px':'273px'}">
          <span v-if="!['20'].includes(categoryId)">
            <el-icon style="color: green" v-if="item.isNorm && !item.isRepaired ">
              <CircleCheckFilled/>
            </el-icon>
            <el-icon v-else
                     :style="{color: dangerField[item.id].isNorm?'#f56c6c':'orange'}">
              <RemoveFilled/>
            </el-icon>
          </span>
          <span v-else>
            <el-icon style="color: #777" v-if="!dangerField[item.id].isNorm">
              <CircleCheck/>
            </el-icon>
            <el-icon style="color: #eee" v-if="dangerField[item.id].isNorm">
              <RemoveFilled/>
            </el-icon>
          </span>

          {{ item.name }}
        </div>


        <div v-if="['30'].includes(categoryId)"
             style="float: right; cursor: pointer"
             @click="changeItem(item, 'isNorm')"
             @mouseover="item.isNorm=!item.isNorm"
             @mouseleave="toMouseLeave(item, 'isNorm')"
        >
        &nbsp; &nbsp;<el-button
              :type="!item.isNorm?'danger':'success'"
              style="width: 150px; pointer-events:none; width: 111px">
            <span>  {{ item.isNorm ? 'Норма' : 'Не норма !' }}</span>
          </el-button>
        </div>
        <div v-if="['30'].includes(categoryId)"
             style="float: right; cursor: pointer"
             @click="changeItem(item, 'isRepaired')"
             @mouseover="item.isRepaired=!item.isRepaired"
             @mouseleave="toMouseLeave(item, 'isRepaired')"
        >
          <el-button
              :style="{'background' :item.isRepaired?'orange':'#c6e0cc'}"
              style="width: 150px; pointer-events:none; width: 112px">
            <span>  {{ !item.isRepaired ? 'Оригинал' : 'Не оригинал !' }}</span>
          </el-button>
        </div>




        <div  v-if="['20'].includes(categoryId)"
              style="float: right; cursor: pointer"
              @click="changeItem(item, 'isStock')"
              @mouseover="item.isStock=!item.isStock"
              @mouseleave="toMouseLeave(item, 'isStock')"
        >
          <el-button
            :style="{'background' :!item.isStock?'#eee':'#c6e0cc'}" style="width: 150px; pointer-events:none">
            <span>  {{ item.isStock ? 'Присутствует' : 'Отсутствует' }}</span>
          </el-button>
        </div>


        <div v-if="!['20', '30'].includes(categoryId) "
             style="float: right; cursor: pointer"
             @click="changeItem(item, 'isNorm')"
             @mouseover="item.isNorm=!item.isNorm"
             @mouseleave="toMouseLeave(item, 'isNorm')"
        >
          <el-button
              :type="!item.isNorm?'danger':'success'" style="width: 150px; pointer-events:none">
            <span>  {{ item.isNorm ? 'Норма' : 'Не норма !' }}</span>
          </el-button>
        </div>

        <div style="clear: both"></div>

        <div v-if="!['20'].includes(categoryId) && dangerField[item.id].isNorm" style="display: flex">

          <div style="display: flex; gap: 12px; float: left;  min-width: 282px; margin-top: 4px">
            <UploadPhotoInspection
              v-if="item.photos[0]"
              @setNewPhoto="setNewPhoto"
              :itemId="item.id"
              :photo="item.photos[0]" />
            <UploadPhotoInspection
              v-if="item.photos[1]"
              @setNewPhoto="setNewPhoto"
              :itemId="item.id"
              :photo="item.photos[1]" />
            <UploadPhotoInspection
              v-if="!item.photos[0]"
              :itemId="item.id"
              @setNewPhoto="setNewPhoto"/>
            <UploadPhotoInspection
              v-if="item.photos[0] && !item.photos[1]"
              :itemId="item.id"
              @setNewPhoto="setNewPhoto"/>
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
                         :value="item.id"/>
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
import {useGlobalStore} from '@/stores/globalStore'
import { ref } from 'vue'
import UploadPhotoInspection from '@/components/UploadPhotoInspection.vue'
import {CircleCheck, CircleCheckFilled, RemoveFilled} from '@element-plus/icons-vue'

const globalStore = useGlobalStore()
const dangerField = ref({})
const chapok = ref(false) // помощник при нажатиии кнопок
const listData = ref([])

const {categoryId} = defineProps(['categoryId'])


function setNewPhoto(val: any, type) {
  if (type === 'delete') {
    listData.value = listData.value.map(el => {
      el.photos = el.photos.filter(res => res.id !== val.id)
      return el
    })
  } else if(type==='addPhoto'){
    let row = listData.value.find(el=>el.id===val.itemId)
    row.photos.push({ photoPath: val.photoPath,
      previewPhotoPath: val.photoPath, itemId: val.itemId,
      photo: val.photoPath.slice(23) })
  }

}


function toMouseLeave(item: any, type: string) {
  if (!chapok.value) {
    if (type === 'isNorm') item.isNorm = !item.isNorm
    if (type === 'isRepaired') item.isRepaired = !item.isRepaired
    if (type === 'isStock') item.isStock = !item.isStock
  }
  chapok.value = false
}

function changeItem(item: any, type: string) {
  if (chapok.value && type === 'isNorm') item.isNorm = !item.isNorm
  if (chapok.value && type === 'isRepaired') item.isRepaired = !item.isRepaired
  if (chapok.value && type === 'isStock') item.isStock = !item.isStock

  if (type === 'isNorm') dangerField.value[item.id].isNorm = !item.isNorm
  if (type === 'isRepaired') dangerField.value[item.id].isRepaired = item.isRepaired
  if (type === 'isStock') dangerField.value[item.id].isStock = !item.isStock

  chapok.value = true
}

function open(_listData: any) {
  console.log('TMP')
  listData.value = _listData
  listData.value.map(el => {
    el.nav = el.id // ?
    if (!dangerField.value[el.id]) dangerField.value[el.id] = {}
    dangerField.value[el.id].isNorm = !el.isNorm // раскрываем поля с ошибками
    dangerField.value[el.id].isRepaired = !el.isRepaired // раскрываем поля с ошибками
    dangerField.value[el.id].isStock = !el.isStock // раскрываем поля с ошибками
    if (el.damageType) el.damageTypeArr = el.damageType.split(',').map(Number) // список повреждений
    return el
  })
}

defineExpose({open})
</script>