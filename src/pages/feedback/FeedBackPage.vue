<template>
  <div>
    <main class="feedback">
      <br>
      <small>* тут принимаются жалобы и предложения только по интерфейсу программы.</small><br>
      <br>
      Пишите пожалуйста! Вместе сделаем программу дружелюбнее!
      <br><br>
      <el-input placeholder="Ваши замечания"
                v-model="text"
                class="textarea"
                type="textarea"/>
      <el-collapse>
        <el-collapse-item
            v-if="!globalStore.isMobileView"
            title="&nbsp; При необходимости добавьте скрин из буфера обмена по Ctrl + V"
            class="collapse">
          <div class="div">
            Создать скрин можно программой Ножницы от Windows ✂ <br>
            Или через горячие клавиши Win + Shift + S. <br>
            Отметьте карандашом элементы скрина. <br>
          </div>
        </el-collapse-item>
      </el-collapse>

      <p v-show="imgBase64">
        <img src="" id="image" style="border: 10px solid #999; border-radius: 4px" alt=""/>
        <DeleteCtrl @click="imgBase64=null"/>
      </p>

      <br><br>
      <el-button type="success" @click="save()">Отправить сообщение</el-button>

      <br><br>
      <el-table
          style="width: 100%"
          :data="tableData"
          empty-text="Нет данных"
          @row-dblclick="openModal"
          highlight-current-row
      >
        <el-table-column label="Статус" prop="status.title" width="140"/>
        <el-table-column label="Сообщение">
          <template #default="scope">
            {{scope.row.message}}
            <small v-if="scope.row.comment"> <br><span class="label ">Комментарий:</span>{{scope.row.comment}}</small>
          </template>
        </el-table-column>
        <el-table-column width="100">

          <template #default="scope">
            <UploadPhotoViewer
                v-if="scope.row.imgBlob && scope.row.imgBlob.length>100"
                :width="100"
                :height="60"
                :url="scope.row.imgBlob"
            />
          </template>
        </el-table-column>

        <el-table-column label="Дата" width="100">
          <template #default="scope">
            {{ formatDateDDMMYYYY(scope.row.createDate) }}
          </template>
        </el-table-column>

        <el-table-column width="100">
          <template #default="scope">
            <a title="смотреть" @click="openModal(scope.row)">👁</a>&nbsp;
            <a title="прочитать вслух" @click="sound(scope.row)">📣</a>&nbsp;
            <DeleteCtrl v-if="globalStore.account.id===scope.row.createdUser.id || globalStore.account.role==='Admin'"
                        @click="deleteFeedBack(scope.row.id)"/>
          </template>
        </el-table-column>
      </el-table>
        <el-pagination
            v-model:page-size="rowsPerPage"
            :page-sizes="[5, 10, 20, 50]"
            layout="prev, pager, next, sizes"
            @current-change="changePage"
            @size-change="changePageSize"
            :total="total"
        />
        <div class="page-info">Показаны {{ pageDescription }} из {{ total }}</div>
    </main>
    <FeedBackModal ref="feedBackModal"/>
  </div>
</template>


<script setup>
import {onMounted, ref} from 'vue'
import {useGlobalStore} from '@/stores/globalStore'
import {formatDateDDMMYYYY} from '@/utils/globalFunctions'
import FeedBackModal from '@/pages/feedback/FeedBackModal.vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import DeleteCtrl from '@/controls/DeleteCtrl.vue'
import {useAdminStore} from "@/stores/adminStore";
import UploadPhotoViewer from "@/components/UploadPhotoViewer.vue";

const adminStore = useAdminStore()
const globalStore = useGlobalStore()
const autor = ref('')
const text = ref('')
const tableData = ref([])
const feedBackModal = ref(null)
const rowsPerPage = ref(5)
const total = ref(0)
const pageDescription = ref('')
const filter = {skip: 0, take: 5,}
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
  const utterance2 = new SpeechSynthesisUtterance(' Сообщение : ' + row.message)
  window.speechSynthesis.speak(utterance2)
}

function toBase64(file) {
  let reader = new FileReader()
  reader.onload = () => imgBase64.value = reader.result
  reader.readAsDataURL(file)
}

function save() {
  if (!text.value) return ElMessage.error('Напишите ваши замечания')
  adminStore.postFeedback({
    content: text.value + ':::' + imgBase64.value,
    id: 0,
    status: 10
  })
      .then(() => {
        clearFields()
        getData()
        ElMessage.success('Спасибо за подсказку и помощь в улучшении программы!')
      })
}

function clearFields() {
  autor.value = ''
  text.value = ''
  imgBase64.value = null
}


function openModal(row) {
  feedBackModal.value.open(row, getData)
}

function deleteFeedBack(id) {
  ElMessageBox.confirm('Вы действительно хотите удалить сообщение?', 'Внимание', {
    confirmButtonText: 'Да',
    cancelButtonText: 'Нет'
  })
      .then(() => adminStore.deleteFeedback(id).then(() => getData()))
      .catch(() => {
      })
}

function getData() {
  adminStore.getAllFeedback(filter.skip,filter.take).then(res => {
    res.items.map(el => {
      let part = el.content.split(':::')
      el.message = part[0]
      if (part[1]) el.imgBlob = part[1]
      if (part[2]) el.comment = part[2]
      return el
    })
    res.items = res.items.sort((a, b) => b.id - a.id); // убрать если сортировка не нужна
    tableData.value = res.items;
    total.value = res.total;
  })
}

function changePageSize() {
  filter.take = rowsPerPage.value
  getData()
}

function changePage(val) {
  filter.skip = (val - 1) * rowsPerPage.value
  getData()
}



onMounted(() => {
  globalStore.setTitle('Страница обратной связи')
  globalStore.steps = []
  imageFiled = document.getElementById('image')
  getData()
})

</script>

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