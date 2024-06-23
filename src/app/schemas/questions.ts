import { z } from "zod";


// Schéma de validation pour obtenir les questions
export const getQuestionsSchema = z.object({
  // Le sujet des questions
  topic: z.string(),

  // Le nombre de questions (entre 1 et 10)
  amount: z.number().int().positive().min(1).max(10),

  // Le type de question (QCM ou ouverte)
  type: z.enum(["mcq", "open_ended"]),
});

// Schéma de validation pour vérifier une réponse
export const checkAnswerSchema = z.object({
  // La réponse de l'utilisateur
  userInput: z.string(),

  // L'identifiant de la question
  questionId: z.string(),
});


// Schéma de validation pour terminer une partie
export const endGameSchema = z.object({
  // L'identifiant de la partie
  gameId: z.string(),
});
