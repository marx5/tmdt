import React, { useState, useEffect } from 'react';
import { Row, Col, ListGroup, Image, Card, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../redux/actions/orderActions';
import { clearCart } from '../redux/actions/cartActions';
import { useTranslation } from '../hooks/useTranslation';
import { BASE_URL } from '../redux/actions/axiosConfig';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';

const PlaceOrderScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const cart = useSelector(state => state.cart);
    const orderCreate = useSelector(state => state.orderCreate);
    const { order, success, error } = orderCreate;
    const [paymentMethod, setPaymentMethod] = useState('COD');

    // Calculate prices
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    cart.itemsPrice = addDecimals(
        cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );

    cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 10);
    cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));
    cart.totalPrice = (
        Number(cart.itemsPrice) +
        Number(cart.shippingPrice) +
        Number(cart.taxPrice)
    ).toFixed(2);

    useEffect(() => {
        if (success) {
            dispatch(clearCart());
            navigate(`/orders/${order._id}`);
        }
        // eslint-disable-next-line
    }, [success]);

    const placeOrderHandler = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        }));
    };

    return (
        <>
            <CheckoutSteps step1 step2 step3 />
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>{t('shippingAddress')}</h2>
                            <p>
                                <strong>{t('address')}:</strong>{' '}
                                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                                {cart.shippingAddress.postalCode},{' '}
                                {cart.shippingAddress.country}
                            </p>
                            <p>
                                <strong>{t('phone')}:</strong>{' '}
                                {cart.shippingAddress.phone}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>{t('paymentMethod')}</h2>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <Form.Check
                                        type='radio'
                                        label={t('cod')}
                                        id='COD'
                                        name='paymentMethod'
                                        value='COD'
                                        checked={paymentMethod === 'COD'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                </ListGroup.Item>
                            </ListGroup>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>{t('orderItems')}</h2>
                            {cart.cartItems.length === 0 ? (
                                <Message variant='info' message={t('emptyCart')} />
                            ) : (
                                <ListGroup variant='flush'>
                                    {cart.cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image
                                                        src={`${BASE_URL}${item.image}`}
                                                        alt={item.name}
                                                        fluid
                                                        rounded
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x {item.price.toLocaleString('vi-VN')} VNĐ ={' '}
                                                    {(item.qty * item.price).toLocaleString('vi-VN')} VNĐ
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>{t('orderSummary')}</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>{t('items')}</Col>
                                    <Col>{cart.itemsPrice.toLocaleString('vi-VN')} VNĐ</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>{t('shipping')}</Col>
                                    <Col>{cart.shippingPrice.toLocaleString('vi-VN')} VNĐ</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>{t('tax')}</Col>
                                    <Col>{cart.taxPrice.toLocaleString('vi-VN')} VNĐ</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>{t('total')}</Col>
                                    <Col>{cart.totalPrice.toLocaleString('vi-VN')} VNĐ</Col>
                                </Row>
                            </ListGroup.Item>
                            {error && (
                                <ListGroup.Item>
                                    <Message variant='danger' message={error} />
                                </ListGroup.Item>
                            )}
                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    className='btn-block'
                                    disabled={cart.cartItems.length === 0}
                                    onClick={placeOrderHandler}
                                >
                                    {t('placeOrder')}
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default PlaceOrderScreen;