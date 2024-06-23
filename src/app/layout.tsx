import { cn } from "@/lib/utils";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";


// Chargement de la police Inter
const inter = Inter({ subsets: ["latin"] });


// Définition des métadonnées de la page
export const metadata: Metadata = {
  title: "QuizBot",
  description: "Generated Quizzes for Everyone",
};


// Définition des propriétés de la page de base de l'application
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Affichage de la page de base de l'application
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen pt-16")}>
        <Providers>
          <Navbar />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
