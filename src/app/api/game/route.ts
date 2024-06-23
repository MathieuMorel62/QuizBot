import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { quizCreationSchema } from "@/app/schemas/form/quiz";
import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";


export async function POST(req: Request, res: Response) {
  try {
    // Récupérer la session de l'utilisateur
    const session = await getAuthSession();
    if (!session?.user) {
      // Retourner une réponse si l'utilisateur n'est pas connecté
      return NextResponse.json(
        { error: "You must be logged in to create a game." },
        { status: 401 }
      );
    }
    
    // Extraire le corps de la requête
    const body = await req.json();
    // Valider et parser les données du corps de la requête
    const { topic, type, amount } = quizCreationSchema.parse(body);
    
    // Créer un nouveau jeu dans la base de données
    const game = await prisma.game.create({
      data: {
        gameType: type,
        timeStarted: new Date(),
        userId: session.user.id,
        topic,
      },
    });
    
    // Mettre à jour ou insérer le compteur de sujets
    await prisma.topic_count.upsert({
      where: {
        topic,
      },
      create: {
        topic,
        count: 1,
      },
      update: {
        count: {
          increment: 1,
        },
      },
    });

    console.log('Sending request to API:', { amount, topic, type });

    // Envoyer une requête à l'API pour obtenir les questions
    const { data } = await axios.post(
      `${process.env.API_URL as string}/api/questions`,
      { amount, topic, type }
    );

    console.log('Received questions data:', data);

    // Traiter les questions de type "QCM"
    if (type === "mcq") {
      type mcqQuestion = {
        question: string;
        answer: string;
        option1: string;
        option2: string;
        option3: string;
      };

      const manyData = data.questions.map((question: mcqQuestion) => {
        const options = [
          question.option1,
          question.option2,
          question.option3,
          question.answer,
        ].sort(() => Math.random() - 0.5);
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          gameId: game.id,
          questionType: "mcq",
        };
      });

      // Insérer les questions dans la base de données
      await prisma.question.createMany({
        data: manyData,
      });
    } 
    // Traiter les questions de type "ouverte"
    else if (type === "open_ended") {
      type openQuestion = {
        question: string;
        answer: string;
      };
      await prisma.question.createMany({
        data: data.questions.map((question: openQuestion) => {
          return {
            question: question.question,
            answer: question.answer,
            gameId: game.id,
            questionType: "open_ended",
          };
        }),
      });
    }

    // Retourner l'ID du jeu créé
    return NextResponse.json({ gameId: game.id }, { status: 200 });
  } catch (error) {
    console.error("Error occurred:", error);
    if (error instanceof z.ZodError) {
      // Gérer les erreurs de validation
      return NextResponse.json(
        { error: error.issues },
        { status: 400 }
      );
    } else {
      // Gérer les erreurs inattendues
      return NextResponse.json(
        { error: "An unexpected error occurred." },
        { status: 500 }
      );
    }
  }
}
