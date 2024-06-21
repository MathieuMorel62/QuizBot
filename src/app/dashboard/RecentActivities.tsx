import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'


type Props = {}


// Activités récentes
const RecentActivities = (props: Props) => {

  // Affichage des activités récentes
  return (
    <Card className='col-span-4 lg:col-span-3'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Activités Récentes</CardTitle>
        <CardDescription>
          Vous avez joué un total de 7 parties.
        </CardDescription>
      </CardHeader>
      <CardContent className='max-h-[580px] overflow-scroll'>
        Historieees
      </CardContent>
    </Card>
  )
}

export default RecentActivities
