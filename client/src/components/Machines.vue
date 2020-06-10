<template>
<v-container fluid>

<v-card>


  <!-- =============  Dialogue d'assignation de machine ============= -->
  <v-dialog v-model="dialogAssignMachine" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Changer le propriétaire de la machine : {{editedItem.machine_name}}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>

            <v-col cols="12" sm="6" md="4">
              <v-combobox  v-model="selectedOwner"
                :items="ownerItems"></v-combobox>
            </v-col>

          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeAssignMachine">Annuler</v-btn>
        <v-btn color="blue darken-1" text @click="saveAssignMachine">Sauver</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

    <!-- =============  Dialogue Affichage Factory (QrCode) ============= -->
   
    <v-dialog v-model="dialogFactory" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Information usine de la machine : {{editedItem.machine_name}}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row  class="text-center">

              <canvas ref="qrcode" width="400" height="400"></canvas>

            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialogFactory">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- =============  Dialogue de création / édition ============= -->
    <v-dialog v-model="dialog" width="700px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <p> Les champs marqués par un point d'exclamation sont requis.</p>
          <v-container>
            <v-form
              ref="form"
              v-model="valid"
            >
                <v-row>

                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.attr.city" label="Ville"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">

                    <v-combobox  v-model="editedItem.attr.exploitation_site" 
                      :rules="[rules.required]" 
                      label="Site d'exploitation (!)"
                      :items="sitesList"></v-combobox>

                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.attr.machine_name" :rules="[rules.required]" label="Nom de la machine (!)"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.attr.address" label="Adresse"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.attr.usage_info" label="Informations d'usage"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.attr.serial_number" :rules="[rules.required]" label="Numéro de série (!)"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.attr.gps" :rules="[rules.gps]" label="GPS (latitude, longitude) (!)"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.attr.misc_information" label="Autres informations"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.attr.theme" label="Visuel"></v-text-field>
                  </v-col>
                </v-row>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Annuler</v-btn>
          <v-btn color="blue darken-1" text @click="save" :disabled="!valid">Sauver</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- =============  Element central ============= -->
<v-card-text>
    <v-row
        align="center"
        class="mx-0"
      >
      <v-card-title>Gestion des Machines</v-card-title>

      <v-text-field style="padding: 10px;"
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-row>  
    
 </v-card-text>
<v-divider class="mx-4"></v-divider>
    
<v-data-table
    :headers="headers"
    :items="machines"
    :search="search"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-btn color="primary" v-if="isAdmin" @click="addMachine()">Ajouter une machine</v-btn>
        <v-spacer></v-spacer>
      </v-toolbar>
    </template>

    <template v-slot:item.attr.machine_name="{ item }">
      <a :href="getMachineLink(item.id)">{{item.attr.machine_name}}</a>
    </template>

    <template v-slot:item.owner_id="{ item }">
      {{getOwnerName(item)}}
    </template>

    <template v-slot:item.action="{ item }">
      <v-icon medium class="mr-2" @click="editItem(item)" v-if="isAdmin || isMaintenance">mdi-pencil</v-icon>
      <v-icon medium class="mr-2" @click="deleteItem(item)" v-if="isAdmin">mdi-delete</v-icon>
      <v-icon medium class="mr-2" @click="assignMachine(item)" v-if="isAdmin || isMaintenance">mdi-account-question</v-icon>
      <v-icon medium class="mr-2" @click="showFactoryInfos(item)" v-if="isAdmin">mdi-factory</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Refresh</v-btn>
    </template>

  </v-data-table>

    
  </v-card>


</v-container>
</template>

<script>

import AccessUtil from "./AccessUtil.js";
import QRCode from 'qrcode'
 

