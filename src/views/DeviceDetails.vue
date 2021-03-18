<template>
  <div class="bv-example-row container">
    <h2 class="container">
    Device Details
    </h2>
     <b-alert v-if="isError" show variant="danger">An error occured while loading device details. Please try again.</b-alert>
    <div class="center-text" v-else-if="isLoading">
      <b-spinner></b-spinner>
    </div>
    <b-container v-else class="bv-example-row">
      <b-row>
        <b-col> 
          <b-row>
            <b-col>
                <b-img thumbnail fluid :src="'http://localhost:8080/get-icon?id='+deviceDetails.device_id" alt="Image 1"></b-img>
            </b-col>
            <b-col class="px-0">
              <section>
                <p>
                  <strong>Name:</strong> {{ deviceDetails.display_name }}
                  <br>
                  <strong>Device ID:</strong> {{ deviceDetails.device_id }}
                  <br>
                  <strong>State:</strong> {{ deviceDetails.active_state }}
                  <br>
                  <strong>Latitude:</strong> {{ roundCoordinate(deviceDetails.device_lat) }}
                  <br>
                  <strong>Longitude:</strong> {{ roundCoordinate(deviceDetails.device_lng) }}
                </p>
              </section>
            </b-col>
          </b-row>
          <b-card class="mt-4" header="Device Preferences"> 
            <b-form @submit="onSubmit"> 
              <b-form-group class="mb-2"
                label="Change Device Icon"> 
                <b-form-file 
                  v-model="iconFile"
                  :state="Boolean(iconFile)"
                  accept="image/*"
                  placeholder="Choose an image"
                  no-drop
                ></b-form-file>
              </b-form-group>
              <b-form-group 
                class="mb-2 mt-3"
                label="Device Visibility"> 
                <b-form-checkbox
                  id="show-hide-checkbox"
                  v-model="devicePrefs.showStatus"
                  @change="onCheckboxChange($event)"
                  switch>
                  Show on Home Page 
                </b-form-checkbox>
              </b-form-group>

              <b-button :disabled="isPageFresh" type="submit" variant="primary" class="mt-2">Save</b-button>
            </b-form>
          </b-card>
        </b-col>
        <b-col> 
          <section class="event-content">
            <div class="container">
              <MapPlotter class="travel-map" :inp_markers="markers" />
            </div>
          </section>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import formatter from '../mixins.js';
import DeviceDataService from '@/services/DeviceDataService.js';
import MapPlotter from '../components/map/MapPlotter';
export default {
  name: 'DeviceDetails',
  components: {
    MapPlotter
  },
  mixins: [formatter],
  data() {
    return {
      deviceDetails: {},
      devicePrefs: {},
      isLoading: true,
      iconFile: null,
      isCheckboxChanged: false,
      isError: false
      // isSaved: false
    }
  },
  created() {
    this.getDeviceDetails();
  },
  computed: {
    markers() {
        return [{
            id: this.deviceDetails.device_id,
            position: {
                lat: this.deviceDetails.device_lat,
                lng: this.deviceDetails.device_lng
            }
        }]
    },
    isPageFresh() {
      return !Boolean(this.iconFile) && !this.isCheckboxChanged;
    }
  },
  methods: {
    async getDeviceDetails() {
      DeviceDataService.getDeviceDetails(this.$route.params.id)
      .then(
        (deviceDetails => {
          this.$set(this, "deviceDetails", deviceDetails);
          this.devicePrefs["showStatus"] = this.deviceDetails["showStatus"];
          this.isLoading = false;
        }).bind(this)
      ).catch(err => {
        this.isError = true;
        this.isLoading = false;
      });
    },
    onCheckboxChange(val){
      if(!this.isCheckboxChanged)
        this.isCheckboxChanged = true;
    },
    onSubmit(event) {
      event.preventDefault();
      // send prefs to server
      // console.log(this.iconFile);
      let fd = new FormData();
      fd.append("image", this.iconFile);
      
      this.isLoading = true;
      Promise.all([
      DeviceDataService.saveDevicePrefs({"device_id": this.deviceDetails.device_id, "showStatus": this.devicePrefs.showStatus}),
      DeviceDataService.uploadUserIcon(this.deviceDetails.device_id, fd)
      ]).then(results => {
          // this.isSaved = true;
          this.$bvToast.toast(`Device Preferences were successfully saved.`, {
          autoHideDelay: 3000,
          variant: 'success',
          solid: true,
          toaster: 'b-toaster-top-center',
          noCloseButton: true
          });
          this.reload();
      })
      .catch(err => {
        this.$bvToast.toast(`An error occurred while saving device preferences. Please try again.`, {
          autoHideDelay: 3000,
          variant: 'danger',
          solid: true,
          toaster: 'b-toaster-top-center',
          noCloseButton: true
          });
      });
    },
    reload() {
      this.isLoading = true;
      this.isCheckboxChanged = false;
      this.iconFile = null;
      this.isError = false;
      this.getDeviceDetails();
    }
  }
}
</script>
<style lang="scss" scoped>
  .center-text {
    text-align: center;
  }
  .travel-map {
  height: 400px;
  }
</style>