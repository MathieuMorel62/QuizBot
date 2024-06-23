'use client';

import { Game, Question } from '@prisma/client';
import { differenceInSeconds } from 'date-fns';
import { BarChart, ChevronRight, Loader2, Timer } from 'lucide-react';
import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button, buttonVariants } from './ui/button';
import MCQCounter from './MCQCounter';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';
import { checkAnswerSchema } from '@/app/schemas/form/quiz';
import { useToast } from './ui/use-toast';
import Link from 'next/link';
import { cn, formatTimeDelta } from '@/lib/utils';


// Définition du type des props
type Props = {
  game: Game & { questions: Pick<Question, 'id' | 'options' | 'question'>[] }
};

// Composant MCQ pour afficher les questions à choix multiples
const MCQ = ({ game }: Props) => {
  // États pour gérer l'index de la question, le choix sélectionné, les réponses correctes/incorrectes, la fin du jeu et le temps actuel
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [selectedChoice, setSelectedChoice] = React.useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = React.useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = React.useState<number>(0);
  const [hasEnded, setHasEnded] = React.useState<boolean>(false);
  const [now, setNow] = React.useState<Date>(new Date());
  const { toast } = useToast();

  // Effet pour mettre à jour le temps actuel chaque seconde tant que le jeu n'est pas terminé
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date());
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [hasEnded]);

  // Mémoïsation de la question actuelle
  const currentQuestion = React.useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  // Mémoïsation des options de réponse de la question actuelle
  const options = React.useMemo(() => {
    if (!currentQuestion) return [];
    if (!currentQuestion.options) return [];
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  // Mutation pour vérifier la réponse de l'utilisateur
  const { mutate: checkAnswer, status } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: options[selectedChoice],
      };
      const response = await axios.post('/api/checkAnswer', payload);
      return response.data;
    },
  });

  // Fonction pour gérer la question suivante
  const handleNext = React.useCallback(() => {
    if (status === 'pending') return;
    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        if (isCorrect) {
          toast({
            title: 'Correct!',
            description: 'Bonne réponse',
            variant: 'success',
          });
          setCorrectAnswers((prev) => prev + 1);
        } else {
          toast({
            title: 'Incorrect!',
            description: 'Mauvaise réponse',
            variant: 'destructive',
          });
          setWrongAnswers((prev) => prev + 1);
        }
        if (questionIndex === game.questions.length - 1) {
          setHasEnded(true);
          return;
        }
        setQuestionIndex((prev) => prev + 1);
      },
    });
  }, [checkAnswer, toast, status, questionIndex, game.questions.length, options, selectedChoice, currentQuestion]);

  // Effet pour gérer les touches clavier pour les choix de réponse et la validation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key == '1') {
        setSelectedChoice(0);
      } else if (event.key === '2') {
        setSelectedChoice(1);
      } else if (event.key === '3') {
        setSelectedChoice(2);
      } else if (event.key === '4') {
        setSelectedChoice(3);
      } else if (event.key === 'Enter') {
        handleNext();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNext]);

  // Vérification si la requête est en cours
  const isLoading = status === 'pending';

  // Si le jeu est terminé, afficher le score et le bouton pour voir les statistiques
  if (hasEnded) {
    return (
      <div className='absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <div className='px-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap'>
          Vous avez terminé en{" "}
          {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
        </div>
        <Link
          href={`/statistics/${game.id}`}
          className={cn(buttonVariants(), 'mt-2')}
        >
          Voir les statistiques
          <BarChart className='w-4 h-4 ml-2' />
        </Link>
      </div>
    );
  };

  // Affichage du jeu
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw]">
      <div className='flex flex-row justify-between'>
        <div className='flex flex-col'>
          {/* Topic */}
          <p>
            <span className='mr-2 text-slate-400'>Thème</span>
            <span className='px-2 py-1 text-white rounded-lg bg-slate-800'>
              {game.topic}
            </span>
          </p>
          <div className="flex self-start mt-3 text-slate-400">
            <Timer className='mr-2' />
            {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          </div>
        </div>
        <MCQCounter
          correctAnswers={correctAnswers}
          wrongAnswers={wrongAnswers}
        />
      </div>
      <Card className='w-full mt-4'>
        <CardHeader className='flex flex-row items-center'>
          <CardTitle className='mr-5 text-center divide-y divide-zinc-600/50'>
            <div>{questionIndex + 1}</div>
            <div className='text-base text-slate-400'>
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className='flex-grow text-lg'>
            {currentQuestion.question}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className='flex flex-col items-center justify-center w-full mt-4'>
        {options.map((option, index) => {
          return (
            <Button
              key={index}
              className='justify-start w-full py-8 mb-4'
              variant={selectedChoice === index ? 'default' : 'secondary'}
              onClick={() => {
                setSelectedChoice(index);
              }}
            >
              <div className="flex items-center justify-start">
                <div className='p-2 px-3 mr-5 border rounded-md'>
                  {index + 1}
                </div>
                <div className="text-start">{option}</div>
              </div>
            </Button>
          );
        })}
        <Button
          className='mt-2'
          disabled={isLoading}
          onClick={() => {
            handleNext();
          }}
        >
          {isLoading && <Loader2 className='w-4 h-4 mr-2 animated-spin' />}
          Suivant <ChevronRight className='w-4 h-4 ml-2' />
        </Button>
      </div>
    </div>
  );
};

export default MCQ;
