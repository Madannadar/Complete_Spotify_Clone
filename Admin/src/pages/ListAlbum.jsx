import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { url } from '../App';
import { toast } from 'react-toastify';

const ListAlbum = () => {
  const [data, setData] = useState([]);

  const fetchAlbum = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);

      if (response.data.success) {
        setData(response.data.albums);
      }
    } catch (error) {
      toast.error('Error fetching album');
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAlbum();
  }, []);

  const deleteAlbum = async (id) => {
    try {
      const response = await axios.post(`${url}/api/album/remove`, { id });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchAlbum();
      }
    } catch (error) {
      toast.error('Error removing album');
    }
  };

  return (
    <div className="p-4">
      <p className="text-lg font-semibold mb-4">All Album List</p>
      <div>
        {/* Header */}
        <div className="hidden sm:grid grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm bg-gray-100 font-bold">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Background Colour</b>
          <b>Action</b>
        </div>

        {/* Data Rows */}
        {data.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm"
          >
            <img className="w-12 h-12 object-cover" src={item.image} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.desc}</p>

            {/* Show the actual color */}
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full border border-gray-400"
                style={{ backgroundColor: item.bgColour }}
              ></div>
              <span className="text-gray-600">{item.bgColour}</span> {/* Optional: Show the color code */}
            </div>

            <button onClick={() => deleteAlbum(item._id)} className="text-red-500 hover:text-red-700 font-semibold">
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListAlbum;
