<template>
  <div>
    <div class="label l_200">Этап выкупа</div>
    <el-dropdown style="margin: -6px 0 6px">
      <el-button type="primary">
        {{ deal.dealStatusTitle }}
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            @click="makeChoice(item)"
            v-for="(item, ind) in StatusTypes" :key="ind">{{ item.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import {useDealStore } from '@/stores/dealStore'
import {DealStatusTable} from '@/utils/globalConstants'

const dealStore = useDealStore()
const { deal } = defineProps(['deal'])
const StatusTypes = ref([])
const availableStatuses = ref([])

watchEffect(() => {
  console.log('   ::: deal.id',deal.dealId)
  deal.dealId && dealStore.getStatuses(deal.dealId).then(res => {
    console.log('res',res)
    availableStatuses.value = res.items
    res.items.forEach(el => {
      let item = DealStatusTable.find(item => item.id === el)
      item && StatusTypes.value.push(item)
    })
    // sortFunction()
  })
})

function makeChoice(item) {
  console.log('item', item)
}
</script>