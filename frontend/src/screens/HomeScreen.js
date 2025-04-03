import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

// Components
import Product from '../components/Product';
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
    const { products, loading, error } = productList;
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(listProducts());
    }, [dispatch]);

    return <>
        <Meta />
        <h1>{t('featuredProducts')}</h1>
        <ProductCarousel />
        <h1>{t('latestProducts')}</h1>
        {/* Đang tải */}
        {loading && <LoadingSpinner />}

        {/* Hiển thị lỗi hoặc danh sách sản phẩm */}
        {error ? <Message message={error} /> : (<Row>
            {/* Hiển thị sản phẩm theo cột */}
            {products.map((product) => {
                return <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                </Col>
            })}
        </Row>)}

    </>
}

export default HomeScreen;