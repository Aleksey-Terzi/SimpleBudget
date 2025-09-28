import { Outlet } from "react-router";
import WebsiteTitle from "./_parts/WebsiteTitle";
import PageHeader from "./_parts/PageHeader";
import Sidebar from "./_parts/Sidebar";
import StatusProvider from "@/contexts/StatusProvider";
import LoadingProvider from "@/contexts/LoadingProvider";
import MenuProvider from "@/contexts/MenuProvider";
import UserHeader from "./_parts/UserHeader";

export default function AppLayout() {
    return (
        <MenuProvider>
            <div className="h-screen grid grid-cols-[14rem,1fr] grid-rows-[3.5rem,1fr]">
                <div className="p-3 flex items-center border-b border-gray-border bg-white">
                    <WebsiteTitle />
                </div>
                <div className="flex border-b border-gray-border bg-white">
                    <menu className="px-3 flex items-center">
                        <PageHeader />
                    </menu>
                    <div className="pe-6 flex grow items-center justify-end">
                        <UserHeader />
                    </div>
                </div>
                <nav className="p-3 overflow-auto border-e border-gray-border bg-white">
                    <Sidebar />
                </nav>
                <main className="p-3 overflow-auto">
                    <StatusProvider>
                        <LoadingProvider>
                            <Outlet />
                        </LoadingProvider>
                    </StatusProvider>
                </main>
            </div>
        </MenuProvider>
    )
}