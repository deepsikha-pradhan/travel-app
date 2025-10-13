const express = require ('express')

const {createUser, loginUser,editUser,deleteUser, forgotPassword }=  require("../controllers/userController");

const router = express.Router();
router.post('/users', createUser);
router.post('/login', loginUser);
router.put('/users/:id', editUser);
router.post('/forgot-password', forgotPassword);
router.delete('/users/:id', deleteUser);

module.exports = router;