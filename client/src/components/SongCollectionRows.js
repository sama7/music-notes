export default function SongCollectionRows(props) {
    const tracks = props.currentPlaylistTracks?.map((item, index) =>
        <tr key={index}>
            <th scope="row">{index + 1}</th>
            <td>
                <img
                    src={item.track.album.images[2].url}
                    alt={"Album cover for " + item.track.album.name + " by " +
                        item.track.artists.map((artist, index) => {
                            if (index === 0) {
                                return artist.name
                            } else {
                                return " " + artist.name
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
                    {
                        item.track.artists.map((artist, index) => {
                            if (index !== item.track.artists.length - 1) {
                                return <span key={index}>{artist.name}, </span>
                            } else {
                                return <span key={index}>{artist.name}</span>
                            }
                        })
                    }
                </span>
            </td>
            <td>{item.track.album.name}</td>
            <td><button type="button" className="btn btn-outline-secondary">Add note</button></td>
            <td></td>
        </tr>
    );
    return (
        <tbody>
            {tracks}
        </tbody>
    );
}
