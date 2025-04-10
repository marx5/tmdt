import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { useTranslation } from '../hooks/useTranslation';

// Styles
import './SearchBox.scss';

const SearchBox = () => {
    const [keyword, setKeyword] = useState('');
    const history = useHistory();
    const { t } = useTranslation();

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            history.push(`/search/${keyword}`);
        } else {
            history.push('/');
        }
    };

    return (
        <Form onSubmit={submitHandler} className="search-box">
            <InputGroup>
                <Form.Control
                    type="text"
                    name="q"
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder={t('searchProducts')}
                    className="search-box-input"
                />
                <Button
                    type="submit"
                    variant="outline-secondary"
                    className="search-box-button"
                >
                    <i className="fas fa-search"></i>
                </Button>
            </InputGroup>
        </Form>
    );
};

export default SearchBox;
