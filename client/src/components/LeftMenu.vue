<template>

<v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      permanent
      app
    >
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img src="img/85.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-title>John Leider</v-list-item-title>

      <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    
</template>

<script>

/*

    <v-navigation-drawer
   permanent
   absolute
    
    
 
  >
    <v-list-item class="px-2">
      <v-list-item-avatar>
        <v-icon>mdi-account-circle</v-icon>
        <!--<v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>-->
      </v-list-item-avatar>

 
        <v-list-item-title>{{fullName}}</v-list-item-title>
        <v-btn
          icon
          @click.stop="drawer = !drawer"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      
    </v-list-item>

    <v-divider></v-divider>

    <!-- ================ MENU ENTRIES ================ -->
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

    <v-divider></v-divider>

</v-navigation-drawer>

*/

export default {
    data() {
        return {
            drawer: true,
            items: [
            { title: 'Home', icon: 'mdi-home-city' },
            { title: 'My Account', icon: 'mdi-account' },
            { title: 'Users', icon: 'mdi-account-group-outline' },
            ],
            mini: true,
            // items: [
            //     { text: 'Accueil', icon: 'mdi-home', page: 'home', user: true },
            //     { text: 'Mon profil', icon: 'mdi-account', page: 'profile', user: true },
            //     { text: 'Machines', icon: 'mdi-format-list-bulleted', page: 'machines', user: true },
            //     { text: 'Utilisateurs', icon: 'mdi-account-group', page: 'users', user: false }
            // ],
        }
    },
    computed: {
        isLogged() {
            return this.$store.getters['user/isLogged'];
        },
        isAdmin() {
          return this.$store.getters['user/isAdmin'];
        },
        fullName() {
            return this.$store.getters['user/getFullName'];
        },
        menuItems() {
           return this.items.filter(e => e.user || this.isAdmin);
        }
    },
    //====================================================================================================================
    created() {
        this.$eventHub.$on('showMenu', (enable) => {
            this.drawer = enable;
        });
     },
 //====================================================================================================================
  beforeDestroy() {
    this.$eventHub.$off('showMenu');
  }
}
</script>
