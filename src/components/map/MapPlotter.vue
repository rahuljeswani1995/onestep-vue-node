<template>
  <GoogleMapLoader
    :mapConfig="mapConfig"
    apiKey=""
  >
    <template slot-scope="{ google, map }">
      <GoogleMapMarker
        v-for="marker in inp_markers"
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
    inp_markers: {
      type: Array,
      required: true
    }
  },
  computed: {
    mapConfig() {
      return {
        ...mapSettings,
        center: this.mapCenter
      };
    },
    mapCenter() {
      if(!Boolean(this.inp_markers[0]))
       return null;
      if(this.inp_markers.length == 1)
        return this.inp_markers[0].position;
      
      let cent_lat = 0, cent_lng = 0, n = this.inp_markers.length;
      this.inp_markers.forEach(el => {
        cent_lat += el.position.lat;
        cent_lng += el.position.lng;
      });
      return {
        "lat": cent_lat/n,
        "lng": cent_lng/n
      };
    },
  }
};
</script>
