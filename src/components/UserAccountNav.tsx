'use client'

import React from 'react'
import Link from 'next/link'
import UserAvatar from './UserAvatar'
import { User } from 'next-auth'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'


// Propriétés du composant UserAccountNav
type Props = {
  user: Pick<User, "name" | "image" | "email"> 
}


// Composant UserAccountNav pour la navigation de l'utilisateur connecté
const UserAccountNav = ({user}: Props) => {

  // Rendu du composant UserAccountNav
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {/* user avatar */}
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-white' align='end'>
        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-1 leading-none'>
            {user.name && <p className='font-medium'>{user.name}</p>}
            {
              user.email && (
                <p className='w-[200px] truncate text-sm text-zinc-700'>
                  {user.email}
                </p>
              )
            }
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/'>test Bonjour</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={(e) => {
            e.preventDefault();
            signOut().catch(console.error);
          }}
          className='text-red-600 cursor-pointer'
        >
          Déconnection
          <LogOut className='w-4 h-4 ml-2' />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccountNav
