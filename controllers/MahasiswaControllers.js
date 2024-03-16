import argon2 from 'argon2';
import Mahasiswa from '../models/MahasiswaModels.js';
import jwt from 'jsonwebtoken';

export const getMahasiswa = async (_, res) => {
  try {
    const response = await Mahasiswa.findAll({
      attributes: ['name', 'email'],
    });
    res.status(200).json({
      message: 'Berhasil Mendapatkan Data Mahasiswa',
      status: 200,
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const RegisterMahasiswa = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const response = await Mahasiswa.findOne({
    attributes: ['email'],
    where: {
      email: email,
    },
  });

  if (response && response.email === email.toLowerCase()) return res.status(400).json({ message: 'Email Sudah Terdaftar!' });
  if (password !== confirmPassword) return res.status(400).json({ message: 'Password Not Same!' });
  const hashPassword = await argon2.hash(password);
  try {
    await Mahasiswa.create({
      name: name,
      email: email,
      password: hashPassword,
    });

    res.status(201).json({
      message: 'Berhasil Login!',
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const checkLogin = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(403).json({ message: 'Mohon Lakukan Login Terlebih Dahulu!' });
  try {
    const findAccount = await Mahasiswa.findOne({
      attributes: ['email', 'name'],
      where: {
        refresh_token: refreshToken,
      },
    });
    res.status(200).json({
      message: 'Sudah Melakukan Login',
      data: findAccount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const LoginMahasiswa = async (req, res) => {
  try {
    const SearchMahasiswa = await Mahasiswa.findOne({
      where: {
        email: req.body.email,
      },
    });

    const match = await argon2.verify(SearchMahasiswa.password, req.body.password);
    if (!match) return res.status(400).json({ message: 'Password Salah!' });

    const payload = {
      id: SearchMahasiswa.id,
      name: SearchMahasiswa.name,
      email: SearchMahasiswa.email,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, {
      expiresIn: '10s',
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, {
      expiresIn: '10s',
    });

    await Mahasiswa.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: payload.id,
        },
      }
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      // maxAge: 24 * 60 * 60 * 1000,
      maxAge: 1000 * 10,
    });

    req.userId = payload.id;

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
export const LogoutMahasiswa = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const Mhs = await Mahasiswa.findOne({
    where: {
      refresh_token: refreshToken,
    },
  });

  if (!Mhs) return res.status(400).json({ message: 'Mahasiswa Tidak Di Temukan!' });
  await Mahasiswa.update(
    { refresh_token: null },
    {
      where: {
        id: Mhs.id,
      },
    }
  );
  res.clearCookie('refreshToken');
  return res.status(200).json({ message: 'Berhasil Logout!' });
};
