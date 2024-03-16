import express from 'express';
import { LoginMahasiswa, LogoutMahasiswa, RegisterMahasiswa, checkLogin, getMahasiswa } from '../controllers/MahasiswaControllers.js';
import { refreshToken, verifyAccount } from '../controllers/Auth.js';

const router = express.Router();

router.get('/mahasiswa', verifyAccount, getMahasiswa);
router.post('/register', RegisterMahasiswa);
router.get('/me', checkLogin);
router.get('/token', refreshToken);
router.post('/login', LoginMahasiswa);
router.delete('/logout', LogoutMahasiswa);

export default router;
