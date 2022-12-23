export default function PlaylistCoverImage(props) {
    function Image(props) {
        // currentPlayistCover actually holds the entire playlist object (result of getPlaylist())
        // helps to have the entire object so that we can reference the playlist name in the alt text
        if (props.currentPlaylistCover.images && props.currentPlaylistCover.images.length > 0) {
            return (
                <img
                    className="playlist-cover"
                    src={props.currentPlaylistCover.images[0].url}
                    alt={`Cover for Playlist "${props.currentPlaylistCover.name}"`}
                />
            );
        } else {
            return;
        }
    }
    return (
        <Image currentPlaylistCover={props.currentPlaylistCover} />
    );
}
