import Select from 'react-select';

export default function PlaylistSelect(props) {
    const playlists = props.userPlaylists.map((playlist) => ({
        value: playlist.id,
        label: playlist.name,
    }));
    return (
        <div className="form-group">
            <label htmlFor="playlist-select">Choose a playlist:</label>
            <Select
                id="playlist-select"
                onChange={props.handlePlaylistChange}
                options={playlists}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                        ...theme.colors,
                        neutral0: 'rgb(33, 37, 41)',
                        primary25: 'rgb(99, 100, 101)',
                        neutral80: 'rgb(255, 255, 255)',
                    },
                })}
                styles={{
                    container: (base) => ({
                        ...base,
                        minWidth: "320px",
                        maxWidth: "max-content",
                        textAlign: 'left',
                    }),
                }}
                onMenuScrollToBottom={props.handlePlaylistSelectScroll}
            />
        </div>
    );
}
