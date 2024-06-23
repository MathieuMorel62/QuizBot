import React from 'react';
import { Card } from './ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Separator } from './ui/separator';


// Définition du type des props
type Props = {
  correctAnswers: number,
  wrongAnswers: number,
}

// Composant MCQCounter pour afficher le nombre de bonnes et de mauvaises réponses
const MCQCounter = ({correctAnswers, wrongAnswers}: Props) => {
  return (
    <Card className='flex flex-row items-center justify-center'>
      <CheckCircle2 color='green' size={30} />
      <span className='mx-2 text-2xl text-[green]'>{correctAnswers}</span>
      <Separator orientation='vertical' />
      <span className='mx-3 text-2xl text-[red]'>{wrongAnswers}</span>
      <XCircle color='red' size={30} />
    </Card>
  )
}

export default MCQCounter
