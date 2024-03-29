import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function AddNoteModal(props) {
    return (
        <Modal show={props.isAddNoteModalShowing} onHide={props.handleAddNoteModalClose} centered>
            <Modal.Header className="bg-dark text-white" closeButton closeVariant="white">
                <Modal.Title>Add Note</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-white">
                <Form>
                    <Form.Group
                        className="mb-3"
                        controlId="addNoteModal.ControlTextarea"
                    >
                        <Form.Label>Enter note text:</Form.Label>
                        <Form.Control className="bg-dark text-white" as="textarea" rows={3} autoFocus onChange={props.handleNoteChange} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="bg-dark text-white">
                <Button id="cancelBtn" variant="secondary" onClick={props.handleAddNoteModalClose}>
                    Cancel
                </Button>
                <Button id="confirmBtn" variant="primary" type="submit" onClick={props.handleAddNoteSubmit}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}