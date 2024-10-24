<template>
  <Teleport to="body">
    <div class="modal">
      <div class="modal__fon" @click="closeModal()"></div>
      <div class="modal__content draggable" :class="{resizable}">
        <div class="modal__head"
             @mouseup="mouseup"
             @mousedown="mousedown"></div>
        <div class="modal__title">
          <h3>{{ title }}</h3>
          <span> {{ subtitle }}</span>
        </div>
        <div class="close_cross" @click="closeModal()">❌</div>
        <div class="modal__info">
          <slot/>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<style scoped>

.modal {
  top: 0;
  width: 100%;
  height: 100vh;
  position: fixed;
  z-index: 1000;
}

.modal__fon {
  width: 100%;
  height: 100vh;
  background: black;
  opacity: .5;
}

.modal__head {
  position: absolute;
  width: calc(100% - 35px);
  height: 30px;
  background: yellow;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}

.modal__title {
  margin-top: -20px;
  margin-left: 12px;
  margin-bottom: 25px;
}


.modal__title h3 {
  color: #d34338;
}

.modal__title span {
  position: absolute;
  margin-top: -18px;
  margin-left: 12px;
  font-size: smaller;
}

.modal__content {
  position: absolute;

  width: v-bind(panelWidth);
  top: v-bind(panelTop);
  left: v-bind(panelCenter);
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 0 5px black;
  background: #ddd;

  font-size: large;
}

.dark .modal__content {
  background: #333;
}

.resizable {
  resize: both;
  overflow: auto;
}

.close_cross {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
}

.modal__info {
  background: #eee;
}

.dark .modal__info {
  background: #222;
}


.modal__info {
  padding: 10px;
}
</style>

<script setup lang="ts">
import {computed, onMounted, onUnmounted} from "vue";
import {useGlobalStore} from "@/stores/globalStore";

interface Props {
  title?: string,
  subtitle?: string,
  width?: number;
  top?: number,
  draggable?: boolean,
  resizable?: boolean
}

const {width, top, title, draggable, resizable} = defineProps<Props>()
const emits = defineEmits(['closeModal'])
const globalStore = useGlobalStore()

const defaultWidth = 400
const panelWidth = computed(() => width ? (width + 'px') : (defaultWidth + 'px'))
const panelTop = computed(() => top != undefined ? (top + 'px') : '100px')
const panelCenter = computed(() => (document.body.clientWidth / 2 - (width ? width : defaultWidth) / 2 - 10 + 'px'))
let dragObject = {elem: {}, x: 0, y: 0};

function mousedown(e: MouseEvent) {
  if (!draggable) return false;
  if (e.which != 1) return false; // если клик правой кнопкой мыши
  let elem = (e.target as HTMLElement).closest('.draggable');
  if (!elem) return false;
  dragObject.elem = elem
  dragObject.x = e.offsetX;
  dragObject.y = e.offsetY;
  document.onmousemove = move
  e.preventDefault();
}

function move(e: MouseEvent) {
  if (!dragObject.elem) return;
  (dragObject.elem as HTMLElement).style.left = e.pageX - dragObject.x + 'px';
  (dragObject.elem as HTMLElement).style.top = e.pageY - dragObject.y + 'px';
  e.preventDefault();
}

const mouseup = () => {
  dragObject.elem = {}
  document.onmousemove = null
}


function closeModal() {
  globalStore.listOpenModals.pop()
  emits('closeModal')
}

let id = Math.floor(Math.random() * 100000); // для правильного закрытия по ESC

function escapeHandler(e) {
  if (e.key === 'Escape') {
    if (document.querySelector('.el-dialog')) return false // Не закрываемся, если открыта панель от просмотра фото
    let currentId = globalStore.listOpenModals[globalStore.listOpenModals.length - 1]
    if (currentId === id) closeModal()
  }
}

onMounted(() => {
  globalStore.listOpenModals.push(id)
  document.addEventListener('keydown', escapeHandler);
})
onUnmounted(() => document.removeEventListener('keydown', escapeHandler))

</script>
