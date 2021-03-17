import axios from "axios"

export default {
  async getVisibleDevices() {
    // http://localhost:8080/get-devices
    let res = await axios.get("http://localhost:8000/events", {params: {"visible": 1}});
    return res.data;
  },
  async getHiddenDevices() {
    // http://localhost:8080/get-devices
    let res = await axios.get("http://localhost:8000/events", {params: {"visible": 0}});
    return res.data;
  },
  async getDeviceDetails(deviceId) {
    // http://localhost:8080/get-devices
    let res = await axios.get("http://localhost:8000/get-device", {params: {"visible": 1, "id": deviceId}});
    return res.data;
  },
  async saveDevicePrefs(prefs) {
    // "http://localhost:8080/show-hide-devices"
    let reqBody = {"visible": prefs.showStatus ? 1: 0, "device_ids": [prefs.device_id]};
    let res = await axios.put("http://localhost:8000/saveDevicePrefs/", reqBody);
    return res.status;
  },
  async unhideDevices(reqBody) {
    // "http://localhost:8080/show-hide-devices"
    let res = await axios.put("http://localhost:8000/saveDevicePrefs/", reqBody);
    return res.data;
  }

}