export default {
    data: () => ({
      valid: false, // form is valid or not
      
      // Affichage des informations usine
      dialogFactory: false,

      // Pour l'assignation d'une machine à un propriétaire
      dialogAssignMachine: false,
      owners: [],
      selectedOwner: {},

      // Gestion des propriétés d'une machine et création
      dialog: false,
      search: '',
      editedIndex: -1,
      editedItem: {

        attr: {
          owner_id: 0,
          city: '',
          exploitation: '',
          machine_name: '',
          address: '',
          usage_info: '',
          serial_number: '',
          gps: '',
          misc_information: '',
          theme: ''
        }
      },
      defaultItem: {
        owner_id: 0,
        attr: {
          city: '',
          exploitation: '',
          machine_name: '',
          address: '',
          usage_info: '',
          serial_number: '',
          gps: '0.0, 0.0',
          misc_information: '',
          theme: ''
        }
      },

      // FIXME: tester le format des coordonnées GPS
      // 
      rules: {
          required: value => !!value || 'Required.',
          gps: value => {
            const pattern = /^((-?|\+?)?\d+(\.\d+)?),\s*((-?|\+?)?\d+(\.\d+)?)$/
            return pattern.test(value) || 'Invalid GPS coordinates.'
          },
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          },
        },

    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nouvelle machine' : "Édition d'une machine"
      },
      isAdmin() {
        return this.$store.getters['user/isAdmin'];
      },
      isMaintenance() {
        return this.$store.getters['user/isMaintenance'];
      },
      machines () {
        return this.$store.getters['machines/machinesNotDeleted'];
      },
      ownerItems() {
        let arr = [];
        for (let i = 0; i < this.owners.length; i++) {
          arr.push({ text: this.ownerText(this.owners[i]), 
                    value: this.owners[i].id })
        }
        return arr;
      },
      sitesList() {
         let sites = [];
         let machines = this.$store.getters['machines/machinesBySite'];
         for (let i = 0; i < machines.length; i++) {
            sites.push(machines[i].exploitation_site);
         }
         return sites;
      },
      headers() {
        let h = [
            { text: 'Ville', value: 'attr.city' },
            { text: "Site d'exploitation", value: 'attr.exploitation_site' },
            { text: 'Nom de la machine', value: 'attr.machine_name' },
            { text: 'Adresse', value: 'attr.address' },
            { text: "Informations d'usage", value: 'attr.usage_info' },
            { text: 'Numéro de série', value: 'attr.serial_number' },
            { text: 'Autres informations', value: 'attr.misc_information' },
            { text: 'Visuel', value: 'attr.theme' },
            { text: 'GPS', value: 'attr.gps' },
        ];

        if (this.isAdmin || this.isMaintenance) {
          h.push({ text: 'Propriétaire', value: 'owner_id' });
          h.push({ text: 'Actions', value: 'action', sortable: false });
        }

        return h;
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    created () {
      this.initialize();
    },

    methods: {   

      ownerText(owner) {
        return owner.username + '(' + owner.company + ') - ' + AccessUtil.levelToName(owner.level);
      }, 

      // Retourne le nom du prorpiétaire de la machine
      getOwnerName(item) {
          let name = 'INCONNU';
          for (let i = 0; i < this.owners.length; i++) {
            if (this.owners[i].id == item.owner_id) {
              name = this.ownerText(this.owners[i]);
              break;
            }
          }

          return name;
      },

      getMachineLink(id) {
          return '/dashboard/machineinfos/' + id;
      },

      initialize() {

          this.$api.getMachines().then((response) => {

            if (response.success) {
              this.$store.commit('machines/SET_MACHINES', response.data.machines);
              
              if (this.isAdmin || this.isMaintenance) {
                this.$api.getOwners().then((response) => {              
                  if (response.success) {
                    this.owners = response.data.owners;
                    } else {
                      console.log(response.message);
                    }
                });
              }
  
            } else {
              console.log(response.message);
            }
          });

      },

      deleteItem (item) {

        if (confirm("Voulez-vous vraiment supprimer la machine : " + item.machine_name + " ?")) {

            this.$api.deleteMachine(item.id).then((response) => {
              if (response.success) {
                this.$eventHub.$emit('setAlert', 'Machine supprimée avec succès', 'success', 3000);
                this.initialize();
              } else {
                this.$eventHub.$emit('setAlert', 'Impossible de supprimer cette machine', 'error', 3000);
              }
            });
        } 

      },

      addMachine() {
        this.editedItem = JSON.parse(JSON.stringify(this.defaultItem));
        this.valid = false;
        this.dialog = true;
      },

      editItem (item) {
        this.editedIndex = this.machines.indexOf(item);
        this.editedItem = JSON.parse(JSON.stringify(item));
        this.dialog = true;
      },

      close () {
        this.dialog = false;
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        }, 300);
      },

      save () {
        if (this.editedIndex == -1) {
          // Création
          this.$api.createMachine(this.editedItem).then((response) => {
              if (response.success) {
                this.$eventHub.$emit('setAlert', 'Machine ajoutée avec succès', 'success', 3000);
                this.initialize();
                this.close();
              } else {
                this.$eventHub.$emit('setAlert', "Impossible d'ajouter cette machine, vérifez les champs", 'error', 3000);
              }
          });

        } else  {
           // édition
            this.$api.updateMachineAttr(this.editedItem.id, this.editedItem.attr).then((response) => {
              if (response.success) {
                this.$eventHub.$emit('setAlert', 'Machine éditée avec succès', 'success', 3000);
                this.initialize();
                this.close();
              } else {
                this.$eventHub.$emit('setAlert', "Impossible d'éditer cette machine, vérifez les champs", 'error', 3000);
              }
          });

        }
        
      },

      //==========================  CHANGEMENT DE PROPRIETAIRE D'UNE MACHINE  ==========================
      assignMachine (item) {
        this.selectedOwner = [];
        this.editedIndex = this.machines.indexOf(item);
        this.editedItem = JSON.parse(JSON.stringify(item));
        this.dialogAssignMachine = true;
      },

      closeAssignMachine() {
        this.dialogAssignMachine = false;
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      },

      saveAssignMachine() {

        if (!isNaN(this.selectedOwner.value)) {
             this.$api.updateMachineOwner(this.editedItem.id, this.selectedOwner.value).then((response) => {
                if (response.success) {
                  this.$eventHub.$emit('setAlert', 'Propriétaire modifié avec succès', 'success', 3000);
                  this.closeAssignMachine();
                  this.initialize();
                  
                } else {
                  this.$eventHub.$emit('setAlert', "Impossible de modifier le propriétaire cette machine, vérifez les champs", 'error', 3000);
                }
            });

        }
      },

      //==========================  INFORMATIONS USINE  ==========================
      showFactoryInfos(item) {
          this.dialogFactory = true;

          function toPaddedHexString(num, len) {
              let str = num.toString(16);
              return "0".repeat(len - str.length) + str;
          }

          // On construit la chaîne de caractères de la prod
          // 0xfb, 0xd5, 0xa8, 0x68;
          let devEui = '00d5a8FFFE' + toPaddedHexString(item.id, 6);
          let appEui = '84aedbea55310420';

          let productLine = item.attr.serial_number + ';' + item.api_key + ';' + devEui + ';' + appEui + ';' + item.app_key;

          // Need to postpone the rendering after the dialog has been created
          this.$nextTick(() => {
            QRCode.toCanvas(this.$refs.qrcode, productLine, { errorCorrectionLevel: 'H', width: 400 }, (err) => {
              if (err) {
                this.$eventHub.$emit('setAlert', "Erreur de génération du QrCode: " + err, 'error', 3000);
              }
            });
          });
      },

      closeDialogFactory() {
          this.dialogFactory = false;
      }


    },
  }
</script>
