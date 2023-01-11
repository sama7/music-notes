import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LogInButton from './LogInButton';
import AddNoteModal from './AddNoteModal';
import PlaylistCoverImage from './PlaylistCoverImage';
import PlaylistSelect from './PlaylistSelect';
import SongCollectionTable from './SongCollectionTable';
import EditNoteModal from './EditNoteModal';
import DeleteNoteModal from './DeleteNoteModal';
import TokenRevokedToast from './TokenRevokedToast';
import RateLimitModal from './RateLimitModal';
import { DateTime } from 'luxon';

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
    const loadPlaylistsLimit = 50;
    const [currentPlaylistsOffset, setCurrentPlaylistsOffset] = useState(0);
    const [nextUserPlaylists, setNextUserPlaylists] = useState('');
    const [currentPlaylist, setCurrentPlaylist] = useState('');
    const [currentPlaylistObject, setCurrentPlaylistObject] = useState({});

    const [currentPlaylistTracks, setCurrentPlaylistTracks] = useState([]);
    const loadTracksLimit = 100;
    const [currentTracksOffset, setCurrentTracksOffset] = useState(0);
    const [nextPlaylistTracks, setNextPlaylistTracks] = useState('');
    const [currentTrack, setCurrentTrack] = useState('');
    const [currentTrackName, setCurrentTrackName] = useState('');
    const [currentTrackArtistsNames, setCurrentTrackArtistsNames] = useState([]);

    const [isAddNoteModalShowing, setAddNoteModalShowing] = useState(false);
    const [isEditNoteModalShowing, setEditNoteModalShowing] = useState(false);
    const [isDeleteNoteModalShowing, setDeleteNoteModalShowing] = useState(false);

    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState('');
    const [notesIncrement, setNotesIncrement] = useState(0);

    const [isTokenRevokedToastShowing, setTokenRevokedToastShowing] = useState(false);

    const [rateLimitSecondsLeft, setRateLimitSecondsLeft] = useState(0);
    const [isRateLimitModalShowing, setRateLimitModalShowing] = useState(false);
    const [retryIntervalID, setRetryIntervalID] = useState(null);

    const textareaRef = useRef(null);
    const tableRef = useRef(null);

    const wasEditNoteModalShowing = usePrevious(isEditNoteModalShowing);
    const prevRateLimitSecondsLeft = usePrevious(rateLimitSecondsLeft);

    const navigate = useNavigate();
    const code = new URLSearchParams(window.location.search).get('code');
    const state = new URLSearchParams(window.location.search).get('state');

    useEffect(() => {
        async function fetchCurrentUser(params) {
            try {
                const response = await fetch('http://localhost:5000/callback?' + params.toString(),
                    { credentials: 'include' });
                if (response.status === 400) {
                    return 400;
                } else if (response.status === 429) {
                    localStorage.setItem('retryAfterTime',
                        DateTime.now().plus({ seconds: response.headers.get('retry-after') }).toSeconds());
                    return 429;
                } else if (!response.ok) {
                    const message = `An error occurred: ${response.statusText}`;
                    window.alert(message);
                    return false;
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
            fetchCurrentUser(params)
                .then((fetchedUser) => {
                    if (fetchedUser === 400) {
                        navigate('/');
                        setLoggedIn(false);
                        setCurrentUser('');
                        setCurrentPlaylist('');
                        setTokenRevokedToastShowing(true);
                        return;
                    } else if (fetchedUser === 429) {
                        handleRateLimitModalShow();
                        return;
                    } else if (!fetchedUser) {
                        return
                    } else {
                        setCurrentUser(fetchedUser);
                        console.log(fetchedUser);
                    }
                })
                .catch((error) => {
                    console.error(`Error while calling fetchCurrentUser(): ${error}`);
                    return;
                });
        }
    }, [code, state, isLoggedIn, navigate]);

    useEffect(() => {
        async function fetchUserPlaylists(params) {
            try {
                const response = await fetch('http://localhost:5000/playlists?' + params.toString());
                if (response.status === 400) {
                    return 400;
                } else if (response.status === 429) {
                    localStorage.setItem('retryAfterTime',
                        DateTime.now().plus({ seconds: response.headers.get('retry-after') }).toSeconds());
                    return 429;
                } else if (!response.ok) {
                    const message = `An error occurred: ${response.statusText}`;
                    window.alert(message);
                    return false;
                }
                const playlists = await response.json();
                return playlists;
            }
            catch (error) {
                console.error(`Error in fetchUserPlaylists(): ${error}`);
                return;
            }
        }

        const params = new URLSearchParams({
            userID: currentUser,
            limit: loadPlaylistsLimit,
            offset: currentPlaylistsOffset,
        });

        if (currentUser) {
            fetchUserPlaylists(params)
                .then((playlists) => {
                    if (playlists === 400) {
                        navigate('/');
                        setLoggedIn(false);
                        setCurrentUser('');
                        setCurrentPlaylist('');
                        setTokenRevokedToastShowing(true);
                        return;
                    } else if (playlists === 429) {
                        handleRateLimitModalShow();
                        return;
                    } else if (!playlists) {
                        return
                    } else {
                        setUserPlaylists(userPlaylists => [...userPlaylists, ...playlists.items]);
                        setNextUserPlaylists(playlists.next);
                        console.log(playlists);
                    }
                })
                .catch((error) => {
                    console.error(`Error while calling fetchUserPlaylists(): ${error}`);
                    return;
                });
        }
    }, [currentUser, currentPlaylistsOffset, navigate]);

    useEffect(() => {
        async function fetchPlaylistTracks(params) {
            try {
                const response = await fetch('http://localhost:5000/tracks?' + params.toString());
                if (response.status === 400) {
                    return 400;
                } else if (response.status === 429) {
                    localStorage.setItem('retryAfterTime',
                        DateTime.now().plus({ seconds: response.headers.get('retry-after') }).toSeconds());
                    return 429;
                } else if (!response.ok) {
                    const message = `An error occurred: ${response.statusText}`;
                    window.alert(message);
                    return false;
                }
                const playlistTracks = await response.json();
                return playlistTracks;
            }
            catch (error) {
                console.error(`Error in fetchPlaylistTracks(): ${error}`);
                return;
            }
        }

        async function fetchPlaylistObject(params) {
            try {
                const response = await fetch('http://localhost:5000/playlist?' + params.toString());
                if (response.status === 400) {
                    return 400;
                } else if (response.status === 429) {
                    localStorage.setItem('retryAfterTime',
                        DateTime.now().plus({ seconds: response.headers.get('retry-after') }).toSeconds());
                    return 429;
                } else if (!response.ok) {
                    const message = `An error occurred: ${response.statusText}`;
                    window.alert(message);
                    return false;
                }
                const playlistObject = await response.json();
                return playlistObject;
            }
            catch (error) {
                console.error(`Error in fetchPlaylistObject(): ${error}`);
                return;
            }
        }

        const trackParams = new URLSearchParams({
            userID: currentUser,
            playlistID: currentPlaylist,
            limit: loadTracksLimit,
            offset: currentTracksOffset,
        });

        const playlistParams = new URLSearchParams({
            userID: currentUser,
            playlistID: currentPlaylist,
        });

        if (currentPlaylist) {
            fetchPlaylistTracks(trackParams)
                .then((playlistTracks) => {
                    if (playlistTracks === 400) {
                        navigate('/');
                        setLoggedIn(false);
                        setCurrentUser('');
                        setCurrentPlaylist('');
                        setTokenRevokedToastShowing(true);
                        return;
                    } else if (playlistTracks === 429) {
                        handleRateLimitModalShow();
                        return;
                    } else if (!playlistTracks) {
                        return;
                    } else {
                        setCurrentPlaylistTracks(currentPlaylistTracks => (
                            [...currentPlaylistTracks, ...playlistTracks.items]));
                        setNextPlaylistTracks(playlistTracks.next);
                        console.log(playlistTracks);
                        if (currentTracksOffset === 0) {
                            return fetchPlaylistObject(playlistParams);
                        } else {
                            return true;
                        }
                    }
                })
                .then((playlistObject) => {
                    if (playlistObject === 400) {
                        navigate('/');
                        setLoggedIn(false);
                        setCurrentUser('');
                        setCurrentPlaylist('');
                        setTokenRevokedToastShowing(true);
                        return;
                    } else if (playlistObject === 429) {
                        handleRateLimitModalShow();
                        return;
                    } else if (!playlistObject) {
                        return;
                    } else {
                        if (currentTracksOffset === 0) {
                            setCurrentPlaylistObject(playlistObject);
                            console.log(playlistObject);
                        }
                    }
                })
                .catch((error) => {
                    console.error('Error while calling fetchPlaylistTracks() or fetchPlaylistObject():' +
                        error);
                    return;
                });
        }
    }, [currentUser, currentPlaylist, currentTracksOffset, navigate]);

    useEffect(() => {
        async function fetchNotes(params) {
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
            user: currentUser,
            playlist: currentPlaylist,
        });

        if (currentPlaylist) {
            fetchNotes(params)
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

    function handlePlaylistSelectScroll() {
        if (nextUserPlaylists) {
            if (DateTime.now().toSeconds() < Math.ceil(localStorage.getItem('retryAfterTime'))) {
                handleRateLimitModalShow();
            } else {
                setCurrentPlaylistsOffset(currentPlaylistsOffset + loadPlaylistsLimit);
            }
        }
    }

    function handlePlaylistChange(option) {
        if (DateTime.now().toSeconds() < Math.ceil(localStorage.getItem('retryAfterTime'))) {
            handleRateLimitModalShow();
        } else {
            if (option.value !== currentPlaylist) {
                setCurrentPlaylistTracks([]);
                setCurrentPlaylist(option.value);
                setCurrentTracksOffset(0);
                setNextPlaylistTracks('');
            }
        }
    }


    useEffect(() => {
        function isBottom(obj) {
            if (obj) {
                return obj.getBoundingClientRect().bottom <= window.innerHeight;
            } else {
                return null;
            }
        }

        function handleTracksScroll() {
            const wrappedElement = tableRef.current;
            if (isBottom(wrappedElement) && nextPlaylistTracks) {
                if (DateTime.now().toSeconds() < Math.ceil(localStorage.getItem('retryAfterTime'))) {
                    handleRateLimitModalShow();
                } else {
                    setCurrentTracksOffset(currentTracksOffset => currentTracksOffset + loadTracksLimit);
                }
            }
        }
        window.addEventListener("scroll", handleTracksScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleTracksScroll);
        };
    }, [nextPlaylistTracks]);

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

    function handleTokenRevokedToastClose() {
        setTokenRevokedToastShowing(false);
    }

    function handleRateLimitModalShow() {
        setRateLimitSecondsLeft(Math.ceil(localStorage.getItem('retryAfterTime') - DateTime.now().toSeconds()));
        setRateLimitModalShowing(true);
    }

    const handleRateLimitModalClose = useCallback(() => {
        if (retryIntervalID) {
            clearInterval(retryIntervalID);
            setRetryIntervalID(null);
        }
        setRateLimitModalShowing(false);
        setRateLimitSecondsLeft(0);
    }, [retryIntervalID]);

    useEffect(() => {
        if (!prevRateLimitSecondsLeft && rateLimitSecondsLeft > 0) {
            const intervalId = setInterval(() => {
                setRateLimitSecondsLeft(localStorage.getItem('retryAfterTime') - DateTime.now().toSeconds());
            }, 1000);
            setRetryIntervalID(intervalId);
        }
        if (rateLimitSecondsLeft <= 0 && retryIntervalID) {
            clearInterval(retryIntervalID);
            setRetryIntervalID(null);
            handleRateLimitModalClose();
        }
    }, [prevRateLimitSecondsLeft, rateLimitSecondsLeft, retryIntervalID, handleRateLimitModalClose]);

    const loggedInTemplate = (
        <div>
            <PlaylistSelect
                userPlaylists={userPlaylists}
                handlePlaylistSelectScroll={handlePlaylistSelectScroll}
                handlePlaylistChange={handlePlaylistChange}
            />
            {currentPlaylistTracks.length > 0 && currentPlaylistObject && (
                <>
                    <PlaylistCoverImage currentPlaylistObject={currentPlaylistObject} />
                    <SongCollectionTable
                        currentPlaylist={currentPlaylist}
                        currentPlaylistTracks={currentPlaylistTracks}
                        handleAddNoteModalShow={handleAddNoteModalShow}
                        handleEditNoteModalShow={handleEditNoteModalShow}
                        handleDeleteNoteModalShow={handleDeleteNoteModalShow}
                        notes={notes}
                        ref={tableRef}
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
            <RateLimitModal
                isRateLimitModalShowing={isRateLimitModalShowing}
                handleRateLimitModalClose={handleRateLimitModalClose}
            />
        </div>
    );
    const loggedOutTemplate = (
        <>
            <LogInButton />
            <TokenRevokedToast
                isTokenRevokedToastShowing={isTokenRevokedToastShowing}
                handleTokenRevokedToastClose={handleTokenRevokedToastClose}
            />
        </>
    );

    return (
        <div>
            {isLoggedIn && userPlaylists.length > 0 ? loggedInTemplate : loggedOutTemplate}
        </div>
    );
}
