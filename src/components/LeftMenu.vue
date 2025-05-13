<template>
  <el-popover
      placement="bottom"
      :title="`Версия ${globalStore.version}`"
      :width="200"
      :show-after="2000"
      :trigger="!globalStore.isMobileView?'hover':''"
  >
    <template #reference>
      <div
          class="left-menu-logo"
          :class="{ small: globalStore.isNarrowPanel, show: globalStore.isShowPanel }"
          @click="globalStore.isShowPanel = false;"
      ></div>
    </template>
    <template #default>
      <RouterLink to="/version" @click="changeMenu({data:'73'})">Детальнее..</RouterLink>
    </template>
  </el-popover>

  <div v-if="globalStore.isMobileView && globalStore.isShowPanel"
       style="width: 100%; height: 100vh; position: fixed; z-index: 10"
       @click="globalStore.isShowPanel = false"
  ></div>

  <div
      class="left-menu-div"
      :class="{ narrow: globalStore.isNarrowPanel, show: globalStore.isShowPanel }"
      style=" min-width: 75px"
  >
    <el-menu
        :default-active="''+globalStore.leftMenuindex"
        class="el-menu-vertical"
        :collapse="globalStore.isNarrowPanel"
        @select="select"
        popper-effect="light"
    >

      <RouterLink to="/desktop" v-if="permit('menu','desktop')">
        <el-menu-item index="1">
          <el-icon>
            <img alt="Рабочий стол" src="@/assets/icons/ic-desktop-windows-black-18-px.png" height="34" width="34"/>
          </el-icon>
          <template #title>Рабочий стол</template>
        </el-menu-item>
      </RouterLink>

      <RouterLink to="/appeal" v-if="permit('menu','appeal')">
        <el-menu-item index="2">
          <el-icon>
            <img alt="Обращения" src="@/assets/icons/ic-people-black-18-px.png" height="34" width="34"/>
          </el-icon>
          <template #title>Обращения</template>
        </el-menu-item>
      </RouterLink>

      <RouterLink to="/deal" v-if="permit('menu','deal')">
        <el-menu-item index="3">
          <el-icon>
            <img alt="Оценки" src="@/assets/icons/ic-directions-car-black-18-px.png" height="34" width="34"/>
          </el-icon>
          <template #title>Оценки</template>
        </el-menu-item>
      </RouterLink>

      <RouterLink to="sell" v-if="permit('menu','sell')">
        <el-menu-item index="4">
          <el-icon>
            <img alt="Склад" src="@/assets/icons/ic-home-black-18-px.png" height="34" width="34"/>
          </el-icon>
          <template #title>Склад</template>
        </el-menu-item>
      </RouterLink>

      <RouterLink to="showcase" v-if="permit('menu','showcase')">
        <el-menu-item index="4">
          <el-icon>
            <img alt="Склад" src="@/assets/icons/ic-vitrina-black-18-px.png" height="34" width="34"/>
          </el-icon>
          <template #title>Витрина</template>
        </el-menu-item>
      </RouterLink>

      <RouterLink to="calls" v-if="permit('menu','calls')">
        <el-menu-item index="5">
          <el-icon>
            <img alt="Звонки" src="@/assets/icons/ic-call-black-20-px.png" height="34" width="34"/>
          </el-icon>
          <template #title>Звонки</template>
        </el-menu-item>
      </RouterLink>

      <RouterLink to="/admin" v-if="permit('menu','admin')">
        <el-menu-item index="7">
          <el-icon>
            <img alt="Вложенные меню" src="@/assets/icons/ic-settings-black-18-px.png" height="34" width="34"/>

          </el-icon>
          <template #title>Управление</template>
        </el-menu-item>
      </RouterLink>

      <el-sub-menu index="6" v-if="permit('menu','importExport')">
        <template #title>
          <el-icon>
            <img alt="Управление" src="@/assets/icons/ic-import-export-black-18-px.png" height="34" width="34"/>
          </el-icon>
          <span>Вложенные меню</span>
        </template>
        <template><span>Раздел с подподразделом</span></template>
        <a href="https://www.forbes.ru/karera-i-svoy-biznes/384349-kak-zhitel-kazani-perezhil-bankrotstvo-i-postroil-set-avtosalonov-s"
           target="_blank">
          <el-menu-item index="6-1">то Подаздел</el-menu-item>
        </a>
        <el-sub-menu index="6-2">
          <template #title><span>Раздел с подподразделом</span></template>
          <a href="https://xn--80aej9aped4f.xn--p1ai/" target="_blank">
            <el-menu-item index="6-2-1">Подподраздел</el-menu-item>
          </a>
        </el-sub-menu>

        <el-sub-menu index="6-3" disabled>
          <template #title><span>Задизаблим</span></template>
        </el-sub-menu>
      </el-sub-menu>


      <RouterLink to="/calendar" v-if="permit('menu','calendar')">
        <el-menu-item index="8">
          <el-icon>
            <img alt="Cобытия" src="@/assets/icons/ic-done-all-black-18-px.png" height="34" width="34"/>
          </el-icon>
          <template #title>Cобытия</template>
        </el-menu-item>
      </RouterLink>

      <RouterLink to="/map" v-if="permit('menu','map')">
        <el-menu-item index="9">
          <el-icon>
            <img alt="Аналитика" src="@/assets/icons/ic-trending-up-black-18-px.png" height="34" width="34"/>
          </el-icon>
          <template #title>Аналитика</template>
        </el-menu-item>
      </RouterLink>

      <RouterLink to="/" v-if="permit('menu','plan')">
        <el-menu-item index="10">
          <el-icon>
            <img alt="Плановые показатели" src="@/assets/icons/icon-plan-indicator.png" height="34" width="34"/>
          </el-icon>
          <template #title>Плановые показатели</template>
        </el-menu-item>
      </RouterLink>

      <RouterLink to="/" v-if="permit('menu','')">
        <el-menu-item index="11">
          <el-icon>
            <img alt="Заявки на кредит" src="@/assets/icons/ic-account-balance-black-18-px.png" height="34" width="34"/>
          </el-icon>
          <template #title>Заявки на кредит</template>
        </el-menu-item>
      </RouterLink>

      <RouterLink to="/realization" v-if="permit('menu','realization')">
        <el-menu-item index="12">
          <el-icon>
            <img alt="Реализация" src="@/assets/icons/ic-shopping-cart-black-18-px.png" height="34" width="34"/>
          </el-icon>
          <template #title>Реализация</template>
        </el-menu-item>
      </RouterLink>

      <RouterLink to="/" v-if="permit('menu','')">
        <el-menu-item index="13">
          <el-icon>
            <img alt="Страховые полисы" src="@/assets/icons/icon-insurance-policies.png" height="34" width="34"/>
          </el-icon>
          <template #title>Страховые полисы</template>
        </el-menu-item>
      </RouterLink>

      <RouterLink to="/" v-if="permit('menu','')">
        <el-menu-item index="14">
          <el-icon>
            <img alt="Доп.оборудование" src="@/assets/icons/icon-equip.png" height="34" width="34"/>
          </el-icon>
          <template #title>Доп.оборудование</template>
        </el-menu-item>
      </RouterLink>

      <RouterLink to="/reports" v-if="permit('menu','reports')">
        <el-menu-item index="15">
          <el-icon>
            <img alt="отчеты" src="@/assets/icons/icon-reports.png" height="34" width="34"/>
          </el-icon>
          <template #title>отчеты</template>
        </el-menu-item>
      </RouterLink>

      <RouterLink to="/" v-if="permit('menu','')">
        <el-menu-item index="16">
          <el-icon>
            <img alt="Новости" src="@/assets/icons/ic-chat-black-18-px.png" height="34" width="34"/>
          </el-icon>
          <template #title>Новости</template>
        </el-menu-item>
      </RouterLink>

      <RouterLink to="/" v-if="permit('menu','')">
        <el-menu-item index="17">
          <el-icon>
            <img alt="Система" src="@/assets/icons/ic-system-inactive.png" height="34" width="34"/>
          </el-icon>
          <template #title>Система</template>
        </el-menu-item>
      </RouterLink>

      <RouterLink to="/" v-if="permit('menu','')">
        <el-menu-item index="18">
          <el-icon>
            <img alt="Помощь" src="@/assets/icons/ic-help-red-18-px.png" height="32" width="32"/>
          </el-icon>
          <template #title>Помощь</template>
        </el-menu-item>
      </RouterLink>

      <RouterLink to="/" v-if="permit('menu','')">
        <el-menu-item index="19">
          <el-icon>
            <img alt="Анкеты" src="@/assets/icons/icon-questionnaires_.png" height="34" width="34"/>
          </el-icon>
          <template #title>Анкеты</template>
        </el-menu-item>
      </RouterLink>

      <RouterLink to="/myView" v-if="permit('menu', '')">
        <el-menu-item index="0">
          <el-icon>
            ИДЕИ
          </el-icon>
          <template #title>Рабочий стол</template>
        </el-menu-item>
      </RouterLink>
    </el-menu>
  </div>


  <div
      class="left-menu-fon"
      :class="{ small: globalStore.isNarrowPanel }"
      v-if="!globalStore.isMobileView && (!globalStore.isNarrowPanel || !globalStore.isShowPanel)"
  ></div>
  <div
      v-if="!globalStore.isNeedTop"
      class="left-menu-opener"
      :class="{ small: globalStore.isNarrowPanel }"
      @click="globalStore.isNarrowPanel = !globalStore.isNarrowPanel"
  >
    <div v-if="!globalStore.isNarrowPanel">
      <img alt="" src="@/assets/img/left-toggle-arrow.png" width="16"/>
      <span> &nbsp; &nbsp; Свернуть меню &nbsp; </span>
    </div>
    <div v-else>
      <img alt="" src="@/assets/img/right-toggle-arrow.png" width="16"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useGlobalStore} from '@/stores/globalStore'
import {ref} from "vue";
import EventBus from "@/utils/eventBus";
import {permit} from "@/utils/permit.js"
import router from '@/router'


const globalStore = useGlobalStore()
const activeIndex = ref('')
const select = (val: string) => {
  globalStore.isShowPanel = false
  globalStore.leftMenuindex = val
}

EventBus.addEventListener('changeMenu', changeMenu)

function changeMenu(a: any) {
  activeIndex.value = a.data
}


// нужно автоматически вычислить по браузерному адресу подходящее меню
router.beforeEach(rout => {
  let storage = 0
  const indexes = { '/v2/desktop': 1, '/v2/appeal': 2, '/v2/deal': 3, '/v2/auto': 3, '/v2/sell': 4 }

  setTimeout(() => {
    let path = rout && rout.href.match(/(\/[^\/]*\/[^\/]*\/)/)
    if (!path) path = [rout.href]
    let p2 = path && path[0].slice(0, -1)
    let ind = Object.keys(indexes).find(el => el.indexOf(p2) > -1)
    if (ind) storage = indexes[ind]
    globalStore.leftMenuindex = storage
  })
})


</script>