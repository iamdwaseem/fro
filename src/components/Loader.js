import { Spinner } from 'react-bootstrap';

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center gap-3 py-5">
      <Spinner animation="border" role="status" variant="primary" />
      {text ? <div className="text-body-secondary">{text}</div> : null}
    </div>
  );
}
