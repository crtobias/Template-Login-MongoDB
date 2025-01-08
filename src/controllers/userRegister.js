import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateToken } from '../jwt.js';
import { sendVerificationEmail } from '../email.js';

const saltRounds = 10;
const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { name }
        ]
      }
    });

    if (existingUser) {
      console.log('Usuario en uso');
      return res.status(400).json({ error: 'Este correo electrónico o nombre ya está en uso.' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

 
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        rol: 'user',
        name,
      }
    });

    // Generar token de verificación
    const token = generateToken({ id: newUser.id, rol: newUser.rol }, '1h');
    console.log(token);
    
    // Enviar email de verificación
    sendVerificationEmail(newUser.email, token);

    res.status(201).json({ message: 'Usuario creado correctamente, por favor verifique su correo.', token });
    console.log('Usuario creado');
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  } finally {
    await prisma.$disconnect();
  }
};
