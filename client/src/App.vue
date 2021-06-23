<template>

  <!-- APP -->

  <v-app>

    <v-app-bar fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" ></v-app-bar-nav-icon>
       
        <v-toolbar-title class="hidden-xs-and-down" style="margin-right:20px;">TarotClub</v-toolbar-title>

    <v-spacer></v-spacer>
       
       <v-btn v-if="isLogged" to="/dashboard/home" icon>
      <v-icon>mdi-account-circle</v-icon>
    </v-btn>
    <v-btn v-if="isLogged" @click="logOut" icon>
      <v-icon>mdi-power</v-icon>
    </v-btn>

    <v-btn v-if="!isLogged" color="primary" :to="{name: 'signin'}">Connexion</v-btn>
    <v-btn v-if="!isLogged" color="success" :to="{name: 'signup'}" style="margin-left:10px;">S'inscrire</v-btn>
       
    </v-app-bar>
    
    <v-snackbar v-model="alertEnable" :color="alertType" :timeout="alertTimeout" :top="true">
          {{ alertText }}
    </v-snackbar>

    <v-navigation-drawer v-model="drawer" app no-gutters :permanent="$vuetify.breakpoint.mdAndUp">
      
         <v-list-item>
           <v-list-item-avatar tile size="50">
             <v-img src="logo.png" max-height="40"  max-width="40"></v-img>
           </v-list-item-avatar>
        <v-list-item-content>
          
          <v-list-item-title class="title">
           TarotClub
          </v-list-item-title>
          <v-list-item-subtitle>
            Tarot card game
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
        
        <v-list dense>

          <v-list-item
            v-for="item in menuItems"
            :key="item.title"
            :to="`/` + item.page"
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

    <v-main fluid>
      <router-view></router-view>   
    </v-main>
    <!--
    <v-footer  absolute inset app>
        <v-card color="transparent" elevation="0" class="mx-auto" style="text-align:right; margin-bottom:10px; padding-top : 30px;">
          <span>TarotClub &copy; 2020-2099 - Tous droits réservés</span>
        </v-card>          
    </v-footer>
-->
  </v-app>
</template>

<script>

export default {
  name: 'App',
  components: {
 
  },
  data () {
      return {
        alertType: 'error', // success, info, warning or error
        alertText: '',
        alertEnable: false,
        alertTimeout: 3000,
        drawer: null,
        menuItems: [
          { text: 'Accueil', icon: 'mdi-home', page: 'home', user: true },
          { text: 'Jouer en ligne', icon: 'mdi-cards-playing-outline', page: 'game', user: true },
          { text: 'Documentation', icon: 'mdi-file-document', page: 'docs', user: true },
      ],
      }
    },
  computed: {
    isLogged() {
      return this.$store.getters["user/isLogged"];
    },
    isInitialized() {
      // Or whatever criteria you decide on to represent that the
      // app state has finished loading.
      return this.$store.state.isinitialized;
    },
  },

  methods: {
    logOut() {
      this.$store.commit("user/LOGOUT");
      this.$api.destroyToken();
      this.$router.push({ name: "signin" });
    },
  },
  //====================================================================================================================
 created() {
     this.$eventHub.$on('setAlert', (text, type, timeout) => {
        this.alertText = text;
        this.alertType = type;
        this.alertTimeout = timeout;
        this.alertEnable = true;
    });

 },
 //====================================================================================================================
  beforeDestroy() {
    this.$eventHub.$off('setAlert');
  }
};
</script>

<style>
.v-application {
    background-color: var(--v-background-base) !important;
}

</style>

