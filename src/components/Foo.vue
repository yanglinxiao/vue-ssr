<template>
  <div class="foo">foo {{$store.state.age}}</div>
</template>

<script>

export default {
  title () {
    return this.$route.meta.title
  },
  created() {
    import(
      /* webpackChunkName: "common2" */
      /* webpackPrefetch: true */
      "../util/common2.js"
    );
  },
  asyncData (store) {
    return store.dispatch('changeAge', 10);
  }
};
</script>

<style scoped>
.foo {
  color: hotpink;
}
</style>