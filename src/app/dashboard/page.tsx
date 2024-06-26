import { getAuthSession } from '@/lib/nextauth'
import { redirect } from 'next/navigation'
import QuizMeCard from '@/components/dashboard/QuizMeCard'
import HistoryCard from '@/components/dashboard/HistoryCard'
import RecentActivities from './RecentActivities'
import dynamic from 'next/dynamic'
import React from 'react'


type Props = {}

// Composant dynamique pour le chargement de HotTopicsCard
const HotTopicsCard = dynamic(() => import('./HotTopicsCard'), { ssr: false })

// Métadonnées de la page
const metadata = {
  title: 'Accueil | QuizBot',
}


// Page d'accueil du tableau de bord
const Dashboard = async (props: Props) => {
  // Vérifie si l'utilisateur est connecté
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }

  // Affiche la page d'accueil du tableau de bord
  return (
    <main className='p-8 mx-auto max-w-7xl'>
      <div className='flex items-center'>
        <h2 className='mr-2 text-3xl font-bold tracking-tight'>Accueil</h2>
      </div>
      <div className='grid gap-4 mt-4 md:grid-cols-2'>
        <QuizMeCard />
        <HistoryCard />
      </div>
      <div className='grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7'>
        <HotTopicsCard />
        <RecentActivities />
      </div>
    </main>
  )
}

export default Dashboard
