const express = require('express');
const router = express.Router();

// This module now exports a function that takes the controller as an argument
module.exports = (uploadController) => {
  // The routes are now set up on the router that is returned by this function
  router.post('/teachers', uploadController.uploadTeachers);
  router.post('/subjects', uploadController.uploadSubjects);
  router.post('/rooms', uploadController.uploadRooms);
  router.post('/fixed-slots', uploadController.uploadFixedSlots);

  return router;
};