import Mahasiswa from '../models/MahasiswaModels.js';
import jwt from 'jsonwebtoken';

export const verifyAccount = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Maaf Anda Tidak Bisa Mengakses Halaman ini, Silahkan Login Terlebih Dahulu!' });
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, _ /* decoded */) => {
    if (err) return res.status(400).json({ message: 'Token Telah Kadaluarsa !' });
    console.log(token);
    next();
  });
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(400).json({ message: 'Error... Token Kadaluarsa!' });
    const MahasiswaSearch = Mahasiswa.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!MahasiswaSearch) return res.status(403).json({ message: 'Tidak memiliki izin akses!' });
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err) return res.status(403);

      const { id, name, email } = decoded;
      const accessToken = jwt.sign({ id, name, email }, process.env.ACCESS_TOKEN, {
        expiresIn: '10s',
      });
      res.status(200).json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
