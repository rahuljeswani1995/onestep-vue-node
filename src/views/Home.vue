<template>
<b-container fluid>
  <DeviceList />
</b-container>
</template>
<script>
import DeviceList from '../components/DeviceList';
export default {
  name: 'home',
  components: {
    DeviceList
  }
}
</script>
</style>