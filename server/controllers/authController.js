const User = require('../models/userModel');
const creatError = require('../utils/appError');
const createError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//Registro de usuarios
exports.signup = async (req, res, next)=>{
  try {
    const user = await User.findOne({email: req.body.email});

    if (user) {
      return next(new createError('Usuario ya registrado', 400));
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const newUser = await User.create({
      ...req.body,
      password: hashedPassword
    });

    //JsonWebToken
    const token = jwt.sign({_id: newUser._id}, "secretkey123",{
      expiresIn: '90d'
    });

    res.status(201).json({
      status: 'success',
      message: 'Usuario registrado correctamente',
      token
    });
  } catch (error) {
    next(error);
  }
};

//Inicio de sesion
exports.login = async (req, res, next)=>{
  try {
    const {email, password} = req.body;

    const user = await User.findOne({ email });

    if(!user) return next(new createError("Usuario no encontrado", 404));

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
      return next(new creatError("Email o contraseña incorrecta", 401));
    }

    const token = jwt.sign({_id: user._id}, "secretkey123",{
      expiresIn: '90d'
    });

    res.status(200).json({
      status: 'success',
      message: 'Sesion iniciada correctamente',
      user:{
        _id:user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token

    })
  } catch (error) {
    next(error);
  }
};

