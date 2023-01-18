export default function RefreshPlaylistsButton(props) {
    return (
        <p>
            <button
                type="button"
                className="btn btn-primary refreshPlaylistsBtn"
                onClick={props.handleRefreshPlaylists}
            >
                Refresh Playlists
            </button>
        </p>
    );
}