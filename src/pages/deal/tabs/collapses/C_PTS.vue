<template>
  <div>
    <div class="info-filed">
      <label class="label l_200">Гос. номер</label>
      {{ deal.auto.registrationMark }}
    </div>

    <div class="info-filed">
      <label class="label l_200">Номер ПТС</label>
      {{ deal.auto.certificateNumber }}
    </div>


    <div class="info-filed">
      <label class="label l_200">Дата выдачи ПТС</label>
      {{ deal.auto.issuedDateText }}
    </div>


    <div class="info-filed">
      <label class="label l_200">ПТС выдан</label>
      {{ deal.auto.issuedBy }}
    </div>


    <div class="info-filed">
      <label class="label l_200">Количество хозяев по ПТС</label>
      {{ deal.auto.countHostsByVC }}
    </div>

    <div class="info-filed">
      <label class="label l_200">ПТС оригинальный</label>
      {{ deal.auto.isOriginalVC ? 'Да' : 'Нет' }}
    </div>
  </div>
</template>
<script setup lang="ts">
const {deal} = defineProps(['deal'])
</script>