const express = require('express');
const router = express.Router();

const { getallJobs, getJobs, createJobs, updateJobs, deleteJobs, deleteallJobs } = require('../controllers/jobs');

//same route comes to redece the liens of code use chain method
router.route('/').get(getallJobs).post(createJobs).delete(deleteallJobs);
router.route('/:id').get(getJobs).patch(updateJobs).delete(deleteJobs);

module.exports = router;
