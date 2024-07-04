<template>
  <div class="step">
    <div v-for="(chain, ind) in globalStore.steps" :key="ind">
      <RouterLink :to="workflowsChainBuild(chain)">
        <div class="done"> ➔ {{ chain.title }} &nbsp;</div>
      </RouterLink>
    </div>
  </div>
</template>
<style>
.step {
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  justify-content: start;
}

@media (width < 400px) {
  .step {
    width: 2000px;
    flex-wrap: inherit;
  }
}

.step .done {
  color: #308a5a;
  cursor: pointer;
}

.step > div {
  z-index: 11;
}

@media (width < 500px) {
  .step {
    min-width: 173px;
  }
}

.step a:hover {
  text-decoration: none;
}
</style>
<script setup>
import { useGlobalStore } from '@/stores/globalStore'

const globalStore = useGlobalStore()

function workflowsChainBuild(chain) {
  let href = ''
  switch (chain.type) {
    case 1:
      href = '/storage/sell/' + chain.id
      break
    case 2:
      href = '/auto/' + chain.autoId + '/deal/' + chain.id
      break
    case 3:
      href = '/auto/' + chain.autoId + '/deal/' + chain.id
      break
    case 4:
      href = '/auto/' + chain.autoId + '/deal/' + chain.id
      break
    case 5:
      if (chain.appealType === 8) {
        href = '/appeal/commission/' + chain.id
      } else {
        href = '/appeal/' + chain.id
      }
   }

  return href
}

</script>

