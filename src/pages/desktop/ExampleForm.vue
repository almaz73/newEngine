<template>
  <div>
    <el-form
        ref="formRef"
        :model="xxx"
        label-width="120px"
    >

      <el-form-item label="Возраст" prop="ruleForm['age']"
                    :rules="[{required: true, message: 'Пожалуйста введите активное имя', trigger: ['blur', 'change']},
                            {min: 3, max: 5, message: 'Длина должна быть от 3 до 5 букв'}]"
      >
        <el-input v-model.number="xxx.ruleForm.age"/>
      </el-form-item>

      <el-form-item label="Возраст" prop="ruleForm.zzz['age2']"
                    :rules="{required: true,message: 'Заполните слово',trigger: 'change'}">
        <el-input v-model.number="xxx.ruleForm.zzz.age2"/>
      </el-form-item>


      <el-button @click="submitForm(formRef)"> Submit</el-button>
      <el-button @click="resetForm(formRef)">Reset</el-button>
    </el-form>
  </div>
</template>

<script setup>
import {reactive, ref} from 'vue'

const formRef = ref()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let appeal = reactive({
  lead: {
    leadType: 10,
    person: {phone: '', email: '', firstName: '', lastName: '', middleName: ''}
  },
  workflow: {swapPhone: '', workflowLeadType: 2},
  communication: {}
})

const xxx = reactive({ruleForm: {age: '', zzz: {age2: ''}}})

const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) console.log('submit!')
    else console.log('error submit!')
  })
}

const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}


</script>