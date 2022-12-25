import SongCollectionRows from './SongCollectionRows';

export default function SongCollectionTable(props) {
    return (
        <table className="table table-dark table-hover">
            <thead>
                <tr>
                    <th className="number text-center" scope="col">#</th>
                    <th className="thumbnail" scope="col"></th>
                    <th className="title" scope="col">Title</th>
                    <th className="album" scope="col">Album</th>
                    <th className="add-edit-note" scope="col"></th>
                    <th className="delete-note" scope="col"></th>
                </tr>
            </thead>
            <SongCollectionRows
                currentPlaylistTracks={props.currentPlaylistTracks}
                handleAddNoteModalShow={props.handleAddNoteModalShow}
                handleEditNoteModalShow={props.handleEditNoteModalShow}
                handleDeleteNoteModalShow={props.handleDeleteNoteModalShow}
                notes={props.notes}
            />
        </table>
    );
}
