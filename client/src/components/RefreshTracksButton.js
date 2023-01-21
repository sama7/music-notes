export default function RefreshTracksButton(props) {
    return (
        <p>
            <button
                type="button"
                className="btn btn-primary refresh-tracks-btn"
                onClick={props.handleRefreshTracks}
            >
                Refresh Tracks
            </button>
        </p>
    );
}