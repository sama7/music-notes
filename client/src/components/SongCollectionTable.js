import SongCollectionRows from './SongCollectionRows';

export default function SongCollectionTable(props) {
    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th className="number" scope="col">#</th>
                    <th className="thumbnail" scope="col"></th>
                    <th className="title" scope="col">Title</th>
                    <th className="album" scope="col">Album</th>
                    <th className="add-edit-note" scope="col"></th>
                    <th className="delete-note" scope="col"></th>
                </tr>
            </thead>
            <SongCollectionRows
                currentPlaylistTracks={props.currentPlaylistTracks}
                handleModalShow={props.handleModalShow}
                notes={props.notes}
                currentPlaylist={props.currentPlaylist}
            />
        </table>
    );
}
