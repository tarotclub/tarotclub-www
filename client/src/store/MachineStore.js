

/*

install_date timestamp,
    city TEXT,
    install_area TEXT,  -- Secteur d'installation: Zoo de Thoiry
    install_subarea TEXT, -- Sous-Secteur d'installation: Aucun
    address TEXT, -- Adresse: Parc et Chateau de Thoiry 78770 THOIRY
    number INTEGER, -- Numéro: Aucun
    misc_information TEXT, -- Infos particulières: Vide
    usage_info TEXT, -- Consigne d'utilisation: Aucune
    client_ref TEXT, -- Référence client: Aucun
    theme TEXT -- Visuel: 50 Ans HAPPY THOIRY



    Ville d'installation: ANGERS
    Secteur d'installation: Chateau Angers
    Sous-Secteur d'installation: Aucun
    Adresse: 2 promenade du Bout-du-Monde 49001 ANGERS
    Numéro: Aucun
    Etat: En panne
    Infos particulières: Vide
    Consigne d'utilisation: 5 jours 1/01; 1/05; 1 et 11/11; 25/12 + extinction de 19h00 a? 9h00
    Référence client: Aucun
    Visuel: Chateau d'Angers


 */


export default {
    namespaced: true,
    state: { 
        list: [
            // {   city: 'THOIRY', 
            //     exploitation_site: 'Zoo de Thoiry', 
            //     machine_name: 'Zoo de Thoiry 1', 
            //     address:'Parc et Chateau de Thoiry 78770 THOIRY',
            //     usage_info: '5 jours 1/01; 1/05; 1 et 11/11; 25/12 + extinction de 19h00 a? 9h00',
            //     serial_number: '',
            //     gps: '',
            //     misc_information: '',
            //     theme: '50 Ans HAPPY THOIRY' // Visuel
            // }
        ]
    },
    mutations: {
        SET_MACHINES: (state, machines) => {
            state.list = machines;
        },
        CLEAR_MACHINES: (state) => {
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

        machinesBySite: state => {
            let orderedList = [];
/*
             { 
                exploitation_site: 'Zoo de Thoiry'
                list: [
                    {},
                    {},
                    ...
                ]
             }

*/

            for (let i = 0; i < state.list.length; i++) {
                // Find any existing site

                if (state.list[i].state == 1) {
                    let found = false;
                    for (let j = 0; j < orderedList.length; j++) {
                        if (orderedList[j].exploitation_site == state.list[i].attr.exploitation_site) {

                            orderedList[j].list.push(state.list[i]);
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        let site = {
                            exploitation_site: state.list[i].attr.exploitation_site,
                            list: [ state.list[i] ]
                        }
                        orderedList.push(site);
                    }
                }
            }
            return orderedList;
        }

    }
}
