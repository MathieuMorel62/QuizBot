"use client";

import React from 'react'
import { Button } from './ui/button'
import { signIn } from 'next-auth/react'


// Propriétés du composant SignInButton
type Props = {
  text: string
}


// Composant SignInButton pour la connexion
const SignInButton = ({ text }: Props) => {
  // Rendu du composant SignInButton
  return (
    <Button
      onClick={() => {
        signIn('google').catch(console.error);
      }}
    >
      {text}
    </Button>
  );
};

export default SignInButton
