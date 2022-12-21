import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function AddNoteModal(props) {
    return (
        <Modal show={props.isAddNoteModalShowing} onHide={props.handleAddNoteModalClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Note</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group
                        className="mb-3"
                        controlId="addNoteModal.ControlTextarea"
                    >
                        <Form.Label>Enter note text:</Form.Label>
                        <Form.Control as="textarea" rows={3} autoFocus onChange={props.handleCurrentNoteChange} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button id="cancelBtn" variant="secondary" onClick={props.handleAddNoteModalClose}>
                    Cancel
                </Button>
                <Button id="confirmBtn" variant="primary" type="submit" onClick={props.handleNoteSubmit}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}