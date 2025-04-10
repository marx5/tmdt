import React, { useEffect, useState } from 'react';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

// Components
import Message from '../components/Message';
import LoadingSpinner from '../components/LoadingSpinner';
import Meta from '../components/Meta';

// Redux actions
import { getOrderDetails, payOrder, deliverOrder } from '../redux/actions/orderActions';
import { useTranslation } from '../hooks/useTranslation';
import { ORDER_PAY_RESET } from '../redux/constants/orderConstants';

const OrderScreen = () => {
    const { id: orderId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    // SDK ready state
    const [sdkReady, setSdkReady] = useState(false);

    const orderDetails = useSelector(state => state.orderDetails);
    const { order, loading, error } = orderDetails;

    const orderPay = useSelector(state => state.orderPay);
    const { success: paySuccess, loading: payLoading } = orderPay;
    const orderDeliver = useSelector(state => state.orderDeliver);
    const { success: deliverSuccess, loading: deliverLoading } = orderDeliver;
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    // Calculation
    if (!loading && !error && order) {
        order.itemsPrice = order.orderItems.reduce((acc, item) => {
            return acc + (item.price * item.qty)
        }, 0)
    }

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }

        const addPayPalScript = async () => {
            setSdkReady(true);
        };

        if (!order || paySuccess || deliverSuccess || order._id !== orderId) {
            dispatch({ type: ORDER_PAY_RESET });
            dispatch({ type: 'ORDER_DELIVER_RESET' });
            dispatch(getOrderDetails(orderId));
        } else if (!order.isPaid) {
            if (!window.paypal) {
                addPayPalScript();
            } else {
                setSdkReady(true);
            }
        }
    }, [dispatch, orderId, order, paySuccess, deliverSuccess, userInfo, navigate]);

    // Handles success from PayPal button
    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult));
    }

    const handleMarkAsDelivered = (e) => {
        e.preventDefault();
        dispatch(deliverOrder(order._id));
    }

    return loading ? <LoadingSpinner /> : error ? <Message variant='danger' message={error} /> : <>
        <Meta title={`${t('orderId')} ${order._id}`} />
        <h1>{t('orderId')} {order._id}</h1>
        <Row>
            <Col md={8}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>{t('deliveryAddress')}</h2>
                        <p>
                            <strong>{t('name')}: </strong> {order.user.name}
                        </p>
                        <p>
                            <strong>{t('email')}: </strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                        </p>
                        <p>
                            <strong>{t('address')}: </strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                        {order.isDelivered ? (
                            <Message variant='success' message={`${t('delivered')} ${order.deliveredAt}`} />
                        ) : (
                            <Message variant='danger' message={t('notDelivered')} />
                        )}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>{t('paymentMethod')}</h2>
                        <p>
                            <strong>{t('method')}: </strong>
                            {order.paymentMethod === 'PayPal' ? (
                                <span>
                                    <i className="fab fa-paypal" style={{ color: '#0070ba', marginRight: '5px' }}></i>
                                    {order.paymentMethod}
                                </span>
                            ) : order.paymentMethod === 'COD' ? (
                                <span>
                                    <i className="fas fa-money-bill-wave" style={{ color: '#28a745', marginRight: '5px' }}></i>
                                    Thanh toán khi nhận hàng
                                </span>
                            ) : (
                                <span>
                                    <i className="fas fa-credit-card" style={{ color: '#6c757d', marginRight: '5px' }}></i>
                                    {order.paymentMethod}
                                </span>
                            )}
                        </p>
                        {order.isPaid ? (
                            <Message variant='success' message={`${t('paidOn')} ${order.paidAt}`} />
                        ) : (
                            <Message variant='danger' message={t('notPaid')} />
                        )}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>{t('orderItems')}</h2>
                        {order.orderItems.length === 0 ? (<Message variant='info' message={t('emptyCart')} />) : (
                            <ListGroup variant='flush'>
                                {order.orderItems.map((item, index) => {
                                    return <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={1}>
                                                <Image src={item.image} alt={item.name} fluid rounded />
                                            </Col>
                                            <Col>
                                                <Link to={`/product/${item.product}`}>
                                                    {item.name}
                                                </Link>
                                            </Col>
                                            <Col md={4}>
                                                        {item.qty} x {item.price.toLocaleString('vi-VN')} VNĐ = {(item.qty * item.price).toLocaleString('vi-VN')} VNĐ
                                                    </Col>
                                        </Row>
                                    </ListGroup.Item>
                                })}
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
                                <Col>{order.itemsPrice.toLocaleString('vi-VN')} VNĐ</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>{t('shipping')}</Col>
                                <Col>{order.shippingPrice.toLocaleString('vi-VN')} VNĐ</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>{t('tax')}</Col>
                                <Col>{order.taxPrice.toLocaleString('vi-VN')} VNĐ</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>{t('total')}</Col>
                                <Col>{order.totalPrice.toLocaleString('vi-VN')} VNĐ</Col>
                            </Row>
                        </ListGroup.Item>
                        {!order.isPaid && (
                            <ListGroup.Item>
                                {payLoading && <LoadingSpinner />}
                                {order.paymentMethod === 'PayPal' ? (
                                    !sdkReady ? (
                                        <LoadingSpinner />
                                    ) : (
                                        <PayPalScriptProvider options={{ "client-id": "YOUR_CLIENT_ID" }}>
                                            <PayPalButtons
                                                createOrder={(data, actions) => {
                                                    return actions.order.create({
                                                        purchase_units: [
                                                            {
                                                                amount: {
                                                                    value: order.totalPrice,
                                                                },
                                                            },
                                                        ],
                                                    });
                                                }}
                                                onApprove={(data, actions) => {
                                                    return actions.order.capture().then((details) => {
                                                        successPaymentHandler(details);
                                                    });
                                                }}
                                            />
                                        </PayPalScriptProvider>
                                    )
                                ) : order.paymentMethod === 'COD' ? (
                                    <Button
                                        variant="primary"
                                        className="btn-block"
                                        onClick={() => successPaymentHandler({ id: 'COD' })}
                                    >
                                        <i className="fas fa-money-bill-wave" style={{ marginRight: '5px' }}></i>
                                        Xác nhận đơn hàng
                                    </Button>
                                ) : (
                                    <Button
                                        variant="primary"
                                        className="btn-block"
                                        onClick={() => successPaymentHandler({ id: 'OTHER' })}
                                    >
                                        <i className="fas fa-credit-card" style={{ marginRight: '5px' }}></i>
                                        Thanh toán
                                    </Button>
                                )}
                            </ListGroup.Item>
                        )}
                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <ListGroup.Item>
                                <Button type='button' className='btn btn-block' onClick={handleMarkAsDelivered}>
                                    {t('markAsDelivered')}
                                </Button>
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </>
}

export default OrderScreen;