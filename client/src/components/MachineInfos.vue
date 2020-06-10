<template>
<v-container fluid>

<v-card v-if="loaded">

    <v-card-title>{{currentMachine.attr.machine_name}}</v-card-title>
    <v-container>
      <v-row justify="space-between">
       
        <v-col cols="auto">
            <v-simple-table dense>
                <tbody>
                    <tr>
                        <td>Adresse</td>
                        <td>{{currentMachine.attr.address}}</td>
                    </tr>
                    <tr>
                        <td>Numéro de série</td>
                        <td>{{currentMachine.attr.serial_number}}</td>
                    </tr>
                    <tr>
                        <td>Téléphone</td> 
                        <td>INFORMATION INCONNUE</td> 
                    </tr> 
                    <tr>  
                        <td>Niveau de réception</td> 
                        <td>INFORMATION INCONNUE</td> 
                    </tr> 
                    <tr> 
                    <tr>
                        <td>GPS</td>
                        <td>{{gpsText}}</td>
                    </tr>
                    <tr>
                        <td>Visuel</td>
                        <td>{{currentMachine.attr.theme}}</td>
                    </tr>
                    <tr>
                        <td>Prix de vente</td>
                        <td>{{medalPrice}}</td>
                    </tr>
                    <tr>
                        <td>Version</td>
                        <td>{{firmwareVersion}}</td>
                    </tr>
                    <tr>
                        <td>Commentaire</td>
                        <td>{{currentMachine.attr.misc_information}}</td>
                    </tr>
                </tbody>
            </v-simple-table>
        </v-col>

         <v-col cols="auto">
            <div  style="width:700px; height: 300px; padding-left:20px; top: 0; left: 0;">
                <l-map :zoom="zoom" :center="center" ref="refMap">
                    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
                    <l-marker :lat-lng="marker"></l-marker>
                </l-map>
            </div>
        </v-col>
      </v-row>   
        
</v-container>

<v-divider class="mx-4"></v-divider>


<v-tabs
    centered
    dark
    icons-and-text
  >
    <v-tabs-slider color="yellow"></v-tabs-slider>

    <v-tab href="#tab-1">
      DONNÉES
      <v-icon>mdi-database</v-icon>
    </v-tab>

    <v-tab href="#tab-2" v-if="isAdmin || isMaintenance">
      MAINTENANCE
      <v-icon>mdi-wrench</v-icon>
    </v-tab>

    <!-- Historique des données -->
    <v-tab-item value="tab-1">
      <v-card flat>
        <v-container>
          <JsonCSV
            :data   = "values_data"
            name    = "filename.csv">
            Export CSV
          </JsonCSV>

            <v-row align="center" class="mx-0">
              <v-text-field style="padding: 10px;"
                  v-model="search_data"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
              ></v-text-field>
              </v-row>  
              <v-data-table
                :headers="headers_data"
                :items="values_data"
                :search="search_data"
              >
              
               <template v-slot:item.medals_level="{ item }">
                  {{getMedalsLevel(item)}}
                </template>
              
              </v-data-table>
        </v-container>
      </v-card>
    </v-tab-item>

    <!-- Maintenance -->
    <v-tab-item value="tab-2"  v-if="isAdmin || isMaintenance">
      <v-card flat>
         <v-container>
            <v-row align="center" class="mx-0">
              <v-text-field style="padding: 10px;"
                  v-model="search_maintenance"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
              ></v-text-field>
              </v-row>  
              <v-data-table
                :headers="headers_maintenance"
                :items="values_maintenance"
                :search="search_maintenance"
              ></v-data-table>
        </v-container>
      </v-card>
    </v-tab-item>

  </v-tabs>
    
  </v-card>

</v-container>
</template>

<script>

import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import JsonCSV from "./JsonCSV";
 
