"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import AppSidebarHeader from "./AppSidebarHeader"
import { Separator } from "../ui/separator"
import { Spinner } from "../ui/spinner"
import { HouseWifi, LayoutDashboard, Receipt, User2 } from "lucide-react"
import { ReactElement, useTransition } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"

interface TNav {
  title: string,
  url: string,
  icon?: ReactElement
}

interface TSideBardata {
  mainContent: TNav[]
}

const data: TSideBardata = {
  mainContent: [
    { title: "Dashboard", url: "/dashboard", icon: <LayoutDashboard /> },
    { title: "Customers", url: "/customers", icon: <User2 /> },
    { title: "Service Plans", url: "/plans", icon: <HouseWifi /> },
    { title: "Billing", url: "/billing", icon: <Receipt /> }
  ]
}

export function AppSidebar() {
  const pathName = usePathname()
  const [isPending] = useTransition()

  return (
    <Sidebar>
      <SidebarHeader>
        <AppSidebarHeader />
      </SidebarHeader>
      <Separator />
      <SidebarContent className="p-5">
        {isPending ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <SidebarMenu>
            {data.mainContent.map(nav => (
              <SidebarMenuItem key={nav.title} className="mb-1">
                <Link href={nav.url}>
                  <SidebarMenuButton isActive={pathName === nav.url} className="hover:bg-foreground hover:text-white flex gap-2 items-center data-active:bg-foreground data-active:text-white">
                    {nav.icon}
                    {nav.title}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        )}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}