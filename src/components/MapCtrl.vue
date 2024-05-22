<template>
  <div id="mapContainer" class="mainMap"></div>
</template>
<style>

.mainMap {
  height: 100vh;
  width: 100vw;
  z-index: 5;
}

</style>

<script setup>
// https://codesandbox.io/p/sandbox/vue3-leaflet-kxrup?file=%2Fpackage.json%3A2%2C17-2%2C23


import {onMounted, ref} from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})


const map = ref(null)

onMounted(() => {
  map.value = L.map("mapContainer").setView([55.7809664, 49.2404736], 12);
  L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(map.value);

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      L.marker([position.coords.latitude, position.coords.longitude]).addTo(map.value);
    });
  } else {
    console.log('местоположение НЕ доступно')
  }

})

</script>
