

export default {
    namespaced: true,
    state: {
        connection: 0,
        list: [
        ],
        currentServer: null
    },
    mutations: {
        SET_SERVERS: (state, list) => {
            state.list = list;
        },
        CLEAR_SERVERS: (state) => {
            state.list = [];
        },
        SET_CURRENT_SERVER: (state, server) => {
            state.currentServer = server;
            state.connection = 1;
        },
    },
    //====================================================================================================================
    getters: {

        machinesNotDeleted: state => {
            let m = state.list;
            return m.filter((e) => {
                return e.state === 1; // On n'affiche que les machines valides (non supprimées)
              });
        },
    }
}
