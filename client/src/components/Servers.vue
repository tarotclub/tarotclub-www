
<template>
  <v-card>
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
    ></v-data-table>
  </v-card>
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
          { text: 'Privacy', value: 'privacy' }
        ],
        servers: [
        ],
      }
    },
    mounted() {
      this.$api.getAllServers().then( result => {
          if (result.success) {
             this.servers = result.data;
          } else {
              this.$eventHub.$emit('setAlert', 'Impossible de récupérer la liste des serveurs', 'error', 3000);
          }

      }).catch(error => {
          console.error(error);
      });
    }
  }
</script>
