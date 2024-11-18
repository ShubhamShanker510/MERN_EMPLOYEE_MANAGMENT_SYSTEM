import express from 'express'
import { deleteUser, loginUser, registerUser, updateUser } from '../controllers/user.controller.js';
import authenticate from '../middlewares/auth.middleware.js';


const router=express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/update/:id').put(authenticate,updateUser);
router.route('/delete/:id').delete(authenticate, deleteUser);

export default router;