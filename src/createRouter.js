import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        meta: {
          title: 'bar'
        },
        component: () => import(
          /*webpackChunkName: "bar"*/
          './components/Bar.vue'
        )
      },
      {
        path: '/foo',
        meta: {
          title: 'foo'
        },
        component: () => import(
          /*webpackChunkName: "foo"*/
          './components/Foo.vue'
        )
      }
    ]
  })
}