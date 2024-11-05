// src/app/context/HomeContext.tsx
"use client";

import { ReactNode, RefObject, createContext, useEffect, useRef, useState } from "react";
import videos, { Video } from "../data/video";
import { Filter, filters } from "../data/Filter";

type HomeContextData = {
    videoURL: string;
    playing: boolean;
    totalTime: number;
    currentTime: number;
    muted: boolean;
    volume: number;
    videoRef: RefObject<HTMLVideoElement>;
    canvasRef: RefObject<HTMLCanvasElement>;
    playPause: () => void;
    configCurrentTime: (time: number) => void;
    configVideo: (index: number) => void;
    configFilter: (index: number) => void;
    toggleMute: () => void;
    updateVolume: (value: number) => void;
}

export const HomeContext = createContext({} as HomeContextData);

const HomeContextProvider = ({ children }: { children: ReactNode }) => {
    const [videoURL, setVideoURL] = useState("");
    const [videoIndex, setVideoIndex] = useState(0);
    const [filterIndex, setFilterIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [totalTime, setTotalTime] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [muted, setMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        configVideo(videoIndex);
    }, []);

    const configVideo = (index: number) => {
        const currentIndex = index % videos.length;
        const currentVideo: Video = videos[currentIndex];
        setVideoURL(currentVideo.videoURL);
        setVideoIndex(currentIndex);
    }

    const configCurrentTime = (time: number) => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = time;
        setCurrentTime(time);
    }

    const playPause = () => {
        const video = videoRef.current;
        if (!video) return;
        playing ? video.pause() : video.play();
        setPlaying(!playing);
    }

    const toggleMute = () => {
        const video = videoRef.current;
        if (video) video.muted = !muted;
        setMuted(!muted);
    }

    const updateVolume = (value: number) => {  // Renomeado para updateVolume
        const video = videoRef.current;
        if (video) video.volume = value;
        setVolume(value);
    }

    const draw = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const filter: Filter = filters[filterIndex];

        for (let i = 0; i < data.length; i += 4) {
            const red = data[i];
            const green = data[i + 1];
            const blue = data[i + 2];

            filter.calc(red, green, blue);
            data[i] = filter.red;
            data[i + 1] = filter.green;
            data[i + 2] = filter.blue;
        }

        context.putImageData(imageData, 0, 0);
        requestAnimationFrame(draw);
    };

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.onloadedmetadata = () => {
                setTotalTime(video.duration);
                setCurrentTime(video.currentTime);

                if (playing) {
                    video.play();
                }
            };

            video.ontimeupdate = () => {
                setCurrentTime(video.currentTime);
            };

            video.onended = () => {
                configVideo(videoIndex + 1);
            }
        }
        draw();
    }, [videoURL, filterIndex]);

    return (
        <HomeContext.Provider value={{
            videoURL,
            playing,
            totalTime,
            currentTime,
            muted,
            volume,
            videoRef,
            canvasRef,
            playPause,
            configCurrentTime,
            configVideo,
            configFilter: (index: number) => setFilterIndex(index),
            toggleMute,
            updateVolume
        }}>
            {children}
        </HomeContext.Provider>
    );
};

export default HomeContextProvider;
