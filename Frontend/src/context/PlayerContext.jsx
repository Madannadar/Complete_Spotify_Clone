import { createContext, useEffect, useRef, useState } from "react";
import axios from 'axios';

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();

    const [showLyrics, setShowLyrics] = useState(false);
    const [volume, setVolume] = useState(1);
    const [repeatMode, setRepeatMode] = useState('no-repeat');
    const [isLoading, setIsLoading] = useState(false);

    const url = 'https://spotify-backend-1q7d.onrender.com';
    const [songsData, setSongData] = useState([]);
    const [albumsData, setAlbumsData] = useState([]);
    const [track, setTrack] = useState(null);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: { second: 0, minute: 0 },
        totalTime: { second: 0, minute: 0 }
    });

    const play = () => {
        if (audioRef.current && track) {
            audioRef.current.play()
                .then(() => {
                    setPlayStatus(true);
                })
                .catch(err => {
                    console.error("Error playing audio:", err);
                    setPlayStatus(false);
                });
        }
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setPlayStatus(false);
        }
    };

    const playwithId = async (id, albumName = null) => {
        try {
            setIsLoading(true);
            const song = songsData.find(item => item._id === id);
            if (song) {
                setTrack(song);
                
                // Update current album if specified or detect from song
                if (albumName) {
                    setCurrentAlbum(albumName);
                } else if (song.album) {
                    setCurrentAlbum(song.album);
                } else {
                    setCurrentAlbum(null); // Reset if no album
                }
                
                // The audio will start playing after the track is set due to useEffect
            }
        } catch (error) {
            console.error("Error playing track:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Track if currently playing songs from a specific album
    const [currentAlbum, setCurrentAlbum] = useState(null);
    
    // Get songs from a specific album
    const getAlbumSongs = (albumName) => {
        return songsData.filter(song => song.album === albumName);
    };
    
    const previous = async () => {
        try {
            setIsLoading(true);
            if (!track || songsData.length === 0) return;
            
            // Check if playing from an album
            if (currentAlbum) {
                const albumSongs = getAlbumSongs(currentAlbum);
                const currentIndexInAlbum = albumSongs.findIndex(item => item._id === track._id);
                
                if (currentIndexInAlbum > 0) {
                    // Play previous song in album
                    setTrack(albumSongs[currentIndexInAlbum - 1]);
                } else if (repeatMode === 'repeat-all' && albumSongs.length > 0) {
                    // If first song in album and repeat-all, go to last song
                    setTrack(albumSongs[albumSongs.length - 1]);
                }
            } else {
                // Playing from general song list
                const currentIndex = songsData.findIndex(item => item._id === track._id);
                if (currentIndex > 0) {
                    setTrack(songsData[currentIndex - 1]);
                } else if (repeatMode === 'repeat-all' && songsData.length > 0) {
                    // If first song and repeat-all, go to last song
                    setTrack(songsData[songsData.length - 1]);
                }
            }
        } catch (error) {
            console.error("Error playing previous track:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const next = async () => {
        try {
            setIsLoading(true);
            if (!track || songsData.length === 0) return;
            
            // Check if playing from an album
            if (currentAlbum) {
                const albumSongs = getAlbumSongs(currentAlbum);
                const currentIndexInAlbum = albumSongs.findIndex(item => item._id === track._id);
                
                if (currentIndexInAlbum < albumSongs.length - 1) {
                    // Play next song in album
                    setTrack(albumSongs[currentIndexInAlbum + 1]);
                } else if (repeatMode === 'repeat-all' && albumSongs.length > 0) {
                    // If last song in album and repeat-all, go to first song
                    setTrack(albumSongs[0]);
                } else if (repeatMode === 'no-repeat') {
                    // If last song in album and no-repeat, stop or continue to next album?
                    // For now, we'll just stop playing
                    setPlayStatus(false);
                }
            } else {
                // Playing from general song list
                const currentIndex = songsData.findIndex(item => item._id === track._id);
                const nextIndex = (currentIndex + 1) % songsData.length;
                
                if (currentIndex < songsData.length - 1 || repeatMode === 'repeat-all') {
                    setTrack(songsData[nextIndex]);
                } else if (repeatMode === 'no-repeat') {
                    // If last song and no-repeat, stop playing
                    setPlayStatus(false);
                }
            }
        } catch (error) {
            console.error("Error playing next track:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleLyrics = () => {
        setShowLyrics(!showLyrics);
    };

    const seekSong = (e) => {
        if (audioRef.current && seekBg.current) {
            const newTime = (e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
        }
    };

    const getSongsData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${url}/api/song/list`);
            if (response.data && response.data.songs && response.data.songs.length > 0) {
                setSongData(response.data.songs);
                setTrack(response.data.songs[0]);
            }
        } catch (error) {
            console.error("Error fetching songs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getAlbumsData = async () => {
        try {
            const response = await axios.get(`${url}/api/album/list`);
            if (response.data && response.data.albums) {
                setAlbumsData(response.data.albums);
            }
        } catch (error) {
            console.error("Error fetching albums:", error);
        }
    };

    const adjustVolume = (newVolume) => {
        // Ensure volume is between 0 and 1
        const boundedVolume = Math.max(0, Math.min(1, newVolume));
        setVolume(boundedVolume);
        if (audioRef.current) {
            audioRef.current.volume = boundedVolume;
        }
    };

    const increaseVolume = () => {
        adjustVolume(volume + 0.1);
    };

    const decreaseVolume = () => {
        adjustVolume(volume - 0.1);
    };

    const toggleMute = () => {
        if (volume > 0) {
            // Store current volume before muting
            audioRef.current._previousVolume = volume;
            adjustVolume(0);
        } else {
            // Restore previous volume or default to 1
            adjustVolume(audioRef.current._previousVolume || 1);
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
            // Restart the same song
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play()
                    .then(() => setPlayStatus(true))
                    .catch(err => console.error("Error repeating track:", err));
            }
        } else if (repeatMode === 'repeat-all' || repeatMode === 'no-repeat') {
            // Play the next song in both repeat-all and no-repeat modes
            // For no-repeat, this will naturally stop at the end of the playlist
            next();
        }
    };

    // Effect to play audio when track changes
    useEffect(() => {
        if (track && audioRef.current) {
            // Reset audio element and play new track
            audioRef.current.currentTime = 0;
            
            // Only attempt to play if we want playback to continue
            if (playStatus) {
                audioRef.current.play()
                    .then(() => setPlayStatus(true))
                    .catch(err => {
                        console.error("Error playing new track:", err);
                        setPlayStatus(false);
                    });
            }
            
            // Check and update currentAlbum when track changes
            if (track.album && (!currentAlbum || track.album !== currentAlbum)) {
                setCurrentAlbum(track.album);
            }
        }
    }, [track]);

    // Effect to handle time updates and song ending
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            if (seekBar.current && !isNaN(audio.duration)) {
                const percentage = Math.floor((audio.currentTime / audio.duration) * 100);
                seekBar.current.style.width = `${percentage}%`;
                
                setTime({
                    currentTime: {
                        second: Math.floor(audio.currentTime % 60),
                        minute: Math.floor(audio.currentTime / 60)
                    },
                    totalTime: {
                        second: Math.floor(audio.duration % 60) || 0,
                        minute: Math.floor(audio.duration / 60) || 0
                    }
                });
            }
        };

        const handleAudioLoaded = () => {
            // Update total time when audio metadata is loaded
            setTime(prev => ({
                ...prev,
                totalTime: {
                    second: Math.floor(audio.duration % 60) || 0,
                    minute: Math.floor(audio.duration / 60) || 0
                }
            }));
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleSongEnd);
        audio.addEventListener('loadedmetadata', handleAudioLoaded);
        
        // Set initial volume
        audio.volume = volume;

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleSongEnd);
            audio.removeEventListener('loadedmetadata', handleAudioLoaded);
        };
    }, [track, repeatMode]);

    // Initial data loading
    useEffect(() => {
        getSongsData();
        getAlbumsData();
    }, []);

    // Function to play a specific album
    const playAlbum = async (albumName, startIndex = 0) => {
        try {
            setIsLoading(true);
            const albumSongs = getAlbumSongs(albumName);
            
            if (albumSongs.length > 0) {
                // Set current album for context-aware navigation
                setCurrentAlbum(albumName);
                
                // Start playing from the specified index (default: first song)
                const validIndex = Math.min(startIndex, albumSongs.length - 1);
                setTrack(albumSongs[validIndex]);
            } else {
                console.warn(`No songs found for album: ${albumName}`);
            }
        } catch (error) {
            console.error("Error playing album:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const contextValue = {
        audioRef,
        seekBar,
        seekBg,
        track,
        setTrack,
        playStatus,
        setPlayStatus,
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
        repeatMode,
        toggleRepeat,
        isLoading,
        currentAlbum,
        setCurrentAlbum,
        playAlbum,
        getAlbumSongs,
    };

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;