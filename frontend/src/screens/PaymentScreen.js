import React, { useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/UI/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../redux/actions/cartActions';
import { useTranslation } from '../hooks/useTranslation';

const PaymentScreen = (props) => {
    const cart = useSelector(state => state.cart);
    const { shippingAddress } = cart;
    const { t } = useTranslation();

    if (!shippingAddress) {
        props.history.push('/shipping');
    }

    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        props.history.push('/placeorder');
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <h1>{t('paymentMethod')}</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>{t('selectMethod')}</Form.Label>
                    <Col>
                        <Form.Check
                            type='radio'
                            label={t('paypal')}
                            id='PayPal'
                            name='paymentMethod'
                            value='PayPal'
                            checked
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        ></Form.Check>
                    </Col>
                </Form.Group>

                <Button type='submit' variant='primary'>
                    {t('continue')}
                </Button>
            </Form>
        </FormContainer>
    )
}

export default PaymentScreen;