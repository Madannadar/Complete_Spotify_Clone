import { createContext, useEffect, useRef, useState } from "react";
// import { songsData } from "../assets/frontend-assets/assets";
// go to time 130 to 150 to understand play and pause function
export const PlayerContext = createContext();
import axios from 'axios'

const PlayerContextProvider = (props) => {
    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();

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
        // if (track.id < songsData.length-1) {
        //     await setTrack(songsData[track.id+1]);
        //     await audioRef.current.play()
        //     setplayStatus(true);
        // }
        songsData.map(async (item, index) => {
            if (track._id === item._id && index < songsData.length) {
                await setTrack(songsData[index + 1]);
                await audioRef.current.play();
                setplayStatus(true);
            }
        })
    }

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
            
        }
    }

    const getAlbumsData = async () => {
        try {
            const response = await axios.get(`${url}/api/album/list`);
            setAlbumsData(response.data.albums);
            setTrack(response.data.albums[0]);

        } catch (error) {
            
        }
    }

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
        albumsData
    }

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    )
}

export default PlayerContextProvider;