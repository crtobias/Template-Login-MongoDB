import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUser = async (req, res) => {
  const { id } = req.params; // El ID ya es un string

  try {
    const user = await prisma.user.findUnique({
      where: { id }, // MongoDB utiliza ObjectId como string
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        rol: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
};
