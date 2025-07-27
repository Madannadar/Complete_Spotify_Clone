import React, { useContext } from 'react';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import Display from './components/Display';
// import LyricsPage from './components/LyricsPage'
import { PlayerContext } from './context/PlayerContext';

const App = () => {
  const { audioRef, track, songsData } = useContext(PlayerContext);

  return (
    <div className='h-screen bg-black'>
      {
        songsData.length !== 0
          ? <>
              <div className='h-[90%] flex'>
                <Sidebar />
                <Display />
              </div>
              <Player />
              {/* <LyricsPage /> */}
            </>
          : (
              <div className="h-full flex flex-col justify-center items-center text-white">
                <div className="loader mb-4"></div>
                <p>Loading songs...</p>
              </div>
            )
      }

      <audio ref={audioRef} src={track ? track.file : ""} preload='auto'></audio>
    </div>
  );
};

export default App;
