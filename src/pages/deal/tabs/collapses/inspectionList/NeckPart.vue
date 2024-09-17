<template>
  <div class="neck">
    <div>
      <b style="color: #bbb; text-transform: uppercase;">
        {{ props.title }}
      </b>

      <a @click="emits('goNext')">
        Пропустить раздел >
      </a>
    </div>

    <div style="flex: 1"></div>

    <el-button type="danger" style="width: 35px; margin-right: 8px">
      {{err_count}}
    </el-button>

    <div>
      <span style="color: #bbb; text-transform: lowercase; font-size: smaller">
        Замечания в разделе
      </span>


      <a @click="emits('hider')">
        скрыть исправные
      </a>
    </div>

  </div>

</template>

<style>
.neck {
  display: flex;
  margin: 40px 0 60px;
}
.neck a {
  display: block;
  font-size: smaller;
  text-decoration: underline;
}
</style>


<script setup lang="ts">
const props = defineProps(['title', 'categoryId', 'err_count'])
console.log('props = ', props)
const emits = defineEmits(['hider', 'goNext'])
</script>