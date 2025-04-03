import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '../hooks/useTranslation';

// Components
import Rating from '../components/Rating';
import LoadingSpinner from '../components/LoadingSpinner';
import Message from '../components/Message';
import Meta from '../components/Meta';

// Redux actions
import { singleProduct, createReview } from '../redux/actions/productActions';

// Redux constants
import * as productConstants from '../redux/constants/productConstants';

const ProductScreen = (props) => {
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const productDetails = useSelector((state) => state.productDetails);
    const { loading, product = {}, error } = productDetails;

    const productCreateReview = useSelector((state) => state.productCreateReview);
    const { error: createReviewError, success: createReviewSuccess } = productCreateReview || {};

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const productReviewCreate = useSelector((state) => state.productReviewCreate);
    const {
        success: successProductReview,
        loading: loadingProductReview,
        error: errorProductReview,
    } = productReviewCreate || {};

    useEffect(() => {
        if (createReviewSuccess) {
            setReviewSubmitted(true);
            setRating(0);
            setComment('');

            // Ẩn thông báo sau 5 giây
            const timer = setTimeout(() => {
                setReviewSubmitted(false);
                dispatch({ type: productConstants.PRODUCT_CREATE_REVIEW_RESET });
            }, 5000);

            return () => clearTimeout(timer);
        }

        dispatch(singleProduct(props.match.params.id));

    }, [dispatch, props.match.params.id, createReviewSuccess]);

    const addToCartHandler = () => {
        props.history.push(`/cart/${props.match.params.id}?qty=${qty}`);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(
            createReview(props.match.params.id, {
                rating,
                comment,
            })
        );
    }

    return <>
        <Link className='btn btn-light my-3' to='/'>
            {t('goBack')}
        </Link>
        {loading && <LoadingSpinner />}
        {error ? <Message message={error} /> : (
            <>
                <Meta title={product.name || ''} />
                <Row>
                    <Col md={6}>
                        <Image src={product.image} alt={product.name} fluid />
                    </Col>
                    <Col md={3}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h3>{product.name}</h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Rating
                                    value={product.rating || 0}
                                    text={`${product.numReviews || 0} ${t('reviews')}`}
                                />
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {t('price')}: {product.price ? product.price.toLocaleString('vi-VN') : 0} VNĐ
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {t('description')}: {product.description}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={3}>
                        <Card>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>{t('price')}:</Col>
                                        <Col>
                                            <strong>{product.price ? product.price.toLocaleString('vi-VN') : 0} VNĐ</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>{t('status')}:</Col>
                                        <Col>
                                            {product.countInStock > 0 ? t('inStock') : t('outOfStock')}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                {product.countInStock > 0 && (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>{t('quantity')}</Col>
                                            <Col>
                                                <div className="quantity-selector d-flex align-items-center">
                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        onClick={() => qty > 1 && setQty(Number(qty) - 1)}
                                                        disabled={qty <= 1}
                                                    >
                                                        <i className="fas fa-minus"></i>
                                                    </Button>

                                                    <Form.Control
                                                        className="mx-2 text-center"
                                                        value={qty}
                                                        onChange={(e) => {
                                                            const value = Number(e.target.value);
                                                            if (value > 0 && value <= product.countInStock) {
                                                                setQty(value);
                                                            }
                                                        }}
                                                        style={{ width: '60px' }}
                                                    />

                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        onClick={() => qty < product.countInStock && setQty(Number(qty) + 1)}
                                                        disabled={qty >= product.countInStock}
                                                    >
                                                        <i className="fas fa-plus"></i>
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}

                                <ListGroup.Item>
                                    <Button
                                        className='btn-block'
                                        type='button'
                                        disabled={product.countInStock === 0}
                                        onClick={addToCartHandler}
                                    >
                                        {t('addToCart')}
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
                {/* Reviews */}
                <Row className='my-3'>
                    <Col md={6}>
                        <h2>{t('reviews')}</h2>
                        {/* If no review exists */}
                        {(!product.reviews || product.reviews.length === 0) && <Message variant='info' message={t('noReviews')} />}
                        {/* If there are reviews */}
                        <ListGroup variant='flush'>
                            {product.reviews && product.reviews.map((review) => (
                                <ListGroup.Item key={review._id}>
                                    <strong>{review.name}</strong>
                                    <Rating value={review.rating} />
                                    <p>{review.createdAt && review.createdAt.substring(0, 10)}</p>
                                    <p>{review.comment}</p>
                                </ListGroup.Item>
                            ))}
                            <ListGroup.Item>
                                <h2 className='mt-3'>{t('writeReview')}</h2>
                                {reviewSubmitted && (
                                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                                        <i className="fas fa-check-circle mr-2"></i>
                                        <strong>{t('reviewSubmitted')}</strong>
                                        <p className="mb-0 mt-1">{t('thankYouForReview')}</p>
                                        <button
                                            type="button"
                                            className="close"
                                            onClick={() => setReviewSubmitted(false)}
                                        >
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                )}
                                {createReviewError && (
                                    <Message
                                        variant='danger'
                                        message={createReviewError}
                                    />
                                )}
                                {userInfo ? (
                                    <Form onSubmit={submitHandler} className="mt-3">
                                        <Form.Group controlId='rating'>
                                            <Form.Label>{t('rating')}</Form.Label>
                                            <Form.Control
                                                as='select'
                                                value={rating}
                                                onChange={(e) => setRating(e.target.value)}
                                                className="form-control-lg"
                                            >
                                                <option value=''>{t('selectRating')}</option>
                                                <option value='1'>1 - {t('poor')}</option>
                                                <option value='2'>2 - {t('fair')}</option>
                                                <option value='3'>3 - {t('good')}</option>
                                                <option value='4'>4 - {t('veryGood')}</option>
                                                <option value='5'>5 - {t('excellent')}</option>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId='comment'>
                                            <Form.Label>{t('comment')}</Form.Label>
                                            <Form.Control
                                                as='textarea'
                                                rows='4'
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                className="form-control-lg"
                                                placeholder={t('writeYourComment')}
                                            ></Form.Control>
                                        </Form.Group>
                                        <Button
                                            type='submit'
                                            variant='primary'
                                            className='mt-3 btn-lg'
                                        >
                                            {t('submit')}
                                        </Button>
                                    </Form>
                                ) : (
                                    <div className="alert alert-info mt-3" role="alert">
                                        <i className="fas fa-info-circle mr-2"></i>
                                        <Link to='/login' className="alert-link">
                                            {t('pleaseLogin')}
                                        </Link>
                                    </div>
                                )}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </>
        )}
    </>
}

export default ProductScreen;