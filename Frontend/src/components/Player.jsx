import React, { useContext } from 'react';
import { assets } from '../assets/frontend-assets/assets';
import { PlayerContext } from '../context/PlayerContext';

const Player = () => {
    const {
        track,
        seekBar,
        seekBg,
        playStatus,
        play,
        pause,
        time,
        previous,
        next,
        seekSong,
        volume,
        handleVolumeChange,
        toggleMute,
    } = useContext(PlayerContext);

    return track ? (
        <div className='h-[10%] bg-black flex justify-between items-center text-white px-4'>
            {/* Left Section - Track Info (Hidden on Mobile) */}
            <div className="hidden lg:flex items-center gap-4">
                <img className='w-12' src={track.image} alt="" />
                <div>
                    <p>{track.name}</p>
                    <p>{track.desc.slice(0, 12)}</p>
                </div>
            </div>

            {/* Center Section - Playback Controls */}
            <div className="flex flex-col items-center gap-1m-auto">
                <div className="flex gap-4">
                    <img className="w-4 cursor-pointer" src={assets.shuffle_icon} alt="" />
                    <img onClick={previous} className="w-4 cursor-pointer" src={assets.prev_icon} alt="" />
                    {playStatus
                        ? <img onClick={pause} className="w-4 cursor-pointer" src={assets.pause_icon} alt="" />
                        : <img onClick={play} className="w-4 cursor-pointer" src={assets.play_icon} alt="" />
                    }
                    <img onClick={next} className="w-4 cursor-pointer" src={assets.next_icon} alt="" />
                    <img className="w-4 cursor-pointer" src={assets.loop_icon} alt="" />
                </div>
                <div className="flex items-center gap-5">
                    <p>{time.currentTime.minute}:{time.currentTime.second}</p>
                    <div ref={seekBg} onClick={seekSong} className="w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer">
                        <hr ref={seekBar} className='h-1 border-none w-100 bg-green-700 rounded-full' />
                    </div>
                    <p>{time.totalTime.minute}:{time.totalTime.second}</p>
                </div>
            </div>

            {/* Right Section - Volume Controls (Hidden on Mobile by Default) */}
            <div className="hidden lg:flex items-center gap-2 opacity-75">
                <img className="w-4" src={assets.plays_icon} alt="" />
                <img className="w-4" src={assets.mic_icon} alt="" />
                <img className="w-4" src={assets.queue_icon} alt="" />
                <img className="w-4" src={assets.speaker_icon} alt="" />
                <div className="flex items-center gap-2">
                    <img
                        onClick={toggleMute}
                        className="w-4 cursor-pointer"
                        src={volume > 0 ? assets.volume_icon : assets.mute_icon}
                        alt="Volume"
                    />
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => handleVolumeChange(e.target.value)}
                        className="w-20 h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, green ${volume * 100}%, gray ${volume * 100}%)`,
                        }}
                    />
                </div>
                <img className="w-4" src={assets.mini_player_icon} alt="" />
                <img className="w-4" src={assets.zoom_icon} alt="" />
            </div>

            {/* Mobile-Only Volume Controls */}
            <div className="lg:hidden flex items-center gap-2 opacity-75">
                <div className="flex items-center gap-2">
                    <img
                        onClick={toggleMute}
                        className="w-4 cursor-pointer"
                        src={volume > 0 ? assets.volume_icon : assets.mute_icon}
                        alt="Volume"
                    />
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => handleVolumeChange(e.target.value)}
                        className="w-20 h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, green ${volume * 100}%, gray ${volume * 100}%)`,
                        }}
                    />
                </div>
            </div>
        </div>
    ) : null;
};

export default Player;