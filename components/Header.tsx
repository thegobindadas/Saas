"use client";

import React, { useState } from "react";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import BottomGradient from "./ui/BottomGradient";
import { UserProfile } from "@/types";


interface HeaderProps {
    user: UserProfile | null | undefined;
    onLogout: () => void;
}



const Header = ({ user, onLogout }: HeaderProps) => {
    
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const router = useRouter();
    
    
    const handleLogout = () => {
        setShowDropdown(false);
        onLogout();
    };


    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };



    return (
        <header className="bg-black bg-opacity-50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side - Logo */}
                    <div className="flex-shrink-0">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">V</span>
                            </div>
                            <div className="ml-3">
                                <h1 className="text-xl font-bold text-white">VideoHub</h1>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Auth buttons or Profile */}
                    <div className="flex items-center space-x-4">
                        {!user ? (
                            <>
                                {/* Login Button */}
                                <button
                                    onClick={() => router.push("/sign-in")}
                                    className="text-gray-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg"
                                >
                                    Login
                                </button>
                                
                                {/* Signup Button */}
                                <button
                                    onClick={() => router.push("/sign-up")}
                                    className="relative group/btn bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                                >
                                    Sign Up
                                    <BottomGradient />
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={toggleDropdown}
                                        className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg p-2"
                                    >
                                        <img
                                            className="h-8 w-8 rounded-full object-cover border-2 border-gray-600"
                                            src={user.avatar}
                                            alt={user.name}
                                        />
                                        <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showDropdown && (
                                        <div className="absolute right-0 mt-2 w-56 bg-gray-900 bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-800 py-1">
                                            {/* User Info */}
                                            <div className="px-4 py-3 border-b border-gray-800">
                                                <div className="flex items-center space-x-3">
                                                    <img
                                                        className="h-10 w-10 rounded-full object-cover"
                                                        src={user.avatar}
                                                        alt={user.name}
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium text-white">{user.name}</p>
                                                        <p className="text-xs text-gray-400">{user.emailAddress}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-1">
                                                <button
                                                    onClick={() => {
                                                        setShowDropdown(false);
                                                        router.push("/profile");
                                                    }}
                                                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 w-full text-left transition-colors duration-200"
                                                >
                                                    <User className="h-4 w-4" />
                                                    <span>Profile</span>
                                                </button>
                                                
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 w-full text-left transition-colors duration-200"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    <span>Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};



export default Header;