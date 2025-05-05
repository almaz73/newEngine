<template>
  <div class="place-table-vitrina">
    <h3 style="text-align: center" v-if="rootTitle || lenRoot">{{ rootTitle }} : {{ lenRoot }}</h3>
    <span v-show="globalStore.isWaiting"
          style="font-size: 32px; opacity: 0.6; position: absolute; left: 47%; top: 150px"> ⧖ </span>
    <div v-show="!globalStore.isWaiting">
      <div style="margin-top: 8px;padding: 8px;">
        <span>
          <el-input clearable v-model="show.searchText" @input="toSearch()" placeholder="поиск..." />
        </span>

        <span style="float: right">
          <el-button title="Вложенности" @click="levels()">≣</el-button>
        </span>

        <div class="vitrina_b_org_us" v-if="!isShort">
          <el-button
            plain
            type="primary"
            @click="toUser()"
            :style="!!lenUsers?{background:'white', borderRadius: '4px'}:''">
            Сотрудники {{ lenUsers }}
          </el-button>
          <el-button
            plain
            @click="toOrg()"
            :style="lenOrgs?{background:'white', borderRadius: '4px'}:''">
            Организации {{ lenOrgs }}
          </el-button>
        </div>
      </div>
      <br>
      <div style="padding:0 8px; max-height: 650px; overflow-y: auto">
        <table style="color: #494848;">
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

              <div class="vitrina_row">
                {{ item.name }}
              </div>
            </td>

            <td style="text-align: center" :style="item.level===1?{'font-weight':'bold'}:''">
              {{ item.count }}
            </td>
          </tr>
          </tbody>
        </table>
        <br><br>
      </div>
    </div>
  </div>
</template>

<style>
.place-table-vitrina {
  position: relative;
  background: white;
  width: 500px;
  padding: 0 24px;
}


