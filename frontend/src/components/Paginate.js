import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Pagination } from 'react-bootstrap';
import { useTranslation } from '../hooks/useTranslation';

const Paginate = ({ pages, page, keyword = '', sort = '' }) => {
    const { t } = useTranslation();

    return (
        pages > 1 && (
            <Pagination className="products-pagination">
                {[...Array(pages).keys()].map((x) => {
                    const pageNum = x + 1;
                    const isActive = pageNum === page;
                    
                    // Construct the search params
                    const searchParams = new URLSearchParams();
                    if (keyword) searchParams.append('keyword', keyword);
                    if (pageNum) searchParams.append('page', pageNum);
                    if (sort) searchParams.append('sort', sort);
                    
                    // Create the URL with pathname and search separately
                    const to = {
                        pathname: keyword ? '/search' : '/products',
                        search: `?${searchParams.toString()}`
                    };

                    return (
                        <LinkContainer key={pageNum} to={to}>
                            <Pagination.Item active={isActive}>
                                {pageNum}
                            </Pagination.Item>
                        </LinkContainer>
                    );
                })}
            </Pagination>
        )
    );
};

export default Paginate; 