<template>
  <div v-for="(f, ind) in fields" :key="ind" class="filter__row">
    <div v-if="f.type==='1.Дата'">
      <span class="label">{{ f.label }}</span>
      <el-date-picker :placeholder="f.placeholder"
                      @change="emits('changed')"
                      format="DD-MM-YYYY"
                      v-model="vModel[f.name]"/>
    </div>

    <div v-if="f.type==='2. Список без кодов'">
      <span class="label">{{ f.label }}</span>
      <el-select
          :placeholder="f.placeholder"
          v-model="vModel[f.name]"
          @change="emits('changed')"
          filterable
          clearable
      >
        <el-option v-for="(item, ind) in lists[f.listName]" :key="ind" :label="item" :value="item"/>
      </el-select>
    </div>

    <div v-if="f.type==='2. Список'">
      <span class="label">{{ f.label }}</span>
      <el-select
          :placeholder="f.placeholder"
          v-model="vModel[f.name]"
          @change="emits('changed')"
          filterable
          clearable
      >
        <el-option v-for="(item, ind) in lists[f.listName]" :key="ind" :label="item.name" :value="item.id"/>
      </el-select>
    </div>

    <div v-if="f.type==='3.Список c множественным выбором'">
      <span class="label">{{ f.label }}</span>
      <el-select
          v-model="vModel[f.name]"
          @change="emits('changed')"
          multiple
          placeholder="Выберите типы КПП"
      >
        <el-option v-for="item in lists[f.listName]" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
    </div>
    <div v-if="f.type==='4. Зависимые списки'">
      <span class="label">{{ f.label }}</span>
      <div class="filter-block">
        <el-select
            :placeholder="f.placeholder1"
            v-model="vModel[f.name1]"
            @change="emits('changed')"
            filterable
            clearable
        >
          <el-option v-for="item in lists[f.listName1]" :key="item.id" :label="item.name" :value="item.id"/>
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
            <el-option v-for="item in lists[f.listName2]" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </span>
      </div>
    </div>

    <div v-if="f.type==='5. Две даты (годы)'">
      <span class="label">{{ f.label }}</span>
      <div class="filter-block">
         от
        <el-select
            class="filter__row-select"
            @change="emits('changed')"
            :placeholder="f.placeholder1"
            v-model="vModel[f.name1]"
            filterable
            clearable
        >
          <el-option v-for="item in lists[f.listName]" :key="item.name" :label="item.name" :value="item.name"/>
        </el-select>
        <span style="white-space: nowrap">
          &nbsp; &nbsp; до
          <el-select
              @change="emits('changed')"
              :placeholder="f.placeholder2"
              v-model="vModel[f.name2]"
              class="filter__row-select"
              filterable
              clearable
          >
            <el-option
                v-for="item in lists[f.listName]"
                :key="item.name"
                :label="item.name"
                :value="item.name"
            />
          </el-select>
        </span>
      </div>
    </div>

    <div v-if="f.type==='6. Два списка'">

      <span class="label">{{ f.label }}</span>
      <div class="filter-block">
         от
        <el-select
            :placeholder="f.placeholder1"
            v-model="vModel[f.name1]"
            @change="emits('changed')"
            class="filter__row-select"
            filterable
            clearable
        >
          <el-option
              v-for="item in lists[f.listName]"
              :key="item.name"
              :label="item.name"
              :value="item.name"
          />
        </el-select>
        <span style="white-space: nowrap">
          &nbsp; &nbsp; до
          <el-select
              :placeholder="f.placeholder2"
              v-model="vModel[f.name2]"
              @change="emits('changed')"
              class="filter__row-select"
              filterable
              clearable
          >
            <el-option
                v-for="item in lists[f.listName]"
                :key="item.name"
                :label="item.name"
                :value="item.name"
            />
          </el-select>
        </span>
      </div>
    </div>

    <div v-if="f.type==='7. Госномер'">
      <span class="label">{{ f.label }}</span>
      <el-input v-model="vModel[f.name]"
                @change="emits('changed')"
                @input="changeRegistartionMark(f.name, vModel[f.name])"
                style="text-transform: uppercase"
                placeholder="X 000 XX 000"
                maxlength="12"
                @key.enter="emits('changed')"/>
    </div>


    <div v-if="f.type==='8. Два числа'">
      <span class="label">{{ f.label }}</span>
      <span v-if="globalStore.isMobileView" style="white-space: nowrap" :style="{margin:globalStore.isMobileView?'116px':''}">
            &nbsp; от
            <el-input v-model="vModel[f.name1]"
                      @change="emits('changed')"
                      type="number"
                      :placeholder="f.placeholder1"
                      clearable
                      @key.enter="emits('changed')"/>
      </span>
      <span v-else style="white-space: nowrap" :style="{margin:globalStore.isMobileView?'116px':''}">
        от<el-input v-model="vModel[f.name1]"
                      @change="emits('changed')"
                      type="number"
                      :placeholder="f.placeholder1"
                      clearable
                      @key.enter="emits('changed')"/>
      </span>
      <br v-if="globalStore.isMobileView">
      <span style="white-space: nowrap" :style="{margin:globalStore.isMobileView?'114px':''}">
            &nbsp; до
            <el-input v-model="vModel[f.name2]"
                      @change="emits('changed')"
                      type="number"
                      :placeholder="f.placeholder2"
                      clearable
                      @key.enter="emits('changed')"/>
          </span>
    </div>

    <div v-if="f.type==='9. Две даты'">
      <span class="label">{{ f.label }}</span>
      <span v-if="globalStore.isMobileView" style="white-space: nowrap" :style="{margin:globalStore.isMobileView?'116px':''}">
            &nbsp; от
            <el-date-picker :placeholder="f.placeholder1"
                            @change="emits('changed')"
                            class="filter__row-select"
                            format="DD-MM-YYYY"
                            v-model="vModel.lowCreateDatePeriod"/>
          </span>
      <span v-else style="white-space: nowrap" :style="{margin:globalStore.isMobileView?'116px':''}">
            от<el-date-picker :placeholder="f.placeholder1"
                            @change="emits('changed')"
                            class="filter__row-select"
                            format="DD-MM-YYYY"
                            v-model="vModel.lowCreateDatePeriod"/>
          </span>
      <br v-if="globalStore.isMobileView">
      <span style="white-space: nowrap" :style="{margin:globalStore.isMobileView?'105px':''}">
        &nbsp; <span v-if="globalStore.isMobileView">&nbsp;</span> до
            <el-date-picker :placeholder="f.placeholder2"
                            @change="emits('changed')"
                            format="DD-MM-YYYY"
                            class="filter__row-select"
                            v-model="vModel.highCreateDatePeriod"/>
         </span>
    </div>

    <div v-if="f.type==='10. Число'">
      <span class="label">{{f.label}}</span>
      <el-input v-model="vModel[f.name]"
                @change="emits('changed')"
                type="number"
                clearable
                placeholder=""
                @key.enter="emits('changed')"/>
    </div>
    <div style="clear: both"></div>
  </div>
</template>
<script setup>
/**
 * Динамический, настраиваемый шаблон, для всех типов полей
 */
import {useGlobalStore} from "@/stores/globalStore";
import {vetRegNumber} from "@/utils/globalFunctions";

const globalStore = useGlobalStore()
const emits = defineEmits(['changed'])
const {vModel, lists, fields} = defineProps(['vModel', 'lists', 'fields'])

function changeRegistartionMark(name, value) {
  // eslint-disable-next-line vue/no-mutating-props
  vModel[name] = vetRegNumber(value)
}
</script>