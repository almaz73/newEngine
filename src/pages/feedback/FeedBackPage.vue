<template>
  <div>
    <main class="feedback">
      <el-input v-model="autor" placeholder="Ваше имя" />
      <small style="color: #999"> &nbsp; &nbsp; &nbsp; * необязательно</small>
      <br>
      <el-input placeholder="Ваши замечания"
                v-model="text"
                class="textarea"
                type="textarea" />
      <el-collapse>
        <el-collapse-item
          v-if="!globalStore.isMobileView"
          title="&nbsp; При необходимости добавить рисунок из буфера обмена Ctrl + V"
          class="collapse">
          <div class="div">
            Создать скрин можно программой Ножницы от Windows ✂ <br>
            Или чеерз горячие клавиши Win + Shift + S. <br>
            Отметьте карандашом участки о чем пишете. <br>
          </div>
        </el-collapse-item>
      </el-collapse>

      <p v-show="imgBase64">

        <img src="" id="image" style="border: 10px solid #999; border-radius: 4px" alt="" />

        <DeleteCtrl @click="imgBase64=null" />
      </p>

      <br><br>
      <el-button type="info" @click="save()">Отправить сообщение разработчикам</el-button>

      <br><br>
      <el-table
        :data="tableData"
        empty-text="Нет данных"
        @row-dblclick="openModal"
        highlight-current-row
      >
        <el-table-column label="Автор" prop="fio" width="100" />
        <el-table-column label="Сообщение" prop="message" />
        <el-table-column label="Фото" width="100">
          <template #default="scope">
            <img :src="scope.row.imgBlob" style="width: 100px" alt="" />
          </template>
        </el-table-column>

        <el-table-column label="Дата" width="100">
          <template #default="scope">
            {{ formatDMY_hm(scope.row.createDate) }}
          </template>
        </el-table-column>

        <el-table-column width="40">
          <template #default="scope">
            <span class="edit-table-row" style="top:10px" @click="openModal(scope.row)" />
            <span class="edit-table-page" style="top:30px" @click="sound(scope.row)">🔱</span>
          </template>
        </el-table-column>
      </el-table>

    </main>
    <FeedBackModal ref="feedBackModal" />
  </div>
</template>

<style scoped>
.feedback {
  padding: 0;
  z-index: -1;
  max-width: 1200px;
}

.feedback .textarea {
  width: 600px;
  margin: 4px 0
}

.feedback .collapse {
  width: 600px;
  color: #bbb;
  padding: 0;

  border: 1px solid #ddd
}

@media (width < 500px) {
  .feedback .textarea, .feedback .collapse {
    width: 300px;
  }
}

.feedback .collapse .div {
  padding: 0 43px;
  font-size: 16px;
  color: #999;
}
</style>

<script setup>
import { onMounted, ref } from 'vue'
import { useGlobalStore } from '@/stores/globalStore'
import { formatDMY_hm } from '@/utils/globalFunctions'
import FeedBackModal from '@/pages/feedback/FeedBackModal.vue'
import { ElMessage } from 'element-plus'
import DeleteCtrl from '@/controls/DeleteCtrl.vue'

const EntityId = 392110;
// const EntityId = 392116

const globalStore = useGlobalStore()
const autor = ref('')
const text = ref('')
const tableData = ref([])
const feedBackModal = ref(null)
let imageFiled = null
let imgBase64 = ref(null)

window.addEventListener('paste', e => {
  if (e.clipboardData) {
    // получаем все содержимое буфера
    var items = e.clipboardData.items
    if (items) {
      for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          // представляем изображение в виде файла
          let blob = items[i].getAsFile()
          toBase64(blob)
          // создаем временный урл объекта
          var URLObj = window.URL || window.webkitURL
          // добавляем картинку в DOM
          imageFiled.src = URLObj.createObjectURL(blob)
        }
      }
    }
  }
})

function sound(row) {
  const utterance2 = new SpeechSynthesisUtterance('Автор: ' + row.fio + ' Пишет : ' + row.message)
  window.speechSynthesis.speak(utterance2)
}

function toBase64(file) {
  let reader = new FileReader()
  reader.onload = () => imgBase64.value = reader.result
  reader.readAsDataURL(file)
}

function save() {
  if (!text.value) return ElMessage.error('Напишите ваши замечания')
  console.log(imgBase64.value)
  globalStore.sendComment({
    text: autor.value + ':::' + text.value + ':::' + imgBase64.value,
    EntityId: EntityId,
    entityType: 20
  })
    .then(() => {
      clearFields()
      getdMessagesToDevelop()
      ElMessage.success('Спасибо за подсказку и помощь в улучшении программы!')
    })
}

function clearFields() {
  autor.value = ''
  text.value = ''
  imgBase64.value = null
}

function getdMessagesToDevelop() {
  console.log(imgBase64.value)
  globalStore.isWaiting = true
  globalStore.getComments(20, EntityId).then(res => {
    res.items.map(el => {
      let part = el.text.split(':::')
      el.fio = part[0]
      el.message = part[1]
      el.imgBlob = part[2]
      return el
    })
    tableData.value = res.items.sort((a, b) => new Date(b.createDate) > new Date(a.createDate) ? 1 : -1)
    globalStore.isWaiting = false
  })
}

getdMessagesToDevelop()

function openModal(row) {
  feedBackModal.value.open(row)
}

onMounted(() => {
  globalStore.setTitle('Страница обратной связи')
  imageFiled = document.getElementById('image')
})

</script>