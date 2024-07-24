<template>
  <div v-for="comment in comments" :key="comment.id">
    {{ formatDMY_hm(comment.createDate) }}
    <span class="red-text">{{ comment.userName }}</span>
    {{ comment.text }}
  </div>
  <el-input
      type="textarea"
      style="width: 300px"
      :rows="3"
      v-model="text"/>
  &nbsp;
  <el-button type="primary" @click="saveComment()">Добавить</el-button>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useDealStore} from '@/stores/dealStore'
import {useGlobalStore} from "@/stores/globalStore";
import {formatDMY_hm} from "@/utils/globalFunctions";

const globalStore = useGlobalStore()
const dealStore = useDealStore()
const comments = ref([])
const text = ref('')

function open() {
  globalStore.getComments(60, dealStore.deal.dealId).then(res => {
    comments.value = res.items
  })
}

function saveComment() {
  if (!text.value) return false
  let params = {
    text: text.value,
    EntityId: dealStore.deal.dealId,
    entityType: 60
  }
  globalStore.sendComment(params).then(() => open())
}

defineExpose({open})
</script>