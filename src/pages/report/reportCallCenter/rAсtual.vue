<template>
  <main>
    <div class="filter-report">
      <h2>Актуальность обращений 🐸</h2>
      <div>
        <label class="label l_300">Дата</label>

        <el-date-picker
            v-model="searchFilter.date"
            format="DD.MM.YYYY"
            value-format="DD.MM.YYYY"
            :clearable="false"
        />
      </div>

      <div>
        <label class="label l_300">Сотрудник</label>
        <el-select
            style="width: 220px"
            v-model="searchFilter.employeeId"
            filterable>
          <el-option v-for="item in myEmployees" :key="item.id" :label="item.title" :value="item.id"/>
        </el-select>
      </div>

      <br>
      <el-button :icon="Grid" type="danger" @click="toSearch()">Сформировать</el-button>
      <el-button type="info" @click="init()">Сброс</el-button>
    </div>
    <el-table
        class="report-days-table"
        :data="tableData"
        size="small"
        v-if="tableData.length"
        border
        empty-text="Нет данных"
        :row-class-name="tableRowClassName"
        @row-click="rowClick"
        highlight-current-row
    >
      <el-table-column width="300" label="СОТРУДНИК">
        <template #default="scope">
          <span style="float: left;" >
            {{ scope.row.employeeTitle }}
          </span>
          <small class="red-text" style="float: right">
           {{ scope.row.employeeTitle?'итого среднее дней':''}}
          </small>
        </template>
      </el-table-column>
      <el-table-column  label="ОБРАЩЕНИЕ" prop="appealsCount" style="color:red"/>
      <el-table-column  label="ТИП" prop="appealTypeTitle"/>
      <el-table-column  label="САЛОН" prop="appealLocationTitle"/>
      <el-table-column  label="КЛИЕНТ" prop="clientTitle"/>
      <el-table-column  label="АВТО" prop="auto"/>
      <el-table-column  label="ДАТА ОБРАЩЕНИЯ" prop="appealCreateDate"/>
      <el-table-column  label="ДАТА ОСМОТРА" prop="buyCreateDate"/>
      <el-table-column  label="КОЛ_ВО ДНЕЙ" prop="appealDaysInWork"/>
    </el-table>
  </main>
</template>
<script setup>
import {useGlobalStore} from "@/stores/globalStore";
import {Grid} from "@element-plus/icons-vue";
import {ref} from "vue";
import {useReportStore} from "@/stores/reportStore";
import {formatDateDDMMYYYY} from "@/utils/globalFunctions";
import {ElMessage} from "element-plus";

const globalStore = useGlobalStore()
const myEmployees = ref([])
const searchFilter = ref({})
const reportStore = useReportStore()
const tableData = ref([])
let oldData=[]


globalStore.getRoles([110, 111]).then(res => myEmployees.value = res.items)



// function columnValue(row, ind) {
//   return row.reasons[ind - 5].count + ' (' + (row.reasons[ind - 5].count * 100 / row.totalAppealCount).toFixed(1) + '%)'
// }

const tableRowClassName = ({row}) => {
  let styles = ''
  if (!row.isShow) styles += 'hide-row '
  if (row.level === 2) styles += 'gray-fon '
  return styles
}


function rowClick(row) {
  if (row.level === 1) { // по нажатию родителя скрываем/показываем строку
    tableData.value.map(el => {
      if (el.number === row.number) {
        if (el.isExpanded) {
          el.isExpanded = false
          if (el.level === 2) el.isShow = false
        } else {
          el.isExpanded = true
          if (el.level === 2) el.isShow = true
        }
      }
      return el
    })
  }
}

function init() {
  searchFilter.value.date = formatDateDDMMYYYY(new Date())
  searchFilter.value.employeeId = null
}

init()


