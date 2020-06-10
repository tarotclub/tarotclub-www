import Vue from 'vue'
import Vuex from 'vuex'
import UserStore from './UserStore.js'
import MachineStore from './MachineStore.js'

Vue.use(Vuex)

const state = {
    isinitialized: false
}

const mutations = {
    SET_INITIALIZED: (state, status) => {
        state.isinitialized = status;
    }
}

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        user: UserStore, 
        machines: MachineStore
    },
    state,
    mutations,
    strict: debug
});
 
