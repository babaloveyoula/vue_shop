<template>
   <vue-particle-line :hoverEffect="false" >
    <countTo :startVal='startVal' :endVal='endVal'  class="text-style animated shake"></countTo>
  </vue-particle-line >
</template>

<script>
  import countTo from 'vue-count-to';
  export default {
    components: { countTo },
    data () {
      return {
        startVal: 0,
        endVal: 2017
      }
    }
  }
</script>
<style lang="less" scoped>
.text-style{
    font-size:70px;
    background: linear-gradient(to right bottom, red , blue);
}

</style>