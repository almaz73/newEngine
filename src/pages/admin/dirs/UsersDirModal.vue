<template>
  <AppModal v-if="isOpen"
            @closeModal="emits('closeModal')"
            :width="globalStore.isMobileView? 330: 920"
            :top="40"
            :title="'Настройки пользователя'"
            :subtitle="user && user.person.firstName+' '+user.person.middleName+' '+user.person.lastName"
            draggable
            resizable>
    <el-scrollbar maxHeight="400px">
      <span class="modal-fields">

          <span><img :src="user && user.avatar.url"></span>
          <span><el-input placeholder="Логин" title="Логин"/></span>
          <span><el-input placeholder="Пароль" title="Пароль"/></span>
        <hr>

          <span><el-input placeholder="Фамилия" title="Фамилия"/></span>
          <span><el-input placeholder="Имя" title="Имя"/></span>
          <span><el-input placeholder="Отчество" title="Отчество"/></span>
          <span> <el-input placeholder="Email" title="Email"/></span>
          <span><el-input placeholder="Телефон" title="Телефон"/></span>
          <span><el-input placeholder="Доп.телефон" title="Доп.телефон"/></span>
        <hr>


          <span><el-input placeholder="Организация" title="Организация"/></span>
          <span><el-input placeholder="Отдел" title="Отдел"/></span>
          <span><el-input placeholder="Место хранения/выкупа" title="Место хранения/выкупа"/></span>
          <span> <el-input placeholder="Часовой пояс" title="Часовой пояс"/></span>
          <span><el-input placeholder="Должность" title="Должность"/></span>
        <hr>


          <span><el-input placeholder="Категория" title="Категория"/></span>
          <span><el-input placeholder="Роль" title="Роль"/></span>

      </span>
    </el-scrollbar>
  </AppModal>
</template>
<style>
.modal-fields img {
  max-width: 120px;
  object-fit: cover;
  max-height: 120px;
}

.modal-fields hr {
  border: 1px solid #ddd;
}

.modal-fields span {
  display: inline-block;
  white-space: nowrap;
  margin: 4px 8px;
}


</style>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";

const globalStore = useGlobalStore()


const {isOpen, userId} = defineProps(['isOpen', 'userId'])
const emits = defineEmits(['closeModal', 'setFoundClient'])
const user = ref(null)

useAdminStore().getUserForModal(userId).then(res => {
  user.value = res
})

</script>