<template>
  <div class="about container">
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
  </div>
</template>
<style lang="scss" scoped>
  .org-description {
    margin-top: 50px;
  }
</style>
<script>
export default {
  name: 'ManagePreferences',
  data() {
    return {
      form: {
        food: null
      },
      foods: ['a', 'b']
    }
  },
  methods: {
    created(){

    },
    async getPrefs() {
      
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
  }
}
</script>