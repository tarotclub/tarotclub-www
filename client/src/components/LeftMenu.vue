<template>
  <v-navigation-drawer permanent app>
    <v-list dense nav class="py-0">
      <v-list-item two-line :class="miniVariant && 'px-0'">
        <v-list-item-avatar>
          <img src="https://randomuser.me/api/portraits/men/81.jpg" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>Application</v-list-item-title>
          <v-list-item-subtitle>Subtext</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item v-for="item in items" :key="item.title" link>
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- <v-list-item v-for="item in items" :key="item.title" link>
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>-->

      <v-btn block>Logout</v-btn>
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
        { title: "Home", icon: "mdi-home-city" },
        { title: "My Account", icon: "mdi-account" },
        { title: "Users", icon: "mdi-account-group-outline" },
      ],
      mini: true,
      // items: [
      //     { text: 'Accueil', icon: 'mdi-home', page: 'home', user: true },
      //     { text: 'Mon profil', icon: 'mdi-account', page: 'profile', user: true },
      //     { text: 'Machines', icon: 'mdi-format-list-bulleted', page: 'machines', user: true },
      //     { text: 'Utilisateurs', icon: 'mdi-account-group', page: 'users', user: false }
      // ],
    };
  },
  computed: {
    isLogged() {
      return this.$store.getters["user/isLogged"];
    },
    isAdmin() {
      return this.$store.getters["user/isAdmin"];
    },
    fullName() {
      return this.$store.getters["user/getFullName"];
    },
    menuItems() {
      return this.items.filter((e) => e.user || this.isAdmin);
    },
  },
  //====================================================================================================================
  created() {
    this.$eventHub.$on("showMenu", (enable) => {
      this.drawer = enable;
    });
  },
  //====================================================================================================================
  beforeDestroy() {
    this.$eventHub.$off("showMenu");
  },
};
</script>
