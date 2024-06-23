import { checkAnswerSchema } from "@/app/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";


// Fonction asynchrone pour la route de vérification de réponse
export async function POST(req: Request, res: Response) {
  try {
    
    // Validation du corps de la requête
    const body = await req.json();
    const {questionId, userAnswer} = checkAnswerSchema.parse(body);

    // Récupération de la question à partir de la base de données
    const question = await prisma.question.findUnique({
      where: {
        id: questionId
      }
    })

    // Si la question n'existe pas, renvoyer une erreur 404
    if (!question) {
      return NextResponse.json(
        {
          error: 'Question not found',
        },
        {
          status: 404,
        }
      );
    }

    // Mise à jour de la réponse de l'utilisateur pour la question
    await prisma.question.update({
      where: {
        id: questionId
      },
      data: {
        userAnswer
      }
    })

    // Si la question est de type QCM
    if (question.questionType === 'mcq') {
      // Vérification si la réponse de l'utilisateur est correcte
      const isCorrect = question.answer.toLowerCase().trim() === userAnswer.toLowerCase().trim();

      // Mettre à jour l'état de correction de la question
      await prisma.question.update({
        where: {
          id: questionId
        },
        data: {
          isCorrect,
        },
      });
      // Retourner le statut de la réponse
      return NextResponse.json(
        {
          isCorrect,
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    // Gestion des erreurs de validation de schéma
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
        },
        {
          status: 400,
        }
      );
    }
  }
}
