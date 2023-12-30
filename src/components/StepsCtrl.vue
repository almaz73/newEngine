<template>
  <div class="step">
    <span class="step__line"></span>
    <div v-for="(s, ind) in steps" :key="ind">
      <div class="step__circle"
           :title="s.name"
           :class="{'done':s.done}">{{ ind + 1 }}
      </div>
    </div>
  </div>
</template>
<style>
.step {
  margin: 0;
  display: flex;
  width: 100%;
  min-width: 400px;
  max-width: 400px;
  flex-wrap: nowrap;
  justify-content: space-between;
  position: relative;
}

.step span {
  z-index: 10;
}

.step__circle {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  height: 20px;
  background: #4d5356;
  border-radius: 50%;
  cursor: pointer;
}

.step__circle.done {
  background: var(--main-color);
}

@media (width < 500px) {
  .step {
    min-width: 173px;
  }
}


.step__line {
  position: absolute;
  height: 1px;
  width: 100%;
  background: #999;
  margin-top: 10px;
  z-index: 0;
}
</style>
<script setup>
let steps = [
  {name: 'Обращение', done: true},
  {name: 'Осмотр', done: true},
  {name: 'Оценка', done: true},
  {name: 'Договор', done: true},
  {name: 'Банк'},
  {name: 'Выкуп'},
]

</script>

