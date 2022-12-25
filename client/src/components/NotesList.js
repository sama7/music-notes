import { useState, useEffect, useRef } from 'react';
import LogInButton from './LogInButton';
import AddNoteModal from './AddNoteModal';
import PlaylistCoverImage from './PlaylistCoverImage';
import PlaylistSelect from './PlaylistSelect';
import SongCollectionTable from './SongCollectionTable';
import EditNoteModal from './EditNoteModal';
import DeleteNoteModal from './DeleteNoteModal';

export function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

export default function NotesList(props) {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState('');
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [currentPlaylist, setCurrentPlaylist] = useState('');
    const [currentPlaylistCover, setCurrentPlaylistCover] = useState({});
    const [currentPlaylistTracks, setCurrentPlaylistTracks] = useState([]);
    const [notes, setNotes] = useState([]);
    const [currentTrack, setCurrentTrack] = useState('');
    const [currentTrackName, setCurrentTrackName] = useState('');
    const [currentTrackArtistsNames, setCurrentTrackArtistsNames] = useState([]);
    const [isAddNoteModalShowing, setAddNoteModalShowing] = useState(false);
    const [isEditNoteModalShowing, setEditNoteModalShowing] = useState(false);
    const [isDeleteNoteModalShowing, setDeleteNoteModalShowing] = useState(false);
    const [currentNote, setCurrentNote] = useState('');
    const [notesIncrement, setNotesIncrement] = useState(0);

    const textareaRef = useRef(null);

    const wasEditNoteModalShowing = usePrevious(isEditNoteModalShowing);

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

    useEffect(() => {
        if (!wasEditNoteModalShowing && isEditNoteModalShowing) {
            if (textareaRef.current) {
                const len = textareaRef.current.value.length;
                textareaRef.current.setSelectionRange(len, len);
            } else {
                console.error('textareaRef is null')
                return;
            }
        }
    }, [wasEditNoteModalShowing, isEditNoteModalShowing]);

    function handlePlaylistChange(e) {
        setCurrentPlaylist(e.target.value);
    }

    function handleAddNoteModalShow(trackSelected) {
        setAddNoteModalShowing(true);
        setCurrentTrack(trackSelected);
    }

    function handleNoteChange(e) {
        setCurrentNote(e.target.value);
    }

    async function handleAddNoteSubmit() {
        try {
            const newNoteEntry = {
                user: currentUser,
                playlist: currentPlaylist,
                track: currentTrack,
                note: currentNote,
            };
            await fetch('http://localhost:5000/note/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newNoteEntry),
            });
            handleAddNoteModalClose();
            setNotesIncrement(notesIncrement + 1);
        }
        catch (error) {
            console.error(`Error in handleAddNoteSubmit(): ${error}`);
            return;
        }
    }

    function handleAddNoteModalClose() {
        setAddNoteModalShowing(false);
        setCurrentNote('');
    }

    function handleEditNoteModalShow(trackSelected, trackSelectedNote) {
        setEditNoteModalShowing(true);
        setCurrentTrack(trackSelected);
        setCurrentNote(trackSelectedNote);
    }

    async function handleEditNoteSubmit() {
        try {
            // there should only be one note with this combination
            const noteSearchCriteria = new URLSearchParams({
                user: currentUser,
                playlist: currentPlaylist,
                track: currentTrack,
            });
            const editedNote = {
                note: currentNote,
            };
            await fetch('http://localhost:5000/note/update?' + noteSearchCriteria.toString(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editedNote),
            });
            handleEditNoteModalClose();
            setNotesIncrement(notesIncrement + 1);
        }
        catch (error) {
            console.error(`Error in handleEditNoteSubmit(): ${error}`);
            return;
        }
    }

    function handleEditNoteModalClose() {
        setEditNoteModalShowing(false);
        setCurrentNote('');
    }

    function handleDeleteNoteModalShow(trackSelected, trackSelectedName, trackSelectedArtistsNames) {
        setDeleteNoteModalShowing(true);
        setCurrentTrack(trackSelected);
        setCurrentTrackName(trackSelectedName);
        setCurrentTrackArtistsNames(trackSelectedArtistsNames);
    }

    async function handleDeleteNoteSubmit() {
        try {
            // there should only be one note with this combination
            const noteSearchCriteria = new URLSearchParams({
                user: currentUser,
                playlist: currentPlaylist,
                track: currentTrack,
            });
            await fetch('http://localhost:5000/note/delete?' + noteSearchCriteria.toString(), {
                method: 'DELETE',
            });
            handleDeleteNoteModalClose();
            setNotesIncrement(notesIncrement - 1);
        }
        catch (error) {
            console.error(`Error in handleDeleteNoteSubmit(): ${error}`);
            return;
        }
    }

    function handleDeleteNoteModalClose() {
        setDeleteNoteModalShowing(false);
    }

    const loggedInTemplate = (
        <div>
            <PlaylistSelect userPlaylists={userPlaylists} handlePlaylistChange={handlePlaylistChange} />
            {currentPlaylistTracks.length > 0 && currentPlaylistCover && (
                <>
                    <PlaylistCoverImage currentPlaylistCover={currentPlaylistCover} />
                    <SongCollectionTable
                        currentPlaylist={currentPlaylist}
                        currentPlaylistTracks={currentPlaylistTracks}
                        handleAddNoteModalShow={handleAddNoteModalShow}
                        handleEditNoteModalShow={handleEditNoteModalShow}
                        handleDeleteNoteModalShow={handleDeleteNoteModalShow}
                        notes={notes}
                    />
                </>
            )
            }
            <AddNoteModal
                isAddNoteModalShowing={isAddNoteModalShowing}
                handleAddNoteModalClose={handleAddNoteModalClose}
                handleNoteChange={handleNoteChange}
                handleAddNoteSubmit={handleAddNoteSubmit}
            />
            <EditNoteModal
                isEditNoteModalShowing={isEditNoteModalShowing}
                handleEditNoteModalClose={handleEditNoteModalClose}
                handleNoteChange={handleNoteChange}
                handleEditNoteSubmit={handleEditNoteSubmit}
                currentNote={currentNote}
                ref={textareaRef}
            />
            <DeleteNoteModal
                isDeleteNoteModalShowing={isDeleteNoteModalShowing}
                handleDeleteNoteModalClose={handleDeleteNoteModalClose}
                handleDeleteNoteSubmit={handleDeleteNoteSubmit}
                currentTrackName={currentTrackName}
                currentTrackArtistsNames={currentTrackArtistsNames}
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
