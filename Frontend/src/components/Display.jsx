import React, { useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import DisplayHome from './DisplayHome'
import DisplayAlbum from './DisplayAlbum'
import { albumsData } from '../assets/frontend-assets/assets'

const Display = () => {

    const displayRef = useRef() // to get the reference of the bg color of the album
    const location = useLocation() // will give the url 
    // console.log(location);
    const isAlbum = location.pathname.includes("album") // return bool by seeing the url
    // console.log(isAlbum);
    const albumId = isAlbum ? location.pathname.slice(-1) : ""
    // console.log(albumId);
    const bgColor = albumsData[Number(albumId)].bgColor;   // in bg the album id ie string will be converted to number
    // console.log(bgColor);
    useEffect(()=> {
        if (isAlbum) {
            displayRef.current.style.background = `linear-gradient(${bgColor},#121212)` // giving gab in between the templete literele wont work
        }
        else{
             displayRef.current.style.background = `#121212`
        }
    })

  return (
    <div ref={displayRef} className='w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg: ml-0'>
        <Routes>
            <Route path='/' element={<DisplayHome/>} />
            <Route path='/album/:id' element={<DisplayAlbum/>} />
        </Routes>
    </div>
  )
}

export default Display