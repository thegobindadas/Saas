"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import BottomGradient from "./ui/BottomGradient";
import { useRouter } from "next/navigation";
import { UserProfile, SidebarItem } from "@/types";


interface sidebarProps {
    user: UserProfile | null | undefined;
    menuItems: SidebarItem[];
}



const Sidebar = ({ user, menuItems }: sidebarProps) => {
    
    const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("home");
    const router = useRouter();



    const SidebarContent = () => (
        <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-800">
                <div className="lg:hidden mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">V</span>
                            </div>
                            <span className="ml-2 text-white font-bold text-lg">MediaMorph</span>
                        </div>
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <div className="hidden lg:block">
                    <h3 className="text-white font-semibold text-lg">Menu</h3>
                </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-4">
                <div className="space-y-2">
                    {menuItems.map((item: SidebarItem) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setIsMobileOpen(false);
                                    router.push(`/${item.id}`);
                                }}
                                className={`relative group/btn w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                                    isActive
                                        ? "bg-cyan-600 text-white"
                                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="font-medium">{item.label}</span>
                                {isActive && <BottomGradient />}
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* Login Prompt for Non-Logged In Users */}
            {!user && (
                <div className="p-4 border-t border-gray-800">
                    <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-2">Join MediaMorph</h4>
                        <p className="text-gray-400 text-sm mb-3">
                            Sign up to upload videos and share with friends
                        </p>
                        <button 
                            onClick={() => router.push("/sign-up")}
                            className="relative group/btn w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            Get Started
                            <BottomGradient />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );


    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gray-900 bg-opacity-50 backdrop-blur-sm border-r border-gray-800 z-30">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar Toggle */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed bottom-4 left-4 w-12 h-12 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 z-50"
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Mobile Sidebar Overlay */}
            {isMobileOpen && (
                <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" onClick={() => setIsMobileOpen(false)} />
            )}

            {/* Mobile Sidebar */}
            <div className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-gray-900 bg-opacity-95 backdrop-blur-sm border-r border-gray-800 z-50 transform transition-transform duration-300 ${
                isMobileOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <SidebarContent />
            </div>
        </>
    );
};



export default Sidebar;