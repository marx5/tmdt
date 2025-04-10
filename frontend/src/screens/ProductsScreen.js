import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '../hooks/useTranslation';
import Message from '../components/Message';
import LoadingSpinner from '../components/LoadingSpinner';
import Meta from '../components/Meta';
import { listProducts } from '../redux/actions/productActions';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import ProductCard from '../components/ProductCard';

// Styles
import './ProductsScreen.scss';

const ProductsScreen = ({ match, history }) => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortOption, setSortOption] = useState('');

    const pageNumber = match.params.pageNumber || 1;
    const keyword = match.params.keyword || '';

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const productList = useSelector((state) => state.productList);
    const { loading, error, products, page, pages } = productList;

    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber, sortOption));
    }, [dispatch, keyword, pageNumber, sortOption]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (searchKeyword.trim()) {
            history.push(`/search/${searchKeyword}`);
        } else {
            history.push('/');
        }
    };

    const sortHandler = (e) => {
        setSortOption(e.target.value);
    };

    return (
        <div className="products-container">
            <Meta title={t('allProducts')} />
            
            {!keyword && <ProductCarousel />}

            <div className="products-header">
                <h1 className="products-header-title">{t('allProducts')}</h1>
                
                <div className="products-header-filters">
                    <form onSubmit={submitHandler} className="products-header-filters-search">
                        <input
                            type="text"
                            placeholder={t('searchProducts')}
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                        <button type="submit">
                            <i className="fas fa-search"></i>
                        </button>
                    </form>

                    <div className="products-header-filters-sort">
                        <select value={sortOption} onChange={sortHandler}>
                            <option value="">{t('sortBy')}</option>
                            <option value="price_asc">{t('priceLowToHigh')}</option>
                            <option value="price_desc">{t('priceHighToLow')}</option>
                            <option value="rating_desc">{t('topRated')}</option>
                            <option value="newest">{t('newest')}</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <Message variant='danger' message={error} />
            ) : (
                <>
                    <div className="products-grid">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>

                    {products.length === 0 && (
                        <div className="products-empty">
                            <div className="products-empty-icon">
                                <i className="fas fa-search"></i>
                            </div>
                            <div className="products-empty-message">
                                {t('noProductsFound')}
                            </div>
                            <Link to="/" className="products-empty-button">
                                {t('goBack')}
                            </Link>
                        </div>
                    )}

                    <Paginate
                        pages={pages}
                        page={page}
                        keyword={keyword ? keyword : ''}
                        sort={sortOption}
                    />
                </>
            )}
        </div>
    );
};

export default ProductsScreen; 