<template>
  <div>
    <div v-for="item in listData" :key="item.id">
      <div v-if="!item.isHidden">
        <div style="float: left" :style="{'max-width':categoryId!=='30'?'350px':'273px'}">
          <span v-if="!['10','20','80','70'].includes(categoryId)">
            <el-icon style="color: green" v-if="item.isNorm && !item.isRepaired ">
              <CircleCheckFilled/>
            </el-icon>
            <el-icon v-else :style="{color: dangerField[item.id].isNorm?'#f56c6c':'orange'}">
              <RemoveFilled/>
            </el-icon>
          </span>

          <span v-else-if="categoryId==='70' && item.name!=='Диагностика'">
            <el-icon style="color: green" v-if="item.isNorm && !item.isRepaired ">
              <CircleCheckFilled/>
            </el-icon>
            <el-icon v-else :style="{color: dangerField[item.id].isNorm?'#f56c6c':'orange'}">
              <RemoveFilled/>
            </el-icon>
          </span>

          <span v-else-if="categoryId==='80'">
            <el-icon style="color: green" v-if="dangerField[item.id].isRequired">
              <CircleCheck/>
            </el-icon>
            <el-icon style="color: #f99" v-if="!dangerField[item.id].isRequired">
              <CircleClose/>
            </el-icon>
          </span>

          <span v-else>
            <el-icon style="color: green" v-if="!dangerField[item.id].isStock">
             <CircleCheck/>
            </el-icon>
            <el-icon style="color: #f99" v-if="dangerField[item.id].isStock">
             <CircleClose/>
            </el-icon>
          </span>

          {{ item.name }}
        </div>

        <div v-if="globalStore.isMobileView" style="clear: both; padding: 4px"></div>


        <div v-if="['30'].includes(categoryId)"
             style="float: right; cursor: pointer"
             @click="changeItem(item, 'isNorm')"
             @mouseover="item.isNorm=!item.isNorm"
             @mouseleave="toMouseLeave(item, 'isNorm')"
        >
          &nbsp; &nbsp;<el-button
            :type="!item.isNorm?'danger':'success'"
            style="pointer-events:none; width: 111px">
          <span>  {{ item.isNorm ? 'Целый' : 'Поврежден !' }}</span>
        </el-button>
        </div>
        <div v-if="['30'].includes(categoryId)"
             style="float: right; cursor: pointer"
             @click="changeItem(item, 'isRepaired')"
             @mouseover="item.isRepaired=!item.isRepaired"
             @mouseleave="toMouseLeave(item, 'isRepaired')"
        >
          <el-button
              :style="{'background' :item.isRepaired?'orange':'#3cac71'}"
              style="pointer-events:none; width: 112px; color: white">
            <span>  {{ !item.isRepaired ? 'Оригинал' : 'Не оригинал !' }}</span>
          </el-button>
        </div>


        <div v-if="['10','20'].includes(categoryId)"
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
              v-if="item.name!=='Диагностика'"
              :style="{background :item.isPlainWork?'#f56c6c':'#3cac71'}"
              style="width: 150px; pointer-events:none; color:white">
            <span>  {{ item.isPlainWork ? 'Не норма !' : 'Норма' }}</span>
          </el-button>
          <el-button
              v-if="item.name==='Диагностика'"
              :style="{background :item.isStock?'#3cac71':'#f56c6c'}"
              style="width: 150px; pointer-events:none; color:white">
            <span>  {{ item.isStock ? 'Присутствует' : 'Отсутствует !' }}</span>
          </el-button>
        </div>

        <div v-if="['80'].includes(categoryId)"
             style="float: right; cursor: pointer"
             @click="changeItem(item, 'isRequired')"
             @mouseover="item.isRequired=!item.isRequired"
             @mouseleave="toMouseLeave(item, 'isRequired')"
        >
          <el-button
              :style="{background :item.isRequired?'#f56c6c':'#3cac71'}"
              style="width: 150px; pointer-events:none; color: white">
            <span>  {{ item.isRequired ? 'Не требуется' : 'Необходимо !' }}</span>
          </el-button>
        </div>

        <div v-if="!['10', '20', '30', '70', '80'].includes(categoryId) "
             style="float: right; cursor: pointer"
             @click="changeItem(item, 'isNorm')"
             @mouseover="item.isNorm=!item.isNorm"
             @mouseleave="toMouseLeave(item, 'isNorm')"
        >
          <el-button
              :type="!item.isNorm?'danger':'success'" style="width: 150px; pointer-events:none">
            <span>  {{
                item.isNorm ? 'Норма' : (['60'].includes(categoryId) ? 'С нарушениями !' : 'Не норма !')
              }}</span>
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
              <Bottom/>
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
                     style="width: 73px; text-align: center; border: none"/>
              &nbsp;
              <el-icon @click="deleteLKP(item.id, ind)">
                <DeleteCtrl title="Удалить"/>
              </el-icon>&nbsp;<el-icon @click="addLKP(item.id, ind)"
                                       size="small"
                                       v-if="lkpModel[item.id] && ind===lkpModel[item.id].length-1">
              <DeleteCtrl style="transform: rotate(45deg)"/>
            </el-icon>
            </div>
          </div>

        </div>


        <div style="clear: both"></div>

        <div v-if="!['10','20','80'].includes(categoryId) && dangerField[item.id].isNorm"
             style="display: flex; flex-wrap: wrap">

          <div v-if="item.photos"
               style="display: flex; gap: 12px; float: left;  min-width: 282px; margin-top: 4px">
            <UploadPhotoInspection
                v-if="item.photos[0]"
                @setNewPhoto="setNewPhoto"
                :itemId="item.id"
                :photo="item.photos[0]"/>
            <UploadPhotoInspection
                v-if="item.photos[1]"
                @setNewPhoto="setNewPhoto"
                :itemId="item.id"
                :photo="item.photos[1]"/>
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
                @change="emits('listChanged')"
                filterable>
              <el-option v-for="item in item.damageItems"
                         :key="item.id"
                         :label="item.damageName"
                         :value="item.id"/>
            </el-select>

            <div style="clear: both"></div>
          </div>
        </div>
        <small v-if="['10'].includes(categoryId)" style="color:#999"> Комментарий: <br>
          <el-input v-model="item.comment" type="textarea" :rows="2" placeholder="добавить"></el-input>
        </small>
        <el-divider/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useGlobalStore} from '@/stores/globalStore'
