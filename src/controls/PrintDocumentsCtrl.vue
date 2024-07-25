<template>
  <el-dropdown style="display: inline-block">
    <el-button type="info">
      <img src="@/assets/icons/icon-print.png" />
      &nbsp; Необходимые документы
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          @click="validatePrintForms(item)"
          v-for="(item, ind) in documents" :key="ind">{{ item.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style>
</style>

<script setup lang="ts">
import { useDealStore } from '@/stores/dealStore'
import { ref } from 'vue'

const dealStore = useDealStore()

// нужно понять и доработать доступы

const documents = [
  { name: 'Единый пакет документов', go: 'getfullpackageofdocs' },
  // { name: 'Доп. соглашения', go: 'getbuyerinstruction' },
  // { name: 'Коммерческие условия', go: 'getcommercialterms' },
  { name: 'Ценник', go: 'PRICE_TAG' },
  { name: ' Ценник (новый) ', go: 'PRICE_TAG_NEW' },

  // { name: '✔ Договор купли-продажи 🚧', go: 'getrepurchaseagreement' },
  // { name: '✔ Коммерческие условия 🚧', go: 'getcommercialterms' },
  // { name: '✔ Акт приема-передачи 🚧', go: 'deliveryacceptancecertificate' },
  { name: '✔ Гарантийное письмо', go: 'indemnity-letter' },
  { name: 'Лист осмотра', go: 'inspection-auto' },
  { name: 'Рабочий лист байера', go: 'buyer-worksheet' },
  { name: 'Карта осмотра (полная)', go: 'auto-inspection-full' },
  { name: 'Сертификат осмотра', go: 'inspection-certificate' },
  { name: 'Лист передачи а/м', go: 'buyer-listtransfer' },


]


function analystCarHelpClick(item) {
  let filter = {
    carModelId: dealStore.deal.auto.carModelId,
    yearReleased: dealStore.deal.auto.yearReleased,
    driveType: dealStore.deal.auto.driveType,
    gearboxType: [dealStore.deal.auto.gearboxType]
  }


  // WorkflowService.analystCarHelp({ filter: filter }).then(function (data) {
  //   $scope.analystCarHelpItems = data.items;
  //   var modal = UIkit.modal('#analystCarHelp');
  //   modal.show();
  // });
}

function opegPDF(data) {
  console.log('data = ', data)

  const source = `data:application/pdf;base64,${data.documentBody}`
  const link = document.createElement('a')
  link.href = source
  link.download = `${data.documentTitle}.pdf`
  link.click()
}

function validatePrintForms(item) {
  switch (item.go) {
    case 'indemnity-letter':
    case 'inspection-auto':
    case 'buyer-worksheet':
    case 'auto-inspection-full':
    case 'inspection-certificate':
    case 'buyer-listtransfer':

      // грузим файл ссылкой
      dealStore.getDealPrint(dealStore.deal.dealId, item.go)
      break
    case 'getfullpackageofdocs':
      dealStore.getNecessaryDocs(dealStore.deal.dealId).then(res => opegPDF(res.data))
      break
    case 'PRICE_TAG':
    case 'PRICE_TAG_NEW':
      dealStore.getBuyPrint(dealStore.deal.dealId, item.go).then(res => opegPDF(res.data))
      break

    case 'agreements26':
    case 'agreements27':
    case 'agreements28':
      // window.location.assign(
      //   $scope.apiUrl + `/print/buy/PrintAdditionalAgreement?dealId=${$routeParams.id}
      //                   &id=&printType=${print.slice(10)}`
      // )
      // checkError();
      break

  }
}
</script>