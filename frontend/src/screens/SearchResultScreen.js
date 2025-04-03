import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';

// Components
import Product from '../components/Product';
import LoadingSpinner from '../components/LoadingSpinner';
import Message from '../components/Message';
import Meta from '../components/Meta';

const SearchResultScreen = (props) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [products, setProducts] = useState([]);
    const keyword = props.location.search.split('=')[1];

    useEffect(() => {
        // Lấy kết quả tìm kiếm từ backend
        const getSearchResult = async () => {
            try {
                setLoading(true);
                const res = await axios.post(`/api/products/search?keyword=${keyword}`);
                setLoading(false);
                setProducts(res.data);
            }
            catch (error) {
                setLoading(false);
                setError(error.response && error.response.data.message ? error.response.data.message : error.message);
            }
        }
        getSearchResult();
    }, [keyword]);

    return <>
        <Meta title='Kết quả tìm kiếm' />
        <h3>Kết quả tìm kiếm cho "{keyword}"...</h3>
        {/* Đang tải */}
        {loading && <LoadingSpinner />}

        {/* Lỗi */}
        {error && <Message message={error} />}

        {/* Không tải, không lỗi và có sản phẩm tìm thấy */}
        {!loading && !error && products.length > 0 && (
            <Row>
                {/* Hiển thị sản phẩm theo cột */}
                {products.map((product) => {
                    return <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                        <Product product={product} />
                    </Col>
                })}
            </Row>)
        }

        {/* Không tải, không lỗi và không có sản phẩm tìm thấy */}
        {!loading && !error && products.length === 0 && (
            <Message variant='info' message={`Không tìm thấy sản phẩm nào cho từ khóa "${keyword}"`} />
        )}

    </>
}

export default SearchResultScreen;