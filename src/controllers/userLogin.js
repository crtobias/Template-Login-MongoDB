import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateToken } from '../jwt.js';

const prisma = new PrismaClient();

const validatePassword = async (x, y) => {
  const isMatch = await bcrypt.compare(x, y);
  return isMatch;
};

function validateStatus(status) {
  return status !== 'PENDING';
}

export const login = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email && !name) {
    return res.status(400).json({ message: 'Se necesita un email o un nombre de usuario' });
  }

  try {
    let existingUser;

    if (email) {
      // Buscar por email
      existingUser = await prisma.user.findUnique({ where: { email }, select: { id: true, password: true, rol: true, status: true } });
    } else if (name) {
      // Buscar por nombre
      existingUser = await prisma.user.findUnique({ where: { name }, select: { id: true, password: true, rol: true, status: true } });
    }

    if (!existingUser) {
      return res.status(404).json({ message: 'No se encontró el usuario' });
    }

    // Validar contraseña
    if (await validatePassword(password, existingUser.password)) {
      // Verificar el estado del usuario
      if (validateStatus(existingUser.status)) {
        const token = generateToken({ id: existingUser.id, rol: existingUser.rol }, '1h');
        return res.status(200).json({ message: 'Login exitoso', token });
      } else {
        return res.status(401).json({ message: 'Usuario no verificado' });
      }
    } else {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  } finally {
    await prisma.$disconnect();
  }
};
