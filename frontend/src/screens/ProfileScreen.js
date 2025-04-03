import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Form, Button, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

// Components
import Message from '../components/Message';
import LoadingSpinner from '../components/LoadingSpinner';
import Meta from '../components/Meta';

// Redux actions
import { getUserDetails, updateUserProfile } from '../redux/actions/userActions';
import { myOrders } from '../redux/actions/orderActions';

const ProfileScreen = (props) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);

    const dispatch = useDispatch();
    const userDetails = useSelector(state => state.userDetails);
    const { loading, error, user } = userDetails;
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const userUpdateProfile = useSelector(state => state.userUpdateProfile);
    const { success } = userUpdateProfile;

    const orderMy = useSelector(state => state.orderMy);
    const { loading: loadingOrders, error: errorOrders, orders } = orderMy;

    useEffect(() => {
        // If user is not logged in
        if (!userInfo) {
            props.history.push('/login');
        }
        else {
            if (!user) {
                dispatch(getUserDetails('profile'));
                dispatch(myOrders());
            }
            else {
                setName(user.name);
                setEmail(user.email);
            }
        }
    }, [dispatch, userInfo, props.history, user]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
        }
        else {
            dispatch(updateUserProfile({ id: user._id, name, email, password }));
        }
    }


    return <Row>
        <Meta title='ProShop | My Profile' />
        {/* Update form */}
        <Col md={3}>
            <h2>Hồ sơ người dùng</h2>
            {message && <Message variant='danger' message={message} />}
            {error && <Message variant='danger' message={error} />}
            {success && <Message variant='success' message='Cập nhật thông tin thành công' />}
            {loading && <LoadingSpinner />}
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name'>
                    <Form.Label>Họ tên</Form.Label>
                    <Form.Control
                        type='name'
                        placeholder='Nhập họ tên'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Nhập email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='password'>
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Nhập mật khẩu'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='confirmPassword'>
                    <Form.Label>Xác nhận mật khẩu</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Xác nhận mật khẩu'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary'>
                    Cập nhật
                </Button>
            </Form>
        </Col>
        {/* Orders */}
        <Col md={9}>
            <h2>Đơn hàng của tôi</h2>
            {loadingOrders ? <LoadingSpinner /> : errorOrders ? <Message variant='danger' message={errorOrders} /> : (
                orders.length === 0 ? <Message variant='info' message='No orders placed' /> : (
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Ngày đặt</th>
                                <th>Tổng tiền</th>
                                <th>Thanh toán</th>
                                <th>Giao hàng</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>{order.totalPrice.toLocaleString('vi-VN')} VNĐ</td>
                                    <td>{order.isPaid ? order.paidAt.substring(0, 10) : <i className='fas fa-times' style={{ color: 'red' }} />}</td>
                                    <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : <i className='fas fa-times' style={{ color: 'red' }} />}</td>
                                    <td>
                                        <LinkContainer to={`/orders/${order._id}`}>
                                            <Button className='btn-sm' variant='light'>Chi tiết</Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>)
            )}
        </Col>
    </Row>
}

export default ProfileScreen;