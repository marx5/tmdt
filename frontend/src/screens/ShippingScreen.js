import React, { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/UI/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../redux/actions/cartActions';
import { savePaymentMethod } from '../redux/actions/cartActions';
import { useTranslation } from '../hooks/useTranslation';
import './ShippingScreen.scss';

const ShippingScreen = () => {
    const cart = useSelector(state => state.cart);
    const { shippingAddress } = cart;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [fullName, setFullName] = useState(shippingAddress?.fullName || '');
    const [phone, setPhone] = useState(shippingAddress?.phone || '');
    const [address, setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');
    const [error, setError] = useState('');

    const validatePhone = (phone) => {
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        return phoneRegex.test(phone);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (!fullName || !phone || !address || !city || !postalCode || !country) {
            setError(t('allFieldsRequired'));
            return;
        }
        if (!validatePhone(phone)) {
            setError(t('invalidPhone'));
            return;
        }
        dispatch(saveShippingAddress({ 
            fullName,
            phone, 
            address, 
            city, 
            postalCode, 
            country 
        }));
        dispatch(savePaymentMethod('COD')); // Tự động chọn COD
        navigate('/placeorder');
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 />
            <div className="shipping-screen">
                <Card className="shipping-screen__card">
                    <Card.Body>
                        <h1 className="shipping-screen__title">{t('shippingAddress')}</h1>
                        {error && <div className="shipping-screen__error">{error}</div>}
                        <Form onSubmit={submitHandler} className="shipping-screen__form">
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId='fullName' className='mb-3'>
                                        <Form.Label>{t('fullName')}</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder={t('enterFullName')}
                                            value={fullName}
                                            required
                                            onChange={(e) => setFullName(e.target.value)}
                                        ></Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId='phone' className='mb-3'>
                                        <Form.Label>{t('phone')}</Form.Label>
                                        <Form.Control
                                            type='tel'
                                            placeholder={t('enterPhone')}
                                            value={phone}
                                            required
                                            onChange={(e) => setPhone(e.target.value)}
                                        ></Form.Control>
                                        <Form.Text className="text-muted">
                                            {t('phoneFormat')}
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group controlId='address' className='mb-3'>
                                <Form.Label>{t('address')}</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder={t('enterAddress')}
                                    value={address}
                                    required
                                    onChange={(e) => setAddress(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId='city' className='mb-3'>
                                        <Form.Label>{t('city')}</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder={t('enterCity')}
                                            value={city}
                                            required
                                            onChange={(e) => setCity(e.target.value)}
                                        ></Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId='postalCode' className='mb-3'>
                                        <Form.Label>{t('postalCode')}</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder={t('enterPostalCode')}
                                            value={postalCode}
                                            required
                                            onChange={(e) => setPostalCode(e.target.value)}
                                        ></Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group controlId='country' className='mb-4'>
                                <Form.Label>{t('country')}</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder={t('enterCountry')}
                                    value={country}
                                    required
                                    onChange={(e) => setCountry(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Button 
                                type='submit' 
                                variant='primary' 
                                className='shipping-screen__submit-btn'
                            >
                                {t('continue')}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </FormContainer>
    )
}

export default ShippingScreen;