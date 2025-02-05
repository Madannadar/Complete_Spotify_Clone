// modified the page so the image of all the album is uniform 
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AlbumItem = ({ image, name, desc, id }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/album/${id}`)}
      className="min-w-[180px] p-2 px-3 rounded-lg cursor-pointer hover:bg-[#ffffff26] transition-all duration-300"
    >
      <img 
        className="w-40 h-40 object-cover rounded-lg shadow-lg border border-gray-300" 
        src={image} 
        alt={name} 
      />
      <p className="font-bold mt-2 mb-1">{name}</p>
      <p className="text-slate-400 text-sm truncate w-40">{desc}</p>
    </div>
  );
};

export default AlbumItem;
