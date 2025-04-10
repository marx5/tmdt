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

// Styles
import './ProductScreen.scss';

const ProductScreen = (props) => {
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');

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
        if (!selectedColor || !selectedSize) {
            alert('Vui lòng chọn màu sắc và kích thước');
            return;
        }
        props.history.push(`/cart/${props.match.params.id}?qty=${qty}&color=${selectedColor}&size=${selectedSize}`);
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

    return (
        <div className="product-container">
            <Link className="product-back btn btn-light" to='/'>
                {t('goBack')}
            </Link>
            
            {loading && <LoadingSpinner />}
            {error ? <Message message={error} /> : (
                <>
                    <Meta title={product.name || ''} />
                    
                    <div className="product-content">
                        <div className="product-gallery">
                            <div className="product-gallery-main">
                                <Image src={product.image} alt={product.name} fluid />
                            </div>
                            {product.images && product.images.length > 0 && (
                                <div className="product-gallery-thumbnails">
                                    {product.images.map((image, index) => (
                                        <img 
                                            key={index} 
                                            src={image} 
                                            alt={`${product.name} ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="product-info">
                            <h1 className="product-info-title">{product.name}</h1>
                            <div className="product-info-rating">
                                <Rating
                                    value={product.rating || 0}
                                    text={`${product.numReviews || 0} ${t('reviews')}`}
                                />
                            </div>
                            <div className="product-info-price">
                                {product.price ? product.price.toLocaleString('vi-VN') : 0} VNĐ
                            </div>
                            <div className="product-info-description">
                                {product.description}
                            </div>

                            <Card className="product-details">
                                <ListGroup variant='flush'>
                                    <ListGroup.Item className="product-details-item">
                                        <span>{t('price')}:</span>
                                        <span>
                                            <strong>{product.price ? product.price.toLocaleString('vi-VN') : 0} VNĐ</strong>
                                        </span>
                                    </ListGroup.Item>

                                    <ListGroup.Item className="product-details-item">
                                        <span>{t('status')}:</span>
                                        <span>
                                            {product.countInStock > 0 ? t('inStock') : t('outOfStock')}
                                        </span>
                                    </ListGroup.Item>

                                    {product.colors && product.colors.length > 0 && (
                                        <ListGroup.Item>
                                            <div className="product-colors">
                                                <div className="product-colors-title">{t('color')}:</div>
                                                <div className="product-colors-list">
                                                    {product.colors.map((color) => (
                                                        <div
                                                            key={color.name}
                                                            className={`product-colors-item ${selectedColor === color.name ? 'selected' : ''}`}
                                                            style={{ backgroundColor: color.code }}
                                                            onClick={() => setSelectedColor(color.name)}
                                                            title={color.name}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </ListGroup.Item>
                                    )}

                                    {selectedColor && product.colors && (
                                        <ListGroup.Item>
                                            <div className="product-sizes">
                                                <div className="product-sizes-title">{t('size')}:</div>
                                                <div className="product-sizes-list">
                                                    {product.colors
                                                        .find(c => c.name === selectedColor)
                                                        .sizes.map((size) => (
                                                            <div
                                                                key={size.size}
                                                                className={`product-sizes-item ${selectedSize === size.size ? 'selected' : ''} ${size.quantity === 0 ? 'disabled' : ''}`}
                                                                onClick={() => size.quantity > 0 && setSelectedSize(size.size)}
                                                            >
                                                                {size.size} ({size.quantity})
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        </ListGroup.Item>
                                    )}

                                    {product.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <div className="product-quantity">
                                                <div className="product-quantity-title">{t('quantity')}</div>
                                                <div className="product-quantity-selector">
                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        onClick={() => qty > 1 && setQty(Number(qty) - 1)}
                                                        disabled={qty <= 1}
                                                    >
                                                        <i className="fas fa-minus"></i>
                                                    </Button>

                                                    <Form.Control
                                                        value={qty}
                                                        onChange={(e) => {
                                                            const value = Number(e.target.value);
                                                            if (value > 0 && value <= product.countInStock) {
                                                                setQty(value);
                                                            }
                                                        }}
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
                                            </div>
                                        </ListGroup.Item>
                                    )}

                                    <ListGroup.Item>
                                        <Button
                                            className='btn-block'
                                            type='button'
                                            disabled={product.countInStock === 0 || !selectedColor || !selectedSize}
                                            onClick={addToCartHandler}
                                        >
                                            {t('addToCart')}
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </div>
                    </div>

                    <div className="product-reviews">
                        <h2 className="product-reviews-title">{t('reviews')}</h2>
                        
                        {(!product.reviews || product.reviews.length === 0) && (
                            <Message variant='info' message={t('noReviews')} />
                        )}

                        <div className="product-reviews-list">
                            {product.reviews && product.reviews.map((review) => (
                                <div key={review._id} className="product-reviews-item">
                                    <div className="product-reviews-item-header">
                                        <div className="product-reviews-item-name">{review.name}</div>
                                        <div className="product-reviews-item-date">
                                            {review.createdAt && review.createdAt.substring(0, 10)}
                                        </div>
                                    </div>
                                    <Rating value={review.rating} />
                                    <div className="product-reviews-item-comment">{review.comment}</div>
                                </div>
                            ))}
                        </div>

                        <div className="product-reviews-form">
                            <h2 className="product-reviews-form-title">{t('writeReview')}</h2>
                            
                            {reviewSubmitted && (
                                <Message variant='success' message={t('reviewSubmitted')} />
                            )}
                            
                            {createReviewError && (
                                <Message variant='danger' message={createReviewError} />
                            )}
                            
                            {userInfo ? (
                                <Form onSubmit={submitHandler}>
                                    <Form.Group controlId='rating' className="product-reviews-form-rating">
                                        <Form.Label>{t('rating')}</Form.Label>
                                        <Form.Control
                                            as='select'
                                            value={rating}
                                            onChange={(e) => setRating(e.target.value)}
                                        >
                                            <option value=''>{t('selectRating')}</option>
                                            <option value='1'>1 - {t('poor')}</option>
                                            <option value='2'>2 - {t('fair')}</option>
                                            <option value='3'>3 - {t('good')}</option>
                                            <option value='4'>4 - {t('veryGood')}</option>
                                            <option value='5'>5 - {t('excellent')}</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId='comment' className="product-reviews-form-comment">
                                        <Form.Label>{t('comment')}</Form.Label>
                                        <Form.Control
                                            as='textarea'
                                            rows='4'
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder={t('writeYourComment')}
                                        />
                                    </Form.Group>
                                    <Button
                                        type='submit'
                                        variant='primary'
                                        className="product-reviews-form-submit"
                                    >
                                        {t('submit')}
                                    </Button>
                                </Form>
                            ) : (
                                <Message variant='info' message={
                                    <>
                                        {t('pleaseLogin')} <Link to='/login'>{t('login')}</Link>
                                    </>
                                } />
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductScreen;