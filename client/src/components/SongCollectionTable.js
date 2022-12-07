export default function SongCollectionTable(props) {
    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th className="number" scope="col">#</th>
                    <th className="title" scope="col">Title</th>
                    <th className="album" scope="col">Album</th>
                    <th className="add-edit-note" scope="col"></th>
                    <th className="delete-note" scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>
                        FF4
                        <br />
                        <span className="artist">Flying Lotus</span>
                    </td>
                    <td>Flamagra</td>
                    <td><button type="button" className="btn btn-outline-secondary">Add note</button></td>
                    <td></td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>
                        Hounds
                        <br />
                        <span className="artist">Puma Blue</span>
                    </td>
                    <td>Hounds</td>
                    <td><button type="button" className="btn btn-outline-secondary">Edit note</button></td>
                    <td><button type="button" className="btn btn-outline-secondary">Delete note</button></td>
                </tr>
                <tr>
                    <th scope="row"></th>
                    <td className="note border" colSpan="4">sounds like arab influence in this song</td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td>
                        ANGEL
                        <br />
                        <span className="artist">Sam Gellaitry</span>
                    </td>
                    <td>VF VOL II</td>
                    <td><button type="button" className="btn btn-outline-secondary">Add note</button></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    );
}
