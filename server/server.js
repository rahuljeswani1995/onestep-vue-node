// server/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { raw } = require('body-parser');
const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

let deviceShowStatus = {};

API_URL = "https://track.onestepgps.com/v3/api/public/device?latest_point=true&api-key=kRi4X4Dc-_Ly02gWiDPUtlUL3_A-tqmMsALrpqvlQnM"

app.get('/events', (req, res) => {
    
    axios.get(API_URL)
    .then(response => {
      const rawResponse = response.data;
      const mappedResponse = rawResponse.result_list.reduce((acc, el) => {     
        if(deviceShowStatus[el.device_id] != false){
            acc.push({"device_id": el.device_id, "display_name": el.display_name, "active_state": el.active_state, "latest_device_point":el.latest_device_point});
        }
        return acc;    
    }, []);
      res.json(mappedResponse);
    })
    .catch(error => {
      console.log(error);
      res.json("ERROR");
    });
});

app.get('/events/:id', (req, res) => {
    const device_id = req.params.id;
    // console.log(device_id);
    axios.get(API_URL)
    .then(response => {
      const rawResponse = response.data;
      const mappedResponse = rawResponse.result_list.map(el => { return {"device_id": el.device_id, "display_name": el.display_name, "active_state": el.active_state, "latest_device_point":el.latest_device_point}})
      const event = mappedResponse.find(event => event.device_id === device_id);
      console.log("B4:" + deviceShowStatus[event.device_id]);
      if(deviceShowStatus[event.device_id] == undefined || deviceShowStatus[event.device_id] == null) {
        deviceShowStatus[event.device_id] = true;
      }
      console.log("After:" + deviceShowStatus[event.device_id]);
      event["showStatus"] = deviceShowStatus[event.device_id];
      res.send(event);
    })
    .catch(error => {
      console.log(error);
      res.json("ERROR");
    });
    
  });

  app.put('/saveDevicePrefs', (req, res) => {
      console.log(req.body);
      deviceShowStatus[req.body.device_id] = req.body.showStatus;
      console.log(deviceShowStatus);
      res.sendStatus(200);
  })

// listen on the port
app.listen(port);