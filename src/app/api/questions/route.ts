import { strict_output } from "@/lib/gpt";
import { getAuthSession } from "@/lib/nextauth";
import { getQuestionsSchema } from "../../schemas/questions";
import { NextResponse } from "next/server";
import { ZodError } from "zod";


// Configuration de l'exécution
export const runtime = "nodejs";
export const maxDuration = 500;

export async function POST(req: Request, res: Response) {
  try {
    // Obtenir la session d'authentification
    const session = await getAuthSession();
    /*
    // Vérifier si l'utilisateur est authentifié
    if (!session?.user) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour créer un jeu." },
        {
          status: 401,
        }
      );
    }
    */
    // Récupérer et parser le corps de la requête
    const body = await req.json();
    const { amount, topic, type } = getQuestionsSchema.parse(body);
    let questions: any;
    
    // Générer des questions ouvertes
    if (type === "open_ended") {
      questions = await strict_output(
        "You are a helpful AI that is able to generate a pair of question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array",
        new Array(amount).fill(
          `You are to generate a random hard open-ended questions about ${topic}`
        ),
        {
          question: "question",
          answer: "answer with max length of 15 words",
        }
      );
    } 
    // Générer des questions à choix multiples (MCQ)
    else if (type === "mcq") {
      questions = await strict_output(
        "You are a helpful AI that is able to generate mcq questions and answers, the length of each answer should not be more than 15 words, store all answers and questions and options in a JSON array",
        new Array(amount).fill(
          `You are to generate a random hard mcq question about ${topic}`
        ),
        {
          question: "question",
          answer: "answer with max length of 15 words",
          option1: "option1 with max length of 15 words",
          option2: "option2 with max length of 15 words",
          option3: "option3 with max length of 15 words",
        }
      );
    }
    // Retourner les questions générées dans la réponse
    return NextResponse.json(
      {
        questions: questions,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    // Gestion des erreurs de validation
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues },
        {
          status: 400,
        }
      );
    } 
    // Gestion des erreurs inattendues
    else {
      console.error("Erreur GPT", error);
      return NextResponse.json(
        { error: "Une erreur inattendue s'est produite." },
        {
          status: 500,
        }
      );
    }
  }
}
