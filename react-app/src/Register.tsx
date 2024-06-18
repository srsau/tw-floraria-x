import React, { useState } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';

interface FormData {
  nume: string;
  prenume: string;
  username: string;
  parola: string;
  confirmParola: string;
  email: string;
  dataNasterii?: string;
  culoare?: string;
  telefon?: string;
  fotografie?: File | null;
}

const initialState: FormData = {
  nume: '',
  prenume: '',
  username: '',
  parola: '',
  confirmParola: '',
  email: '',
  dataNasterii: '',
  culoare: '',
  telefon: '',
  fotografie: null,
};

const regexTelefon = /^[+]?[0-9]{1,4}[0-9]{10}$/;

export const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialState);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const validateForm = () => {
    const { nume, prenume, username, parola, confirmParola, email, telefon } =
      formData;
    if (!nume || nume.length < 3) {
      return 'Numele trebuie să fie mai mare de 2 caractere.';
    }
    if (!prenume || prenume.length < 3) {
      return 'Prenumele trebuie să fie mai mare de 2 caractere.';
    }
    if (!username) {
      return 'Username-ul este obligatoriu.';
    }
    if (!parola) {
      return 'Parola este obligatorie.';
    }
    if (parola !== confirmParola) {
      return 'Parola și confirmarea parolei nu se potrivesc.';
    }
    if (!email) {
      return 'Email-ul este obligatoriu.';
    }
    if (telefon && !regexTelefon.test(telefon)) {
      return 'Formatul numărului de telefon este invalid.';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
    } else {
      setError('');
      //   setSuccess(true);

      const dataToSend = {
        nume: formData.nume,
        prenume: formData.prenume,
        username: formData.username,
        parola: formData.parola,
        confirmParola: formData.confirmParola,
        email: formData.email,
        dataNasterii: formData.dataNasterii,
        culoare: formData.culoare,
        telefon: formData.telefon,
        fotografie: formData.fotografie ? formData.fotografie.name : null,
      };
      console.log({ dataToSend });

      try {
        const response = await fetch('http://localhost:8000/inregistrare', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });

        const result = await response.json();

        if (response.ok) {
          setSuccess(true);
        } else {
          const err = result?.error ?? 'A apărut o eroare.';
          setError(err);
        }
      } catch (error) {
        setError('A apărut o eroare la trimiterea formularului.');
      }
    }
  };

  const a = {
    nume: 'aad',
    prenume: 'aad',
    username: 'aa',
    parola: 'aa',
    confirmParola: 'aa',
    email: 'e@e.com',
    dataNasterii: '1882-02-12',
    culoare: '#a12626',
    telefon: '',
    fotografie: {},
  };

  return (
    <Container>
      <h1>Registration Form</h1>
      {success ? (
        <Alert variant="success">Un email de confirmare a fost trimis.</Alert>
      ) : (
        <>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="nume">
              <Form.Label>Nume</Form.Label>
              <Form.Control
                type="text"
                name="nume"
                value={formData.nume}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="prenume">
              <Form.Label>Prenume</Form.Label>
              <Form.Control
                type="text"
                name="prenume"
                value={formData.prenume}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="parola">
              <Form.Label>Parola</Form.Label>
              <Form.Control
                type="password"
                name="parola"
                value={formData.parola}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="confirmParola">
              <Form.Label>Reintroducere Parola</Form.Label>
              <Form.Control
                type="password"
                name="confirmParola"
                value={formData.confirmParola}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="dataNasterii">
              <Form.Label>Data Nașterii</Form.Label>
              <Form.Control
                type="date"
                name="dataNasterii"
                value={formData.dataNasterii}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="culoare">
              <Form.Label>Culoare</Form.Label>
              <Form.Control
                type="color"
                name="culoare"
                value={formData.culoare}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="telefon">
              <Form.Label>Telefon</Form.Label>
              <Form.Control
                type="tel"
                name="telefon"
                value={formData.telefon}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="fotografie">
              <Form.Label>Fotografie</Form.Label>
              <Form.Control
                type="file"
                name="fotografie"
                accept="image/*"
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </>
      )}
    </Container>
  );
};
