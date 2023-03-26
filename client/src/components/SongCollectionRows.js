import React from "react";
import trackCoverMissing from './track-cover-missing.png'

export default function SongCollectionRows(props) {

    function AddEditButtonCell(props) {
        for (let i = 0; i < props.notes.length; i++) {
            // if we find a note that corresponds to this track, render edit button
            if (props.notes[i].track === props.item.track.uri) {
                return (
                    <button
                        type="button"
                        className="btn btn-outline-light"
                        onClick={() =>
                            props.handleEditNoteModalShow(props.item.track.uri,
                                props.notes[i].note)
                        }
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
                className="btn btn-outline-light"
                onClick={() => props.handleAddNoteModalShow(props.item.track.uri)}
            >
                Add Note
            </button>
        );
    }

    function DeleteButtonCell(props) {
        for (let i = 0; i < props.notes.length; i++) {
            // if we find a note that corresponds to this track, render delete button
            if (props.notes[i].track === props.item.track.uri) {
                return (
                    <button
                        type="button"
                        className="btn btn-outline-light"
                        onClick={() =>
                            props.handleDeleteNoteModalShow(props.item.track.uri,
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
        function unescape(string) {
            return new DOMParser().parseFromString(string, 'text/html').querySelector('html').textContent;
        }

        for (let i = 0; i < props.notes.length; i++) {
            // if we find a note that corresponds to this track, render the note in a row below the track
            if (props.notes[i].track === props.item.track.uri) {
                return (
                    <tr>
                        <th scope="row"></th>
                        <td className="note border border-2 border-white border-opacity-25" colSpan="5">
                            {unescape(props.notes[i].note)}
                        </td>
                    </tr>
                );
            }
        }
        return;
    }

    const tracks = props.currentPlaylistTracks?.map((item, index) => {
        if (item.track) {
            return (
                <React.Fragment key={`${index}-${item.track.name}`}>
                    <tr key={index}>
                        <th className="align-middle text-center" scope="row">{index + 1}</th>
                        <td className="align-middle">
                            {item.track.album.images.length > 0
                                ?
                                <img
                                    src={item.track.album.images[2].url}
                                    alt={"Album cover for " + item.track.album.name + " by " +
                                        item.track.artists.map((artist, index) => {
                                            if (index === 0) {
                                                return artist.name;
                                            } else {
                                                return " " + artist.name;
                                            }
                                        })
                                    }
                                    width="50"
                                    height="50"
                                    crossOrigin="anonymous"
                                />
                                :
                                <img
                                    src={trackCoverMissing}
                                    alt={"Album cover for " + item.track.album.name + " by " +
                                        item.track.artists.map((artist, index) => {
                                            if (index === 0) {
                                                return artist.name;
                                            } else {
                                                return " " + artist.name;
                                            }
                                        })
                                        + " (placeholder art)"
                                    }
                                    width="50"
                                    height="50"
                                    crossOrigin="anonmymous"
                                />
                            }
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
                            <AddEditButtonCell
                                notes={props.notes}
                                item={item}
                                handleAddNoteModalShow={props.handleAddNoteModalShow}
                                handleEditNoteModalShow={props.handleEditNoteModalShow}
                            />
                        </td>
                        <td className="align-middle">
                            <DeleteButtonCell
                                notes={props.notes}
                                item={item}
                                handleDeleteNoteModalShow={props.handleDeleteNoteModalShow}
                            />
                        </td>
                    </tr>
                    <NotesRow notes={props.notes} item={item} />
                </React.Fragment>
            )
        } else {
            return '';
        }
    });
    return (
        <tbody>
            {tracks}
        </tbody>
    );
}
