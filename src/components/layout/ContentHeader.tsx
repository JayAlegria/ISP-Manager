"use client"
import { SidebarTrigger } from '../ui/sidebar'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { FC } from 'react'
import { Separator } from '../ui/separator'

interface TContentHeader {
  pageTitle: string,
  pageDescriptions?: string
}

export const ContentHeader: FC<TContentHeader> = ({ pageTitle, pageDescriptions }) => {

  return (
    <>
      <header className='flex justify-between w-full py-3'>
        <div className='flex items-center gap-2'>
          <SidebarTrigger />
          <div>
            <p className='font-bold'>{pageTitle}</p>
            <small>{pageDescriptions}</small>
          </div>
        </div>
        <div>
          <Avatar>
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <Separator />
    </>
  )
}
