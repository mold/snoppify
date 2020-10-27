/** Declaration file generated by dts-gen */

export = spotify_web_api_node;

declare class spotify_web_api_node {
    constructor(credentials: any);

    addToMySavedAlbums(albumIds: any, callback: any): any;

    addToMySavedShows(showIds: any, callback: any): any;

    addToMySavedTracks(trackIds: any, callback: any): any;

    addToQueue(uri: any, options: any, callback: any): any;

    addTracksToPlaylist(playlistId: any, tracks: any, options: any, callback: any): any;

    areFollowingPlaylist(userId: any, playlistId: any, followerIds: any, callback: any): any;

    authorizationCodeGrant(code: any, callback: any): any;

    changePlaylistDetails(playlistId: any, options: any, callback: any): any;

    clientCredentialsGrant(callback: any): any;

    containsMySavedAlbums(albumIds: any, callback: any): any;

    containsMySavedShows(showIds: any, callback: any): any;

    containsMySavedTracks(trackIds: any, callback: any): any;

    createAuthorizeURL(scopes: any, state: any, showDialog: any, responseType: any): any;

    createPlaylist(name: any, options: any, callback: any): any;

    followArtists(artistIds: any, callback: any): any;

    followPlaylist(playlistId: any, options: any, callback: any): any;

    followUsers(userIds: any, callback: any): any;

    getAccessToken(): any;

    getAlbum(albumId: any, options: any, callback: any): any;

    getAlbumTracks(albumId: any, options: any, callback: any): any;

    getAlbums(albumIds: any, options: any, callback: any): any;

    getArtist(artistId: any, callback: any): any;

    getArtistAlbums(artistId: any, options: any, callback: any): any;

    getArtistRelatedArtists(artistId: any, callback: any): any;

    getArtistTopTracks(artistId: any, country: any, callback: any): any;

    getArtists(artistIds: any, callback: any): any;

    getAudioAnalysisForTrack(trackId: any, callback: any): any;

    getAudioFeaturesForTrack(trackId: any, callback: any): any;

    getAudioFeaturesForTracks(trackIds: any, callback: any): any;

    getAvailableGenreSeeds(callback: any): any;

    getCategories(options: any, callback: any): any;

    getCategory(categoryId: any, options: any, callback: any): any;

    getClientId(): any;

    getClientSecret(): any;

    getCredentials(): any;

    getEpisode(episodeId: any, options: any, callback: any): any;

    getEpisodes(episodeIds: any, options: any, callback: any): any;

    getFeaturedPlaylists(options: any, callback: any): any;

    getFollowedArtists(options: any, callback: any): any;

    getMe(callback: any): any;

    getMyCurrentPlaybackState(options: any, callback: any): any;

    getMyCurrentPlayingTrack(options: any, callback: any): any;

    getMyDevices(callback: any): any;

    getMyRecentlyPlayedTracks(options: any, callback: any): any;

    getMySavedAlbums(options: any, callback: any): any;

    getMySavedShows(options: any, callback: any): any;

    getMySavedTracks(options: any, callback: any): any;

    getMyTopArtists(options: any, callback: any): any;

    getMyTopTracks(options: any, callback: any): any;

    getNewReleases(options: any, callback: any): any;

    getPlaylist(playlistId: any, options: any, callback: any): any;

    getPlaylistTracks(playlistId: any, options: any, callback: any): any;

    getPlaylistsForCategory(categoryId: any, options: any, callback: any): any;

    getRecommendations(options: any, callback: any): any;

    getRedirectURI(): any;

    getRefreshToken(): any;

    getShow(showId: any, options: any, callback: any): any;

    getShowEpisodes(showId: any, options: any, callback: any): any;

    getShows(showIds: any, options: any, callback: any): any;

    getTrack(trackId: any, options: any, callback: any): any;

    getTracks(trackIds: any, options: any, callback: any): any;

    getUser(userId: any, callback: any): any;

    getUserPlaylists(userId: any, options: any, callback: any): any;

    isFollowingArtists(artistIds: any, callback: any): any;

    isFollowingUsers(userIds: any, callback: any): any;

    pause(options: any, callback: any): any;

    play(options: any, callback: any): any;

    refreshAccessToken(callback: any): any;

    removeFromMySavedAlbums(albumIds: any, callback: any): any;

    removeFromMySavedShows(showIds: any, callback: any): any;

    removeFromMySavedTracks(trackIds: any, callback: any): any;

    removeTracksFromPlaylist(playlistId: any, tracks: any, options: any, callback: any): any;

    removeTracksFromPlaylistByPosition(playlistId: any, positions: any, snapshotId: any, callback: any): any;

    reorderTracksInPlaylist(playlistId: any, rangeStart: any, insertBefore: any, options: any, callback: any): any;

    replaceTracksInPlaylist(playlistId: any, uris: any, callback: any): any;

    resetAccessToken(): void;

    resetClientId(): void;

    resetClientSecret(): void;

    resetCredentials(): void;

    resetRedirectURI(): void;

    resetRefreshToken(): void;

    search(query: any, types: any, options: any, callback: any): any;

    searchAlbums(query: any, options: any, callback: any): any;

    searchArtists(query: any, options: any, callback: any): any;

    searchEpisodes(query: any, options: any, callback: any): any;

    searchPlaylists(query: any, options: any, callback: any): any;

    searchShows(query: any, options: any, callback: any): any;

    searchTracks(query: any, options: any, callback: any): any;

    seek(positionMs: any, options: any, callback: any): any;

    setAccessToken(accessToken: any): void;

    setClientId(clientId: any): void;

    setClientSecret(clientSecret: any): void;

    setCredentials(credentials: any): void;

    setRedirectURI(redirectUri: any): void;

    setRefreshToken(refreshToken: any): void;

    setRepeat(state: any, options: any, callback: any): any;

    setShuffle(state: any, options: any, callback: any): any;

    setVolume(volumePercent: any, options: any, callback: any): any;

    skipToNext(options: any, callback: any): any;

    skipToPrevious(options: any, callback: any): any;

    transferMyPlayback(deviceIds: any, options: any, callback: any): any;

    unfollowArtists(artistIds: any, callback: any): any;

    unfollowPlaylist(playlistId: any, callback: any): any;

    unfollowUsers(userIds: any, callback: any): any;

    uploadCustomPlaylistCoverImage(playlistId: any, base64URI: any, callback: any): any;

}

