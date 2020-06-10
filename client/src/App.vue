<template>

  <!-- APP -->

  <v-app>

    <v-snackbar v-model="alertEnable" :color="alertType" :timeout="alertTimeout" :top="true">
          {{ alertText }}
    </v-snackbar>

    <TopToolbar></TopToolbar>
    <v-content>
      <v-container fluid>
        <template v-if="!isInitialized">
            <div class="text-center">
              <v-progress-circular indeterminate color="primary" :size="50"></v-progress-circular>
           </div>
        </template>
        <template v-else>
            <router-view></router-view>
        </template>
        </v-container>
    </v-content>
   
    <!-- FOOTER -->
    <v-footer style="padding-top:16px;" class="font-weight-medium" >

        <v-card color="transparent" elevation="0" class="mx-auto" style="text-align:center; margin-bottom:10px; padding-top : 30px;">
          <span>Monnaie de Paris &copy; 2020 - Tous droits réservés</span>
        </v-card>
              
    </v-footer>

  </v-app>
</template>

<script>

import TopToolbar  from "./components/TopToolBar";

export default {
  name: 'App',
  components: {
    TopToolbar
  },
  data () {
      return {
        alertType: 'error', // success, info, warning or error
        alertText: '',
        alertEnable: false,
        alertTimeout: 3000
      }
    },
  computed: {
    isInitialized() {
      // Or whatever criteria you decide on to represent that the
      // app state has finished loading.
      return this.$store.state.isinitialized;
    },
  },

  methods: {

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
