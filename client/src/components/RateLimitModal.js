import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { DateTime } from 'luxon';

export default function RateLimitModal(props) {
    const rateLimitSecondsLeftString = DateTime.now().plus(props.rateLimitSecondsLeft * 1000).toRelative();
    return (
        <Modal show={props.isRateLimitModalShowing} onHide={props.handleRateLimitModalClose} centered>
            <Modal.Header className="bg-dark text-white" closeButton closeVariant="white">
                <Modal.Title>Error: Rate limit reached</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-white text-start">
                Too many requests sent to Spotify. Please try again {rateLimitSecondsLeftString}.
            </Modal.Body>
            <Modal.Footer className="bg-dark text-white">
                <Button id="cancelBtn" variant="secondary" onClick={props.handleRateLimitModalClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}