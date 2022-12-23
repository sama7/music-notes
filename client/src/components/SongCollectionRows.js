import React from "react";

export default function SongCollectionRows(props) {

    function AddEditButtonCell(props) {
        for (let i = 0; i < props.notes.length; i++) {
            // if we find a note that corresponds to this track, render edit button
            if (props.notes[i].track === props.item.track.id) {
                return (
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                    // onClick={() => props.handleModalShow(props.item.track.id)}
                    >
                        Edit Note
                    </button>
                );
            }
        }
        // if this track has no notes, render add button
        return (
            <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => props.handleAddNoteModalShow(props.item.track.id)}
            >
                Add Note
            </button>
        );
    }

    function DeleteButtonCell(props) {
        for (let i = 0; i < props.notes.length; i++) {
            // if we find a note that corresponds to this track, render delete button
            if (props.notes[i].track === props.item.track.id) {
                return (
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                            props.handleDeleteNoteModalShow(props.item.track.id,
                                props.item.track.name, props.item.track.artists)
                        }
                    >
                        Delete Note
                    </button>
                );
            }
        }
        // if this track has no notes, render nothing
        return;
    }

    function NotesRow(props) {
        for (let i = 0; i < props.notes.length; i++) {
            // if we find a note that corresponds to this track, render the note in a row below the track
            if (props.notes[i].track === props.item.track.id) {
                return (
                    <tr>
                        <th scope="row"></th>
                        <td className="note border" colSpan="5">{props.notes[i].note}</td>
                    </tr>
                );
            }
        }
        return;
    }

    const tracks = props.currentPlaylistTracks?.map((item, index) =>
        <React.Fragment key={`${index}-${item.track.name}`}>
            <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>
                    <img
                        src={item.track.album.images[2].url}
                        alt={"Album cover for " + item.track.album.name + " by " +
                            item.track.artists.map((artist, index) => {
                                if (index === 0) {
                                    return artist.name;
                                } else {
                                    return " " + artist.name;
                                }
                            })}
                        width="50"
                        height="50"
                    />
                </td>
                <td>
                    {item.track.name}
                    <br />
                    <span className="artist">
                        {item.track.explicit && "🅴 "}
                        {
                            item.track.artists.map((artist, index) => {
                                if (index !== item.track.artists.length - 1) {
                                    return <span key={index}>{artist.name}, </span>;
                                } else {
                                    return <span key={index}>{artist.name}</span>;
                                }
                            })
                        }
                    </span>
                </td>
                <td className="align-middle">{item.track.album.name}</td>
                <td className="align-middle">
                    {/* <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => props.handleModalShow(item.track.id)}
                    >
                        Add Note
                    </button> */}
                    <AddEditButtonCell notes={props.notes} item={item} handleAddNoteModalShow={props.handleAddNoteModalShow} />
                </td>
                <td className="align-middle">
                    <DeleteButtonCell notes={props.notes} item={item} handleDeleteNoteModalShow={props.handleDeleteNoteModalShow} />
                </td>
            </tr>
            <NotesRow notes={props.notes} item={item} />
        </React.Fragment>
    );
    return (
        <tbody>
            {tracks}
        </tbody>
    );
}
