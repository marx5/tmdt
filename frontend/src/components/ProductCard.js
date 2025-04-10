import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import Rating from './Rating';
import { useTranslation } from '../hooks/useTranslation';
import { BASE_URL } from '../redux/actions/axiosConfig';

// Styles
import './ProductCard.scss';

const ProductCard = ({ product }) => {
    const { t } = useTranslation();

    return (
        <Card className="product-card">
            <Link to={`/product/${product._id}`}>
                <Card.Img
                    src={`${BASE_URL}${product.image}`}
                    variant="top"
                    className="product-card-image"
                />
            </Link>
            <Card.Body className="product-card-body">
                <Link to={`/product/${product._id}`}>
                    <Card.Title as="div" className="product-card-title">
                        <strong>{product.name}</strong>
                    </Card.Title>
                </Link>
                <Card.Text as="div" className="product-card-rating">
                    <Rating
                        value={product.rating}
                        text={`${product.numReviews} ${t('reviews')}`}
                    />
                </Card.Text>
                <Card.Text as="h3" className="product-card-price">
                    {product.price.toLocaleString('vi-VN')} VNĐ
                </Card.Text>
                {product.countInStock > 0 ? (
                    <Button
                        variant="primary"
                        className="product-card-button"
                        as={Link}
                        to={`/product/${product._id}`}
                    >
                        {t('viewDetails')}
                    </Button>
                ) : (
                    <Button
                        variant="secondary"
                        className="product-card-button"
                        disabled
                    >
                        {t('outOfStock')}
                    </Button>
                )}
            </Card.Body>
        </Card>
    );
};

export default ProductCard; 