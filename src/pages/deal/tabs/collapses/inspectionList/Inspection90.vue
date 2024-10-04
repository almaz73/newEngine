<template>
  <div>
    <div v-for="(item, itemIndex) in listData">
      <div v-if="!item.isHidden">
        <div style="float: left" :style="{'max-width':categoryId!=='30'?'350px':'273px'}">

          <span>
            <el-icon style="color: green" v-if="!dangerField[item.id].isStock">
             <CircleCheck />
            </el-icon>
            <el-icon style="color: #f99" v-if="dangerField[item.id].isStock">
             <CircleClose />
            </el-icon>
          </span>

          {{ item.name }}
        </div>

        <div v-if="globalStore.isMobileView" style="clear: both; padding: 4px"></div>

        <div
          style="float: right; cursor: pointer"
          @click="changeItem(item, 'isStock')"
          @mouseover="item.isStock=!item.isStock"
          @mouseleave="toMouseLeave(item, 'isStock')"
        >
          <el-button
            :style="{background :!item.isStock?'#f56c6c':'#c6e0cc', color:item.isStock?'':'white'}"
            style="width: 150px; pointer-events:none">
            <span>  {{ item.isStock ? 'Без нарушений' : 'Есть нарушения !' }}</span>
          </el-button>
        </div>


        <div style="clear: both"></div>

        <div
          style="cursor: pointer; display: flex; gap:4px"
          v-if="inspectionAvtotec && item.name=='Автотека'">
          <div>История эксплуатации &nbsp; &nbsp;</div>

          <div class="quadro green"
               title="ДТП: отсутствует
Расчеты: отсутствует
Страховые выплаты: отсутствует
Собственники: не более одного на 3 года эксплуатации"
               @click="switchColor(item, 'Зеленый')"
               :class="{'active':!exploitationHistoryType}">З
          </div>
          <div class="quadro yellow"
               title="ДТП: отсутствуют красные, не более 2х дтп, не более 3 элементов в общем
Расчеты: Не более 10% от стоимости авто. Отсутствуют силовые элементы
Страховые выплаты: Не более 10% от стоимости авто
Собственники: не более одного на 2 года эксплуатации"
               @click="switchColor(item, 'Желтый')"
               :class="{'active':exploitationHistoryType==10}">Ж
          </div>
          <div class="quadro red"
               title="Расчеты:Х
Страховые выплаты: Х
Собственники: Х
Такси, каршеринг, аукцион битых, угон, тотал, ввезенка"
               @click="switchColor(item, 'Красный')"
               :class="{'active':exploitationHistoryType==20}">К
          </div>
        </div>

        <div style="clear: both"></div>

        <div style="padding: 12px" v-if="item.inspectionUiType===10">

          <small v-for="(file, ind) in item.documents">
            <div class="file-frame">
              <img src="@/assets/img/doc.png" v-if="file.mimeType==='doc'" />
              <img src="@/assets/img/txt.png" v-if="file.mimeType==='txt'" />
              <img src="@/assets/img/pdf.png" v-if="file.mimeType==='pdf'" />
              <img src="@/assets/img/rtf.png" v-if="file.mimeType==='rtf'" />
              <img src="@/assets/img/xls.png" v-if="file.mimeType==='xls'" />
              <img src="@/assets/img/picture.png"
                   v-if="['png','jpg','gif','raw','tiff','bmp','psd'].includes(file.mimeType)" />

              <a v-if="!file.Document" @click="openFile(itemIndex, ind)">{{ file.title }}</a>
              <span v-if="file.Document">{{ file.title }}</span>
              <span size="small" style="cursor: pointer" @click="deleteFile(itemIndex, ind)"> ✖ </span>
            </div>


          </small>

          <el-upload
            ref="upload"
            :show-file-list="false"
            style="float: right"
            @click="activeItemIndex=itemIndex"
            :http-request="uploadFiles"
            :auto-upload="true"
          >
            <template #trigger>
              <el-button :icon="Plus"> Файл</el-button>
            </template>
          </el-upload>
        </div>


        <div style="clear: both"></div>
        <small style="color:#999"> Комментарий: <br>
          <el-input v-model="item.comment" type="textarea" :rows="2" placeholder="добавить"></el-input>
        </small>

        <el-divider />
      </div>
    </div>


  </div>

