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
        showLyrics,
        toggleLyrics,
    } = useContext(PlayerContext);

    return track ? (
        <div className='h-[10%] bg-black flex justify-between items-center text-white px-4'>
            {/* Mobile View - Left Side: Song Image and Name */}
            <div className="lg:hidden flex items-center gap-4 flex-shrink-0" style={{ width: '30%' }}>
                <img className='w-12 h-12 rounded-full' src={track.image} alt={track.name} />
                <p className="text-sm truncate">{track.name}</p>
            </div>

            {/* Mobile View - Center: Playback Controls */}
            <div className="lg:hidden flex gap-4 justify-center items-center flex-shrink-0" style={{ width: '40%' }}>
                <img onClick={previous} className="w-6 cursor-pointer" src={assets.prev_icon} alt="Previous" />
                {playStatus
                    ? <img onClick={pause} className="w-6 cursor-pointer" src={assets.pause_icon} alt="Pause" />
                    : <img onClick={play} className="w-6 cursor-pointer" src={assets.play_icon} alt="Play" />
                }
                <img onClick={next} className="w-6 cursor-pointer" src={assets.next_icon} alt="Next" />
            </div>

            {/* Mobile View - Right Side: Volume and Lyrics Button */}
            <div className="lg:hidden flex items-center gap-3 opacity-75 flex-shrink-0" style={{ width: '30%', justifyContent: 'flex-end' }}>
                <img
                    onClick={toggleMute}
                    className="w-5 cursor-pointer"
                    src={volume > 0 ? assets.volume_icon : assets.mute_icon}
                    alt="Volume"
                />
                <img 
                    onClick={toggleLyrics}
                    className="w-5 cursor-pointer" 
                    src={assets.mic_icon} 
                    alt="Lyrics" 
                />
            </div>

            {/* Larger Screen View - No Changes */}
            <div className="hidden lg:flex items-center gap-4">
                <img className='w-12' src={track.image} alt={track.name} />
                <div>
                    <p>{track.name}</p>
                    <p>{track.desc.slice(0, 12)}</p>
                </div>
            </div>

            {/* Larger Screen View - Playback Controls */}
            <div className="hidden lg:flex flex-col items-center justify-center">
                <div className="flex gap-4">
                    <img className="w-4 cursor-pointer" src={assets.shuffle_icon} alt="Shuffle" />
                    <img onClick={previous} className="w-4 cursor-pointer" src={assets.prev_icon} alt="Previous" />
                    {playStatus
                        ? <img onClick={pause} className="w-4 cursor-pointer" src={assets.pause_icon} alt="Pause" />
                        : <img onClick={play} className="w-4 cursor-pointer" src={assets.play_icon} alt="Play" />
                    }
                    <img onClick={next} className="w-4 cursor-pointer" src={assets.next_icon} alt="Next" />
                    <img className="w-4 cursor-pointer" src={assets.loop_icon} alt="Loop" />
                </div>
                <div className="hidden md:flex items-center gap-5 w-full mt-1">
                    <p>{time.currentTime.minute}:{time.currentTime.second}</p>
                    <div 
                        ref={seekBg} 
                        onClick={seekSong} 
                        className="w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer"
                    >
                        <hr ref={seekBar} className='h-1 border-none w-100 bg-green-700 rounded-full' />
                    </div>
                    <p>{time.totalTime.minute}:{time.totalTime.second}</p>
                </div>
            </div>

            {/* Larger Screen View - Volume Controls */}
            <div className="hidden lg:flex items-center gap-2 opacity-75">
                <img className="w-4" src={assets.plays_icon} alt="Plays" />
                <img
                    onClick={toggleLyrics}
                    className="w-4 cursor-pointer"
                    src={assets.mic_icon}
                    alt="Lyrics"
                />
                <img className="w-4" src={assets.queue_icon} alt="Queue" />
                <img className="w-4" src={assets.speaker_icon} alt="Speaker" />
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
                <img className="w-4" src={assets.mini_player_icon} alt="Mini Player" />
                <img className="w-4" src={assets.zoom_icon} alt="Zoom" />
            </div>

            {/* Lyrics Display */}
            {showLyrics && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col justify-start items-center z-50 pt-20">
                    <div className="bg-black p-6 rounded-lg w-[95%] h-[80vh] text-white">
                        <h2 className="text-3xl font-bold mb-6 text-center">Lyrics</h2>
                        <div className="h-[60vh] overflow-y-auto text-2xl">
                            <p className="whitespace-pre-line text-center">{track.lyrics}</p>
                        </div>
                        <button
                            onClick={toggleLyrics}
                            className="mt-6 bg-green-600 text-white px-6 py-3 rounded text-lg block mx-auto"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    ) : null;
};

export default Player;