oldData = [        {
  "appealsCount": 2,
  "employeeTitle": "Бабаева Галина",
  "appealDaysInWorkAverage": 1847.0,
  "items": [
    {
      "appealId": 341843,
      "appealTypeTitle": "Выкуп",
      "appealLocationTitle": "АТЦ АПЕЛЬСИН",
      "clientTitle": " тест",
      "clientPhone": "53438808092",
      "auto": "Maserati Другая",
      "appealCreateDate": "14.02.2019",
      "buyCreateDate": null,
      "appealDaysInWork": 1870.0
    },
    {
      "appealId": 375909,
      "appealTypeTitle": "Выкуп",
      "appealLocationTitle": "Выкуп (Уфа)",
      "clientTitle": " Аня",
      "clientPhone": "05860537956",
      "auto": "Opel Astra",
      "appealCreateDate": "01.04.2019",
      "buyCreateDate": null,
      "appealDaysInWork": 1824.0
    }
  ]
},
  {
    "appealsCount": 82,
    "employeeTitle": "Быкова Надежда",
    "appealDaysInWorkAverage": 1713.0,
    "items": [
      {
        "appealId": 217623,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "KIA Нижнекамск",
        "clientTitle": " Резеда",
        "clientPhone": "29545289798",
        "auto": "Toyota Avensis",
        "appealCreateDate": "27.07.2018",
        "buyCreateDate": null,
        "appealDaysInWork": 2072.0
      },
      {
        "appealId": 310222,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Выкуп (Аист-К)",
        "clientTitle": " Ильдар",
        "clientPhone": "32261724612",
        "auto": "Ford Focus",
        "appealCreateDate": "20.12.2018",
        "buyCreateDate": null,
        "appealDaysInWork": 1926.0
      },
      {
        "appealId": 344080,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Марат",
        "clientPhone": "42005072411",
        "auto": "ВАЗ (LADA) Granta",
        "appealCreateDate": "18.02.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1866.0
      },
      {
        "appealId": 344749,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Марат",
        "clientPhone": "88966317780",
        "auto": "Citroen C4 Aircross",
        "appealCreateDate": "19.02.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1865.0
      },
      {
        "appealId": 351356,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Петр",
        "clientPhone": "15335249605",
        "auto": "ВАЗ (LADA) Granta",
        "appealCreateDate": "01.03.2019",
        "buyCreateDate": "02.03.2019",
        "appealDaysInWork": 1.0
      },
      {
        "appealId": 351642,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Юлия",
        "clientPhone": "99947571430",
        "auto": "Peugeot 308",
        "appealCreateDate": "01.03.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1855.0
      },
      {
        "appealId": 353001,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Айнур",
        "clientPhone": "98204629614",
        "auto": "Kia Rio",
        "appealCreateDate": "04.03.2019",
        "buyCreateDate": "04.03.2019",
        "appealDaysInWork": 0.0
      },
      {
        "appealId": 353016,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars выездной выкуп (НЧ)",
        "clientTitle": " Евгений",
        "clientPhone": "91122541443",
        "auto": "ВАЗ (LADA) Kalina",
        "appealCreateDate": "04.03.2019",
        "buyCreateDate": "04.03.2019",
        "appealDaysInWork": 0.0
      },
      {
        "appealId": 353212,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": "ДЕМЧУК Евгений",
        "clientPhone": "14632980895",
        "auto": "Kia Rio",
        "appealCreateDate": "04.03.2019",
        "buyCreateDate": "04.03.2019",
        "appealDaysInWork": 0.0
      },
      {
        "appealId": 353477,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Руслан",
        "clientPhone": "55330865508",
        "auto": "ВАЗ (LADA) Priora",
        "appealCreateDate": "04.03.2019",
        "buyCreateDate": "04.03.2019",
        "appealDaysInWork": 0.0
      },
      {
        "appealId": 353848,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Радик",
        "clientPhone": "15323660898",
        "auto": "Chevrolet Cruze",
        "appealCreateDate": "05.03.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1851.0
      },
      {
        "appealId": 355563,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Ильшат",
        "clientPhone": "99846795827",
        "auto": "Hyundai Getz",
        "appealCreateDate": "07.03.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1849.0
      },
      {
        "appealId": 355685,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars выездной выкуп (НЧ)",
        "clientTitle": " Ильшат",
        "clientPhone": "57715868533",
        "auto": "ВАЗ (LADA) Vesta",
        "appealCreateDate": "07.03.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1849.0
      },
      {
        "appealId": 356257,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Юрий",
        "clientPhone": "00277643398",
        "auto": "Opel Astra",
        "appealCreateDate": "08.03.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1848.0
      },
      {
        "appealId": 357985,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Николай",
        "clientPhone": "79894080101",
        "auto": "ВАЗ (LADA) Kalina",
        "appealCreateDate": "11.03.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1845.0
      },
      {
        "appealId": 359501,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Дмитрий",
        "clientPhone": "71105766063",
        "auto": "Geely Emgrand EC7",
        "appealCreateDate": "13.03.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1843.0
      },
      {
        "appealId": 360230,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Павел",
        "clientPhone": "61557804183",
        "auto": "Kia Rio X-Line",
        "appealCreateDate": "14.03.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1842.0
      },
      {
        "appealId": 360260,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Денис",
        "clientPhone": "12012067205",
        "auto": "ВАЗ (LADA) Priora",
        "appealCreateDate": "14.03.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1842.0
      },
      {
        "appealId": 363452,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Ильмир",
        "clientPhone": "93303856423",
        "auto": "ВАЗ (LADA) Kalina",
        "appealCreateDate": "18.03.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1838.0
      },
      {
        "appealId": 367570,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Алмаз Ильдаров",
        "clientPhone": "29485043549",
        "auto": "Volkswagen Polo",
        "appealCreateDate": "21.03.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1835.0
      },
      {
        "appealId": 368180,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars выездной выкуп (НЧ)",
        "clientTitle": " Рамис",
        "clientPhone": "27217893712",
        "auto": "ВАЗ (LADA) Priora",
        "appealCreateDate": "22.03.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1834.0
      },
      {
        "appealId": 370326,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Ленарис",
        "clientPhone": "95590710200",
        "auto": "Volkswagen Polo",
        "appealCreateDate": "25.03.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1831.0
      },
      {
        "appealId": 370620,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars выездной выкуп (НЧ)",
        "clientTitle": " Ильдус",
        "clientPhone": "69657257713",
        "auto": "Suzuki SX4",
        "appealCreateDate": "25.03.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1831.0
      },
      {
        "appealId": 371492,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Ренат",
        "clientPhone": "70738782490",
        "auto": "Kia Ceed",
        "appealCreateDate": "26.03.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1830.0
      },
      {
        "appealId": 375991,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Лиля",
        "clientPhone": "94792031146",
        "auto": "Kia Ceed",
        "appealCreateDate": "01.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1824.0
      },
      {
        "appealId": 376225,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Алексей",
        "clientPhone": "68306614018",
        "auto": "Chevrolet Cruze",
        "appealCreateDate": "02.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1823.0
      },
      {
        "appealId": 378948,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Юлия",
        "clientPhone": "98593602682",
        "auto": "Geely Emgrand X7",
        "appealCreateDate": "05.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1820.0
      },
      {
        "appealId": 378963,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Сергей",
        "clientPhone": "37421013261",
        "auto": "ВАЗ (LADA) Kalina",
        "appealCreateDate": "05.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1820.0
      },
      {
        "appealId": 379046,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Ильдар",
        "clientPhone": "69790010239",
        "auto": "Kia Rio",
        "appealCreateDate": "05.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1820.0
      },
      {
        "appealId": 379122,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Марсель",
        "clientPhone": "01079926785",
        "auto": "Hyundai i30",
        "appealCreateDate": "05.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1820.0
      },
      {
        "appealId": 379140,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Альберт",
        "clientPhone": "27755523170",
        "auto": "ВАЗ (LADA) Kalina",
        "appealCreateDate": "05.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1820.0
      },
      {
        "appealId": 379160,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Айдар",
        "clientPhone": "41010011613",
        "auto": "Opel Astra",
        "appealCreateDate": "05.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1820.0
      },
      {
        "appealId": 379447,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Марат",
        "clientPhone": "44506762549",
        "auto": "Ford Focus",
        "appealCreateDate": "05.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1820.0
      },
      {
        "appealId": 381024,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Айрат",
        "clientPhone": "40960690104",
        "auto": "Suzuki SX4",
        "appealCreateDate": "08.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1817.0
      },
      {
        "appealId": 381280,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Макс Редкозубов",
        "clientPhone": "06667752013",
        "auto": "Peugeot 308",
        "appealCreateDate": "08.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1817.0
      },
      {
        "appealId": 381364,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Рашид",
        "clientPhone": "05897402558",
        "auto": "Volkswagen Golf Plus",
        "appealCreateDate": "08.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1817.0
      },
      {
        "appealId": 381415,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars выездной выкуп (НЧ)",
        "clientTitle": " Ильдар",
        "clientPhone": "68812811234",
        "auto": "ВАЗ (LADA) Priora",
        "appealCreateDate": "08.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1817.0
      },
      {
        "appealId": 381461,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Руслан",
        "clientPhone": "06646887168",
        "auto": "ВАЗ (LADA) Kalina",
        "appealCreateDate": "08.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1817.0
      },
      {
        "appealId": 381577,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Раузиль",
        "clientPhone": "27300523315",
        "auto": "Volkswagen Jetta",
        "appealCreateDate": "08.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1817.0
      },
      {
        "appealId": 381891,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Владелец",
        "clientPhone": "13766263273",
        "auto": "Hyundai Creta",
        "appealCreateDate": "09.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1816.0
      },
      {
        "appealId": 381944,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Роман",
        "clientPhone": "47903026553",
        "auto": "ВАЗ (LADA) Kalina",
        "appealCreateDate": "09.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1816.0
      },
      {
        "appealId": 382145,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Артур",
        "clientPhone": "36898199313",
        "auto": "Skoda Octavia",
        "appealCreateDate": "09.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1816.0
      },
      {
        "appealId": 382945,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Александр",
        "clientPhone": "38185539452",
        "auto": "Opel Astra",
        "appealCreateDate": "10.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1815.0
      },
      {
        "appealId": 383029,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Юлия",
        "clientPhone": "26073287893",
        "auto": "Renault Fluence",
        "appealCreateDate": "10.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1815.0
      },
      {
        "appealId": 383061,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars выездной выкуп (НЧ)",
        "clientTitle": " Ришат",
        "clientPhone": "99321912618",
        "auto": "Ford Focus",
        "appealCreateDate": "10.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1815.0
      },
      {
        "appealId": 383532,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars выездной выкуп (НЧ)",
        "clientTitle": " Максим",
        "clientPhone": "60749800888",
        "auto": "Kia Rio",
        "appealCreateDate": "11.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1814.0
      },
      {
        "appealId": 383675,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Руслан",
        "clientPhone": "44943263879",
        "auto": "ВАЗ (LADA) Kalina",
        "appealCreateDate": "11.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1814.0
      },
      {
        "appealId": 384084,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Александр",
        "clientPhone": "94503122223",
        "auto": "ВАЗ (LADA) Granta",
        "appealCreateDate": "11.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1814.0
      },
      {
        "appealId": 384353,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Елена",
        "clientPhone": "63978933370",
        "auto": "ВАЗ (LADA) XRAY",
        "appealCreateDate": "12.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1813.0
      },
      {
        "appealId": 384385,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Ильнар",
        "clientPhone": "71630652513",
        "auto": "ВАЗ (LADA) Granta",
        "appealCreateDate": "12.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1813.0
      },
      {
        "appealId": 384661,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Продавец",
        "clientPhone": "93864927142",
        "auto": "Kia Rio",
        "appealCreateDate": "12.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1813.0
      },
      {
        "appealId": 384772,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars выездной выкуп (НЧ)",
        "clientTitle": " Нур Ямалов",
        "clientPhone": "62005446674",
        "auto": "ВАЗ (LADA) Priora",
        "appealCreateDate": "12.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1813.0
      },
      {
        "appealId": 386473,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Петр",
        "clientPhone": "40372191968",
        "auto": "ВАЗ (LADA) Granta",
        "appealCreateDate": "15.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1810.0
      },
      {
        "appealId": 386518,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Альбина",
        "clientPhone": "79049779452",
        "auto": "ВАЗ (LADA) Granta",
        "appealCreateDate": "15.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1810.0
      },
      {
        "appealId": 386599,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Ильдар",
        "clientPhone": "22395448991",
        "auto": "ВАЗ (LADA) Kalina",
        "appealCreateDate": "15.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1810.0
      },
      {
        "appealId": 386625,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars выездной выкуп (НЧ)",
        "clientTitle": " Салават",
        "clientPhone": "80876621658",
        "auto": "Hyundai Solaris",
        "appealCreateDate": "15.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1810.0
      },
      {
        "appealId": 386707,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Мария",
        "clientPhone": "47840183905",
        "auto": "Kia Rio",
        "appealCreateDate": "15.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1810.0
      },
      {
        "appealId": 386816,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Ярослав",
        "clientPhone": "05727808320",
        "auto": "ВАЗ (LADA) Granta",
        "appealCreateDate": "15.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1810.0
      },
      {
        "appealId": 386957,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Эдуард",
        "clientPhone": "61427190817",
        "auto": "ВАЗ (LADA) Kalina",
        "appealCreateDate": "15.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1810.0
      },
      {
        "appealId": 387181,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Рустам",
        "clientPhone": "24420346430",
        "auto": "Hyundai Solaris",
        "appealCreateDate": "16.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1809.0
      },
      {
        "appealId": 387370,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Ильхам",
        "clientPhone": "17759035253",
        "auto": "ВАЗ (LADA) Kalina",
        "appealCreateDate": "16.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1809.0
      },
      {
        "appealId": 387508,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Максим",
        "clientPhone": "14058929643",
        "auto": "Kia Rio",
        "appealCreateDate": "16.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1809.0
      },
      {
        "appealId": 387527,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Алия",
        "clientPhone": "19268426258",
        "auto": "Volkswagen Polo",
        "appealCreateDate": "16.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1809.0
      },
      {
        "appealId": 387537,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Рамис",
        "clientPhone": "53183861026",
        "auto": "Hyundai Solaris",
        "appealCreateDate": "16.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1809.0
      },
      {
        "appealId": 387566,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Рафаэль",
        "clientPhone": "53337817692",
        "auto": "ВАЗ (LADA) Granta",
        "appealCreateDate": "16.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1809.0
      },
      {
        "appealId": 388102,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Наиль",
        "clientPhone": "00241515813",
        "auto": "ВАЗ (LADA) Kalina",
        "appealCreateDate": "17.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1808.0
      },
      {
        "appealId": 388150,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Павел",
        "clientPhone": "70127443898",
        "auto": "Kia Rio",
        "appealCreateDate": "17.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1808.0
      },
      {
        "appealId": 388156,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Фрол Акимов",
        "clientPhone": "52665562391",
        "auto": "Skoda Octavia",
        "appealCreateDate": "17.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1808.0
      },
      {
        "appealId": 388175,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Алексей",
        "clientPhone": "83479779600",
        "auto": "Volkswagen Golf",
        "appealCreateDate": "17.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1808.0
      },
      {
        "appealId": 388196,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Айнур",
        "clientPhone": "71674337406",
        "auto": "ВАЗ (LADA) Vesta",
        "appealCreateDate": "17.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1808.0
      },
      {
        "appealId": 388281,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars выездной выкуп (НЧ)",
        "clientTitle": " Алексей",
        "clientPhone": "08413198380",
        "auto": "ВАЗ (LADA) XRAY",
        "appealCreateDate": "17.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1808.0
      },
      {
        "appealId": 388288,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars выездной выкуп (НЧ)",
        "clientTitle": " Ильяс",
        "clientPhone": "28168906509",
        "auto": "Kia Rio",
        "appealCreateDate": "17.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1808.0
      },
      {
        "appealId": 388918,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars выездной выкуп (НЧ)",
        "clientTitle": " Рустем",
        "clientPhone": null,
        "auto": "ВАЗ (LADA) Granta",
        "appealCreateDate": "18.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1807.0
      },
      {
        "appealId": 388976,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars выездной выкуп (НЧ)",
        "clientTitle": " Ильгиз",
        "clientPhone": null,
        "auto": "ВАЗ (LADA) Granta",
        "appealCreateDate": "18.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1807.0
      },
      {
        "appealId": 389012,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars выездной выкуп (НЧ)",
        "clientTitle": " Алина",
        "clientPhone": "89003238404",
        "auto": "ВАЗ (LADA) Granta",
        "appealCreateDate": "18.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1807.0
      },
      {
        "appealId": 389157,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Равиль",
        "clientPhone": "89196963310",
        "auto": "Kia Optima",
        "appealCreateDate": "18.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1807.0
      },
      {
        "appealId": 389281,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Юлия",
        "clientPhone": null,
        "auto": "Nissan Almera",
        "appealCreateDate": "18.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1807.0
      },
      {
        "appealId": 389343,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Радик",
        "clientPhone": "89503183484",
        "auto": "Volkswagen Tiguan",
        "appealCreateDate": "18.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1807.0
      },
      {
        "appealId": 389368,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Айдар",
        "clientPhone": "",
        "auto": "ВАЗ (LADA) Granta",
        "appealCreateDate": "18.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1807.0
      },
      {
        "appealId": 389411,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Венера",
        "clientPhone": null,
        "auto": "Nissan Almera",
        "appealCreateDate": "18.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1807.0
      },
      {
        "appealId": 389422,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars на Х.Туфана (НЧ)",
        "clientTitle": " Татьяна",
        "clientPhone": null,
        "auto": "ВАЗ (LADA) Granta",
        "appealCreateDate": "18.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1807.0
      },
      {
        "appealId": 389429,
        "appealTypeTitle": "Выкуп",
        "appealLocationTitle": "Used Cars выездной выкуп (НЧ)",
        "clientTitle": " Ирэк",
        "clientPhone": null,
        "auto": "Opel Corsa",
        "appealCreateDate": "18.04.2019",
        "buyCreateDate": null,
        "appealDaysInWork": 1807.0
      }
    ]
  },
]
normalizeTableData()
function toSearch() {
  let params = {date:searchFilter.value.date}
  if (searchFilter.value.employeeId) params.employeeId = searchFilter.value.employeeId

  reportStore.getActual(params).then(res => {
    if (res) {
      oldData = res.report
      normalizeTableData()
    }

    if (!tableData.value || !tableData.value.length) ElMessage.warning('Нет данных')
  })
}

function normalizeTableData() {
  tableData.value = []
  let report = JSON.parse(JSON.stringify(oldData))

  report.forEach((el, ind) => {
    tableData.value.push({
      employeeTitle: el.employeeTitle,
      appealsCount: el.appealsCount,
      phoneAll: el.phoneAll,
      isExpanded: false,
      isShow: true,
      level: 1,
      number: ind
    })
    if (el.items) {
      el.items.forEach(item => {
        tableData.value.push({
          appealsCount: item.appealId,
          appealTypeTitle: item.appealTypeTitle,
          appealLocationTitle: item.appealLocationTitle,
          clientTitle: item.clientTitle+' ☎ '+item.clientPhone,
          auto: item.auto,
          appealCreateDate: item.appealCreateDate,
          buyCreateDate: item.buyCreateDate,
          appealDaysInWork: item.appealDaysInWork,
          isShow: false,
          level: 2,
          number: ind
        })
      })

      tableData.value.push(el)
    }
  })

  // let sum = getSummCallsByDays(report)
  //
  // tableData.value.push(sum)
  console.log('tableData.value', tableData.value)
}


</script>
