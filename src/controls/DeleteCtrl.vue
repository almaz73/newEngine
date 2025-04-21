<template>
  <img alt=""
       class="img-hover-border"
       title="Удалить"
       src="@/assets/icons/icon-cross-red.png">
</template>

<style scoped>
.img-hover-border {
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: border-bottom;
}

.img-hover-border:hover {
  padding-bottom:1px;
  border-bottom: 2px solid var(--main-color); /* или любой цвет подчёркивания */
}
</style>
