import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export function createStore () {
  return new Vuex.Store({
    state: {
      age: 10
    },
    actions: {
      changeAge ({ commit }, step = 1) {
        return new Promise((resolve, reject) => {
          setTimeout(()=> {
            commit('changeAge', step);
            resolve();
          }, 1000);
        })
      }
    },
    mutations: {
      changeAge (state, step) {
        state.age += step;
      }
    }
  });
}