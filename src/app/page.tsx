'use client';

import { useContext, useState } from "react";
import { HomeContext } from "./context/HomeContext";
import { FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import videos, { Video } from './data/video';
import { convertTimeToString } from "./utils/Utils";

export default function Home() {
  const {
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
    configFilter,
    toggleMute,
    updateVolume
  } = useContext(HomeContext);

  const [showFilter, setShowFilter] = useState(true);

  return (
    <main className="flex bg-[#121212] text-white min-h-screen">
      {/* Seção de Controle de Vídeo */}
      <div className="w-3/4 p-6 flex flex-col items-center">
        <video className="w-full rounded-lg mb-4" ref={videoRef} src={videoURL} hidden={showFilter}></video>
        <canvas className="w-full h-[400px] rounded-lg mb-4" ref={canvasRef} hidden={!showFilter}></canvas>

        <div className="bg-[#1f1f1f] w-full p-4 rounded-lg flex items-center justify-between mt-2 shadow-lg">
          <button onClick={playPause} className="text-white text-2xl hover:text-[#0d6efd] transition-colors">
            {playing ? <FaPause /> : <FaPlay />}
          </button>

          <input
            type="range"
            min={0}
            max={totalTime}
            value={currentTime}
            onChange={(e) => configCurrentTime(Number(e.target.value))}
            className="w-1/2 h-1 bg-[#0d6efd] appearance-none rounded-md"
          />

          <span className="text-sm font-mono">{convertTimeToString(currentTime)} / {convertTimeToString(totalTime)}</span>

          <button onClick={toggleMute} className="text-white text-2xl ml-4 hover:text-[#0d6efd] transition-colors">
            {muted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={volume}
            onChange={(e) => updateVolume(Number(e.target.value))}
            className="w-24 h-1 bg-[#0d6efd] appearance-none rounded-md"
          />

          <select
            onChange={(e) => configFilter(Number(e.target.value))}
            className="bg-[#333] border-none text-white p-1 rounded-lg ml-4"
          >
            <option value={0}>Sem filtro</option>
            <option value={1}>Verde</option>
            <option value={2}>Azul</option>
            <option value={3}>Vermelho</option>
            <option value={4}>Preto e branco</option>
          </select>

          <label className="flex items-center ml-4">
            <input
              type="checkbox"
              checked={!showFilter}
              onChange={() => setShowFilter(!showFilter)}
              className="mr-2"
            />
            Mostrar vídeo
          </label>
        </div>
      </div>

      {/* Barra Lateral de Lista de Vídeos */}
      <aside className="w-1/4 bg-[#1a1a1a] p-6 overflow-y-auto shadow-lg border-l border-[#333]">
        <h2 className="text-lg font-semibold mb-4 text-center">Lista de Vídeos</h2>
        {videos.map((video: Video, index) => (
          <div
            key={index}
            className="mb-4 cursor-pointer bg-[#2a2a2a] p-2 rounded-lg hover:bg-[#333] transition-colors shadow-md"
            onClick={() => configVideo(index)}
          >
            <img
              src={`/${video.imageURL}`}
              alt={video.description}
              className="w-full h-32 object-cover rounded-lg mb-2"
            />
            <p className="text-center text-sm font-light">{video.description}</p>
          </div>
        ))}
      </aside>
    </main>
  );
}
