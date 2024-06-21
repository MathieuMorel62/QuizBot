import { getAuthSession } from '../../lib/nextauth'
import { redirect } from 'next/navigation'
import React from 'react'
import QuizCreation from '../../components/QuizCreation';


type Props = {}


// Métadonnées de la page quiz
export const metadata = {
  title: 'Quiz | QuizBot',
};


// Page de création de quiz
const QuizPage = async (props: Props) => {
  // Vérifie si l'utilisateur est connecté
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }

  // Affiche la page de création de quiz
  return (
    <QuizCreation />
  )
}

export default QuizPage
