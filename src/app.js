import Vue from 'vue';
import App from './App.vue';
import { createRouter } from './createRouter';
import { createStore } from './createStore';
import titleMixin from './mixin/title'

Vue.mixin(titleMixin);

// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp () {
  // 创建路由实例
  const router = createRouter();
  // 创建store实例
  const store = createStore();

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  });

  return { app, router, store };
}