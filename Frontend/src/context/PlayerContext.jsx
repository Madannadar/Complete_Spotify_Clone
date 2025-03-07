import { createContext, useEffect, useRef, useState } from "react";
// import { songsData } from "../assets/frontend-assets/assets";
// go to time 130 to 150 to understand play and pause function
export const PlayerContext = createContext();
import axios from 'axios'

const PlayerContextProvider = (props) => {
    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();
    const [showLyrics, setShowLyrics] = useState(false); 
    const [volume, setVolume] = useState(1); // Volume state (0 to 1)

    const url = 'https://spotify-backend-1q7d.onrender.com';

    const [songsData, setSongData] = useState([]);
    const [albumsData, setAlbumsData] = useState([]);
    const [track, setTrack] = useState(songsData[0]) // default track when we load the site
    const [playStatus, setplayStatus] = useState(false)
    const [time, setTime] = useState({
        currentTime: {
            second: 0,
            minute: 0
        },
        totalTime:{
            second: 0,
            minute: 0
        }
    })

    const play = () => {
        audioRef.current.play();
        setplayStatus(true)
    }

    const pause = () => {
        audioRef.current.pause();
        setplayStatus(false);
    }

    const playwithId = async (id) => {
        // await setTrack(songsData[id]);
        // await audioRef.current.play();
        // setplayStatus(true);
        await songsData.map((item) => {
            if (id === item._id){
                setTrack(item);
            }
        })
        await audioRef.current.play();
        setplayStatus(true);
    }

    const previous = async () => {
        // if (track.id > 0) {
        //     await setTrack(songsData[track.id-1]);
        //     await audioRef.current.play()
        //     setplayStatus(true);
        songsData.map(async (item, index) => {
            if (track._id === item._id && index > 0) {
                await setTrack(songsData[index - 1]);
                await audioRef.current.play();
                setplayStatus(true);
            }
        })
    }
    
    const next = async () => {
        const currentIndex = songsData.findIndex((item) => item._id === track._id);
    
        if (currentIndex === songsData.length - 1) {
            // If the current track is the last one, play the first song
            await setTrack(songsData[0]);
        } else {
            // Otherwise, play the next song
            await setTrack(songsData[currentIndex + 1]);
        }
    
        await audioRef.current.play();
        setplayStatus(true);
    };
        
    const toggleLyrics = () => {
        setShowLyrics(!showLyrics);
    };

    const seekSong = async (e) => {
        // console.log(e); // nativeEvent.offsetX gives the location on where we click on the seekbar
        audioRef.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth)*audioRef.current.duration)
        console.log(audioRef.current.currentTime);
    }

    const getSongsData = async () => {
        try {
            const response = await axios.get(`${url}/api/song/list`);
            setSongData(response.data.songs);
            setTrack(response.data.songs[0]);
        } catch (error) {
            console.error("Error fetching songs:", error);
        }
    }

    const getAlbumsData = async () => {
        try {
            const response = await axios.get(`${url}/api/album/list`);
            setAlbumsData(response.data.albums);
        } catch (error) {
            console.error("Error fetching albums:", error);
        }
    }

    const increaseVolume = () => {
        const newVolume = Math.min(volume + 0.1, 1); // Increase volume by 0.1, max 1
        setVolume(newVolume);
        audioRef.current.volume = newVolume;
    };

    const decreaseVolume = () => {
        const newVolume = Math.max(volume - 0.1, 0); // Decrease volume by 0.1, min 0
        setVolume(newVolume);
        audioRef.current.volume = newVolume;
    };

    const toggleMute = () => {
        if (volume > 0) {
            setVolume(0); // Mute
            audioRef.current.volume = 0;
        } else {
            setVolume(1); // Unmute
            audioRef.current.volume = 1;
        }
    };

    const toggleRepeat = () => {
        const modes = ['no-repeat', 'repeat-one', 'repeat-all'];
        const currentIndex = modes.indexOf(repeatMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        setRepeatMode(modes[nextIndex]);
    };

    const handleSongEnd = () => {
        if (repeatMode === 'repeat-one') {
            audioRef.current.currentTime = 0; // Restart the same song
            audioRef.current.play();
        } else if (repeatMode === 'repeat-all') {
            next(); // Play the next song
        }
    };

    useEffect(() => {
        setTimeout(() => {
            audioRef.current.ontimeupdate = () => {
                seekBar.current.style.width = (Math.floor(audioRef.current.currentTime/audioRef.current.duration*100))+"%"
                setTime({
                    currentTime: {
                        second: Math.floor(audioRef.current.currentTime%60), // %60 for second
                        minute: Math.floor(audioRef.current.currentTime/60) // /60 for minute
                    },
                    totalTime:{
                        second: Math.floor(audioRef.current.duration %60),
                        minute: Math.floor(audioRef.current.duration / 60)
                    }
                })
            }
        }, 1000);
    },[audioRef])

    useEffect( () => {
        getSongsData();
        getAlbumsData();
    },[])

    const contextValue = {
        audioRef,
        seekBar,
        seekBg,
        track,
        setTrack,
        playStatus,
        setplayStatus,
        time,
        setTime,
        play,
        pause,
        playwithId,
        previous,
        next,
        seekSong,
        songsData,
        albumsData,
        showLyrics,
        toggleLyrics,
        volume,
        increaseVolume,
        decreaseVolume,
        toggleMute,
    }

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    )
}

export default PlayerContextProvider;