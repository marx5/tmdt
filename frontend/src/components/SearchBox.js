import React, { useState } from 'react';
import { Form, FormControl, Button, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

// Styles
import './SearchBox.scss';

const SearchBox = () => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation();

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search?keyword=${keyword}`);
        } else {
            navigate('/');
        }
    };

    return (
        <Form onSubmit={submitHandler} className='d-flex'>
            <InputGroup>
                <FormControl
                    type='text'
                    name='q'
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder={t('searchProducts')}
                    className='mr-sm-2 ml-sm-5'
                />
                <Button type='submit' variant='outline-success' className='p-2'>
                    <i className="fas fa-search"></i>
                </Button>
            </InputGroup>
        </Form>
    );
};

export default SearchBox;
