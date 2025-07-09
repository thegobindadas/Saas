"use client";

import React, { useState, useEffect } from "react";
import { Home, Share2, Upload } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { SidebarItem, UserProfile } from "@/types";


const sidebarItems: SidebarItem[] = [
    { id: "home", href: "/home", label: "Home", icon: Home },
    { id: "social-share", href: "/social-share", label: "Social Share", icon: Share2 },
    { id: "video-upload", href: "/video-upload", label: "Video Upload", icon: Upload },
];



export default function AppLayout({ children }: { children: React.ReactNode }) {

    const { isSignedIn, user, isLoaded } = useUser();
    const { signOut } = useClerk();
    const [userData, setUserData] = useState<UserProfile>({
        name: "",
        firstName: "",
        lastName: "",
        emailAddress: "",
        avatar: "",
    });


    const handleLogout = async () => {
        await signOut();
    };


    useEffect(() => {
        if (user) {
            setUserData({
                name: user.fullName || `${user.firstName} ${user.lastName}` || "User",
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                emailAddress: user?.primaryEmailAddress?.emailAddress || "",
                avatar: user.imageUrl || "https://unsplash.com/photos/a-yellow-sign-with-a-smiley-face-on-it-P4RcBNbRl60",
            })
        }
    }, [user, isLoaded, isSignedIn]);
    

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    if (!isSignedIn) {
        return <div>Sign in to view this page</div>;
    }



    return (
        <div className="bg-black min-h-screen">
            <Header
                user={userData}
                onLogout={handleLogout}
            />

            <Sidebar
                user={userData}
                menuItems={sidebarItems}
            />

            <div className="lg:ml-64 pt-16 min-h-screen bg-black">
                <div className="p-8">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </div>
            </div>

        </div>
    );
}