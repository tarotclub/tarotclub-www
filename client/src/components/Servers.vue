
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
          {
            name: 'Frozen Yogurt',
            nb_players: 159,
            nb_tables: 100,
            region: 'EU',
            server_type: 'Official',
            privacy: 'Public',
          },
          {
            name: 'Frozen Yogurt',
            nb_players: 86,
            nb_tables: 10,
            region: 'US',
            server_type: 'Community',
            privacy: 'Private',
          },
        ],
      }
    },
  }
</script>
