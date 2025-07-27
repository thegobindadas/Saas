"use client";

import React from "react";
import { Home as HomeIcon, Share2, Upload } from "lucide-react";



function Home() {
    return (
        
        <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Welcome to VideoHub</h2>
            <p className="text-gray-400 text-lg mb-8">
                Discover, share, and upload amazing videos with our community
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                    <HomeIcon className="h-8 w-8 text-cyan-400 mb-4 mx-auto" />
                    <h3 className="text-white font-semibold mb-2">Discover</h3>
                    <p className="text-gray-400 text-sm">Explore trending videos and content</p>
                </div>
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                    <Share2 className="h-8 w-8 text-cyan-400 mb-4 mx-auto" />
                    <h3 className="text-white font-semibold mb-2">Share</h3>
                    <p className="text-gray-400 text-sm">Share your favorite videos with friends</p>
                </div>
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                    <Upload className="h-8 w-8 text-cyan-400 mb-4 mx-auto" />
                    <h3 className="text-white font-semibold mb-2">Upload</h3>
                    <p className="text-gray-400 text-sm">Share your own video content</p>
                </div>
            </div>
        </div>
    )
}



export default Home