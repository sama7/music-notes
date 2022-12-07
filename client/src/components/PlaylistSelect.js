export default function PlaylistSelect(props) {
    const playlistItems = props.userPlaylists?.map(playlist =>
        <option
            key={playlist.id}
            value={playlist.name}
        >
            {playlist.name}
        </option>
    );
    return (
        <select className="form-select">
            <option key="0">Select playlist</option>
            {playlistItems}
        </select>
    );
}
