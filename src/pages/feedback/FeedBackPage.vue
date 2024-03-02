<template>
  <main class="feedback">
    <el-input v-model="autor" placeholder="Ваше имя"/>
    <br>
    <el-input placeholder="Напишите ваши замечания"
              v-model="text"
              rows="4"
              class="textarea"
              type="textarea"/>
    <el-collapse>
      <el-collapse-item
          v-if="!globalStore.isMobileView"
          title="&nbsp; При необходимости можете добавить рисунок из буфера обмена Ctrl + V}"
          class="collapse">
        <div class="div">
          Создать снимок экрана можно программой Ножницы от Windows ✂ <br>
          В этой программе можете нарисовать стрелку, выделить что-нибудь. <br>
          Так же удобно делать это горячими клавишами Win + Shift + S. <br>
        </div>
      </el-collapse-item>
    </el-collapse>

    <p></p>
    <img id="image" style="border: 10px solid #999; border-radius: 4px" alt=""/>

    <br><br>
    <el-button type="info" @click="sendMessageToDeveloper()">Отправить сообщение разработчикам</el-button>

    <br><br>
    <el-table
        :data="tableData"
        empty-text="Нет данных"
        @row-dblclick="openModal"
        highlight-current-row
    >
      <el-table-column label="Автор" prop="fio" width="100"/>
      <el-table-column label="Сообщение" prop="message"/>
      <el-table-column label="Фото" width="100">
        <template #default="scope">
          <img :src="scope.row.imgBlob" style="width: 100px" alt=""/>
        </template>
      </el-table-column>

      <el-table-column label="Дата" width="100">
        <template #default="scope">
          {{ formatDMY_hm(scope.row.createDate) }}
        </template>
      </el-table-column>

      <el-table-column width="40">
        <template #default="scope">
          <span class="edit-table-row" @click="openModal(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>

  </main>
  <FeedBackModal ref="feedBackModal"/>
</template>

<style>
.feedback {
  padding: 8px;
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
import {onMounted, ref} from "vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useFeedBackStore} from "@/stores/feedbackStore";
import {formatDMY_hm} from "@/utils/globalFunctions";
import FeedBackModal from "@/pages/feedback/FeedBackModal.vue";

const EntityId = 392088;

const feedBackStore = useFeedBackStore()
const globalStore = useGlobalStore()
const autor = ref('')
const text = ref('')
const tableData = ref([])
const feedBackModal = ref(null)
let imgBase64 = null

window.addEventListener("paste", e => {
  if (e.clipboardData) {
    // получаем все содержимое буфера
    var items = e.clipboardData.items;
    if (items) {
      for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          // представляем изображение в виде файла
          let blob = items[i].getAsFile();
          toBase64(blob)
          // создаем временный урл объекта
          var URLObj = window.URL || window.webkitURL;
          // добавляем картинку в DOM
          document.getElementById("image").src = URLObj.createObjectURL(blob);
        }
      }
    }
  }
})

function toBase64(file) {
  let reader = new FileReader();
  reader.onload = () => imgBase64 = reader.result;
  reader.readAsDataURL(file);
}

function sendMessageToDeveloper() {
  console.log(imgBase64)
  feedBackStore.sendMessage({
    text: autor.value + ':::' + text.value + ':::' + imgBase64,
    EntityId: EntityId,
    entityType: 20
  })
      .then(() => getdMessagesToDevelop())

}

function getdMessagesToDevelop() {
  console.log(imgBase64)
  feedBackStore.getMessages(EntityId).then(res => {
    res.items.map(el => {
      let part = el.text.split(':::')
      el.fio = part[0]
      el.message = part[1]
      el.imgBlob = part[2]
      return el
    })
    tableData.value = res.items
  })
}

getdMessagesToDevelop()

function openModal(row) {
  feedBackModal.value.open(row)
}

onMounted(() => {
  globalStore.setTitle('Форма обратной связи')
})

</script>