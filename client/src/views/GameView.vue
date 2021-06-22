<template>
<v-container fluid fill-height id="game-container">

    <v-row class="fill-height" v-if="!isIngame">
          <v-col>
              <Servers></Servers>
          </v-col>
    </v-row>
    
    <div v-else id="game-board" class="board">
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
import Vue from 'vue';
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
       ],
       view: { w:0, h:0 }
    }),
    components: { Table, Servers, DownloadTile, Card },
    computed: {
        isIngame() {
            return this.$store.state.isIngame;
        }
    },
    //====================================================================================================================
    methods: {
        
        createDef: function(xml, id_name)
        {
            let g = d3.select('#svgmain defs');
            let node = document.importNode(xml.documentElement, true);
            d3.select(node).attr("id", id_name);
            g.node().appendChild(node);
        },
        computeSize: function(ratio)
        {
            let sizeByHeight = {
                w: this.view.h * ratio,
                h: this.view.h
            }
            let sizeByWidth = {
                w: this.view.w,
                h: this.view.w / ratio
            }
        
            if ((sizeByWidth.w <= this.view.w) && (sizeByWidth.h <= this.view.h))  {
                console.log("Fit width");
                return sizeByWidth;
            } else {
                console.log("Fit height");
                return sizeByHeight;
            }
        },
        handleResize() {
            if (this.isIngame) {
                let central_area = d3.select('#game-container');
            
                if (!central_area.empty()) {
                    let size = central_area.node().getBoundingClientRect();
                    this.view.w = size.width - 30;
                    this.view.h = size.height - 30;
                } else {
                    this.view.w = 1024;
                    this.view.h = 576;
                }

                let boardNewSize = this.computeSize(1);
            
                document.getElementById('game-board').style.width= boardNewSize.w + 'px';
                document.getElementById('game-board').style.height= boardNewSize.h + 'px';
            }
        },
        onResize: function() {
            Vue.nextTick().then( () => {             
                this.handleResize();
            });
        },
        initializeGameView() {

             /* For the drop shadow filter... */
            let defs = d3.select('#svgmain defs');

            let filter = defs.append("filter")
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
    //====================================================================================================================
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
    },
    //====================================================================================================================
    mounted() {
        console.log("mounted game view")
        window.addEventListener('resize', this.onResize);
        this.handleResize();
    }
}
</script>
