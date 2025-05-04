
import express from 'express';
import { updateProfile, changePassword } from '../controllers/userController.js';

const router = express.Router();

router.put('/:id', updateProfile);        // PUT /api/users/:id
router.put('/:id/password', changePassword); // PUT /api/users/:id/password

export default router;
