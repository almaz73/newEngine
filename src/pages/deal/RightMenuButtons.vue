<template>
  <div class="rightMenu">
    <el-dropdown style="display: inline-block">
      <el-button>
        Необходимые документы
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            @click="makeChoice(item)"
            v-for="(item, ind) in documents" :key="ind">{{ item.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-button>
      Подобные автомобили
    </el-button>
    <el-button>
      Необходимые документы
    </el-button>


  </div>
</template>

<style scoped>
.rightMenu {
  max-width: 730px;
  align-content: center;
}

.el-button:first-child {
  margin-left: 12px
}

.el-button:last-child {
  margin-right: 50px
}
</style>

<script setup lang="ts">
import { useDealStore } from '@/stores/dealStore'
import { ref } from 'vue'

const dealStore = useDealStore()
const documents = ref([])
</script>