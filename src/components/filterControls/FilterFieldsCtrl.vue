<template>
  <div v-for="(f, ind) in fields" :key="ind">

    <div v-if="f.type==='1.Дата'">
      <span class="label">{{ f.label }}</span>
      <el-date-picker :placeholder="f.placeholder"
                      @change="emits('changed')"
                      format="DD-MM-YYYY"
                      v-model="vModel[f.name]"/>
    </div>

    <div v-if="f.type==='2.Список'">
      <span class="label">{{ f.label }}</span>
      <el-select
          :placeholder="f.placeholder"
          v-model="vModel[f.name]"
          @change="emits('changed')"
          filterable
          clearable
      >
        <el-option v-for="(item, ind) in cities" :key="ind" :label="item" :value="item"/>
      </el-select>
    </div>

    <div v-if="f.type==='3.Список c множественным выбором'">
      <span class="label">{{f.label}}</span>
      <el-select
          v-model="vModel[f.name]"
          @change="emits('changed')"
          multiple
          placeholder="Выберите типы КПП"
      >
        <el-option v-for="item in kpp" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
    </div>

    <div v-if="f.type==='4. Два списка'">
      <span class="label">{{f.label}}</span>
      <div class="filter-block">
        <el-select
            placeholder="Выберите бренд"
            v-model="vModel[f.name1]"
            @change="emits('changed')"
            filterable
            clearable
        >
          <el-option v-for="item in brands" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
        <span style="white-space: nowrap">
           &nbsp; &nbsp; &nbsp; &nbsp;
          <el-select
              :placeholder="f.placeholder2"
              v-model="vModel[f.name2]"
              @change="emits('changed')"
              filterable
              clearable
          >
            <el-option v-for="item in models" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </span>
      </div>
    </div>

    <div v-if="f.type==='5. Две даты'">
      <span class="label">{{f.label}}</span>
      <div class="filter-block">
        &nbsp; от
        <el-select
            @change="emits('changed')"
            :placeholder="f.placeholder1"
            v-model="vModel[f.name1]"
            filterable
            clearable
        >
          <el-option v-for="item in years" :key="item.name" :label="item.name" :value="item.name"/>
        </el-select>
        <span style="white-space: nowrap">
          &nbsp; &nbsp; &nbsp; до
          <el-select
              @change="emits('changed')"
              :placeholder="f.placeholder2"
              v-model="vModel[f.name2]"
              filterable
              clearable
          >
            <el-option
                v-for="item in years"
                :key="item.name"
                :label="item.name"
                :value="item.name"
            />
          </el-select>
        </span>
      </div>
    </div>
  </div>
</template>
<script setup>
/**
 * Динамический, настраиваемый шаблон, для всех типов полей
 */
import {useGlobalStore} from "@/stores/globalStore";
import {kpp} from "@/utils/globalConstants";

const globalStore = useGlobalStore()
const emits = defineEmits(['changed'])
const {vModel, fields, brands, models, places, cities, years} = defineProps(['vModel', 'fields', 'brands', 'models', 'places', 'cities', 'years'])



</script>