<template>
  <div style="position: absolute">

  </div>
</template>
<script setup lang="ts">
import {useGlobalStore} from "@/stores/globalStore.ts";
import {ElNotification} from "element-plus";
import {h} from 'vue'

const globalStore = useGlobalStore()

globalStore.getRegularlyQueryingEvents().then(res => {
  res.items.forEach(el => {
    const notification = ElNotification({
      title: 'Внимание',
      message: h('div', [
        el.text,
        h('br'),
        h('button', {
          onClick: () => {
            toRead(el.id)
            notification.close()
          }
        }, 'Перейти')
      ]),
      duration: 0
    })

  })
})

function toRead(id: number) {
  globalStore.readedQueryingEvents(id)
}

</script>