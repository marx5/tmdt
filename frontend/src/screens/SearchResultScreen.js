import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '../hooks/useTranslation';

// Components
import Product from '../components/Product';
import LoadingSpinner from '../components/LoadingSpinner';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { listProducts } from '../redux/actions/productActions';

const SearchResultScreen = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';
    const { t } = useTranslation();
    
    const dispatch = useDispatch();
    const productList = useSelector((state) => state.productList);
    const { loading, error, products = [] } = productList;

    useEffect(() => {
        if (keyword) {
            dispatch(listProducts(keyword));
        }
    }, [dispatch, keyword]);

    return (
        <>
            <Meta title={t('searchResults')} />
            <h3>{t('searchResults')} "{keyword}"</h3>
            
            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <Message variant='danger' message={error} />
            ) : (
                <>
                    {products.length === 0 ? (
                        <Message variant='info' message={`${t('noProductsFound')} "${keyword}"`} />
                    ) : (
                        <Row>
                            {products.map((product) => (
                                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                    )}
                </>
            )}
        </>
    );
};

export default SearchResultScreen;