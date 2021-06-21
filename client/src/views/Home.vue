<template>
<v-container fluid fill-height>


<!--

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
-->

    <div style="border: 5px solid black;text-align: center; width: 60vw; height: 60vw; margin: auto;background-color: #026a2d;">
         <svg viewBox="0 0 700 700" id="svgmain">
        <defs>
        </defs>
            <Card name="01-T" x="200" y="200" />

         </svg>
    </div>

</v-container>

</template>

<script>

/*
// CODE POUR LA LISTE DES TABLES

 <svg class="responsive-container"
        viewBox="0 0 330 600"
         id="svgmain">
        <defs>
        </defs>

        <Table  v-for="table in tables" :key="table.id" 
            :x="table.x" 
            :y="table.y" 
            :size="table.size"
            >
        </Table>

        <Card name="01-T" x="200">
        </Card>

    </svg>

*/

import Servers from "../components/Servers.vue";
import Table from "../components/Table.vue";
import DownloadTile from "../components/DownloadTile.vue";
import Card from "../components/Card.vue";
import * as d3 from 'd3';

export default {
    data: () => ({
       tables: [
           {
               id: 0,
               x: 20,
               y: 20,
               size: 100
           }
       ]
    }),
    components: { Table, Servers, DownloadTile, Card },
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
                d3.xml('./img/table.svg'),
                d3.xml('./cards/01-T.svg')
             ];

             let names = [
                 "table_bg",
                 "card01-T"
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

        /* For the drop shadow filter... */
  var defs = d3.select('#svgmain defs');

  var filter = defs.append("filter")
      .attr("id", "dropshadow")

  filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 2)
      .attr("result", "blur");
  filter.append("feOffset")
      .attr("in", "blur")
      .attr("dx", 2)
      .attr("dy", 2)
      .attr("result", "offsetBlur");

  var feMerge = filter.append("feMerge");

  feMerge.append("feMergeNode")
      .attr("in", "offsetBlur")
  feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");

    }
}
</script>
