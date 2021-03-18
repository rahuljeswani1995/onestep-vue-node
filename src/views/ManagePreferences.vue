<template>
  <div class="center-text container">
    <b-alert v-if="isError" show variant="danger">An error occured while loading this page. Please try again.</b-alert>
    <b-spinner v-else-if="isLoading"></b-spinner>
    <b-row v-else>
      <b-col>
        <h2 class="subtitle is-3">
        Manage Hidden Devices
        </h2>
        <b-table 
          :items="tableRows"
          :fields="tableColumns"
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
          </b-table>
          <b-button :disabled="devicesToUpdate.length == 0" class="mt-2" variant="primary" @click="onHiddenDevicesUpdate()">Update</b-button>
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
      devices: [],
      tableColumns: [
        {key: "icon", sortable: false},
        {key: "device_id", sortable: true},
        {key: "device_name", sortable: true},
        {key: "status", sortable: true},  
        {key: "latitude", sortable: false},
        {key: "longitude", sortable: false},
        {key: "isHidden", label: "Hidden", sortable: false},  
      ],
      tableRows: [],
      sortBy: 'device_name',
      sortDesc: true,
      isLoading: true,
      // tableUpdated: false,
      isError: false
    }
  },
  computed: {
    devicesToUpdate(){
      return this.tableRows.filter(el => el.isHidden != true).map(el => el.device_id);
    }
  },
  created(){
      this.getDevicesData();
  },
  methods: {
    onRowCheckboxChange(value, item){
      // if(!this.tableUpdated)
      //   this.tableUpdated = true;
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
      ).catch(err => {
        this.isError = true;
        this.isLoading = false;
      });
    },
    prepareTableData(devices) {
      devices.forEach(el => {
        this.tableRows.push(
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
    onHiddenDevicesUpdate(){
      // console.log(this.tableRows);
      // let ids_to_update = this.tableRows.filter(el => el.isHidden != true).map(el => el.device_id);
      DeviceDataService.unhideDevices({"device_ids": this.devicesToUpdate, "visible": 1})
        .then(resp => {
          // console.log(resp);
          this.$bvToast.toast(`Hidden devices were successfully updated.`, {
          autoHideDelay: 3000,
          variant: 'success',
          solid: true,
          toaster: 'b-toaster-top-center',
          noCloseButton: true
          });
          this.reload();
        }).catch(err => {
          this.$bvToast.toast(`An error occurred while updating hidden devices. Please try again.`, {
          autoHideDelay: 3000,
          variant: 'danger',
          solid: true,
          toaster: 'b-toaster-top-center',
          noCloseButton: true
          });
        });
    },
    reload(){
      this.devices = [];
      this.tableRows = [];
      this.isLoading = true;
      // this.tableUpdated = false;
      this.isError = false;
      this.getDevicesData();
    }
  }
}
</script>