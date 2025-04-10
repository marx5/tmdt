import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';

// Components
import LoadingSpinner from '../components/LoadingSpinner';
import Message from '../components/Message';
import Meta from '../components/Meta';

// Redux actions
import { getUsers, deleteUser } from '../redux/actions/userActions';

const UserListScreen = () => {
    const dispatch = useDispatch();
    const usersList = useSelector(state => state.usersList);
    const { loading, error, users } = usersList;
    const navigate = useNavigate();

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(getUsers());
        }
        else {
            navigate('/login');
        }
    }, [dispatch, navigate, userInfo]);

    const userDeleteHandler = async (id, isAdmin) => {
        if (isAdmin) {
            alert('Không thể xóa tài khoản admin khác');
            return;
        }
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            await dispatch(deleteUser(id));
            dispatch(getUsers());
        }
    }

    const renderDeleteButton = (user) => {
        if (user.isAdmin) {
            return (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Không thể xóa tài khoản admin</Tooltip>}
                >
                    <span>
                        <Button
                            variant='danger'
                            className='btn-sm'
                            disabled
                        >
                            <i className='fas fa-trash' />
                        </Button>
                    </span>
                </OverlayTrigger>
            );
        }
        return (
            <Button
                variant='danger'
                className='btn-sm'
                onClick={() => userDeleteHandler(user._id, user.isAdmin)}
            >
                <i className='fas fa-trash' />
            </Button>
        );
    }

    return <>
        <Meta title='Users List' />
        <h1>Người dùng</h1>
        {loading ? <LoadingSpinner /> : error ? <Message variant='danger' message={error} /> : (
            <Table striped bordered hover responsive className='table-sm'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Admin</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => {
                        return <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                            <td>
                                {user.isAdmin ?
                                    (<i className='fas fa-check' style={{ color: 'green' }} />)
                                    :
                                    (<i className='fas fa-times' style={{ color: 'red' }} />)}
                            </td>
                            <td>
                                <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                    <Button variant='light' className='btn-sm'><i className='fas fa-edit' /></Button>
                                </LinkContainer>
                                {renderDeleteButton(user)}
                            </td>
                        </tr>
                    })}
                </tbody>
            </Table>
        )}
    </>
}

export default UserListScreen;