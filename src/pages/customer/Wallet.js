import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import Loader from '../../components/Loader';
import useAuth from '../../hooks/useAuth';
import { addMoney, getWallet } from '../../services/walletService';

function resolveWalletBalance(response) {
  const data = response?.data ?? response;

  return data?.walletBalance ?? data?.balance ?? data?.data?.walletBalance ?? data?.data?.balance ?? data ?? null;
}

export default function Wallet() {
  const { user } = useAuth();
  const userId = user?.userId ?? user?.id ?? null;

  const [walletBalance, setWalletBalance] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadWallet = async () => {
    if (!userId) {
      setError('User information is unavailable. Please log in again.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await getWallet(userId);
      setWalletBalance(resolveWalletBalance(response));
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || 'Unable to load wallet details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
  }, [userId]);

  const handleAddMoney = async (event) => {
    event.preventDefault();

    if (!userId) {
      setError('User information is unavailable. Please log in again.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await addMoney({
        userId,
        amount: Number(amount),
      });

      setSuccess('Money added successfully.');
      setAmount('');
      await loadWallet();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || 'Unable to add money.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader text="Loading wallet..." />;
  }

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h1 className="h3 mb-2">Wallet</h1>
        <p className="text-body-secondary mb-0">View your wallet balance and add money.</p>
      </div>

      {error ? <Alert variant="danger">{error}</Alert> : null}
      {success ? <Alert variant="success">{success}</Alert> : null}

      <Row className="g-3">
        <Col md={6}>
          <Card className="shadow-sm border-0 rounded-4 h-100">
            <Card.Body className="p-4 d-flex flex-column gap-2">
              <div className="text-body-secondary small">Wallet Balance</div>
              <div className="display-6 mb-0">{walletBalance ?? '0'}</div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm border-0 rounded-4 h-100">
            <Card.Body className="p-4">
              <Form onSubmit={handleAddMoney}>
                <Form.Group controlId="addMoneyAmount" className="mb-3">
                  <Form.Label>Add Money</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="Enter amount"
                    required
                  />
                </Form.Group>

                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Money'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}