export default {
    components: {
        JsonCSV,
        LMap,
        LTileLayer,
        LMarker
        // LPopup,
        // LTooltip
    },
    data: () => ({
      // ----------- CARTE GPS ------------
      zoom:13,
      loaded: false,
      center: '',
      url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: '',
      validMarker: false,
      
      firmwareVersion: 'INFORMATION INCONNUE',
      medalPrice: 'INFORMATION INCONNUE',
      
      currentMachineId: -1,
      currentMachine: {},

      // ----------- DONNEES CLOUD ------------
      search_data: '',
      headers_data: [
        { text: 'Date et Heure', value: 'datetime' },
        { text: 'Total médailles', value: 'total' },
        { text: 'Nb médailles depuis denier RAZ', value: 'partial' },
        { text: 'Transactions CB', value: 'card_payments' },
        { text: 'Transactions monnaie', value: 'coin_payments' },
        { text: 'Version firmware', value: 'firmware_version' },
        { text: 'Niveau médaille faible', value: 'medals_level' },
        { text: 'Prix médaille', value: 'medal_price' },
        { text: 'Transactions monnaie', value: 'coin_payments' },
      ],
      values_data: [
        // { datetime: '2019-06-06 22:01:43',	total: 9671,	partial: 493 },
        // { datetime: '2019-06-05	22:01:53',	total: 9668,	partial: 490 },
        // { datetime: '2019-06-04	22:01:46',	total: 9664,	partial: 486 },
        // { datetime: '2019-06-03	22:01:44',	total: 9661,	partial: 483 },
        // { datetime: '2019-06-02	22:01:37',	total: 9656,	partial: 478 },
        // { datetime: '2019-06-02	00:03:46',	total: 9640,	partial: 462 },
        // { datetime: '2019-05-31	22:01:41',	total: 9617,	partial: 439 },
        // { datetime: '2019-05-30	22:01:48',	total: 9589,	partial: 411 },
        // { datetime: '2019-05-29	22:01:39',	total: 9564,	partial: 386 },
        // { datetime: '2019-05-28	22:01:45',	total: 9556,	partial: 378 },
        // { datetime: '2019-05-27	22:01:45',	total: 9549,	partial: 371 },
        // { datetime: '2019-05-26	22:01:36',	total: 9545,	partial: 367 },
        // { datetime: '2019-05-25	22:01:35',	total: 9542,	partial: 364 },
        // { datetime: '2019-05-24	22:01:42',	total: 9539,	partial: 361 },
        // { datetime: '2019-05-23	22:01:40',	total: 9533,	partial: 355 },
        // { datetime: '2019-05-22	22:08:46',	total: 9530,	partial: 352 },
        // { datetime: '2019-05-21	22:01:46',	total: 9522,	partial: 344 },
        // { datetime: '2019-05-20	22:01:38',	total: 9517,	partial: 339 },
        // { datetime: '2019-05-19	22:01:43',	total: 9515,	partial: 337 },
        // { datetime: '2019-05-18	22:01:44',	total: 9503,	partial: 325 },
        // { datetime: '2019-05-17	22:01:41',	total: 9496,	partial: 318 },
        // { datetime: '2019-05-16	22:01:36',	total: 9489,	partial: 311 },
        // { datetime: '2019-05-15	22:01:42',	total: 9481,	partial: 303 },
        // { datetime: '2019-05-14	22:01:39',	total: 9477,	partial: 299 },
        // { datetime: '2019-05-13	22:01:38',	total: 9468,	partial: 290 },
        // { datetime: '2019-05-12	22:01:41',	total: 9464,	partial: 286 },
        // { datetime: '2019-05-11	22:01:41',	total: 9461,	partial: 283 }
      ],
      // ----------- DONNEES MAINTENANCE ------------
      search_maintenance: '',
      headers_maintenance: [
        { text: 'Date et Heure', value: 'datetime' },
        { text: 'Référence client', value: 'client_ref' },
        { text: 'Référence interne', value: 'internal_ref' },
        { text: 'État visuel', value: 'visual_aspect' },
        { text: 'Opérations effectuées', value: 'operations' },
        { text: 'Commentaires', value: 'comments' },
      ],
      values_maintenance: [
      ]
    }),

    methods: {
      getMedalsLevel(item) {
          let level = "Ok";
          if (item.medals_level) {
              level = "Faible";
          }
          return level;
      },
      zoomUpdate(zoom) {
        this.currentZoom = zoom;
      },
      centerUpdate(center) {
        this.currentCenter = center;
      },
      check_lat_lon(lat, lon){
        const ck_lat = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
        const ck_lon = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;

        var validLat = ck_lat.test(lat);
        var validLon = ck_lon.test(lon);
        if (validLat && validLon) {
            return true;
        } else {
            return false;
        }
      },

      async initialize(machine_id) {
          let success = false;
          this.validMarker = false;
          this.currentMachineId = machine_id;
          console.log('Machine infos for: ' + this.currentMachineId);
          
          let m = this.$store.state.machines.list;
          let current = m.filter((e) => {
            return e.id == this.currentMachineId;
          });

          if (current.length == 1) {
              this.currentMachine = current[0];

              // default center in Paris:
              let latitude = 48.856614;
              let longitude = 2.3522219;
              

              let latlong =  this.currentMachine.attr.gps.split(',');
              if (latlong.length == 2) {
                latitude = parseFloat(latlong[0]);
                longitude = parseFloat(latlong[1]);
                if (this.check_lat_lon(latitude, longitude)) {
                    this.validMarker = true;
                }
              }
              this.marker = latLng(latitude, longitude);
              this.center = latLng(latitude, longitude)

              try {
                let response = await this.$api.getData(machine_id);
                  if (response.success) {
                      this.values_maintenance = response.data.cloud_actions;
                      this.values_data = response.data.cloud_data;

                      // On récupère les informations des dernières remontées de données
                      let size = this.values_data.length;

                      if (size > 0)
                       {
                          let entry = this.values_data[size - 1];

                          this.firmwareVersion = entry.firmware_version;
                          this.medalPrice = entry.medal_price;
                       }

                      success = true;
                  }
              } catch (error) {
                console.log(error);
              }

              
          } else {
            success = false;
          }

          return success;
      },
      returnToHome() {
        this.$eventHub.$emit('setAlert', 'Machine inconnue', 'error', 3000);
        this.$router.push({ name: 'Home' });
      }
    },
    computed: {
      gpsText() {
        if (this.validMarker) {
          return this.currentMachine.attr.gps;
        } else {
          return "INFORMATION INCONNUE";
        }
      },
      isAdmin() {
        return this.$store.getters['user/isAdmin'];
      },
      isMaintenance() {
        return this.$store.getters['user/isMaintenance'];
      },
    },
    beforeRouteUpdate (to, from, next) {

        console.log('[MACHINE_INFO] Changed route: ' + to.params.id);
        if (this.initialize(to.params.id)) {
            next();
        } else {
          this.returnToHome();
        }
     
    },
    activated() {
        
    },
    // initialize local data before template is processed
    created() {
        console.log('[MACHINE_INFO] created: ' + this.$route.params.id);
        if (!this.initialize(this.$route.params.id)) {
          this.returnToHome();
        }
    },

    mounted() {
        this.$nextTick(() => {
            this.loaded = true;
        });
    }
}
</script>
