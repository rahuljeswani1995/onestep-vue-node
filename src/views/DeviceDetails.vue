<template>
  <div class="container">
    <h2 class="subtitle is-3">
    Device Details
    </h2>
    <div class="center-text" v-if="isLoading">
      <b-spinner></b-spinner>
    </div>
    <b-container v-else class="bv-example-row">
      <b-row>
        <b-col> 
          <section>
            <h2 class="subtitle">
              <strong>Name:</strong> {{ deviceDetails.display_name }}
              <br>
              <strong>Device ID:</strong> {{ deviceDetails.device_id }}
              <br>
              <strong>State:</strong> {{ deviceDetails.active_state }}
              <br>
              <strong>Latitude:</strong> {{ roundCoordinate(deviceDetails.latest_device_point.lat) }}
              <br>
              <strong>Longitude:</strong> {{ roundCoordinate(deviceDetails.latest_device_point.lng) }}
            </h2>
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
              <b-button type="submit" variant="primary">Save</b-button>
              <b-button type="reset" variant="danger">Reset</b-button>
            </b-form>
          </b-card>
        </b-col>
        <b-col> 
          <section class="event-content">
            <div class="container">
              <!-- <p class="is-size-4 description">{{ event.description }}</p>
              <p class="is-size-5"><strong>Location:</strong> {{ event.location }}</p>
              <p class="is-size-5"><strong>Category:</strong> {{ event.category }}</p>
              <div class="event-images columns is-multiline has-text-centered">
                <div v-for="image in event.images" :key="image.id" class="column is-one-third">
                  <img :src="image" :alt="event.name">
                </div>
              </div> -->
              <!-- INSERT MAP HERE -->
              <MapPlotter class="travel-map" 
              :id="deviceDetails.device_id"
              :lat="deviceDetails.latest_device_point.lat"
              :long="deviceDetails.latest_device_point.lng" />
            </div>
          </section>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
// NEW - import EventService
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
    // NEW - initialize the event object
    return {
      deviceDetails: {},
      devicePrefs: {},
      isLoading: true,
      // isSaved: false
    }
  },
  created() {
    this.getDeviceDetails(); // NEW - call getEventData() when the instance is created
  },
  // NEW
  methods: {
    async getDeviceDetails() {
      // Use the eventService to call the getEventSingle() method
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