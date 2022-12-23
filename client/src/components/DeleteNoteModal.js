import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function DeleteNoteModal(props) {
    return (
        <Modal show={props.isDeleteNoteModalShowing} onHide={props.handleDeleteNoteModalClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Delete Note</Modal.Title>
            </Modal.Header>
            <Modal.Body autoFocus>
                <p>
                    Are you sure you want to delete the note for <b>"{props.currentTrackName}"</b> by
                    <b> {props.currentTrackArtistsNames.map((artist, index) => {
                        if (index !== props.currentTrackArtistsNames.length - 1) {
                            return <span key={index}>{artist.name}, </span>;
                        } else {
                            return <span key={index}>{artist.name}</span>;
                        }
                    })
                    }</b>
                    ?
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button id="noBtn" variant="secondary" autoFocus onClick={props.handleDeleteNoteModalClose}>
                    No
                </Button>
                <Button id="yesBtn" variant="primary" type="submit" onClick={props.handleDeleteNoteSubmit}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}