var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
//Need to enter username and password for your database
var connString = "postgres://postgres:@localhost/assessbox";

var app = express();

app.use(bodyParser.json());
app.use(cors());

//The test doesn't like the Sync version of connecting,
//  Here is a skeleton of the Async, in the callback is also
//  a good place to call your database seeds.
var db = massive.connect({connectionString : connString},
  function(err, localdb){
    db = localdb;
    app.set('db', db);
  
    db.user_create_seed(function(){
      console.log("User Table Init");
    });
    db.vehicle_create_seed(function(){
      console.log("Vehicle Table Init")
    });
});


//////get/////
app.get('/api/users', function(req, res) {
  db.get_users(function(err, resp) {
    res.status(200).send(resp)
  })
});
app.get('/api/vehicles', function(req, res) {
  db.get_vehicles(function(err, resp) {
    res.send(resp)
  })
});
app.get('/api/user/:userId/vehiclecount', function(req, res) {
  let params = [req.params.userId]
  db.get_vehicle_count(params, function(err, resp) {
    res.send(resp[0])
  })
});
app.get('/api/user/:userId/vehicle', function(req, res) {
  let params = [req.params.userId]
  db.get_vehiclesByUser(params, function(err, resp) {
    res.send(resp)
  })
});
app.get('/api/vehicle', function(req, res) {
  let email = [req.query.email]
  let first = [req.query.userFirstStart + "%"]

  if(req.query.email) {
    db.get_vehiclesByEmail(email, function(err, resp) {
      res.send(resp)
    })
  } else if (req.query.userFirstStart){
    db.get_vehiclesByFirstName(first, function(err, resp) {
      res.send(resp)
    })
  }
});
app.get('/api/newervehiclesbyyear', function(req, res) {
  
  db.get_newerVehicles(function(err, resp) {
    res.status(200).send(resp)
  })
});

////posts//////
app.post('/api/users', function(req, res) {
  let params = [req.body.firstname, req.body.lastname, req.body.email]
  console.log(params)

  db.post_user(params, function(err, resp) {
     res.status(200).send(params[0])
  })
})
app.post('/api/vehicles', function(req, res) {
  let params = [req.body.make, req.body.model, req.body.year, req.body.ownerId]

  db.post_vehicle(params, function(err, resp) {
    if (err) return console.log(err)
    else res.status(200).send(params[0])
  })
})

/////put///////
app.put('/api/vehicle/:vehicleId/user/:userId', function(req, res){
  let params = [req.params.userId, req.params.vehicleId ]
  console.log(params)
  db.update_owner(params, function(err, resp){
    res.send('success')
  })
})

app.delete('/api/user/:userId/vehicle/:vehicleId', function(req, res){
  let params = [req.params.userId, req.params.vehicleId]

  db.delete_owner(params, function(err, resp){
    res.status(200).send(resp)
  })
})
////delete//////
app.delete('/api/vehicle/:vehicleId', function(req, res){
  let params = [req.params.vehicleId]

  db.delete_vehicle(params, function(err, resp){
    res.status(200).send(resp)
  })
})


app.listen('3000', function(){
  console.log("Successfully listening on : 3000")
})

module.exports = app;
