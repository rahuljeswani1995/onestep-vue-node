export default {
    methods: {
        roundCoordinate(co_ord) {
            return Math.floor(co_ord*1000+0.5)/1000;
        }
    } 
  }