<template>
  <div class="bar">bar  {{$store.state.age}}</div>
</template>

<script>
export default {
  title () {
    return this.$route.meta.title
  },
  created() {
    import(
      /* webpackChunkName: "common1" */
      "../util/common1.js"
    );
  },
  asyncData(store) {
    return store.dispatch("changeAge", 2);
  },
};
</script>

<style scoped>
.bar {
  color: greenyellow;
}
</style>