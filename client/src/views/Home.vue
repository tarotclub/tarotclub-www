<template>

<!-- <div class="responsive-container"> -->
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
   
</template>

<script>

import Table from "../components/Table.vue";
import * as d3 from 'd3';

export default {
    data: () => ({
       tables: [
           {
               x: 20,
               y: 20,
               size: 200
           }
       ]
    }),
    components: { Table },
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
