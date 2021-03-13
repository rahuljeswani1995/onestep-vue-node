import axios from "axios"

export default {
  async getVisibleDevices() {
    let res = await axios.get("http://localhost:8000/events");
    return res.data;
  },
  async getDeviceDetails(deviceId) {
    let res = await axios.get("http://localhost:8000/events/" + deviceId);
    return res.data;
  },
  async saveDevicePrefs(prefs) {
    let res = await axios.put("http://localhost:8000/saveDevicePrefs/", prefs);
    return res.status;
  }

}