import React, { useEffect } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../redux/actions/cartActions';
import { useTranslation } from '../hooks/useTranslation';
import { BASE_URL } from '../redux/actions/axiosConfig';
import './CartScreen.scss';

const CartScreen = () => {
    const { id: productId } = useParams();
    const [searchParams] = useSearchParams();
    const qty = searchParams.get('qty') ? Number(searchParams.get('qty')) : 1;
    const color = searchParams.get('color') || '';
    const size = searchParams.get('size') || '';
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);
    const { cartItems } = cart;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, qty, color, size));
        }
    }, [dispatch, productId, qty, color, size]);

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    }

    const checkoutHandler = () => {
        if (userInfo) {
            navigate('/shipping');
        } else {
            navigate('/login?redirect=shipping');
        }
    }

    const updateQuantityHandler = (id, newQty, countInStock, color, size) => {
        if (newQty > 0 && newQty <= countInStock) {
            dispatch(addToCart(id, Number(newQty), color, size));
        }
    }

    return (
        <div className="cart-container">
            <Row>
                <Col md={8}>
                    <h1 className="cart-title">{t('shoppingCart')}</h1>
                    {cartItems.length === 0 ? (
                        <Message variant='info' message={
                            <div className="cart-empty">
                                <div className="cart-empty-message">
                                    {t('emptyCart')}
                                </div>
                                <Link to='/' className="cart-empty-link">
                                    {t('goBack')}
                                </Link>
                            </div>
                        } />
                    ) : (
                        <ListGroup variant='flush'>
                            {cartItems.map(item => (
                                <ListGroup.Item key={`${item.product}-${item.color}-${item.size}`} className="cart-item">
                                    <Row className="align-items-center">
                                        <Col md={2}>
                                            <Image 
                                                src={`${BASE_URL}${item.image}`}
                                                alt={item.name} 
                                                fluid 
                                                rounded 
                                                className="cart-item-image"
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <div className="cart-item-name">
                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            </div>
                                            <div className="cart-item-details">
                                                <span className="color">Màu: {item.color}</span>
                                                <span className="size">Size: {item.size}</span>
                                            </div>
                                        </Col>
                                        <Col md={2} className="cart-item-price">
                                            {item.price.toLocaleString('vi-VN')} VNĐ
                                        </Col>
                                        <Col md={3}>
                                            <div className="cart-quantity">
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    className="cart-quantity-button"
                                                    onClick={() => updateQuantityHandler(item.product, item.qty - 1, item.countInStock, item.color, item.size)}
                                                    disabled={item.qty <= 1}
                                                >
                                                    <i className="fas fa-minus"></i>
                                                </Button>

                                                <Form.Control
                                                    className="cart-quantity-input"
                                                    value={item.qty}
                                                    onChange={(e) => {
                                                        const value = Number(e.target.value);
                                                        if (value > 0 && value <= item.countInStock) {
                                                            updateQuantityHandler(item.product, value, item.countInStock, item.color, item.size);
                                                        }
                                                    }}
                                                />

                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    className="cart-quantity-button"
                                                    onClick={() => updateQuantityHandler(item.product, item.qty + 1, item.countInStock, item.color, item.size)}
                                                    disabled={item.qty >= item.countInStock}
                                                >
                                                    <i className="fas fa-plus"></i>
                                                </Button>
                                            </div>
                                        </Col>
                                        <Col md={2}>
                                            <Button
                                                type='button'
                                                variant='light'
                                                className="cart-remove"
                                                onClick={() => removeFromCartHandler(item.product)}
                                            >
                                                <i className='fas fa-trash'></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Col>
                <Col md={4}>
                    <Card className="cart-summary">
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2 className="cart-summary-title">
                                    {t('total')} ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) {t('items')}
                                </h2>
                                <div className="cart-summary-total">
                                    {cartItems
                                        .reduce((acc, item) => acc + item.qty * item.price, 0)
                                        .toLocaleString('vi-VN')} VNĐ
                                </div>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    className='btn-block cart-summary-checkout'
                                    disabled={cartItems.length === 0}
                                    onClick={checkoutHandler}
                                >
                                    {t('proceedToCheckout')}
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default CartScreen;

