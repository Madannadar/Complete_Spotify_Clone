import React, { useState, useEffect } from 'react';

const LyricsPage = () => {
  const [showLyrics, setShowLyrics] = useState(false);
  const [songData, setSongData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Function to fetch song data from database
  const fetchSongData = async (songId) => {
    try {
      setLoading(true);
      // Replace this with your actual API endpoint
      const response = await fetch(`/api/songs/${songId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch song data');
      }
      
      const data = await response.json();
      setSongData(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching song data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Replace with the actual song ID you want to fetch
    // This could come from URL parameters, props, or context
    const songId = "67bd9b4c353410eae0cc5bec";
    fetchSongData(songId);
  }, []);

  const toggleLyrics = () => {
    setShowLyrics(!showLyrics);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-medium text-gray-600">Loading song data...</div>
      </div>
    );
  }

  if (error || !songData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-medium text-red-600">
          Error loading song: {error || "Song not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          <div 
            className="w-full h-64 bg-gray-300 flex items-center justify-center cursor-pointer"
            onClick={toggleLyrics}
          >
            {songData.image ? (
              <img 
                src={songData.image} 
                alt={songData.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src="/api/placeholder/400/320" 
                alt={songData.name} 
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <span className="text-white text-lg font-medium">
                {!showLyrics ? "Click to view lyrics" : "Click to hide lyrics"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">{songData.name}</h2>
            <span className="text-sm text-gray-500">{songData.duration}</span>
          </div>
          <p className="text-gray-600 text-sm mt-1">{songData.album}</p>
          
          {showLyrics && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Lyrics</h3>
              <pre className="whitespace-pre-wrap text-gray-700 font-medium">
                {songData.lyrics}
              </pre>
            </div>
          )}
          
          <div className="mt-4 flex justify-between items-center">
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              onClick={toggleLyrics}
            >
              {showLyrics ? "Hide Lyrics" : "Show Lyrics"}
            </button>
            
            <button className="text-blue-500 hover:text-blue-600">
              Play Song
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LyricsPage;