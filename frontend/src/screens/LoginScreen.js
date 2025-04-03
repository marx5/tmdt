import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import LoadingSpinner from '../components/LoadingSpinner';
import FormContainer from '../components/UI/FormContainer';
import { login } from '../redux/actions/userActions';
import { useTranslation } from '../hooks/useTranslation';
import Meta from '../components/Meta';

const LoginScreen = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const userLogin = useSelector(state => state.userLogin);
    const { loading, error, userInfo } = userLogin;
    const { t } = useTranslation();

    const redirect = props.location.search ? props.location.search.split('=')[1] : '/';

    useEffect(() => {
        if (userInfo) {
            props.history.push(redirect);
        }
    }, [props.history, userInfo, redirect]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    }

    return (
        <FormContainer>
            <Meta title='ProShop | Sign In' />
            <h1>{t('login')}</h1>
            {/* {console.log(error)} */}
            {error && <Message variant='danger' message={error} />}
            {loading && <LoadingSpinner />}
            <Form onSubmit={submitHandler}>
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

                <Button type='submit' variant='primary'>
                    {t('login')}
                </Button>
            </Form>

            <Row className='py-3'>
                <Col>
                    {t('newCustomer')}{' '}
                    <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                        {t('register')}
                    </Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default LoginScreen;