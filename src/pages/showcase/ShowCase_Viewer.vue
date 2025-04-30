<template>
  <div class="place-table-vitrina">
    <h3 style="position: absolute; top: -30px; width: 100%; text-align: center">{{ rootTitle }} : {{ lenRoot }}</h3>
    <span v-show="globalStore.isWaiting"
          style="font-size: 32px; opacity: 0.6; position: absolute; left: 47%; top: 50px"> ⧖ </span>
    <div v-show="!globalStore.isWaiting">
      <div class="uk-table-container" style="margin-top: 8px;padding: 8px;">
                <span>
                    <input v-model="show.searchText" @change="toSearch()" placeholder="поиск..." />
                    <a
                      @click="clearSearch()"
                      class="uk-text-danger"
                    ><i class="uk-icon-close"></i>
                    </a>
                </span>
        <span style="float: right" v-if="!isShort">
                        <button @click="level1()" title="Скрыть уровни"> ⭱</button>
                        <button @click="level2()" title="Показать зависимость"> ⭶</button>
                    <button @click="level3()" title="Показать все"> ⭳</button>

                </span>
        <div class="b_org_us" v-if="!isShort">
          <button @click="toUser()" :style="!!lenUsers?{background:'white', borderRadius: '4px'}:''">
            Сотрудники {{ lenUsers }}
          </button>
          <button @click="toOrg()"

                  :style="lenOrgs?{background:'white', borderRadius: '4px'}:''">
            Организации {{ lenOrgs }}
          </button>
        </div>
      </div>
      <br>
      <div class="uk-table-container"
           style="height: 430px;overflow-y: auto;overflow-x: hidden; padding:0 8px;">

        <table class="uk-table a-table-credits"

               style="color: #494848; width: 100%">
          <tbody>
          <tr
            v-for="item in items"
            class="a-grid-row"
            v-show="item.show === true && !item.hide"
            @click="rowClick(item)"
            :style="(item.level === 2) ? {'color' : '#d34439'}:(item.level === 3) ? {'font-style' : 'italic'}:null"
          >
            <td
              :title="item.name"
              :style="(item.level === 2) ? {'padding-left' : '15px'}:(item.level === 3) ? {'padding-left' : '30px'}:null">

              <div
                style="width: 310px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                {{ item.name }}
              </div>
            </td>

            <td style="text-align: center" :style="item.level===1?{'font-weight':'bold'}:''">
              {{ item.count }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import { useGlobalStore } from '@/stores/globalStore'

const globalStore = useGlobalStore()
const { data, rootTitle, lenRoot } = defineProps(['data', 'rootTitle', 'lenRoot'])
const items = ref<any>([])
const lenUsers = ref(0)
const lenOrgs = ref(0)
const show = ref({})


function showData(val: any) {
  console.log('val = ', val)
  console.log('!!!! data = ', data)
  items.value = data
}

defineExpose({ showData })
</script>