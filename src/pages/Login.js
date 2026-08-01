import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { login as loginRequest } from '../services/authService';
import useAuth from '../hooks/useAuth';
import { USER_ROLES } from '../constants/userRole';

const initialFormState = {
  role: USER_ROLES.CUSTOMER,
  email: '',
  password: '',
};

export default function Login() {
  const [formState, setFormState] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const { login } = useAuth();
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
      const response = await loginRequest({
        userRole: formState.role,
        userEmail: formState.email,
        userPassword: formState.password,
      });

      const authenticatedUser = response?.data?.user ?? response?.data ?? null;

      if (authenticatedUser) {
        login({
          user: authenticatedUser,
          token: response?.data?.token ?? null,
        });
      }

      navigate(formState.role === USER_ROLES.ADMIN ? '/admin' : '/customer', { replace: true });
    } catch (error) {
      setApiError(error?.response?.data?.message || error.message || 'Login failed.');
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
                <div className="text-uppercase text-primary fw-semibold small mb-2">Login</div>
                <h1 className="h3 mb-2">Welcome back</h1>
                <p className="text-body-secondary mb-0">Sign in to continue to your reservation dashboard.</p>
              </div>

              {apiError ? <Alert variant="danger">{apiError}</Alert> : null}

              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="loginRole">
                  <Form.Label>Role</Form.Label>
                  <Form.Select name="role" value={formState.role} onChange={handleChange} isInvalid={Boolean(errors.role)}>
                    <option value={USER_ROLES.ADMIN}>ADMIN</option>
                    <option value={USER_ROLES.CUSTOMER}>CUSTOMER</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.role}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="loginEmail">
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

                <Form.Group className="mb-4" controlId="loginPassword">
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

                <div className="d-flex gap-3 flex-wrap">
                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? 'Signing in...' : 'Login'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}