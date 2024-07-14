import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

export default function TokenRevokedToast(props) {
    return (
        <ToastContainer className="m-3" position="top-end">
            <Toast
                className="bg-dark text-white text-start"
                onClose={props.handleTokenRevokedToastClose}
                show={props.isTokenRevokedToastShowing}
                delay={3000}
                autohide
            >
                <Toast.Header closeButton={false}>
                    <strong className="me-auto">Playlistnotes</strong>
                </Toast.Header>
                <Toast.Body>Refresh token has expired or been revoked. Please log in again.</Toast.Body>
            </Toast>
        </ToastContainer>
    );
}