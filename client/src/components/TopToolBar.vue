<template>
<div>
      <v-navigation-drawer
      v-model="drawer"
      absolute
      :permanent="$vuetify.breakpoint.mdAndUp"
      >
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-icon>mdi-account-circle</v-icon>
            <!--<v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>-->
          </v-list-item-avatar>

    
            <v-list-item-title v-if="isLogged">{{fullName}}</v-list-item-title>
            <v-btn
              icon
              @click.stop="drawer = !drawer"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
          
        </v-list-item>

        <v-divider></v-divider>

    <!-- ================ MENU DE GAUCHE ================ -->
        <v-list dense>

          <v-list-item
            v-for="item in menuItems"
            :key="item.title"
            :to="`/dashboard/` + item.page"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
                            
            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

    </v-navigation-drawer>

  <v-app-bar fixed app>



    <v-app-bar-nav-icon @click.stop="drawer = !drawer" ></v-app-bar-nav-icon>
    <router-link to="/">
      <img class="mr-3" :src="require('../assets/logo.png')" height="40" />
    </router-link>

    <v-toolbar-title class="hidden-xs-and-down" style="margin-right:20px;">{{ title }}</v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- MENU -->
 
    <v-btn v-if="isLogged" to="/dashboard/home" icon>
      <v-icon>mdi-account-circle</v-icon>
    </v-btn>
    <v-btn v-if="isLogged" @click="logOut" icon>
      <v-icon>mdi-power</v-icon>
    </v-btn>

    <v-btn v-if="!isLogged" color="primary" :to="{name: 'signin'}">Connexion</v-btn>
    <v-btn v-if="!isLogged" color="success" :to="{name: 'signup'}" style="margin-left:10px;">S'inscrire</v-btn>
  </v-app-bar>
</div>
</template>
    
<script>
export default {
  // components: {},
  //====================================================================================================================
  data() {
    return {
      title: "TarotClub",
      showSessionDialog: false,
      items: [
          { text: 'Accueil', icon: 'mdi-home', page: 'home', user: true },
          { text: 'Mon profil', icon: 'mdi-account', page: 'profile', user: true },
          { text: 'Machines', icon: 'mdi-format-list-bulleted', page: 'machines', user: true },
          { text: 'Utilisateurs', icon: 'mdi-account-group', page: 'users', user: false }
      ],
      drawer: null,
    };
  },
  computed: {
    isLogged() {
      return this.$store.getters["user/isLogged"];
    },
    isAdmin() {
      return this.$store.getters["user/isAdmin"];
    },
    machines() {
      let m = this.$store.getters["machines/machinesBySite"];

      let searchText = this.search.toLowerCase();
      return m.filter((e) => {
        if (this.search != "") {
          return e.exploitation_site.toLowerCase().includes(searchText);
        } else {
          return true;
        }
      });
    },
  },
  methods: {
    logOut() {
      this.$store.commit("user/LOGOUT");
      this.$store.commit("machines/CLEAR_MACHINES");
      this.$api.destroyToken();
      this.$router.push({ name: "Signin" });
    },
    getMachineLink(id) {
      return "/dashboard/machineinfos/" + id;
    },
    toggleMenu() {
      // this.$eventHub.$emit('setAlert', 'Machine inconnue', 'error', 3000);
    },
  },
  mounted() {},
};
</script>