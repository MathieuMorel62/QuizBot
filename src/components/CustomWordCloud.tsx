'use client'

import { useTheme } from 'next-themes'
import React from 'react'
import D3WordCloud from 'react-d3-cloud'


type Props = {}


// Données pour le nuage de mots
const data = [
  { text: 'React', value: 3, },
  { text: 'NextJS', value: 5, },
  { text: 'MySQL', value: 10, },
  { text: 'Javascript', value: 8, },
  { text: 'UI/UX', value: 3, },
  { text: 'Redux', value: 7, },
]


// Fonction pour déterminer la taille de la police
const fontSizeMapper = (word: { value: number }) => {
  return Math.log2(word.value) * 5 + 16;
}


// Composant pour le nuage de mots
const CustomWordCloud = (props: Props) => {
  const theme = useTheme()
  return (
    <>
      <D3WordCloud
        height={550}
        data={data}
        font='Times'
        fontSize={fontSizeMapper}
        rotate={0}
        padding={10}
        fill={theme.theme === 'dark' ? 'white' : 'black'}
      />
    </>
  )
}

export default CustomWordCloud
