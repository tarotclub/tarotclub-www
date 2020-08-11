

export default {
    namespaced: true,
    state: {
        connection: 0,
        list: [
        ]
    },
    mutations: {
        SET_SERVERS: (state, machines) => {
            state.list = machines;
        },
        CLEAR_SERVERS: (state) => {
            state.list = [];
        }
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
