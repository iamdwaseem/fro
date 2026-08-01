import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { register as registerRequest } from '../services/authService';
import { USER_ROLES } from '../constants/userRole';

const initialFormState = {
  role: USER_ROLES.CUSTOMER,
  email: '',
  password: '',
};

export default function Register() {
  const [formState, setFormState] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState((currentState) => ({
      ...currentState,
      [name]: value,
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formState.role) {
      nextErrors.role = 'Role is required.';
    }

    if (!formState.email) {
      nextErrors.email = 'Email is required.';
    }

    if (!formState.password) {
      nextErrors.password = 'Password is required.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    setApiError('');

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      await registerRequest({
        userRole: formState.role,
        userEmail: formState.email,
        userPassword: formState.password,
      });

      navigate('/login', { replace: true });
    } catch (error) {
      setApiError(error?.response?.data?.message || error.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xl={6} lg={7} md={9}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body className="p-4 p-md-5">
              <div className="mb-4">
                <div className="text-uppercase text-primary fw-semibold small mb-2">Register</div>
                <h1 className="h3 mb-2">Create your account</h1>
                <p className="text-body-secondary mb-0">Register to access the flight reservation system.</p>
              </div>

              {apiError ? <Alert variant="danger">{apiError}</Alert> : null}

              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="registerRole">
                  <Form.Label>Role</Form.Label>
                  <Form.Select name="role" value={formState.role} onChange={handleChange} isInvalid={Boolean(errors.role)}>
                    <option value={USER_ROLES.ADMIN}>ADMIN</option>
                    <option value={USER_ROLES.CUSTOMER}>CUSTOMER</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.role}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="registerEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formState.email}
                    onChange={handleChange}
                    isInvalid={Boolean(errors.email)}
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="registerPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formState.password}
                    onChange={handleChange}
                    isInvalid={Boolean(errors.password)}
                  />
                  <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Registering...' : 'Register'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}