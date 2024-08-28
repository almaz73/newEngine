<template>
  <div v-if="props.showInspectArr.includes(props.categoryId)" style="width: 100%">
    <div v-for="group in props.groupItems" style="padding: 0 20px; flex-wrap: wrap;
    display: flex; align-items: center; justify-content: space-between">
      <span>{{ group.name }}</span>
      <span style=" flex-grow: 1"></span>

      <el-icon v-if="group.recordStatus===30"
               style="color:#999"
               :title="group.firstName +' '+group.lastName +'\n '+formatDMY_hm(group.createdDate)"
      ><EditPen /> &nbsp; </el-icon> &nbsp;

      <el-icon v-if="[30, 40, 50, 60, 70].includes(props.categoryId) && group.isNorm" style="color: green"><Select /></el-icon>
      <el-icon v-if="props.categoryId==30 && !group.isNorm && group.isRepaired">
        <Tools />
      </el-icon> &nbsp;
      <el-icon v-if="props.categoryId==30 && !group.isNorm" style="color: pink">
        <CloseBold />
      </el-icon>

      <el-icon v-if="[80].includes(props.categoryId)>-1 && group.isRequired" style="color: orange"><Select /></el-icon>
      <el-icon v-if="[20, 90].includes(props.categoryId)>-1 && group.isStock" style="color: green"><Select /></el-icon>


      <small v-if="group.damageText" style="width: 90%; padding: 0 10px; color: #888">Повреждения: &nbsp; &nbsp; &nbsp;  {{group.damageText}}</small>
      <hr style="width: 100%; border: 1px solid #eee; border-bottom: none"/>
    </div>



    <br>
  </div>
</template>
<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore'
import { useDealStore } from '@/stores/dealStore'
import { ref } from 'vue'
import { Select, CloseBold, Tools, EditPen } from '@element-plus/icons-vue'
import {formatDMY_hm} from "@/utils/globalFunctions";

const props = defineProps(['showInspectArr', 'categoryId', 'groupItems'])

// console.log('??? !!! props = ', props)

// watchEffect(() => {
//   if (props.showHistory) getHistory()
// })


const dealStore = useDealStore()
const globalStore = useGlobalStore()
const tableData = ref([])

</script>