import { PrismaClient } from "@prisma/client";
import "server-only";
 

// Declaration d'une variable globale pour le cache de l'instance PrismaClient
declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var cachedPrisma: PrismaClient;
}


// Instance de PrismaClient
export let prisma: PrismaClient;
// Si l'environnement est en production, crée un nouveau client PrismaClient
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // Si l'environnement est en développement, utilise l'instance PrismaClient en cache
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}
