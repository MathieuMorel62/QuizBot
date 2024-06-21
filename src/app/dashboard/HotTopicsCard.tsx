import React from 'react'
import CustomWordCloud from '../../components/CustomWordCloud'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'


type Props = {}

// Carte des sujets d'actualité
const HotTopicsCard = (props: Props) => {
  // Affichage de la carte des sujets d'actualité
  return (
    <Card className='col-span-4'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Sujets d'actualité</CardTitle>
        <CardDescription>
          Cliquez sur un sujet pour lancer un quiz sur ce thème!
        </CardDescription>
      </CardHeader>
      <CardContent className='pl-2'>
        <CustomWordCloud />
      </CardContent>
    </Card>
  )
}

export default HotTopicsCard
