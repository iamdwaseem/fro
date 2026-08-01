import { Button, Modal } from 'react-bootstrap';

export default function ConfirmModal({
  show = false,
  title = 'Confirm Action',
  message = 'Are you sure you want to continue?',
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  onConfirm,
  onCancel,
}) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{message}</Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" type="button" onClick={onCancel}>
          {cancelButtonText}
        </Button>
        <Button variant="primary" type="button" onClick={onConfirm}>
          {confirmButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
