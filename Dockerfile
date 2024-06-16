# Image de base Ubuntu 20.04
FROM ubuntu:20.04

# Mise à jour des paquets et installation des dépendances
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    software-properties-common \
    git

# Installation de Node.js version 18 et npm
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Installation de yarn
RUN npm install -g yarn

# Nom de l'image
LABEL name="projet_quizbot"

# Nom du conteneur
ENV CONTAINER_NAME=quizbot_app

# Point d'entrée
CMD ["bash"]
