const { Router } = require('express');
const route = Router();
const { v4: uuidv4 } = require('uuid');

// entry
route.get('/', (req, res) => {
  res.render('getinfo');
});

//get info
route.post('/setup', (req, res) => {
  const { user, rid } = req.body;
  if (user) {
    // create new room
    res.redirect(`/r/${uuidv4()}`);
  } else if (rid) {
    //join room
    res.send(rid);
  } else {
    res.redirect('/');
  }
});

// enter in a room
route.get('/r/:room', (req, res) => {
  res.render('room', { roomID: req.params.room });
});

route.all('*', (req, res) => {
  res.redirect('/');
});
module.exports = route;
