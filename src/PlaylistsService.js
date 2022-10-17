const { Pool } = require('pg');
const { mapDBToModelPlaylistSongs } = require('./utils');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylists(playlistsId, userId) {
    const queryPlaylist = {
      text: `SELECT playlists.id, playlists.name 
      FROM playlists 
      INNER JOIN users 
      ON playlists.owner=users.id
      LEFT JOIN collaborations
      ON collaborations.playlist_id = playlists.id
      WHERE playlists.id = $2
      AND playlists.owner = $1
      OR collaborations.user_id = $1
      GROUP BY playlists.id`,
      values: [userId, playlistsId],
    };

    const resultPlaylist = await this._pool.query(queryPlaylist);

    const querySongs = {
      text: `SELECT songs.id as song_id, songs.title, songs.performer
      FROM playlists
      INNER JOIN users
      ON playlists.owner = users.id
      JOIN playlist_songs
      ON playlists.id = playlist_songs.playlist_id
      JOIN songs
      ON playlist_songs.song_id = songs.id
      LEFT JOIN collaborations
      ON collaborations.playlist_id = playlists.id
      WHERE playlists.id = $2
      AND playlists.owner = $1
      OR collaborations.user_id = $1`,
      values: [userId, playlistsId],
    };

    const resultSongs = await this._pool.query(querySongs);

    return mapDBToModelPlaylistSongs(resultPlaylist.rows, resultSongs.rows);
  }
}

module.exports = PlaylistsService;
