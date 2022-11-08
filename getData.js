const SpotifyWebApi = require("spotify-web-api-node");
require("dotenv").config();
const token = process.env.TOKEN;

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(token);

function getMyData() {
  (async () => {
    const me = await spotifyApi.getMe();
    const id = me.body.id;
    // console.log(me);
    getMyPlayLists(id)
    return id;
  })().catch((e) => {
    console.error(e);
  });

  async function getMyPlayLists(userId) {
    const data = await spotifyApi.getUserPlaylists(userId);
    const playlists = data.body.items;
    let playlistsAndSongs = []
    for (const lists of playlists) {
      // console.log(lists.id)
      const tracks = await getPlaylistTracks(lists.id, lists.name)
      playlistsAndSongs.push({
        playlistName: lists.name,
        tracks: tracks
      })
    }
    console.log(playlistsAndSongs)
  }

  async function getPlaylistTracks(playlistId, playlistName) {
    const data = await spotifyApi.getPlaylistTracks(playlistId, {
      offset: 1,
      limit: 100,
      fields: "items",
    });
    let tracks = [];
    for (const tracks_obj of data.body.items) {
      tracks.push(tracks_obj.track.name);
    }
    return tracks;
  }
}


getMyData()