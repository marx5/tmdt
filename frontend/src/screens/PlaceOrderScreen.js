import React, { useEffect } from 'react';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import { createOrder } from '../redux/actions/orderActions';
import { clearCart } from '../redux/actions/cartActions';
import { useTranslation } from '../hooks/useTranslation';
import { BASE_URL } from '../redux/actions/axiosConfig';

// Styles
import './PlaceOrderScreen.scss';

const PlaceOrderScreen = () => {
    const cart = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Calculate prices
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    }

    cart.itemsPrice = addDecimals(
        cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
    cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);
    cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));
    cart.totalPrice = (
        Number(cart.itemsPrice) +
        Number(cart.shippingPrice) +
        Number(cart.taxPrice)
    ).toFixed(2);

    const orderCreate = useSelector(state => state.orderCreate);
    const { order, success, error } = orderCreate;

    useEffect(() => {
        if (success) {
            dispatch(clearCart());
            navigate(`/orders/${order._id}`);
        }
        // eslint-disable-next-line
    }, [success]);

    const placeOrderHandler = () => {
        dispatch(
            createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            })
        );
    }

    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <div className="place-order-container">
                <Row>
                    <Col md={8}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>{t('shippingAddress')}</h2>
                                <p>
                                    <strong>{t('address')}: </strong>
                                    {`${cart.shippingAddress.address}, ${cart.shippingAddress.city}, ${cart.shippingAddress.postalCode}`}
                                </p>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>{t('paymentMethod')}</h2>
                                <strong>{t('method')}: </strong>
                                {cart.paymentMethod}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>{t('orderItems')}</h2>
                                {cart.cartItems.length === 0 ? (<Message variant='info' message={t('emptyCart')} />) : (
                                    <ListGroup variant='flush'>
                                        {cart.cartItems.map((item, index) => (
                                            <ListGroup.Item key={index} className="place-order-items-item">
                                                <Row className="align-items-center">
                                                    <Col md={2}>
                                                        <img
                                                            src={`${BASE_URL}${item.image}`}
                                                            alt={item.name}
                                                            className="place-order-items-image"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = `${BASE_URL}/uploads/default-product.jpg`;
                                                            }}
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <Link to={`/product/${item.product}`} className="place-order-items-name">
                                                            {item.name}
                                                        </Link>
                                                        <div className="place-order-items-details">
                                                            {item.color && (
                                                                <span className="place-order-items-details-color">
                                                                    <span 
                                                                        className="place-order-items-details-color-box"
                                                                        style={{ backgroundColor: item.color }}
                                                                    />
                                                                    {item.color}
                                                                </span>
                                                            )}
                                                            {item.size && (
                                                                <span className="place-order-items-details-size">
                                                                    Size: {item.size}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col md={4} className="place-order-items-price">
                                                        {item.qty} x {item.price.toLocaleString('vi-VN')} VNĐ = {(item.qty * item.price).toLocaleString('vi-VN')} VNĐ
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
                        <Card className="place-order-summary-card">
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h2 className="place-order-summary-title">{t('orderSummary')}</h2>
                                </ListGroup.Item>
                                <ListGroup.Item className="place-order-summary-item">
                                    <Row>
                                        <Col>{t('items')}</Col>
                                        <Col>{Number(cart.itemsPrice).toLocaleString('vi-VN')} VNĐ</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item className="place-order-summary-item">
                                    <Row>
                                        <Col>{t('shipping')}</Col>
                                        <Col>{Number(cart.shippingPrice).toLocaleString('vi-VN')} VNĐ</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item className="place-order-summary-item">
                                    <Row>
                                        <Col>{t('tax')}</Col>
                                        <Col>{Number(cart.taxPrice).toLocaleString('vi-VN')} VNĐ</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item className="place-order-summary-item">
                                    <Row>
                                        <Col>{t('total')}</Col>
                                        <Col className="place-order-summary-total">{Number(cart.totalPrice).toLocaleString('vi-VN')} VNĐ</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    {error && <Message variant='danger' message={error} />}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Button
                                        type='button'
                                        className='place-order-summary-button'
                                        onClick={placeOrderHandler}
                                        disabled={cart.cartItems.length === 0}
                                    >
                                        {t('placeOrder')}
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default PlaceOrderScreen;