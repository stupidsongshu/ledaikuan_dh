<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  beforeRouteEnter () {
    console.log('app')
  }
}
</script>

<style lang="stylus">
  #app
    /*width: 10rem
    max-width: 600px*/
    min-height: 100%
    margin: 0 auto
    padding-top: 65px; /*no*/
</style>
