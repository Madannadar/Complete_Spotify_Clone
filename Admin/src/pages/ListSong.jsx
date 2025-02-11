import React, { useEffect, useState } from 'react';
import { url } from '../App';
import { toast } from 'react-toastify';
import axios from 'axios';

const ListSong = () => {
  const [data, setData] = useState([]);

  const fetchSongs = async () => {
    try {
      const response = await axios.get(`${url}/api/song/list`);
      if (response.data.success) {
        setData(response.data.songs);
      }
    } catch (error) {
      toast.error('Error fetching songs');
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const removeSong = async (id) => {
    try {
      const response = await axios.post(`${url}/api/song/remove`, { id });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchSongs(); // reload after deleting the song
      }
    } catch (error) {
      toast.error('Error while deleting song');
    }
  };

  return (
    <div className="p-4">
      <p className="text-lg font-semibold mb-4">All Songs List</p>
      <div>
        {/* Header Row */}
        <div className="hidden sm:grid grid-cols-[0.5fr_1fr_2fr_1fr_2fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm bg-gray-100 font-bold">
          <b>Image</b>
          <b>Name</b>
          <b>Album</b>
          <b>Duration</b>
          {/* <b>Lyrics</b> */}
          <b>Action</b>
        </div>

        {/* Data Rows */}
        {data.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[0.5fr_1fr_2fr_1fr_2fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm"
          >
            <img className="w-12 h-12 object-cover" src={item.image} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.album}</p>
            <p>{item.duration}</p>
            {/* <p className="truncate max-w-xs" title={item.lyrics}>{item.lyrics}</p> */}
            <button onClick={() => removeSong(item._id)} className="text-red-500 hover:text-red-700 font-semibold cursor-pointer">X</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListSong;
