// server/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const fileUpload = require('express-fileupload');
const app = express();
const port = 8000;

// enable files upload
app.use(fileUpload({
  createParentPath: true
}));

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
            acc.push({"device_id": el.device_id, "display_name": el.display_name, "active_state": el.active_state, "device_lat":el.latest_device_point.lat, "device_lng":el.latest_device_point.lng});
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

app.get('/get-device', (req, res) => {
    console.log(req.query);
    const device_id = req.query.id;
    // console.log(device_id);
    axios.get(API_URL)
    .then(response => {
      const rawResponse = response.data;
      const mappedResponse = rawResponse.result_list.map(el => { return {"device_id": el.device_id, "display_name": el.display_name, "active_state": el.active_state, "device_lat":el.latest_device_point.lat, "device_lng":el.latest_device_point.lng}})
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
      // console.log(req.body);
      deviceShowStatus[req.body.device_id] = req.body.showStatus;
      // console.log(deviceShowStatus);
      res.sendStatus(200);
  })

  app.post('/update-icon', (req, res) => {
    console.log("UPDATE ICON");
    console.log(req.body);
    res.sendStatus(200);
  })

  app.post('/upload-avatar', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.image;
            console.log(avatar);
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            avatar.mv('./uploads/' + avatar.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
  });

// listen on the port
app.listen(port);