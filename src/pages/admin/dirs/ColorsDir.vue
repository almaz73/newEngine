<template>
  <div>
    <div style="margin-bottom: 30px">
      <el-input v-model="search"
                :prefix-icon="Search"
                clearable
                :style="{marginRight: globalStore.isMobileView?'80px':'30px'}"
                @keydown.enter="find()"/>
      <el-button @click="find()" n type="danger" :icon="Plus">{{ globalStore.isMobileView ? '' : 'Добавить' }}
      </el-button>
    </div>

    <el-table
        :data="tableData"
        ref="singleTableRef"
        empty-text="Нет данных"
        highlight-current-row
    >
      <el-table-column label="Цвет" prop="colorName"/>
      <el-table-column>
        <template #default="scope">
          <div style="width: 20px; height: 20px; border: 1px solid #ddd"
               :style="{background:scope.row.colorCode}"></div>
        </template>
      </el-table-column>

      <el-table-column width="73">
        <template #default>
          <el-icon>
            <EditPen/>
          </el-icon>
          &nbsp;
          <el-icon>
            <CloseBold/>
          </el-icon>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>
<script setup lang="ts">
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import {ElTable} from "element-plus";
import {useGlobalStore} from "@/stores/globalStore";
import {EditPen, CloseBold, Search, Plus} from '@element-plus/icons-vue'

const globalStore = useGlobalStore()
const adminStore = useAdminStore()
const tableData = ref([])
const search = ref('')

adminStore.getColors().then(res => tableData.value = res.items)


globalStore.setTitle('Цвета кузова')


</script>