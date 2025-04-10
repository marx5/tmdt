import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../redux/actions/axiosConfig';

// Components
import LoadingSpinner from './LoadingSpinner';
import Message from './Message';

// Redux actions
import { getTopProducts } from '../redux/actions/productActions';

// Styles
import './ProductCarousel.scss';

const ProductCarousel = () => {
    const dispatch = useDispatch();

    const productTopRated = useSelector((state) => state.productTopRated);
    const { loading, error, products } = productTopRated;

    useEffect(() => {
        dispatch(getTopProducts());
    }, [dispatch]);

    return loading ? (
        <LoadingSpinner />
    ) : error ? (
        <Message variant='danger' message={error} />
    ) : (
        <Carousel 
            pause='hover' 
            className='bg-dark mb-4' 
            interval={5000}
            indicators={true}
            controls={true}
        >
            {products.map((product) => (
                <Carousel.Item key={product._id}>
                    <Link to={`/product/${product._id}`}>
                        <Image 
                            src={`${BASE_URL}${product.image}`} 
                            alt={product.name} 
                            fluid 
                            className="carousel-image"
                        />
                        <Carousel.Caption className='carousel-caption'>
                            <h5>{product.name} ({product.price.toLocaleString('vi-VN')} VNĐ)</h5>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default ProductCarousel;