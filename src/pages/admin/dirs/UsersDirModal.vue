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
         <img :src="user && user.avatar.url" alt="Фото пользователя">
         <el-input placeholder="Логин" title="Логин" v-model="user.login"/>
         <el-input placeholder="Пароль" title="Пароль" type="password" v-model="user.password"/>
        <hr>

         <el-input placeholder="Фамилия" title="Фамилия" v-model="user.person.lastName"/>
         <el-input placeholder="Имя" title="Имя" v-model="user.person.firstName"/>
         <el-input placeholder="Отчество" title="Отчество" v-model="user.person.middleName"/>
          <el-input placeholder="Email" title="Email" v-model="user.person.email"/>
         <el-input placeholder="Телефон" title="Телефон" v-model="user.person.phone"/>
         <el-input placeholder="Доп.телефон" title="Доп.телефон" v-model="user.person.phone2"/>
        <hr>


          <el-input placeholder="Организация" title="Организация" v-model="user.organization.name"/>
          <el-select
              placeholder="Введи организацию"
              v-model="user.department.id"
              filterable
              clearable>
        <el-option v-for="item in departments" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
            <el-input placeholder="Отдел" title="Отдел" v-model="user.department"/>

         <el-input placeholder="Место хранения/выкупа" title="Место хранения/выкупа" v-model="user.department"/>
          <el-input placeholder="Часовой пояс" title="Часовой пояс"/>
         <el-input placeholder="Должность" title="Должность" v-model="user.position"/>
        <hr>


         <el-input placeholder="Категория" title="Категория"/>
         <el-input placeholder="Роль" title="Роль"/>

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

.dark .modal-fields hr {
  border: 1px solid #444;
}

.modal-fields .el-input__wrapper {
  border: 1px solid red;


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
const user = ref({
  login: '',
  person: {firstName: '', middleName: '', lastName: ''},
  avatar: {url: ''},
  organization: {name: ''},
  department: {}
})
const adminStore = useAdminStore()
const departments = ref([])



adminStore.getUserForModal(userId).then(res =>user.value = res)
adminStore.getDepartments().then(res =>{
  departments.value = res.items
  console.log('departments', departments.value)
})


</script>