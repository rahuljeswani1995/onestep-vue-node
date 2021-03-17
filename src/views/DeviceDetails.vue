<template>
  <div class="bv-example-row container">
    <h2 class="container">
    Device Details
    </h2>
    <div class="center-text" v-if="isLoading">
      <b-spinner></b-spinner>
    </div>
    <b-container v-else class="bv-example-row">
      <b-row>
        <b-col> 
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
          <b-card class="mt-4" header="Device Preferences"> 
            <b-form @submit="onSubmit" @reset="onReset"> 
              <b-form-checkbox
                id="show-hide-checkbox"
                class="mb-2"
                v-model="devicePrefs.showStatus"
                switch>
                Show on Home Page 
              </b-form-checkbox>
              <b-button type="submit" variant="primary" class="mt-2">Save</b-button>
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
    }
  },
  methods: {
    async getDeviceDetails() {
      DeviceDataService.getDeviceDetails(this.$route.params.id)
      .then(
        (deviceDetails => {
          this.$set(this, "deviceDetails", deviceDetails);
          this.devicePrefs["showStatus"] = this.deviceDetails["showStatus"]
          this.isLoading = false;
        }).bind(this)
      );
    },
    onSubmit(event) {
      event.preventDefault();
      // send prefs to server
      DeviceDataService.saveDevicePrefs({"device_id": this.deviceDetails.device_id, "showStatus": this.devicePrefs.showStatus})
        .then(resp => {
          // this.isSaved = true;
          this.reload();
        });
      
    },
    onReset(event) {
      event.preventDefault();
      this.devicePrefs["showStatus"] = this.deviceDetails["showStatus"];
    },
    reload() {
      this.isLoading = true;
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