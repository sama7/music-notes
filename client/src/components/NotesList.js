import { useState, useEffect } from 'react';
import LogInButton from './LogInButton';
import PlaylistSelect from './PlaylistSelect';
import SongCollectionTable from './SongCollectionTable';

export default function NotesList(props) {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [currentPlaylist, setCurrentPlaylist] = useState('');
    const [currentPlaylistTracks, setCurrentPlaylistTracks] = useState([]);
    const code = new URLSearchParams(window.location.search).get('code');
    const state = new URLSearchParams(window.location.search).get('state');

    function handleChange(e) {
        setCurrentPlaylist(e.target.value);
    }

    useEffect(() => {
        async function fetchUserPlaylists() {
            const response = await fetch('http://localhost:5000/callback?' + params.toString(), { credentials: 'include' });

            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const playlists = await response.json();
            return playlists;
        }

        const params = new URLSearchParams({
            code: code,
            state: state
        });

        if (code && state && !isLoggedIn) {
            setLoggedIn(true);
            fetchUserPlaylists()
                .then((playlists) => {
                    setUserPlaylists(playlists);
                    console.log(playlists);
                })
                .catch((err) => {
                    console.error('Something went wrong:', err);
                });
        }
    }, [code, state, isLoggedIn]);

    useEffect(
        () => {
            async function fetchPlaylistTracks() {
                const response = await fetch('http://localhost:5000/tracks?' + params.toString());

                if (!response.ok) {
                    const message = `An error occurred: ${response.statusText}`;
                    window.alert(message);
                    return;
                }
                const playlistTracks = await response.json();
                return playlistTracks;
            }

            const params = new URLSearchParams({ playlistID: currentPlaylist });

            if (currentPlaylist) {
                fetchPlaylistTracks()
                    .then((playlistTracks) => {
                        setCurrentPlaylistTracks(playlistTracks);
                        console.log(playlistTracks);
                    })
                    .catch((err) => {
                        console.error('Something went wrong:', err);
                    });
            }
        },
        [currentPlaylist],
    );

    const loggedInTemplate = (
        <div>
            <PlaylistSelect userPlaylists={userPlaylists} handleChange={handleChange} />
            <SongCollectionTable currentPlaylistTracks={currentPlaylistTracks} />
        </div>
    );
    const loggedOutTemplate = (
        <LogInButton />
    );

    return (
        <div>
            {isLoggedIn ? loggedInTemplate : loggedOutTemplate}
        </div>
    );
}
