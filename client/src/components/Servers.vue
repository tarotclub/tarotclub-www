
<template>
<div>
  <v-card v-show="connection == 0">
    <v-card-title>
      Liste des serveurs
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :loading="servers.length == 0"
      :headers="headers"
      :items="servers"
      :search="search"
    >
    
    <template v-slot:item.join="{ item }">
      <v-icon medium class="mr-2" @click="joinServer(item)" >mdi-play-network</v-icon>
    </template>
    
    </v-data-table>
  </v-card>

  <v-card v-show="connection == 1">
    <v-card-title>
      Connexion au serveur ...
      <v-spacer></v-spacer>
    </v-card-title>
  </v-card>

</div>
</template>

<script>
  export default {
    data () {
      return {
        search: '',
        headers: [
          { text: 'Server name', value: 'name' },
          { text: 'Number of players', value: 'nb_players' },
          { text: 'Number of tables', value: 'nb_tables' },
          { text: 'Region', value: 'region' },
          { text: 'Server type', value: 'server_type' },
          { text: 'Privacy', value: 'privacy' },
          { text: 'Rejoindre', value: 'join', sortable: false }
        ]
      }
    },
    //====================================================================================================================
    computed: {
      servers() {
        // Or whatever criteria you decide on to represent that the
        // app state has finished loading.
        return this.$store.state.server.list;
      },
      connection() {
        // Or whatever criteria you decide on to represent that the
        // app state has finished loading.
        return this.$store.state.server.connection;
      },
    },
    //====================================================================================================================
    methods: {
      joinServer(server) {
        console.log("[SERVERS] Connect to server: ");
        this.connection = 1;

        // // Not a real URL, just using for demo purposes
        // let es = new EventSource(this.$api.getRESTApiUri() + '/connect');

        // es.addEventListener('message', event => {
        //     let data = JSON.parse(event.data);
        //     this.stockData = data.stockData;
        // }, false);
      },
    },
    //====================================================================================================================
    mounted() {
      // this.$api.getAllServers().then( result => {
      //     if (result.success) {
      //        this.servers = result.data;
      //     } else {
      //         this.$eventHub.$emit('setAlert', 'Impossible de récupérer la liste des serveurs', 'error', 3000);
      //     }

      // }).catch(error => {
      //     console.error(error);
      // });
    }
  }
</script>
