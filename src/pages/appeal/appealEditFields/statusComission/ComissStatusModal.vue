<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 360: 520"
            :top="70"
            :title="mod.title"
            draggable>
    <div>
        <span class="modal-field">
          <div v-if="[40, 70].includes(mod.status)">
            <label class="label l_300">Причина архивирования</label>
            <el-select
                title="Тип"
                placeholder="Выберите причину"
                v-model="mod.archiveRequestReasons"
                style="width: 250px"
                multiple
                filterable
                clearable>
              <el-option v-for="item in archiveReasons" :key="item.value" :label="item.title"
                         :value="item.value"/>
            </el-select>
          </div>

           <div v-if="mod.status === 90">
             <label class="label l_300">Вид выкупа</label>
             <el-select
                  title="Тип"
                  placeholder="Выберите вид"
                  v-model="mod.BuyCategory"
                  style="width: 250px"
                  filterable
                  clearable>
               <el-option v-for="item in buyCategories" :key="item.value" :label="item.title" :value="item.value"/>
             </el-select>
          </div>

          <div v-if="mod.status === 90">
            <label class="label l_300">Ответственный</label>
             <el-select
                 title="Тип"
                 placeholder="Выберите отвественного"
                 v-model="mod.responsibleId"
                 style="width: 250px"
                 filterable
                 clearable>
               <el-option v-for="item in buyUsers" :key="item.id" :label="item.title" :value="item.id"/>
             </el-select>
          </div>

          <br>
          <el-input
              v-model="mod.comment"
              type="textarea"
              placeholder="Введите комментарий">
          </el-input>

          <span class="modal-buttons-bottom">
          <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
          <el-button type="info" @click="isOpen = false">Отмена</el-button>
        </span>
        </span>
    </div>
  </AppModal>
</template>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {useAppealStoreStatus} from "@/stores/appealStoreStatus";
import {useGlobalStore} from "@/stores/globalStore";
import {useDesktopStore} from "@/stores/desktopStore";
import {ElMessage} from "element-plus";

const desktopStore = useDesktopStore()
const globalStore = useGlobalStore()
const appealStoreStatus = useAppealStoreStatus()
const isOpen = ref(false);
const mod = ref({});
const closeModal = () => isOpen.value = false;

const archiveReasons = ref([])
const buyUsers = ref(null)
const buyCategories = ref(null)

function open(val, comissId) {
  
  console.log('val = ',val)
  //mod.archiveRequestReasons
  
  mod.value.id = comissId;
  mod.value.title = val.title;
  mod.value.status = val.value;
  if (val.archiveRequestReasons) mod.value.archiveRequestReasons = val.archiveRequestReasons.map(it => it.value)

  switch (mod.value.status) {
    case 90:
      if (buyUsers.value == null) {
        globalStore.getRoles({roles: [20, 21, 120],filterType: 10}).then(function (data) {
          console.log('data = ',data)
          buyUsers.value = data.items;
        });

        globalStore.getBuyCategories().then(res=>buyCategories.value = res)
      }
      isOpen.value = true;
      break;
    case 40:
    case 70:
      appealStoreStatus.getArchiveRequestReasons().then(res => archiveReasons.value = res)
    case 50:
    case 60:
      isOpen.value = true;
      break;
    default:
      save()
      break;
  }
}

function save() {

  if (!mod.value.comment && mod.value.status === 90) {
    return ElMessage.warning('Поле "Комментарий" обязателен для заполнения')
  }
  if (!mod.value.archiveRequestReasons && [40, 70].includes(mod.value.status)) {
    return ElMessage.warning('Поле "Причина архивирования" обязателен для заполнения')
  }
  if (mod.value.archiveRequestReasons) {
    mod.value.comment = mod.value.comment || ''
    mod.value.comment += ' 👇Причины запроса в архив '
    mod.value.archiveRequestReasons.forEach(it => {
      if (archiveReasons.value.length) {
        let reason = archiveReasons.value.find(el => el.value === it)
        mod.value.comment += '  ➨' + reason.title
      }
    })
  }


  // let params = {
  //   archiveRequestReasons: [10],
  //   comment: "111111111111 👇Причины запроса в архив   ➨Передвигается",
  //   id: 2178,
  //   status: 40,
  //   title: "Запрос в архив"
  // }

  let params = {
    id: mod.value.id,
    title: mod.value.title,
    status: mod.value.status,
    comment:mod.value.comment,
    archiveRequestReasons: mod.value.archiveRequestReasons,
    BuyCategory: mod.value.BuyCategory,
    responsible: {id:mod.value.responsibleId}
  }
  
  console.log('params = ',params)

  globalStore.isWaiting = true

  appealStoreStatus.setComissionStatus(params).then(res=>{
    if (res.status === 200) location.reload()
  })

}


defineExpose({open});


</script>