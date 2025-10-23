const express = require ('express')

const {createUser, loginUser,editUser,deleteUser,updatePassword, forgotPassword, validateOtp}=  require("../controllers/userController");

const router = express.Router();
router.post('/users', createUser);
router.post('/login', loginUser);
router.put('/users/:id', editUser);
router.post('/forgot-password', forgotPassword);
router.post('/validate-otp', validateOtp)
router.delete('/users/:id', deleteUser);
router.post('/update-password', updatePassword)


module.exports = router;