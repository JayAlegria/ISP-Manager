"use client"
import { SidebarTrigger } from '../ui/sidebar'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { FC } from 'react'
import { Separator } from '../ui/separator'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { logout } from '@/actions/auth/logout'
import { usePathname, useRouter } from 'next/navigation'
import { capitalize } from '@/util/capitalize'

interface TContentHeader {
  pageTitle: string,
  pageDescriptions?: string
}

export const ContentHeader = () => {
  const router = useRouter()
  const path = usePathname()
  const handleLogout = async () => {
    await logout()
    router.push("/admin-login")
  }
  return (
    <>
      <header className='flex justify-between w-full py-3'>
        <div className='flex items-center gap-2'>
          <SidebarTrigger />
          <div>
            <p className='font-bold'>{capitalize(path.replace("/", ""))}</p>
          </div>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Button variant="ghost" className='w-full' onClick={handleLogout}>Logout</Button>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </header>
      <Separator />
    </>
  )
}
