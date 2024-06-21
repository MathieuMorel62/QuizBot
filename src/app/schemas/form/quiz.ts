import {z} from 'zod';


// Schéma de validation pour la création de quiz
export const quizCreationSchema = z.object({
  topic: z.string().min(4, {message: 'Le sujet doit contenir au moins 4 caractères'}),
  type: z.enum(['mcq', 'open_ended']),
  amount: z.number().min(1).max(10),
})
