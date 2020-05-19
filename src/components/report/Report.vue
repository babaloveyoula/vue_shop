<template>
  <baidu-map
    :center="center"
    :zoom="zoom"
    @ready="handler"
    class="map"
  ></baidu-map>
</template>
<script>
export default {
  data() {
    return {
      center: { lng: 0, lat: 0 },
      zoom: 3
    };
  },
  methods: {
    handler({ BMap, map }) {
      console.log(BMap, map);
      this.center.lng = 106.684691;
      this.center.lat = 35.54279;
      this.zoom = 15;
    }
  }
};
</script>
<style lang="less">
.map {
  width: 100%;
  height: 100%;
}
</style>
