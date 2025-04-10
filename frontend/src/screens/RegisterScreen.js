import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import LoadingSpinner from '../components/LoadingSpinner';
import FormContainer from '../components/UI/FormContainer';
import { register } from '../redux/actions/userActions';
import { useTranslation } from '../hooks/useTranslation';

// Styles
import './RegisterScreen.scss';

const RegisterScreen = (props) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordRequirements, setPasswordRequirements] = useState({
        hasMinLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
        passwordsMatch: false
    });

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

    // Validate password requirements
    useEffect(() => {
        const requirements = {
            hasMinLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            passwordsMatch: password === confirmPassword && password !== ''
        };
        setPasswordRequirements(requirements);
    }, [password, confirmPassword]);

    const isPasswordValid = () => {
        return Object.values(passwordRequirements).every(req => req);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage(t('passwordsDoNotMatch'));
        } else if (!isPasswordValid()) {
            setMessage(t('passwordRequirementsNotMet'));
        } else {
            dispatch(register(name, email, password));
        }
    }

    return (
        <div className="register-container">
            <h1 className="register-title">{t('register')}</h1>
            {message && <Message variant='danger' message={message} />}
            {error && <Message variant='danger' message={error} />}
            {loading && <LoadingSpinner />}
            <Form onSubmit={submitHandler} className="register-form">
                <Form.Group className="register-form-group">
                    <Form.Label className="register-form-label">{t('name')}</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder={t('enterName')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="register-form-input"
                        required
                    />
                </Form.Group>

                <Form.Group className="register-form-group">
                    <Form.Label className="register-form-label">{t('email')}</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder={t('enterEmail')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="register-form-input"
                        required
                    />
                </Form.Group>

                <Form.Group className="register-form-group">
                    <Form.Label className="register-form-label">{t('password')}</Form.Label>
                    <div className="register-form-password">
                        <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t('enterPassword')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`register-form-input ${password && (isPasswordValid() ? 'valid' : 'error')}`}
                            required
                        />
                        <button
                            type="button"
                            className="register-form-password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                    <div className="register-form-requirements">
                        <div className="register-form-requirements-title">{t('passwordRequirements')}:</div>
                        <ul className="register-form-requirements-list">
                            <li className={`register-form-requirements-item ${passwordRequirements.hasMinLength ? 'valid' : 'invalid'}`}>
                                {t('passwordMinLength')}
                            </li>
                            <li className={`register-form-requirements-item ${passwordRequirements.hasUpperCase ? 'valid' : 'invalid'}`}>
                                {t('passwordUpperCase')}
                            </li>
                            <li className={`register-form-requirements-item ${passwordRequirements.hasLowerCase ? 'valid' : 'invalid'}`}>
                                {t('passwordLowerCase')}
                            </li>
                            <li className={`register-form-requirements-item ${passwordRequirements.hasNumber ? 'valid' : 'invalid'}`}>
                                {t('passwordNumber')}
                            </li>
                            <li className={`register-form-requirements-item ${passwordRequirements.hasSpecialChar ? 'valid' : 'invalid'}`}>
                                {t('passwordSpecialChar')}
                            </li>
                            <li className={`register-form-requirements-item ${passwordRequirements.passwordsMatch ? 'valid' : 'invalid'}`}>
                                {t('passwordsMatch')}
                            </li>
                        </ul>
                    </div>
                </Form.Group>

                <Form.Group className="register-form-group">
                    <Form.Label className="register-form-label">{t('confirmPassword')}</Form.Label>
                    <div className="register-form-password">
                        <Form.Control
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder={t('confirmPassword')}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`register-form-input ${confirmPassword && (passwordRequirements.passwordsMatch ? 'valid' : 'error')}`}
                            required
                        />
                        <button
                            type="button"
                            className="register-form-password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                </Form.Group>

                <Button
                    type='submit'
                    variant='primary'
                    className="register-form-submit"
                    disabled={!isPasswordValid()}
                >
                    {t('register')}
                </Button>
            </Form>

            <Row className='py-3'>
                <Col className="register-login">
                    {t('haveAccount')}{' '}
                    <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                        {t('login')}
                    </Link>
                </Col>
            </Row>
        </div>
    )
}

export default RegisterScreen;