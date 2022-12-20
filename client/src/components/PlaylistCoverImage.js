export default function PlaylistCoverImage(props) {
    function Image(props) {
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
