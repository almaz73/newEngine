<template>
  <main>
    <h2>Отчет колл-центра по сотрудникам</h2>

    <div>
      <label class="label l_300">Период</label>
      <el-date-picker
          class="auto-panel"
          v-model="startDate"
          type="year"
          :clearable="false"
      />
      &nbsp; &nbsp; &nbsp;

      <el-date-picker
          class="auto-panel"
          v-model="startDate"
          type="year"
          :clearable="false"
      />

    </div>

    <div>
      <label class="label l_300">Тип сделки</label>
      <el-select
          style="width: 220px"
          v-model="managerId"
          @change="toChangeManager"
          filterable>
        <el-option v-for="item in responsibles" :key="item.id" :label="item.title" :value="item.id"/>
      </el-select>
    </div>

    <div>
      <label class="label l_300">Cотруджник</label>
      <el-select
          style="width: 220px"
          v-model="managerId"
          @change="toChangeManager"
          filterable>
        <el-option v-for="item in responsibles" :key="item.id" :label="item.title" :value="item.id"/>
      </el-select>
    </div>

    <div>
      <label class="label l_300">Отображение места выкупа</label>
      <el-select
          style="width: 220px"
          v-model="managerId"
          @change="toChangeManager"
          filterable>
        <el-option v-for="item in responsibles" :key="item.id" :label="item.title" :value="item.id"/>
      </el-select>
    </div>

    <br>
      <el-button :icon="MagicStick" type="danger">Сформировать</el-button>
      <el-button type="info">Сброс</el-button>
  </main>
</template>
<script setup>
import {MagicStick} from "@element-plus/icons-vue";
</script>
