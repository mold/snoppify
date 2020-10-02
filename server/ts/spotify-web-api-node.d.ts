// /** Declaration file generated by dts-gen */

// declare module 'spotify-web-api-node' {

//     export default class SpotifyWebApi {
//         constructor(credentials: any);

//         addToMySavedAlbums(albumIds: any, callback: any): any;

//         addToMySavedTracks(trackIds: any, callback: any): any;

//         addTracksToPlaylist(userId: any, playlistId: any, tracks: any, options: any, callback: any): any;

//         areFollowingPlaylist(userId: any, playlistId: any, followerIds: any, callback: any): any;

//         authorizationCodeGrant(code: any, callback?: any): Promise<any>;

//         changePlaylistDetails(userId: any, playlistId: any, options: any, callback: any): any;

//         clientCredentialsGrant(options?: any, callback?: any): Promise<any>;

//         containsMySavedAlbums(albumIds: any, callback: any): any;

//         containsMySavedTracks(trackIds: any, callback: any): any;

//         createAuthorizeURL(scopes: any, state: any, showDialog: any): any;

//         createPlaylist(userId: any, playlistName: any, options: any, callback: any): any;

//         followArtists(artistIds: any, callback: any): any;

//         followPlaylist(userId: any, playlistId: any, options: any, callback: any): any;

//         followUsers(userIds: any, callback: any): any;

//         getAccessToken(): any;

//         getAlbum(albumId: any, options: any, callback: any): any;

//         getAlbumTracks(albumId: any, options: any, callback: any): any;

//         getAlbums(albumIds: any, options: any, callback: any): any;

//         getArtist(artistId: any, callback: any): any;

//         getArtistAlbums(artistId: any, options: any, callback: any): any;

//         getArtistRelatedArtists(artistId: any, callback: any): any;

//         getArtistTopTracks(artistId: any, country: any, callback: any): any;

//         getArtists(artistIds: any, callback: any): any;

//         getAudioAnalysisForTrack(trackId: any, callback: any): any;

//         getAudioFeaturesForTrack(trackId: any, callback: any): any;

//         getAudioFeaturesForTracks(trackIds: any, callback?: any): Promise<any>;

//         getAvailableGenreSeeds(callback: any): any;

//         getCategories(options: any, callback: any): any;

//         getCategory(categoryId: any, options: any, callback: any): any;

//         getClientId(): any;

//         getClientSecret(): any;

//         getCredentials(): any;

//         getFeaturedPlaylists(options: any, callback: any): any;

//         getFollowedArtists(options: any, callback: any): any;

//         getMe(callback: any): any;

//         getMyCurrentPlaybackState(options: any, callback: any): any;

//         getMyCurrentPlayingTrack(options: any, callback: any): any;

//         getMyDevices(callback: any): any;

//         getMyRecentlyPlayedTracks(options: any, callback: any): any;

//         getMySavedAlbums(options: any, callback: any): any;

//         getMySavedTracks(options: any, callback: any): any;

//         getMyTopArtists(options: any, callback: any): any;

//         getMyTopTracks(options: any, callback: any): any;

//         getNewReleases(options: any, callback: any): any;

//         getPlaylist(userId: any, playlistId: any, options?: any, callback?: any): Promise<any>;

//         getPlaylistTracks(userId: any, playlistId: any, options: any, callback: any): any;

//         getPlaylistsForCategory(categoryId: any, options: any, callback: any): any;

//         getRecommendations(options: any, callback: any): any;

//         getRedirectURI(): any;

//         getRefreshToken(): any;

//         getTrack(trackId: any, options?: any, callback?: any): Promise<any>;

//         getTracks(trackIds: any, options?: any, callback?: any): Promise<any>;

//         getUser(userId: any, callback: any): any;

//           /**
//          * Get a user's playlists.
//          * @param {string} userId An optional id of the user. If you know the Spotify URI it is easy
//          * to find the id (e.g. spotify:user:<here_is_the_id>). If not provided, the id of the user that granted
//          * the permissions will be used.
//          * @param {Object} [options] The options supplied to this request.
//          * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
//          * @example getUserPlaylists('thelinmichael').then(...)
//          * @returns {Promise|undefined} A promise that if successful, resolves to an object containing
//          *          a list of playlists. If rejected, it contains an error object. Not returned if a callback is given.
//          */
//         getUserPlaylists(userId: string, options?: Partial<{ offset:number; limit:number; }>, callback?: any): Promise<{body:SpotifyApi.ListOfUsersPlaylistsResponse}>;

//         isFollowingArtists(artistIds: any, callback: any): any;

//         isFollowingUsers(userIds: any, callback: any): any;

//         pause(callback: any): any;

//         play(options: any, callback: any): any;

//         refreshAccessToken(callback: any): any;

//         removeFromMySavedAlbums(albumIds: any, callback: any): any;

//         removeFromMySavedTracks(trackIds: any, callback: any): any;

//         removeTracksFromPlaylist(userId: any, playlistId: any, tracks: any, options: any, callback: any): any;

//         removeTracksFromPlaylistByPosition(userId: any, playlistId: any, positions: any, snapshotId: any, callback: any): any;

//         reorderTracksInPlaylist(userId: any, playlistId: any, rangeStart: any, insertBefore: any, options: any, callback: any): any;

//         replaceTracksInPlaylist(userId: any, playlistId: any, uris: any, callback: any): any;

//         resetAccessToken(): void;

//         resetClientId(): void;

//         resetClientSecret(): void;

//         resetCredentials(): void;

//         resetRedirectURI(): void;

//         resetRefreshToken(): void;

//         search(query: any, types: any, options: any, callback: any): any;

//         searchAlbums(query: any, options: any, callback: any): any;

//         searchArtists(query: any, options: any, callback: any): any;

//         searchPlaylists(query: any, options: any, callback: any): any;

//         searchTracks(query: any, options?: any, callback?: any): Promise<any>;

//         setAccessToken(accessToken: any): void;

//         setClientId(clientId: any): void;

//         setClientSecret(clientSecret: any): void;

//         setCredentials(credentials: any): void;

//         setRedirectURI(redirectUri: any): void;

//         setRefreshToken(refreshToken: any): void;

//         setRepeat(options: any, callback: any): any;

//         setShuffle(options: any, callback: any): any;

//         skipToNext(callback: any): any;

//         skipToPrevious(callback: any): any;

//         transferMyPlayback(options: any, callback: any): any;

//         unfollowArtists(artistIds: any, callback: any): any;

//         unfollowPlaylist(userId: any, playlistId: any, callback: any): any;

//         unfollowUsers(userIds: any, callback: any): any;

//     }

//     export interface SpotifyTrack {

//     }
// }
