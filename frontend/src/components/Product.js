import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { useTranslation } from '../hooks/useTranslation';

const Product = ({ product }) => {
    const { t } = useTranslation();

    return <Card className='my-3 p-3 rounded'>
        <Link to={`/product/${product._id}`}>
            <Card.Img src={product.image} variant='top' />
        </Link>

        <Card.Body>
            <Link to={`/product/${product._id}`}>
                <Card.Title as='div'>
                    <strong>{product.name}</strong>
                </Card.Title>
            </Link>

            <Card.Text as='div'>
                <Rating
                    value={product.rating}
                    text={`${product.numReviews} ${t('reviews')}`}
                />
            </Card.Text>

            <Card.Text as='h3'>
                {product.price ? product.price.toLocaleString('vi-VN') : 0} VNĐ
            </Card.Text>
        </Card.Body>
    </Card>
}

export default Product;