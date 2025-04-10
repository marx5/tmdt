import React, { useEffect, useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

// Components
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Message from '../components/Message';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import { useTranslation } from '../hooks/useTranslation';

// Redux actions
import { listProducts } from '../redux/actions/productActions';

const HomeScreen = () => {
    const dispatch = useDispatch();
    const productList = useSelector((state) => state.productList);
    const { loading, error, products = [] } = productList;
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(listProducts());
    }, [dispatch]);

    // Lọc và sắp xếp sản phẩm mới nhất
    const latestProducts = useMemo(() => {
        if (!Array.isArray(products)) {
            return [];
        }
        return [...products]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 8); // Hiển thị 8 sản phẩm mới nhất
    }, [products]);

    return (
        <div className="home-screen">
            <Meta />
            <h1>{t('featuredProducts')}</h1>
            <ProductCarousel />
            <h1>{t('latestProducts')}</h1>
            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <Row>
                    {latestProducts.length > 0 ? (
                        latestProducts.map((product) => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                <ProductCard product={product} />
                            </Col>
                        ))
                    ) : (
                        <Col>
                            <Message variant="info">{t('noProductsFound')}</Message>
                        </Col>
                    )}
                </Row>
            )}
        </div>
    );
};

export default HomeScreen;