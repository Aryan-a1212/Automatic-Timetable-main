const express = require('express');
const router = express.Router();

module.exports = (uploadController) => {
  router.post('/teachers', ...uploadController.uploadTeachers);
  router.post('/subjects', ...uploadController.uploadSubjects);
  router.post('/rooms', ...uploadController.uploadRooms);
  router.post('/fixed-slots', ...uploadController.uploadFixedSlots);

  return router;
};