</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore'
import { useDealStore } from '@/stores/dealStore'
import { CircleCheck, CircleClose, Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const globalStore = useGlobalStore()
const listData = ref([])
const dealStore = useDealStore()
const chapok = ref(false)
const item = ref({})
const dangerField = ref({})
const { categoryId } = defineProps(['categoryId'])
const emits = defineEmits(['listChanged'])
const exploitationHistoryType = ref(null)
const inspectionAvtotec = ref(false)
const activeItemIndex = ref(null)
let quardColor = []

// берем типы цветов бакенда, остальные параметры зашиты в клиентский код, решили переходить тихонечко
dealStore.getExploitationHistoryTypes().then(res => quardColor = res.data)

item.value = dealStore.deal

function openFile(itemIndex, ind) {
  let file = listData.value[itemIndex].documents[ind].documentPath
  window.open(file)
}

function deleteFile(itemIndex, ind) {
  listData.value[itemIndex].documents.splice(ind, 1)
}

const checkBeforeUpload = (rawFile: any) => {
  if (rawFile.size > 10000000) {
    ElMessage.error('Прикрепляемый файл не может быть больше 10 mb!')
    return true
  }
}

function uploadFiles(obj) {
  if (checkBeforeUpload(obj.file)) return false
  const f = obj.file

  if (f) {
    const fr = new FileReader()
    fr.onload = () => {
      const fbase64 = fr.result //файл в base64
      listData.value[activeItemIndex.value].documents.push({
        mimeType: setMimeType(obj.file.name),
        Document: fbase64.split('base64,')[1],
        title: obj.file.name
      })
    }
    fr.readAsDataURL(f)
  }
}

// узнаем есть ли галочка автотеки
function getCheck(inspection) {
  dealStore.getbycategories([90]).then(res => {
    let element = res.data.items.find(el => el.name === 'Автотека')

    if (element) inspectionAvtotec.value = element.workId === 65
    if (inspectionAvtotec.value) {
      // получаем цвет квадрата, если автотека включена
      if (inspection && inspection.auto) exploitationHistoryType.value = inspection.auto.exploitationHistoryType
    }
  })
}

function getExploitationHistoryType() {
  return exploitationHistoryType.value
}


function open(_listData: any, inspection: any) {
  listData.value = _listData

  listData.value.map(el => {
    el.nav = el.id
    el.documents && el.documents.map(item => item.mimeType = setMimeType(item.title))
    if (!dangerField.value[el.id]) dangerField.value[el.id] = {}
    dangerField.value[el.id].isNorm = !el.isNorm // раскрываем поля с ошибками
    dangerField.value[el.id].isStock = !el.isStock // раскрываем поля с ошибками
    return el
  })
  getCheck(inspection)
}

function getTextAfterLastDot(str) {
  const lastIndex = str.lastIndexOf('.')
  return lastIndex !== -1 ? str.substring(lastIndex + 1) : ''
}

function setMimeType(fileName: string) {
  let mimeType = getTextAfterLastDot(fileName)
  if (mimeType.toLowerCase().includes('xls')) mimeType = 'xls'
  if (mimeType.toLowerCase().includes('doc')) mimeType = 'doc'

  if (['exe', 'bat'].includes(mimeType.toLowerCase())) {
    ElMessage.warning('Осторожно! Вы сохраняете запускаемый файл')
    return false
  }

  if (!mimeType || !['txt', 'doc', 'xls', 'pdf', 'rtf', 'png', 'jpg', 'gif', 'raw', 'tiff', 'bmp', 'psd'].includes(mimeType)) {
    mimeType = 'txt'
  }

  return mimeType.toLowerCase()
}

function switchColor(item, color) {
  switch (color) {
    case 'red':
      item.isStock = false
      item.isNorm = false
      break
    case 'yellow':
      item.isStock = false
      item.isNorm = true
      break
    case 'green':
      item.isStock = true
      item.isNorm = true
      break
  }
  exploitationHistoryType.value = quardColor.find(el => el.title === color).value
}


function changeItem(item: any, type: string) {
  if (chapok.value && type === 'isStock') item.isStock = !item.isStock
  if (type === 'isStock') dangerField.value[item.id].isStock = !item.isStock

  chapok.value = true
  emits('listChanged')
}

function toMouseLeave(item: any, type: string) {
  if (!chapok.value) {
    if (type === 'isStock') item.isStock = !item.isStock
  }
  chapok.value = false
}

defineExpose({ open, getExploitationHistoryType })

</script>