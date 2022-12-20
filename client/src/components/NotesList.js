import { useState, useEffect } from 'react';
import LogInButton from './LogInButton';
import NotesModal from './NotesModal';
import PlaylistCoverImage from './PlaylistCoverImage';
import PlaylistSelect from './PlaylistSelect';
import SongCollectionTable from './SongCollectionTable';

export default function NotesList(props) {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState('');
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [currentPlaylist, setCurrentPlaylist] = useState('');
    const [currentPlaylistCover, setCurrentPlaylistCover] = useState({});
    const [currentPlaylistTracks, setCurrentPlaylistTracks] = useState([]);
    const [notes, setNotes] = useState([]);
    const [currentTrack, setCurrentTrack] = useState('');
    const [isModalShowing, setModalShowing] = useState(false);
    const [note, setNote] = useState('');
    const [notesIncrement, setNotesIncrement] = useState(0);

    const code = new URLSearchParams(window.location.search).get('code');
    const state = new URLSearchParams(window.location.search).get('state');

    useEffect(() => {
        async function fetchCurrentUser() {
            try {
                const response = await fetch('http://localhost:5000/callback?' + params.toString(), { credentials: 'include' });
                if (!response.ok) {
                    const message = `An error occurred: ${response.statusText}`;
                    window.alert(message);
                    return;
                }
                const currentUser = await response.json();
                return currentUser;
            }
            catch (error) {
                console.error(`Error in fetchCurrentUser(): ${error}`);
                return;
            }
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
                .catch((error) => {
                    console.error(`Error while calling fetchCurrentUser(): ${error}`);
                    return;
                });
        }
    }, [code, state, isLoggedIn]);

    useEffect(() => {
        async function fetchUserPlaylists() {
            try {
                const response = await fetch('http://localhost:5000/playlists');
                if (!response.ok) {
                    const message = `An error occurred: ${response.statusText}`;
                    window.alert(message);
                    return;
                }
                const playlists = await response.json();
                return playlists;
            }
            catch (error) {
                console.error(`Error in fetchUserPlaylists(): ${error}`);
                return;
            }
        }

        if (currentUser) {
            fetchUserPlaylists()
                .then((playlists) => {
                    setUserPlaylists(playlists);
                    console.log(playlists);
                })
                .catch((error) => {
                    console.error(`Error while calling fetchUserPlaylists(): ${error}`);
                    return;
                });
        }
    }, [currentUser]);

    useEffect(() => {
        async function fetchPlaylistTracks() {
            try {
                const response = await fetch('http://localhost:5000/tracks?' + params.toString());
                if (!response.ok) {
                    const message = `An error occurred: ${response.statusText}`;
                    window.alert(message);
                    return;
                }
                const playlistTracks = await response.json();
                return playlistTracks;
            }
            catch (error) {
                console.error(`Error in fetchPlaylistTracks(): ${error}`);
                return;
            }
        }

        async function fetchPlaylistCover() {
            try {
                const response = await fetch('http://localhost:5000/cover?' + params.toString());
                if (!response.ok) {
                    const message = `An error occurred: ${response.statusText}`;
                    window.alert(message);
                    return;
                }
                const playlistCover = await response.json();
                return playlistCover;
            }
            catch (error) {
                console.error(`Error in fetchPlaylistCover(): ${error}`);
                return;
            }
        }

        const params = new URLSearchParams({ playlistID: currentPlaylist });

        if (currentPlaylist) {
            fetchPlaylistTracks()
                .then((playlistTracks) => {
                    setCurrentPlaylistTracks(playlistTracks);
                    console.log(playlistTracks);
                })
                .catch((error) => {
                    console.error(`Error while calling fetchPlaylistTracks(): ${error}`);
                    return;
                });
            fetchPlaylistCover()
                .then((playlistCover) => {
                    setCurrentPlaylistCover(playlistCover);
                    console.log(playlistCover);
                })
                .catch((error) => {
                    console.error(`Error while calling fetchPlaylistCover(): ${error}`);
                    return;
                });
        }
    }, [currentPlaylist]);

    useEffect(() => {
        async function fetchNotes() {
            try {
                const response = await fetch('http://localhost:5000/note/?' + params.toString());
                if (!response.ok) {
                    const message = `An error occurred: ${response.statusText}`;
                    window.alert(message);
                    return;
                }
                const notes = await response.json();
                return notes;
            }
            catch (error) {
                console.error(`Error in fetchNotes(): ${error}`);
                return;
            }
        }

        const params = new URLSearchParams({
            userID: currentUser,
            playlistID: currentPlaylist,
        });

        if (currentPlaylist) {
            fetchNotes()
                .then((notes) => {
                    setNotes(notes);
                    console.log(notes);
                })
                .catch((error) => {
                    console.error(`Error while calling fetchNotes(): ${error}`);
                    return;
                });
        }
    }, [currentUser, currentPlaylist, notesIncrement]);

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
        try {
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
            });
            handleModalClose();
            setNotesIncrement(notesIncrement + 1);
        }
        catch (error) {
            console.error(`Error in handleNoteSubmit(): ${error}`);
            return;
        }
    }

    function handleModalClose() {
        setModalShowing(false);
        setNote('');
    }

    const loggedInTemplate = (
        <div>
            <PlaylistSelect userPlaylists={userPlaylists} handleChange={handleChange} />
            {currentPlaylistTracks.length > 0 && currentPlaylistCover && (
                <>
                    <PlaylistCoverImage currentPlaylistCover={currentPlaylistCover} />
                    <SongCollectionTable
                        currentPlaylist={currentPlaylist}
                        currentPlaylistTracks={currentPlaylistTracks}
                        handleModalShow={handleModalShow}
                        notes={notes}
                    />
                </>
            )
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