import {ref} from 'vue'
import UploadPhotoInspection from '@/components/UploadPhotoInspection.vue'
import {Bottom, CircleCheck, CircleCheckFilled, CircleClose, RemoveFilled} from '@element-plus/icons-vue'
import DeleteCtrl from '@/controls/DeleteCtrl.vue'

const globalStore = useGlobalStore()
const dangerField = ref<any>()
const chapok = ref(false) // помощник при нажатиии кнопок
const listData = ref<any>()

const {categoryId} = defineProps(['categoryId'])
const emits = defineEmits(['listChanged'])
const LKPfields = ref<any>() // раскрытие ЛКП
const lkpModel = ref<any>()  // содержимое ЛКП

function addLKP(id: number) {
  let row = listData.value.find((el: any) => el.id === id)
  row.paintworks.push(0)
}

function deleteLKP(id: number, ind: number) {
  let row = listData.value.find((el: any) => el.id === id)
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
      el.photos = el.photos.filter((res: any) => res.id !== val.id)
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
    if (type === 'isRequired') item.isRequired = !item.isRequired
    if (type === 'isStock') item.isStock = !item.isStock
    if (type === 'isPlainWork') item.isPlainWork = !item.isPlainWork
  }
  chapok.value = false
}

function changeItem(item: any, type: string) {
  if (chapok.value && type === 'isNorm') item.isNorm = !item.isNorm
  if (chapok.value && type === 'isRepaired') item.isRepaired = !item.isRepaired
  if (chapok.value && type === 'isRequired') item.isRequired = !item.isRequired
  if (chapok.value && type === 'isStock') item.isStock = !item.isStock
  if (chapok.value && type === 'isPlainWork') item.isPlainWork = !item.isPlainWork

  if (type === 'isNorm') dangerField.value[item.id].isNorm = !item.isNorm
  if (type === 'isRepaired') dangerField.value[item.id].isRepaired = item.isRepaired
  if (type === 'isRequired') dangerField.value[item.id].isRequired = item.isRequired
  if (type === 'isStock') dangerField.value[item.id].isStock = !item.isStock
  if (type === 'isPlainWork') dangerField.value[item.id].isPlainWork = !item.isPlainWork

  chapok.value = true
  emits('listChanged')
}

function open(_listData: any) {
  listData.value = _listData
  listData.value.map((el: any) => {
    el.nav = el.id // ?
    if (!dangerField.value[el.id]) dangerField.value[el.id] = {}
    dangerField.value[el.id].isNorm = !el.isNorm // раскрываем поля с ошибками
    dangerField.value[el.id].isRepaired = !el.isRepaired // раскрываем поля с ошибками
    dangerField.value[el.id].isStock = !el.isStock // раскрываем поля с ошибками
    dangerField.value[el.id].isRequired = !el.isRequired // раскрываем поля с ошибками
    if (el.damageType) el.damageTypeArr = el.damageType.split(',').map(Number) // список повреждений
    return el
  })
}

defineExpose({open})
</script>