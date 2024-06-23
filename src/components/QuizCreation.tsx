'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { useForm } from 'react-hook-form'
import { quizCreationSchema } from '../app/schemas/form/quiz'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage, FormControl } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { BookOpen, CopyCheck } from 'lucide-react'
import { Separator } from './ui/separator'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation'


type Props = {}

// Type pour l'entrée du formulaire
type Input = z.infer<typeof quizCreationSchema>

// Composant principal pour la création de quiz
const QuizCreation = (props: Props) => {
  const router = useRouter()

  // Utilisation de useMutation pour gérer la mutation asynchrone
  const { mutate: getQuestions, status } = useMutation({
    mutationFn: async ({ amount, topic, type }: Input) => {
      console.log('Requesting questions:', { amount, topic, type });
      const response = await axios.post('/api/game', {
        amount,
        topic,
        type
      });
      console.log('Received response:', response.data);
      return response.data
    }
  })

  // Initialisation du formulaire avec react-hook-form et zod pour la validation
  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      amount: 3,
      topic: "",
      type: "open_ended"
    }
  })

  // Fonction de soumission du formulaire
  function onSubmit(input: Input) {
    getQuestions({
      amount: input.amount,
      topic: input.topic,
      type: input.type
    }, {
      onSuccess: ({ gameId }) => {
        if (form.getValues('type') == 'open_ended') {
          router.push(`/play/open-ended/${gameId}`);
        } else {
          router.push(`/play/mcq/${gameId}`);
        }
      },
    })
  }

  // Surveillance des changements de formulaire
  form.watch();

  // Vérification de l'état de chargement
  const isLoading = status === 'pending';

  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2x font-bold'>Création de Quiz</CardTitle>
          <CardDescription>
            Choisir un sujet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sujet</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrer le sujet..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Veuillez fournir un sujet.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de questions</FormLabel>
                    <FormControl>
                      <Input placeholder="Saisir un montant..."
                        {...field}
                        type="number"
                        min={1}
                        max={10}
                        onChange={e => {
                          form.setValue('amount', parseInt(e.target.value))
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={() => {
                    form.setValue("type", "mcq")
                  }}
                  className='w-1/2 rounded-none rounded-l-lg'
                  variant={form.getValues("type") === "mcq" ? "default" : "secondary"}
                >
                  <CopyCheck className='w-4 h-4 mr-2' /> Choix Multiple
                </Button>
                <Separator orientation='vertical' />
                <Button
                  type="button"
                  onClick={() => {
                    form.setValue("type", "open_ended")
                  }}
                  className='w-1/2 rounded-none rounded-r-lg'
                  variant={form.getValues("type") === "open_ended" ? "default" : "secondary"}
                >
                  <BookOpen className='w-4 h-4 mr-2' /> Ouvert à tous
                </Button>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Chargement...' : 'Soumettre'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default QuizCreation
