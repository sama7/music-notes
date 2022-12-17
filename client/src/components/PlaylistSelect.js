export default function PlaylistSelect(props) {
    const playlists = props.userPlaylists?.map((playlist, index) =>
        <option
            key={index}
            value={playlist.id}
        >
            {playlist.name}
        </option>
    );
    return (
        <div className="form-group">
            <label htmlFor="playlist-select">Choose a playlist:</label>
            <select id="playlist-select" className="form-select" onChange={props.handleChange}>
                <option key="-1" value="">Select playlist</option>
                {playlists}
            </select>
        </div>
    );
}
