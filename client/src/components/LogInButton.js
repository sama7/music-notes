export default function LogInButton(props) {
    const production = 'https://musicnotes.herokuapp.com';
    const development = 'http://localhost:5000';

    function Button(props) {
        if (process.env.REACT_APP_ENV === 'production') {
            return (
                <a
                    href={`${production}/login`}
                    className="btn btn-primary login-btn"
                >
                    Log in
                </a>
            );
        }
        // otherwise, we're in dev
        return (
            <a
                href={`${development}/login`}
                className="btn btn-primary login-btn"
            >
                Log in
            </a>
        );
    }

    return (
        <Button />
    );
}
