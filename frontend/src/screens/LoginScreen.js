import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import LoadingSpinner from '../components/LoadingSpinner';
import FormContainer from '../components/UI/FormContainer';
import { login } from '../redux/actions/userActions';
import { useTranslation } from '../hooks/useTranslation';
import Meta from '../components/Meta';

// Styles
import './LoginScreen.scss';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const userLogin = useSelector(state => state.userLogin);
    const { loading, error, userInfo } = userLogin;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, userInfo, redirect]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    }

    return (
        <div className="login-container">
            <Meta title='ProShop | Sign In' />
            <h1 className="login-title">{t('login')}</h1>
            {/* {console.log(error)} */}
            {error && <Message variant='danger' message={error} />}
            {loading && <LoadingSpinner />}
            <Form onSubmit={submitHandler} className="login-form">
                <Form.Group className="login-form-group">
                    <Form.Label className="login-form-label">{t('email')}</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder={t('enterEmail')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-form-input"
                    />
                </Form.Group>

                <Form.Group className="login-form-group">
                    <Form.Label className="login-form-label">{t('password')}</Form.Label>
                    <div className="login-form-password">
                        <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t('enterPassword')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-form-input"
                        />
                        <button
                            type="button"
                            className="login-form-password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                </Form.Group>

                <Button type='submit' variant='primary' className="login-form-submit">
                    {t('login')}
                </Button>
            </Form>

            <Row className='py-3'>
                <Col className="login-register">
                    {t('newCustomer')}{' '}
                    <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                        {t('register')}
                    </Link>
                </Col>
            </Row>
        </div>
    )
}

export default LoginScreen;