import { useState, useEffect } from 'react';
import LogInButton from './LogInButton';
import PlaylistSelect from './PlaylistSelect';
import SongCollectionTable from './SongCollectionTable';

export default function NotesList(props) {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const code = new URLSearchParams(window.location.search).get('code');
    const state = new URLSearchParams(window.location.search).get('state');

    useEffect(() => {
        async function getAccessToken() {
            const response = await fetch('http://localhost:5000/callback?' + params.toString(), {credentials: 'include'});
    
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
    
            const playlists = await response;
            console.log(playlists);
        }

        const params = new URLSearchParams({
            code: code,
            state: state
        });

        if (code && state && !isLoggedIn) {
            setLoggedIn(true);
            getAccessToken();
        }
    }, [code, state, isLoggedIn]);
    
    const loggedInTemplate = (
        <div>
            <PlaylistSelect userPlaylists={props.userPlaylists} />
            <SongCollectionTable />
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
