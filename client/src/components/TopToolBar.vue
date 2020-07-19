<template>
  <v-app-bar fixed app>
 
      <router-link to="/">
        <img class="mr-3" :src="require('../assets/logo.png')" height="40"/>
      </router-link>
      
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      
      <v-spacer></v-spacer>

      
      <!-- MENU -->

        <v-btn v-if="isLogged" to="/dashboard/home" icon>
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
        <v-btn v-if="isLogged" @click="logOut" icon>
          <v-icon>mdi-power</v-icon>
        </v-btn>
  </v-app-bar>
</template>
    
<script>


export default {
  components: {

  },
    //====================================================================================================================
    data() {
        return {
            title: "TarotClub",
            showSessionDialog: false,
            drawer: null,
        }
    },
    computed: {
        isLogged() {
            return this.$store.getters['user/isLogged'];
        },
        isAdmin() {
          return this.$store.getters['user/isAdmin'];
        },
        machines() {
          let m = this.$store.getters['machines/machinesBySite'];
          
          let searchText = this.search.toLowerCase();
          return m.filter((e) => {
              if (this.search != '') {
                  return e.exploitation_site.toLowerCase().includes(searchText);
              } else {
                return true;
              }
          });

        }
    },
    methods: {

        logOut() {
            this.$store.commit('user/LOGOUT');
            this.$store.commit('machines/CLEAR_MACHINES');
            this.$api.destroyToken();
            this.$router.push({ name: 'Signin' });
        },
        getMachineLink(id) {
            return '/dashboard/machineinfos/' + id;
        },
        toggleMenu() {
          // this.$eventHub.$emit('setAlert', 'Machine inconnue', 'error', 3000);
        }
    },
    mounted() {

    }

}

</script>