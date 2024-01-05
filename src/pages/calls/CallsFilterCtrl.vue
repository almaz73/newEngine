<template>
  <div class="deal-filters">
    <FilterFieldsCtrl @changed="changed" :lists="lists" :vModel="vModel" :fields="fields"/>
    <a @click="isMoreFilter=!isMoreFilter">Дополнительный фильтер </a>
    <!--    Скрытая часть-->
    <div class="more-filter" :class="{open:isMoreFilter}">
      <div style="min-height: 0; overflow: hidden">
        <FilterFieldsCtrl @changed="changed" :lists="lists" :vModel="vModel" :fields="fields_additional"/>
      </div>
    </div>
    <!--    Конец скрытой части-->
  </div>
</template>
<script setup>
import {computed, ref, watch} from 'vue'
import {useGlobalStore} from '@/stores/globalStore'
import {globalRef} from "@/components/filterControls/FilterGlobalRef";
import {getTags} from "@/components/filterControls/FilterGetTags";

import FilterFieldsCtrl from "@/components/filterControls/FilterFieldsCtrl.vue";
import {tagsControl} from "@/utils/globalFunctions";

const emit = defineEmits(['update:modelValue', 'changeFilter', 'getData'])
const vModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
const props = defineProps(['modelValue'])
const globalStore = useGlobalStore()
const ccEmployees = ref([])
const manageres = ref([])
const tags = ref([])
const isMoreFilter = ref(false)
const lists = ref({})

const fields = [
  {type: '1.Дата', label: 'Дата звонка', name: 'createDate', placeholder: 'Выберите дату'},
  {type: '1.Дата', label: 'Телефонный номер', name: 'phoneNumber', placeholder: 'Наберите номер'},
]
const fields_additional = [
  {
    type: '9. Две даты',
    label: 'Период',
    name1: 'lowCreateDatePeriod', placeholder1: 'Выберите дату',
    name2: 'highCreateDatePeriod', placeholder2: 'Выберите дату'
  }, {
    type: '2. Список', listName: 'ccEmployees',
    label: 'Сотрудник',
    name: 'ccEmployee',
    placeholder: 'Выберите сотрудника'
  }
]

watch(globalRef, () => tagsControl(globalRef, vModel))


function changed() {
  // создаем теги
  tags.value = []
  globalRef.tags = getTags(tags, vModel, lists)
}

function open() {
  globalStore.getUsers().then((res) => {
    res.items.map(el => el.name = el.title)
    manageres.value = lists.value.manageres = res.items
    manageres.value.forEach(item => {
      if (item.role === 110 || item.role === 111) ccEmployees.value.push(item);
    });
    lists.value.ccEmployees = ccEmployees.value
  })

}

defineExpose({open})
</script>