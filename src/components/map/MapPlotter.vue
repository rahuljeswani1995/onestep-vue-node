<template>
  <GoogleMapLoader
    :mapConfig="mapConfig"
    apiKey=""
  >
  // insert your google maps api key to render styled map
    <template slot-scope="{ google, map }">
      <GoogleMapMarker
        v-for="marker in markers"
        :key="marker.id"
        :marker="marker"
        :google="google"
        :map="map"
      />
    </template>
  </GoogleMapLoader>
</template>

<script>
import GoogleMapLoader from "./GoogleMapLoader";
import GoogleMapMarker from "./GoogleMapMarker";

import { mapSettings } from "@/constants/mapSettings";

export default {
  components: {
    GoogleMapLoader,
    GoogleMapMarker
  },
  props: {
    id: {
      type: String,
      required: true
    },
    lat: {
      type: Number,
      required: true
    },
    long: {
      type: Number,
      required: true
    }
  },
  computed: {
    markers() {
        return [{
            id: this.id,
            position: {
                lat: this.lat,
                lng: this.long
            }
        }]
    },
    mapConfig() {
      return {
        ...mapSettings,
        center: this.mapCenter
      };
    },
    mapCenter() {
      return this.markers[0]? this.markers[0].position: null;
    }
  }
};
</script>
