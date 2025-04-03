import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useTranslation } from '../hooks/useTranslation';

const SearchBox = ({ history }) => {
    const [keyword, setKeyword] = useState('');
    const { t } = useTranslation();

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            history.push(`/search?keyword=${keyword}`);
        } else {
            history.push('/');
        }
    }

    return (
        <Form onSubmit={submitHandler} inline>
            <Form.Control
                type='text'
                name='q'
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={t('search')}
                className='mr-sm-2 ml-sm-5'
            ></Form.Control>
            <Button type='submit' variant='outline-success' className='p-2'>
                {t('searchButton')}
            </Button>
        </Form>
    )
}

export default SearchBox;
