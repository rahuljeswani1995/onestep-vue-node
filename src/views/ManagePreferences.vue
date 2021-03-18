<template>
  <div class="center-text container">
    <b-spinner v-if="isLoading"></b-spinner>
    <b-row v-else>
      <!-- <b-col>
        <b-form @submit="onSubmit" @reset="onReset">
          <b-form-group id="input-group-3" label="Food:" label-for="input-3">
            <b-form-select
              id="input-3"
              v-model="form.food"
              :options="foods"
              required
            ></b-form-select>
          </b-form-group>

          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
      </b-col>     -->
      <b-col>
        <h2 class="subtitle is-3">
        Hidden Devices
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
            <template #cell(isHidden)="row">
              <b-form-checkbox
                v-model="row.item.isHidden"
                @change="onRowCheckboxChange($event, row.item)"
              ></b-form-checkbox>
            </template>
            <!-- <template v-slot:cell(isHidden)="data">
              <b-form-checkbox
                id="show-hide-checkbox"
                class="mb-2"
                v-model="data.item.isHidden"
                switch> 
              </b-form-checkbox> -->
            <!-- </template> -->
          </b-table>
          <b-button :disabled="!tableUpdated" class="mt-2" variant="primary" @click="onHiddenDevicesUpdate()">Update</b-button>
      </b-col>    
    </b-row>

    
  </div>
</template>
<style lang="scss" scoped>
  .center-text {
    text-align: center;
  }
</style>
<script>
import DeviceDataService  from '@/services/DeviceDataService.js';
export default {
  name: 'ManagePreferences',
  data() {
    return {
      form: {
        food: null
      },
      foods: ['a', 'b'],
      devices: [],
      table_columns: [
        {key: "icon", sortable: false},
        {key: "device_id", sortable: true},
        {key: "device_name", sortable: true},
        {key: "status", sortable: true},  
        {key: "latitude", sortable: false},
        {key: "longitude", sortable: false},
        {key: "isHidden", label: "Hidden", sortable: false},  
      ],
      table_rows: [],
      sortBy: 'device_name',
      sortDesc: true,
      isLoading: true,
      tableUpdated: false
    }
  },
  created(){
      this.getDevicesData();
  },
  methods: {
    async getPrefs() {
      
    },
    onRowCheckboxChange(value, item){
      if(!this.tableUpdated)
        this.tableUpdated = true;
      item.isHidden = value;
    },
    async getDevicesData() {
      DeviceDataService.getHiddenDevices()
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
            "latitude": Math.round(el.device_lat * 1000) / 1000,
            "longitude": Math.round(el.device_lng * 1000) / 1000,
            "isHidden": true
          }
        );
      })
    },
    onSubmit(event) {
      event.preventDefault();
      // send prefs to server
      // DeviceDataService.saveDevicePrefs({"device_id": this.deviceDetails.device_id, "showStatus": this.devicePrefs.showStatus})
      //   .then(resp => {
      //     // this.isSaved = true;
      //     this.reload();
      //   });
      
    },
    onReset(event) {
      event.preventDefault();
      
    },
    onHiddenDevicesUpdate(){
      console.log(this.table_rows);
      let ids_to_update = this.table_rows.filter(el => el.isHidden != true).map(el => el.device_id);
      DeviceDataService.unhideDevices({"device_ids": ids_to_update, "visible": 1})
        .then(resp => {
          // console.log(resp);
          this.reload();
        });
    },
    reload(){
      this.devices = [];
      this.table_rows = [];
      this.isLoading = true;
      this.tableUpdated = false;
      this.getDevicesData();
    }
  }
}
</script>