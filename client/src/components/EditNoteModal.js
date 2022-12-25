import { forwardRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const EditNoteModal = forwardRef(function EditNoteModal(props, ref) {
    return (
        <Modal show={props.isEditNoteModalShowing} onHide={props.handleEditNoteModalClose} centered>
            <Modal.Header className="bg-dark text-white" closeButton closeVariant="white">
                <Modal.Title>Edit Note</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-white">
                <Form>
                    <Form.Group
                        className="mb-3"
                        controlId="editNoteModal.ControlTextarea"
                    >
                        <Form.Label>Enter note text:</Form.Label>
                        <Form.Control
                            className="bg-dark text-white"
                            as="textarea"
                            rows={3}
                            autoFocus
                            defaultValue={props.currentNote}
                            onChange={props.handleNoteChange}
                            ref={ref}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="bg-dark text-white">
                <Button id="cancelBtn" variant="secondary" onClick={props.handleEditNoteModalClose}>
                    Cancel
                </Button>
                <Button id="confirmBtn" variant="primary" type="submit" onClick={props.handleEditNoteSubmit}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default EditNoteModal;