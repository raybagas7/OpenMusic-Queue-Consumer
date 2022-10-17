const mapDBToModelPlaylistSongs = (playlist_data, playlist_songs) => {
  const result = {
    playlist: {
      ...playlist_data[0],
      songs: playlist_songs.map((song) => ({
        id: song.song_id,
        title: song.title,
        performer: song.performer,
      })),
    },
  };

  return result;
};

module.exports = { mapDBToModelPlaylistSongs };
