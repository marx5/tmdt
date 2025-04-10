import React, { useEffect, useState } from 'react';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../redux/actions/axiosConfig';

// Components
import Message from '../components/Message';
import LoadingSpinner from '../components/LoadingSpinner';
import Meta from '../components/Meta';

// Redux actions
import { getOrderDetails, deliverOrder } from '../redux/actions/orderActions';
import { useTranslation } from '../hooks/useTranslation';

const OrderScreen = () => {
    const { id: orderId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const orderDetails = useSelector(state => state.orderDetails);
    const { order, loading, error } = orderDetails;

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

        if (!order || deliverSuccess || order._id !== orderId) {
            dispatch({ type: 'ORDER_DELIVER_RESET' });
            dispatch(getOrderDetails(orderId));
        }
    }, [dispatch, orderId, order, deliverSuccess, userInfo, navigate]);

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
                        <h2>{t('orderItems')}</h2>
                        {order.orderItems.length === 0 ? (<Message variant='info' message={t('emptyCart')} />) : (
                            <ListGroup variant='flush'>
                                {order.orderItems.map((item, index) => {
                                    return <ListGroup.Item key={index}>
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
                        {userInfo && userInfo.isAdmin && !order.isDelivered && (
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