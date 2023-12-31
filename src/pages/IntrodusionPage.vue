<template>
  <main>

    <h2>Программный продукт "Апельсин"</h2>
    <br>

    <p>
      <RouterLink to="/ideas">Накоплено</RouterLink>
      - Идеи по редизайну
    </p>
    <p>
      <a href="https://g66.ru/almaz73/" title="Оставить замечания, предложения, идеи">
        Task Board</a> - Доска замечаний и предложений
    </p>

    <br>
    <h4>Инструкции по работе (В разработке)</h4>
    <p>
      <RouterLink to="/bayerhelp">Инструкция. Байер</RouterLink>
    </p>

  </main>
</template>

<script setup>
import {useGlobalStore} from "@/stores/globalStore";

useGlobalStore().setTitle('Введение')
</script>