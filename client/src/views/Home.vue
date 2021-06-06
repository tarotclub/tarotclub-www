<template>
<v-container class="ma-5">

<h1>TarotClub, le jeu de Tarot libre !</h1>

    
             <p class="lead">TarotClub est un jeu de Tarot libre (licence GPLv3) fonctionnant sur Windows, Linux et Mac OS X. Le but de ce site est de centraliser les informations autour du développement du jeu.</p>

            <v-img src="img/screenshots/front.png"
                gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
            ></v-img>

     <v-row class="pa-20">
         <v-col>
         <v-card flat>
            <v-card-title>
                Modes de jeu
            </v-card-title>
            <v-card-text>
                <p>Partie rapide ou enchaînement</p>
                <p>Jeu solo contre l'ordinateur</p>
                <p>Donnes numérotées</p>
            </v-card-text>
         </v-card>
</v-col>
<v-col>
         <v-card flat>
            <v-card-title>
                Réseau
            </v-card-title>
            <v-card-text>
                <p>Jeu en réseau</p>
                <p>Réseau local ou distant</p>
                <p>Serveur intégré</p>
            </v-card-text>
         </v-card>
</v-col>
<v-col>
        <v-card flat>
            <v-card-title>
                Outils
            </v-card-title>
            <v-card-text>
                <p>Intelligence artificielle en JavaScript, modifiable</p>
                <p>Éditeur de donne</p>
                <p>Options de jeu (adversaires, jouerie)</p>
                <p>Cartes de Tarot au format vectoriel (SVG)</p>
                <p>>Système de log avancé avec sauvegarde des parties jouées</p>
            </v-card-text>
         </v-card>
</v-col>
     </v-row>

    <v-row>
        <DownloadTile image="img/ubuntu.png"></DownloadTile>
        <DownloadTile image="img/win.png"></DownloadTile>
        <DownloadTile image="img/fedora.png"></DownloadTile>
    </v-row>




<Servers></Servers>

</v-container>

</template>

<script>

/*

    <svg class="responsive-container"
        viewBox="0 0 330 600"
         id="svgmain">
        <defs>
        </defs>


        <!-- Ici on stocke les feux -->
        <!-- <g id="tables_group"> -->

                <Table  v-bind:key v-for="table in tables" 
                    :x="table.x" 
                    :y="table.y" 
                    :size="table.size"
                    >
                </Table>

        <!-- </g> -->

    </svg>
<!-- </div> -->



*/


import Servers from "../components/Servers.vue";
import Table from "../components/Table.vue";
import DownloadTile from "../components/DownloadTile.vue";
import * as d3 from 'd3';

export default {
    data: () => ({
       tables: [
           {
               x: 20,
               y: 20,
               size: 100
           }
       ]
    }),
    components: { Table, Servers, DownloadTile },
    methods: {
//====================================================================================================================
        createDef: function(xml, id_name)
        {
            let g = d3.select('#svgmain defs');
            let node = document.importNode(xml.documentElement, true);
            d3.select(node).attr("id", id_name);
            g.node().appendChild(node);
        },
        initialize() {
             let filesToLoad = [
                d3.xml('./img/table.svg')
             ];

             let names = [
                 "table_bg"
             ]

            // We must wait for all data to be fetched before compute various sizes
            Promise.all(filesToLoad).then((list) =>
            {
                // All other elements are lights
                for (let i = 0; i < list.length; i++) {
                    this.createDef(list[i], names[i]);
                }
            })
            .catch(function(error) {
                console.log("Promise get files error: " + error);
            });
        }
    },
    mounted() {
        console.log("mounted home")
        this.initialize();
    }
}
</script>

<style scoped>
/* local styles */
.responsive-container {
  height: 100%;
  width: 100%;

  display: inline-block;
  position: relative;

  vertical-align: top;
  overflow: hidden;
}

.svg-content {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
