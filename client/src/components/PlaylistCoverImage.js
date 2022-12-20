export default function PlaylistCoverImage(props) {
    return (
        <img
            className="playlist-cover"
            src={props.currentPlaylistCover.images[0].url}
            alt={`Cover for Playlist "${props.currentPlaylistCover.name}"`}
        />
    );
}
