import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import LoadingSpinner from '../components/LoadingSpinner';
import FormContainer from '../components/UI/FormContainer';
import { register } from '../redux/actions/userActions';
import { useTranslation } from '../hooks/useTranslation';

const RegisterScreen = (props) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const dispatch = useDispatch();
    const userRegister = useSelector(state => state.userRegister);
    const { loading, error, userInfo } = userRegister;
    const { t } = useTranslation();

    const redirect = props.location.search ? props.location.search.split('=')[1] : '/';

    useEffect(() => {
        if (userInfo) {
            props.history.push(redirect);
        }
    }, [props.history, userInfo, redirect]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage(t('passwordsDoNotMatch'));
        } else {
            dispatch(register(name, email, password));
        }
    }

    return (
        <FormContainer>
            <h1>{t('register')}</h1>
            {message && <Message variant='danger' message={message} />}
            {error && <Message variant='danger' message={error} />}
            {loading && <LoadingSpinner />}
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name'>
                    <Form.Label>{t('name')}</Form.Label>
                    <Form.Control
                        type='name'
                        placeholder={t('enterName')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='email'>
                    <Form.Label>{t('email')}</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder={t('enterEmail')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='password'>
                    <Form.Label>{t('password')}</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder={t('enterPassword')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='confirmPassword'>
                    <Form.Label>{t('confirmPassword')}</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder={t('confirmPassword')}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary'>
                    {t('register')}
                </Button>
            </Form>

            <Row className='py-3'>
                <Col>
                    {t('haveAccount')}{' '}
                    <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                        {t('login')}
                    </Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default RegisterScreen;