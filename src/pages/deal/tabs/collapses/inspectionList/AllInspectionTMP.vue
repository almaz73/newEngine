<template>
  <div>
    <div v-for="item in listData">
      <div v-if="!(globalStore.showOnlyErrors && item.isNorm)">
        <div style="float: left" :style="{'max-width':categoryId!=='30'?'350px':'273px'}">
          <span v-if="!['20'].includes(categoryId)">
            <el-icon style="color: green" v-if="item.isNorm && !item.isRepaired ">
              <CircleCheckFilled />
            </el-icon>
            <el-icon v-else
                     :style="{color: dangerField[item.id].isNorm?'#f56c6c':'orange'}">
              <RemoveFilled />
            </el-icon>
          </span>
          <span v-else>
            <el-icon style="color: green" v-if="!dangerField[item.id].isStock">
              <CircleCheck />
            </el-icon>
            <el-icon style="color: #f99" v-if="dangerField[item.id].isStock">
              <CircleClose />
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


        <div v-if="['20'].includes(categoryId)"
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


        <div v-if="['70'].includes(categoryId)"
             style="float: right; cursor: pointer"
             @click="changeItem(item, 'isPlainWork')"
             @mouseover="item.isPlainWork=!item.isPlainWork"
             @mouseleave="toMouseLeave(item, 'isPlainWork')"
        >
          <el-button
            :style="{background :item.isPlainWork?'#f56c6c':'#c6e0cc', color:item.isPlainWork?'white':''}"
            style="width: 150px; pointer-events:none">
            <span>  {{ item.isStock ? 'Норма' : 'Не норма !' }}</span>
          </el-button>
        </div>


        <div v-if="!['20', '30', '70'].includes(categoryId) "
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


        <div v-if="['30', '90'].includes(categoryId)
                   && (item.isPaintworkAvailable
                   || item.paintworks && item.paintworks.length)">
          <div style="clear: both"></div>
          <small style="float: right; cursor: pointer; padding-top: 8px"
                 :style="{opacity:item.paintworks.length?1:0.2}"
                 @click="showLKP(item)">
            Толщина ЛКП (мкм)
            <el-icon>
              <Bottom />
            </el-icon>
            <span v-if="!LKPfields[item.id]">
              &nbsp; {{ item.paintworks.join(', ') }}
            </span>
          </small>
          <div style="clear: both"></div>
          <div v-if="LKPfields[item.id]" style="float:right; padding: 8px ">
            <div v-for="(work, ind) in item.paintworks" :key="ind">
              <input v-if="lkpModel[item.id]"
                     type="number"
                     min="0"
                     v-model="lkpModel[item.id][ind]"
                     style="width: 73px; text-align: center; border: none" />
              &nbsp;
              <el-icon @click="deleteLKP(item.id, ind)">
                <DeleteCtrl title="Удалить" />
              </el-icon>&nbsp;<el-icon @click="addLKP(item.id, ind)"
                                       size="small"
                                       v-if="lkpModel[item.id] && ind===lkpModel[item.id].length-1">
              <DeleteCtrl style="transform: rotate(45deg)" />
            </el-icon>
            </div>
          </div>

        </div>


        <div style="clear: both"></div>

        <div v-if="!['20'].includes(categoryId) && dangerField[item.id].isNorm" style="display: flex">

          <div v-if="item.photos"
               style="display: flex; gap: 12px; float: left;  min-width: 282px; margin-top: 4px">
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
              @setNewPhoto="setNewPhoto" />
            <UploadPhotoInspection
              v-if="item.photos[0] && !item.photos[1]"
              :itemId="item.id"
              @setNewPhoto="setNewPhoto" />
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
        <el-divider />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore'
import { ref } from 'vue'
import UploadPhotoInspection from '@/components/UploadPhotoInspection.vue'
import { Bottom, CircleCheck, CircleCheckFilled, CircleClose, RemoveFilled } from '@element-plus/icons-vue'
import DeleteCtrl from '@/controls/DeleteCtrl.vue'

const globalStore = useGlobalStore()
const dangerField = ref({})
const chapok = ref(false) // помощник при нажатиии кнопок
const listData = ref([])

const { categoryId } = defineProps(['categoryId'])
const LKPfields = ref({}) // раскрытие ЛКП
const lkpModel = ref({}) // содержимое ЛКП

function addLKP(id: number) {
  let row = listData.value.find(el => el.id === id)
  row.paintworks.push(0)
}

function deleteLKP(id: number, ind: number) {
  let row = listData.value.find(el => el.id === id)
  row.paintworks.splice(ind, 1)
  if (!row.paintworks.length) addLKP(id)
}

function showLKP(item: any) {
  LKPfields.value[item.id] = !LKPfields.value[item.id]
  let row = listData.value.find(el => el.id === item.id)
  lkpModel.value[item.id] = row.paintworks
  if (!row.paintworks.length) addLKP(item.id)
}

function setNewPhoto(val: any, type: string) {
  if (type === 'delete') {
    listData.value = listData.value.map(el => {
      el.photos = el.photos.filter(res => res.id !== val.id)
      return el
    })
  } else if (type === 'addPhoto') {
    let row = listData.value.find(el => el.id === val.itemId)
    row.photos.push({
      photoPath: val.photoPath,
      previewPhotoPath: val.photoPath, itemId: val.itemId,
      photo: val.photoPath.slice(23)
    })
  }

}


function toMouseLeave(item: any, type: string) {
  if (!chapok.value) {
    if (type === 'isNorm') item.isNorm = !item.isNorm
    if (type === 'isRepaired') item.isRepaired = !item.isRepaired
    if (type === 'isStock') item.isStock = !item.isStock
    if (type === 'isPlainWork') item.isPlainWork = !item.isPlainWork
  }
  chapok.value = false
}

function changeItem(item: any, type: string) {
  if (chapok.value && type === 'isNorm') item.isNorm = !item.isNorm
  if (chapok.value && type === 'isRepaired') item.isRepaired = !item.isRepaired
  if (chapok.value && type === 'isStock') item.isStock = !item.isStock
  if (chapok.value && type === 'isPlainWork') item.isPlainWork = !item.isPlainWork

  if (type === 'isNorm') dangerField.value[item.id].isNorm = !item.isNorm
  if (type === 'isRepaired') dangerField.value[item.id].isRepaired = item.isRepaired
  if (type === 'isStock') dangerField.value[item.id].isStock = !item.isStock
  if (type === 'isPlainWork') dangerField.value[item.id].isPlainWork = !item.isPlainWork

  chapok.value = true
}

function open(_listData: any) {
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

defineExpose({ open })
</script>