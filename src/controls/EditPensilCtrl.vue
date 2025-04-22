<template>
  <img
    alt=""
    class="img-hover-border"
    title="Редактировать"
    src="@/assets/icons/icon-pencil-red.png"
  >
</template>

<style scoped>
.img-hover-border {
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: border-bottom;
}

.img-hover-border:hover {
  margin-top: -1px;
  padding-bottom:1px;
  border-bottom: 2px solid var(--main-color); /* или любой цвет подчёркивания */
}
</style>
