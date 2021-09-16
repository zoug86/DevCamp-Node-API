const express = require('express');
const router = express.Router();
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');

const { getUsers, createUser, updateUser, deleteUser, getUser } = require('../controllers/users');

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advancedResults(User), getUsers).post(createUser);
router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)


module.exports = router;