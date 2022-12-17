import { useState, useEffect } from 'react';
import LogInButton from './LogInButton';
import NotesModal from './NotesModal';
import PlaylistSelect from './PlaylistSelect';
import SongCollectionTable from './SongCollectionTable';

export default function NotesList(props) {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState('');
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [currentPlaylist, setCurrentPlaylist] = useState('');
    const [currentPlaylistTracks, setCurrentPlaylistTracks] = useState([]);
    const [currentTrack, setCurrentTrack] = useState('');
    const [isModalShowing, setModalShowing] = useState(false);
    const [note, setNote] = useState('');

    const code = new URLSearchParams(window.location.search).get('code');
    const state = new URLSearchParams(window.location.search).get('state');

    useEffect(
        () => {
            async function fetchCurrentUser() {
                const response = await fetch('http://localhost:5000/callback?' + params.toString(), { credentials: 'include' });

                if (!response.ok) {
                    const message = `An error occurred: ${response.statusText}`;
                    window.alert(message);
                    return;
                }
                const currentUser = await response.json();
                return currentUser;
            }

            const params = new URLSearchParams({
                code: code,
                state: state
            });

            if (code && state && !isLoggedIn) {
                setLoggedIn(true);
                fetchCurrentUser()
                    .then((fetchedUser) => {
                        setCurrentUser(fetchedUser);
                        console.log(fetchedUser);
                    })
                    .catch((err) => {
                        console.error('Something went wrong in fetchCurrentUser:', err);
                        return;
                    });
            }
        },
        [code, state, isLoggedIn],
    );

    useEffect(
        () => {
            async function fetchUserPlaylists() {
                const response = await fetch('http://localhost:5000/playlists');

                if (!response.ok) {
                    const message = `An error occurred: ${response.statusText}`;
                    window.alert(message);
                    return;
                }
                const playlists = await response.json();
                return playlists;
            }

            if (currentUser) {
                fetchUserPlaylists()
                    .then((playlists) => {
                        setUserPlaylists(playlists);
                        console.log(playlists);
                    })
                    .catch((err) => {
                        console.error('Something went wrong:', err);
                        return;
                    });
            }
        },
        [currentUser],
    );

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
                        return;
                    });
            }
        },
        [currentPlaylist],
    );

    function handleChange(e) {
        setCurrentPlaylist(e.target.value);
    }

    function handleModalShow(trackSelected) {
        setModalShowing(true);
        setCurrentTrack(trackSelected);
    }

    function handleNoteChange(e) {
        setNote(e.target.value);
    }

    async function handleNoteSubmit() {
        const newNoteEntry = {
            user: currentUser,
            playlist: currentPlaylist,
            track: currentTrack,
            note: note,
        };
        console.log(newNoteEntry);
        await fetch("http://localhost:5000/note/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newNoteEntry),
        })
            .catch(error => {
                window.alert(error);
                return;
            });
        handleModalClose();
    }

    function handleModalClose() {
        setModalShowing(false);
        setNote('');
    }

    const loggedInTemplate = (
        <div>
            <PlaylistSelect userPlaylists={userPlaylists} handleChange={handleChange} />
            {currentPlaylistTracks.length > 0 &&
                <SongCollectionTable
                    currentPlaylist={currentPlaylist}
                    currentPlaylistTracks={currentPlaylistTracks}
                    handleModalShow={handleModalShow}
                />
            }
            <NotesModal
                isModalShowing={isModalShowing}
                handleModalClose={handleModalClose}
                handleNoteChange={handleNoteChange}
                handleNoteSubmit={handleNoteSubmit}
            />
        </div>
    );
    const loggedOutTemplate = (
        <LogInButton />
    );

    return (
        <div>
            {isLoggedIn && userPlaylists.length > 0 ? loggedInTemplate : loggedOutTemplate}
        </div>
    );
}
