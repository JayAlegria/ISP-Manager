import { AppSidebar } from "@/components/layout/AppSidebar";
import { ContentHeader } from "@/components/layout/ContentHeader";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="@container/main px-5">
                <ContentHeader />
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
