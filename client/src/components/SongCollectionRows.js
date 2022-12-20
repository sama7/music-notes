import React from "react";

export default function SongCollectionRows(props) {

    function NotesRow(props) {
        for (let i = 0; i < props.notes.length; i++) {
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
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => props.handleModalShow(item.track.id)}
                    >
                        Add Note
                    </button>
                </td>
                <td></td>
            </tr>
            <NotesRow notes={props.notes} item={item} index={index} />
        </React.Fragment>
    );
    return (
        <tbody>
            {tracks}
        </tbody>
    );
}
