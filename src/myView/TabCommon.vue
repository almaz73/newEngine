<template>

  <i>Идеи тут, потому что:<br>
    - не потеряются,<br>
    - внимание к проделанной работе </i>


  <p>
    Старая программа у нас на angularJS, заросла множеством функций, и вследствие чего становится все запутанней и
    запутанней.
    Распутать этот клубок, и заодно обдумать как разбить все это на модули для удобной поддержки призвана новая
    программа на новой технологии Vue3.
  </p>
  <p>
    Второй фактор уходить от angularJS к Vue3 в том, что первый уже больше не поддерживается, устарел, и писать на этом
    языке труднее,
    нет возможностей менять вид некоторые контролы. Тогда как Vue3 очень гибкая, современная и немногословная.
  </p>
  <p>
    К дизайну, цветам и иконкам претензий нет, поэтому дизайн сохранил привычной, и решил переделывать только те места,
    которые улучшили бы интерфейс.
    На новой современной технологии сайт будет дешевле поддерживать и легче и быстрее добавлять новые возможности.
  </p>
  <p>
    Хочется, чтобы программа становилась более дружелюбной, фидбека, обратной связи от пользователей. Например, через
    <RouterLink to="/feedback">➽ страницу обратной связи</RouterLink>.<br>

    Возможно при личной встречи, или иными способами. Программа должны быть тонко заточена под необходимые нужды.
  </p>

  <p>
    Перед тем как начать, я пытался найти самые неудобные места сайта, они
    <RouterLink to="/ideas">тут</RouterLink>
    <br>
    Но они неполные, можно много чем дополнить.

  </p>
  <ul>
    Если в коротком варианте вот они:
    <li>В программе мало подсказок. Не ясно, что делает каждый контрол. Хочется подсказок при наведении мышкой</li>
    <li> Совершенно нигде в коде нет кэширования. Множество методов возвращают одно и то же. Кеширование уменьшит
      нагрузка на сервер.
    </li>
    <li> Сайт нужно улучшать для работы в мобильной версии</li>
    <li> Плохо работают модальные окна. В модальных окнах нельзя делать некоторые вещи, например загрузить файл, и
      возможно еще что-то ламается. Думаю в связи с этим и пытались отказаться от использования модальных окон, когда
      оно просилось
    </li>
    <li> Бывает, трудно понять, где находишься. Есть хлебные крошки мелкими буквами, но думаю заголовок должен ясно
      говорить об этом
    </li>
    <li>Слишком много контролов(кнопок) на одну страницу, или они не сгруппированы.</li>
    <li>Работа с методами не унифицирована. Например, на каких то страницах количество страниц называются total, где-то
      totalPage, где-то skip, где-то offset, где-то фильтр отправляется текстом, где-то параметрами. <br>Нужно бы собрать
      такие рассхождения, и привести к общему виду
    </li>
    <li>
      Бакенд в основном оперирует с ID для справочников.  Цвет id:10 или id:20 например, нужно бы использовать code,
      потому что id обычно используется для индексаций, и при копирование баз может поменяться.
      И плюс удобнее было бы использовать говорящие названия, colorCode:10 к примеру.
    </li>
  </ul>
</template>
<script setup lang="ts">
</script>