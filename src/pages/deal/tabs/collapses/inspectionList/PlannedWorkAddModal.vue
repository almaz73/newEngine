<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="360"
            :top="40"
            :title="'Планируемая работа'"
            draggable>
    <div>
      <el-form ref="form" :model="model" class="error-to-message">
        <span class="modal-field">
          <el-form-item prop="inspectionItemTypeId" :rules="{required: true, message: 'Элемент', trigger: ['change']}">
            <label class="label-right l_100">Элемент</label>
              <el-select
                @change="elementChanged(model.inspectionItemTypeId)"
                v-model="model.inspectionItemTypeId"
                style="width: 190px"
              >
                <el-option
                  style="width: 360px"
                  v-for="item in inspectionItemTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
          </el-form-item>

          <el-form-item prop="workId" :rules="{required: true, message: 'Тип работы', trigger: ['change']}">
            <label class="label-right l_100">Тип работы</label>
             <el-select
               v-model="model.workId"
               style="width: 190px"
             >
              <el-option
                v-for="item in works"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item prop="price" :rules="{required: true, message: 'Цена', trigger: ['change']}">
            <label class="label-right l_100">Цена</label>
            <el-input
              style="width: 190px"
              type="number"
              v-model="model.price"
              clearable
              placeholder="Модель">
           </el-input>
          </el-form-item>

           <el-form-item prop="damageArray" :rules="{required: true, message: 'Дефекты', trigger: ['change']}">
            <label class="label-right l_100">Дефекты</label>
             <el-select
               v-model="model.damageArray"
               style="width: 190px"
               multiple
             >
              <el-option
                v-for="item in damageItems"
                :key="item.id"
                :label="item.damageItem.damageName"
                :value="item.damageItem.id"

              />
            </el-select>
          </el-form-item>

           <label class="label-right l_100"></label>
           <el-input
             style="width: 190px"
             type="textarea"
             v-model="model.comment"
             clearable
             placeholder="Комментарий">
           </el-input>

          <span class="modal-buttons-bottom">
          <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
          <el-button type="info" @click="isOpen = false">Отмена</el-button>
        </span>
        </span>
      </el-form>
    </div>
  </AppModal>
</template>

<script setup>
import AppModal from '@/components/AppModal.vue'
import { useGlobalStore } from '@/stores/globalStore'
import { useAdminStore } from '@/stores/adminStore'
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { checkEmptyFields } from '@/utils/globalFunctions'
import { useDealStore } from '@/stores/dealStore'
import { ElMessage } from 'element-plus'

const form = ref(null)
const globalStore = useGlobalStore()
const dealStore = useDealStore()
const isOpen = ref(false)
const model = ref({})
const closeModal = () => isOpen.value = false
const adminStore = useAdminStore()
let cb
const works = ref([])
const inspectionItemTypes = ref([])
const damageItems = ref([])
const route = useRoute()

function open(cbModal) {
  cb = cbModal
  isOpen.value = true
  model.value = { workId: '', inspectionItemTypeId: '', price: null, comment: '' }

  dealStore.getbycto().then(res => works.value = res.data.items)
  dealStore.getbycategories([30, 40, 80]).then(res => inspectionItemTypes.value = res.data.items)
}

function elementChanged(id) {
  adminStore.getInspection(id).then(res => {
    damageItems.value = res.inspectionItemTypeDamageItems
  })
}

function save() {
  checkEmptyFields(form.value).then(res => {
    model.value.damageType = model.value.damageArray.join(',')
    model.value.damageTypeArray = []
    damageItems.value.forEach(el => {
      if (model.value.damageArray.includes(el.damageItem.id)) model.value.damageTypeArray.push(el)
    })
    model.value.inspectionId = route.params.inspectionId
    dealStore.savePlannedWork([model.value]).then(res => {
      if (res.status === 200) ElMessage.success('Запланированная работа успешно сохранена')
      cb()
      isOpen.value = false
    })
  })

}


defineExpose({ open })


</script>