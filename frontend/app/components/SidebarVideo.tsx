"use client";

import React, { useRef, useState } from 'react';
import { Volume2, VolumeX, Maximize } from 'lucide-react';

interface SidebarVideoProps {
    url: string;
}

const SidebarVideo: React.FC<SidebarVideoProps> = ({ url }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);

    // Force reload when URL changes
    React.useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, [url]);

    const toggleMute = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    const toggleFullscreen = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            } else if ((videoRef.current as any).webkitRequestFullscreen) {
                (videoRef.current as any).webkitRequestFullscreen();
            } else if ((videoRef.current as any).msRequestFullscreen) {
                (videoRef.current as any).msRequestFullscreen();
            }
        }
    };

    return (
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black ring-1 ring-[#0b1f3a]/5 shadow-sm group">
            <video
                ref={videoRef}
                key={url}
                src={url}
                className="w-full h-full object-cover"
                playsInline
                muted={isMuted}
                loop
                autoPlay
            />

            {/* Small Overlay Controls */}
            <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                    onClick={toggleMute}
                    className="p-1.5 bg-black/40 backdrop-blur-md text-white rounded-lg hover:bg-black/60 transition-colors border border-white/10"
                    title={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <button
                    onClick={toggleFullscreen}
                    className="p-1.5 bg-black/40 backdrop-blur-md text-white rounded-lg hover:bg-black/60 transition-colors border border-white/10"
                    title="Maximize"
                >
                    <Maximize size={14} />
                </button>
            </div>
        </div>
    );
};

export default SidebarVideo;
