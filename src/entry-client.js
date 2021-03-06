// import Vue from 'vue';
import { createApp } from './app'

// 客户端特定引导逻辑……

const { app, store, router } = createApp();

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}

// 官方代码
router.onReady(() => {
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)

    // 我们只关心非预渲染的组件
    // 所以我们对比它们，找出两个匹配列表的差异组件
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })

    if (!activated.length) {
      return next()
    }

    // 这里如果有加载指示器(loading indicator)，就触发

    Promise.all(activated.map(c => {
      if (c.asyncData) {
        return c.asyncData(store)
      }
    })).then(() => {

      // 停止加载指示器(loading indicator)

      next()
    }).catch(next)
  })
  
  app.$mount('#app')
})


// Vue.mixin({
//   beforeMount () {
//     const { asyncData } = this.$options;
//     asyncData && asyncData(this.$store);
//   }
// });

// 这里假定 App.vue 模板中根元素具有 `id="app"`
// app.$mount('#app');

