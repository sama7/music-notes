export default function RefreshPlaylistsButton(props) {
    return (
        <p>
            <button
                type="button"
                className="btn btn-primary refresh-playlists-btn"
                onClick={props.handleRefreshPlaylists}
            >
                Refresh Playlists
            </button>
        </p>
    );
}