import playlistCoverMissing from './playlist-cover-missing.png'

export default function PlaylistCoverImage(props) {
    function Image(props) {
        if (props.currentPlaylistObject.images && props.currentPlaylistObject.images.length > 0) {
            return (
                <img
                    className="playlist-cover"
                    src={props.currentPlaylistObject.images[0].url}
                    alt={`Cover for Playlist "${props.currentPlaylistObject.name}"`}
                />
            );
        } else {
            return (
                <img
                    className="playlist-cover"
                    src={playlistCoverMissing}
                    alt={`Cover for Playlist "${props.currentPlaylistObject.name}" (placeholder art)`}
                />
            );
        }
    }
    return (
        <Image currentPlaylistObject={props.currentPlaylistObject} />
    );
}
