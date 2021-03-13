<template>
  <div class="events container">
    <h2 class="subtitle is-3">
    List of Devices
    </h2>
    <!-- <div class="columns is-multiline">
      <div v-for="event in events" :event="event" :key="event.device_id" class="column is-one-quarter">
        <router-link :to="'/event/' + event.device_id">
          <EventCard :event="event" />
        </router-link>
      </div>
    </div> -->
    <!-- <table class="table is-fullwidth">
      <thead>
        <tr>
          <th v-for="(item, index) in table_columns" :key="index">{{item}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(event, index) in events" :event="event" :key="event.device_id">
          <th>{{index + 1}}</th>
          <td><router-link :to="'/event/' + event.device_id"> {{event.device_id}} </router-link></td>
          <td>{{event.display_name}}</td>
          <td>{{event.active_state}}</td>
          <td>{{roundCoordinate(event.latest_device_point.lat)}}</td>
          <td>{{roundCoordinate(event.latest_device_point.lng)}}</td>
        </tr>
      </tbody>
    </table> -->
     <b-spinner v-if="isLoading"></b-spinner>
     <b-table v-else
      :items="table_rows"
      :fields="table_columns"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      hover
      small
      :no-sort-reset="true"
      primary-key="device_id"
      @row-clicked="expandAdditionalInfo">
        <template #cell(show_details)="row">
          <router-link :to="'/event/' + row.item.device_id">
          <!-- @click="expandAdditionalInfo(row.item)" -->
            <b-button size="sm" class="mr-2">
              <!-- {{ row.detailsShowing ? 'Hide' : 'Show'}} Details -->
              Show Details
            </b-button>
          </router-link>
          <!-- As `row.showDetails` is one-way, we call the toggleDetails function on @change -->
          <!-- <b-form-checkbox v-model="row.detailsShowing" @change="row.toggleDetails">
            Details via check
          </b-form-checkbox> -->
        </template>
        <template #row-details="row">
          <b-card>
            <b-row class="mb-2">
              <b-col sm="3" class="text-sm-right"><b>INSERT MAP HERE:</b></b-col>
            </b-row>

            <b-row class="mb-2">
              <b-col>{{ row.item.latitude}}</b-col>
              <b-col>{{ row.item.longitude }}</b-col>
            </b-row>

            <b-button size="sm" @click="expandAdditionalInfo(row.item)">Hide Details</b-button>
          </b-card>
        </template>
      </b-table>
  </div>
</template>
<script>
// import EventCard from "@/components/EventCard";
import DeviceDataService  from '@/services/DeviceDataService.js'; // NEW
import formatter from '../mixins.js';
export default {
  name: "DeviceList",
  mixins: [formatter],
  components: {
    // EventCard
  },
  data() {
    return {
      table_columns: [
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
      devices: []
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
            "device_id": el.device_id,
            "device_name": el.display_name,
            "status": el.active_state,
            "latitude": Math.round(el.latest_device_point.lat * 1000) / 1000,
            "longitude": Math.round(el.latest_device_point.lng * 1000) / 1000,
            _showDetails: false
          }
        )
      })
    },
    expandAdditionalInfo(row) {
      row._showDetails = !row._showDetails;
    }
  }
};
</script>
<style lang="scss" scoped>
  .events {
    text-align: center;
  }
</style>