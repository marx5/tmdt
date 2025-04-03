import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/UI/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../redux/actions/cartActions';
import { useTranslation } from '../hooks/useTranslation';

const ShippingScreen = (props) => {
    const cart = useSelector(state => state.cart);
    const { shippingAddress } = cart;
    const { t } = useTranslation();

    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode }));
        props.history.push('/payment');
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 />
            <h1>{t('shippingAddress')}</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='address'>
                    <Form.Label>{t('address')}</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder={t('enterAddress')}
                        value={address}
                        required
                        onChange={(e) => setAddress(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='city'>
                    <Form.Label>{t('city')}</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder={t('enterCity')}
                        value={city}
                        required
                        onChange={(e) => setCity(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='postalCode'>
                    <Form.Label>{t('postalCode')}</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder={t('enterPostalCode')}
                        value={postalCode}
                        required
                        onChange={(e) => setPostalCode(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary'>
                    {t('continue')}
                </Button>
            </Form>
        </FormContainer>
    )
}

export default ShippingScreen;