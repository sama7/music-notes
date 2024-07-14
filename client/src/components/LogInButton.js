export default function LogInButton(props) {
    const production = 'https://www.playlistnotes.io';
    const development = `http://localhost:${process.env.REACT_APP_DEV_SERVER_PORT}`;

    function Button(props) {
        if (process.env.REACT_APP_ENV === 'production') {
            return (
                <a
                    href={`${production}/api/login`}
                    className="btn btn-primary login-btn"
                >
                    Log in with Spotify
                </a>
            );
        }
        // otherwise, we're in dev
        return (
            <a
                href={`${development}/api/login`}
                className="btn btn-primary login-btn"
            >
                Log in with Spotify
            </a>
        );
    }

    return (
        <Button />
    );
}
