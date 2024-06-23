import MCQ from '@/components/MCQ';
import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import React from 'react'


// Définition du type des props avec un gameId de type string
type Props = {
  params: {
    gameId: string;
  }
}

// Fonction asynchrone pour la page QCM
const MCQPage = async ({ params: { gameId }}: Props) => {
  // Récupération de la session d'authentification
  const session = await getAuthSession()
  // Si la session utilisateur n'existe pas, redirection vers la page d'accueil
  if (!session?.user) {
    return redirect('/')
  }

  // Récupération du jeu  à partir de la base de données avec les questions associées
  const game = await prisma.game.findUnique({
    where: {
      id: gameId
    },
    include: {
      questions: {
        select: {
          id: true,
          question: true,
          options: true,
        },
      },
    },
  });

  // Si le jeu n'existe pas ou si le type de jeu n'est pas QCM, redirection vers la page de quiz
  if (!game || game.gameType !== 'mcq') {
    return redirect('/quiz')
  }

  // Renvoi du composant MCQ avec les données du jeu récupéré
  return (
    <MCQ game={game} />
  )
}

export default MCQPage