.vitrina_row {
  cursor: pointer;
  width: 400px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

@media (width < 500px) {
  .place-table-vitrina {
    width: 330px;
  }

  .vitrina_row {
    width: 270px;
  }
}

.vitrina_b_org_us {
  display: flex;
  justify-content: space-between;
  margin-top: 8px
}

.vitrina_b_org_us button {
  padding: 0 30px;
}
</style>

<script setup lang="ts">

import { ref } from 'vue'
import { useGlobalStore } from '@/stores/globalStore'

const globalStore = useGlobalStore()
const rootTitle = ref('')
const lenRoot = ref<number | null>(null)
const isShort = ref(false)
const items = ref<any>([])
const lenUsers = ref<string>()
const lenOrgs = ref<string>('')
const show = ref<any>({})


function toUser() {
  makeTable(show.value.usersData)
  lenOrgs.value = ''
  lenUsers.value = ' : ' + show.value.usersData?.length
  toSearch()
}

function toOrg() {
  makeTableWitnOrg(show.value.usersData)
  toSearch()
}

function makeTableWitnOrg(data: any) {
  let listOrgs: any = {}
  // создаем список организаций, с вложенными пользователями с их салонами
  data.forEach((el: any) => {
    el.organizations.forEach((item: any) => {
      if (!listOrgs[item.title]) {
        listOrgs[item.title] = {
          name: item.title,
          appealCountByUser: item.appealCountByOrg,
          organizations: [{
            title: el.name,
            appealCountByOrg: item.appealCountByOrg,
            departments: item.departments
          }]
        }
      } else {
        listOrgs[item.title].appealCountByUser += item.appealCountByOrg
        listOrgs[item.title].organizations.push({
          title: el.name,
          appealCountByOrg: item.appealCountByOrg,
          departments: item.departments
        })

      }
    })
  })
  let arr: any = []
  Object.entries(listOrgs).forEach(z => arr.push(z[1]))
  lenOrgs.value = ' : ' + arr.length
  lenUsers.value = ''
  makeTable(arr)
}


let level = 1

function levels() {
  if (level < 3) level++
  else level = 1

  if (level === 1) level1()
  if (level === 2) level2()
  if (level === 3) level3()
}

function level1() {
  items.value.forEach((row: any) => {
    if (row.level != 1) row.show = false
    row.isDeployed = false
  })
  level = 1
}

function level2() {
  items.value.forEach((row: any) => {
    row.isDeployed = true
    if (row.level === 2) {
      row.show = true
      row.isDeployed = false
    }
    if (row.level === 3) {
      row.show = false
      row.isDeployed = false
    }
  })
  level = 2
}

function level3() {
  items.value.forEach((row: any) => {
    row.isDeployed = true
    row.show = true
  })
  level = 3
}


function toSearch() {
  let val = show.value.searchText
  if (val) val = val.toLowerCase()
  if (val) items.value.map((el: any) => el.hide = !el.alltxt.includes(val))
  else items.value.map((el: any) => el.hide = false)
}

function rowClick(row: any) {
  if (row.level === 1) {
    row.isDeployed = !row.isDeployed

    if (row.isDeployed) {
      items.value.forEach((item: any) => {
        if (item.level === 2 && item.parentId == row.id) item.show = true
      })
    } else {
      // закрываем все подподузлы, после закрытия подузла
      items.value.forEach((item: any) => {
        if (item.level == 2 && item.parentId == row.id) {
          item.show = false
          item.isDeployed = false
          items.value.forEach((elem: any) => {
            if (elem.level == 3 && item.id == elem.parentId) {
              elem.show = false
              elem.isDeployed = false
            }
          })
        }
      })
    }
  }

  if (row.level == 2) {
    row.isDeployed = !row.isDeployed
    items.value.forEach((item: any) => {
      if (item.level == 3 && item.parentId == row.id) {
        item.show = row.isDeployed
      }
    })
    if (row.alltxt === 'Отказались') {
      let link = location.origin
      link += '/v2/appeal/' + row.name
      window.open(link)
    }
  }
}

function makeTable(data: any) {
  let rowLevel1Id = 1
  let rowLevel2Id = 1
  let rowLevel3Id = 1
  lenRoot.value = 0
  items.value = []
  if (!data) return false

  if (data[0] && data[0].count != undefined) {
    data = data.sort((a: any, b: any) => {
      if (a.count < b.count) return 1
      else if (a.count > b.count) return -1
      else 0
    })
  } else {
    data = data.sort((a: any, b: any) => {
      if (a.appealCountByUser < b.appealCountByUser) return 1
      else if (a.appealCountByUser > b.appealCountByUser) return -1
      else 0
    })
  }

  data.forEach((item_0: any) => {
    let row: any = {}
    let alltxt = ''
    row.id = rowLevel1Id
    row.name = item_0.name
    alltxt = row.name.toLowerCase()
    row.level = 1
    row.show = true
    row.isDeployed = true
    row.isDeployed = (level === 1)
    row.appealsCount = item_0.appealCount
    row.dealsCount = item_0.buyCount

    let rootCount = 0
    items.value.push(row)
    item_0.organizations && item_0.organizations.forEach((item_1: any) => {
      let row: any = {}
      row.id = rowLevel2Id
      row.name = item_1.title
      alltxt += row.name.toLowerCase()
      row.count = item_1.appealCountByOrg
      rootCount += row.count
      row.show = true
      row.isDeployed = true
      if (level === 1) {
        row.show = false
        row.isDeployed = false
      }
      row.level = 2
      row.parentId = rowLevel1Id
      items.value.push(row)

      item_1.departments.forEach((item_2: any) => {
        let row: any = {}
        row.id = rowLevel3Id
        row.name = item_2.title
        alltxt += row.name.toLowerCase()
        row.count = item_2.appealCountByDepartment
        row.show = true
        row.isDeployed = true
        if (level === 2 || level === 1) {
          row.show = false
          row.isDeployed = false
        }
        row.level = 3
        row.parentId = rowLevel2Id
        row.number = null
        row.type = 10
        row.alltxt = alltxt
        items.value.push(row)
        rowLevel3Id++
      })
      row.alltxt = alltxt

      rowLevel2Id++
    })


    item_0.appeals && item_0.appeals.forEach((reject: any) => {
      let row: any = {}
      row.id = rowLevel2Id
      row.name = reject
      // rootCount += row.count
      row.show = true
      row.isDeployed = true
      if (level === 1) {
        row.show = false
        row.isDeployed = false
      }
      row.level = 2
      row.parentId = rowLevel1Id
      items.value.push(row)
      row.alltxt = 'Отказались'
      rowLevel2Id++
    })

    row.alltxt = alltxt
    row.count = rootCount
    if (item_0.count) row.count = item_0.count
    lenRoot.value += row.count

    rowLevel1Id++
  })
}

function showData(data: any, node: string) {
  if (node) {
    let path = node.split('|')
    rootTitle.value = path[2]
    makeTable(data[path[0]][path[1].slice(0, -1)])
    isShort.value = true
    level1()
  } else {
    makeTable(data.usersData)
    rootTitle.value = 'Обращения в работе'
    isShort.value = false
    setTimeout(toUser)
  }

  show.value = data
}

defineExpose({ showData })
</script>