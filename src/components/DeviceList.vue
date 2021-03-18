<template>
  <b-container class="center-text" fluid>
     <b-spinner v-if="isLoading"></b-spinner>
     <b-row v-else> 
       <b-col>
         <h2 class="subtitle is-3">
          List of Devices
          </h2>
         <b-table 
          :items="table_rows"
          :fields="table_columns"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          hover
          small
          :no-sort-reset="true"
          primary-key="device_id">
            <template #cell(icon)="row">
              <img :src="'http://localhost:8080/get-icon?id='+row.item.device_id" width="30px">
            </template>
            <template #cell(show_details)="row">
              <router-link :to="'/device/' + row.item.device_id">
                <b-button size="sm" class="mr-2">
                  Show Details
                </b-button>
              </router-link>
              <!-- As `row.showDetails` is one-way, we call the toggleDetails function on @change -->
              <!-- <b-form-checkbox v-model="row.detailsShowing" @change="row.toggleDetails">
                Details via check
              </b-form-checkbox> -->
            </template>
          </b-table>
       </b-col>
       <b-col>
         <MapPlotter class="travel-map" :inp_markers="markers" />
       </b-col>
     </b-row>
     
  </b-container>
</template>
<script>
import MapPlotter from "@/components/map/MapPlotter";
import DeviceDataService  from '@/services/DeviceDataService.js';
import formatter from '../mixins.js';
export default {
  name: "DeviceList",
  mixins: [formatter],
  components: {
    MapPlotter
  },
  data() {
    return {
      table_columns: [
        {key: "icon", sortable: false},
        {key: "device_id", sortable: true},
        {key: "device_name", sortable: true},
        {key: "status", sortable: true},  
        {key: "latitude", sortable: false},
        {key: "longitude", sortable: false},
        {key: "show_details", sortable: false},  
      ],
      table_rows: [],
      sortBy: 'device_name',
      sortDesc: true,
      isLoading: true,
      devices: [],
      markers: []
    };
  },
  created() {
    this.getDevicesData();
  },
  methods: {
    async getDevicesData() {
      DeviceDataService.getVisibleDevices()
      .then(
        (devices => {
          this.$set(this, "devices", devices);
          this.prepareTableData(devices);
          this.isLoading = false;
        }).bind(this)
      );
    },
    prepareTableData(devices) {
      devices.forEach(el => {
        this.table_rows.push(
          {
            _icon: false,
            "device_id": el.device_id,
            "device_name": el.display_name,
            "status": el.active_state,
            "latitude": Math.round(el.device_lat * 1000) / 1000,
            "longitude": Math.round(el.device_lng * 1000) / 1000,
            _showDetails: false
          }
        );
        this.markers.push(
            {
              id: el.device_id,
              position: {
                lat: el.device_lat,
                lng: el.device_lng
              }
            }
        );
      })
    }
  }
};
</script>
<style lang="scss" scoped>
  .center-text {
    text-align: center;
  }
  .travel-map {
  height: 400px;
  }
</style>