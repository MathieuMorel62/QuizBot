import SignInButton from "@/components/SignInButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/nextauth";


export default async function Home() {
  const session = await getAuthSession();
  if (session?.user) {
    return redirect("/dashboard");
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle>
            Bienvenu sur QuizBot
          </CardTitle>
          <CardDescription>
            Quizbot est une application de quiz qui vous permet de générer et de partager des quiz avec vos amis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInButton text="Connection avec Google"/>
        </CardContent>
      </Card>
    </div>
  );
};
