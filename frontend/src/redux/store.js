import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

// Reducers
import { productListReducer, productDetailsReducer, productDeleteReducer, productCreateReducer, productUpdateReducer, productCreateReviewReducer, productTopRatedReducer } from './reducers/productReducers';
import { cartReducer } from './reducers/cartReducers'; 
import { userLoginReducer, userRegisterReducer, userDetailsReducer, userUpdateProfileReducer, usersListReducer, userUpdateReducer } from './reducers/userReducers';
import { orderCreateReducer, orderDetailsReducer, orderPayReducer, orderMyReducer, orderListReducer, orderDeliverReducer } from './reducers/orderReducers';

console.log('Setting up Redux store...');

const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userUpdate: userUpdateReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderDeliver: orderDeliverReducer,
    orderMy: orderMyReducer,
    orderList: orderListReducer,
    usersList: usersListReducer,
    productDelete: productDeleteReducer,
    productCreate: productCreateReducer,
    productUpdate: productUpdateReducer,
    productCreateReview: productCreateReviewReducer,
    productTopRated: productTopRatedReducer
});

// Helper function to safely parse JSON
const safeParseJSON = (key, defaultValue) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error parsing ${key} from localStorage:`, error);
        localStorage.removeItem(key); // Remove invalid data
        return defaultValue;
    }
};

// Cart items from browser localstorage
const cartItemsFromStorage = safeParseJSON('cartItems', []);
// Logged in user from browser localstorage
const userInfoFromStorage = safeParseJSON('userInfo', null);
// Shipping address from browser storage
const shippingAddressFromStorage = safeParseJSON('shippingAddress', {});

const initialState = {
    cart: { 
        cartItems: Array.isArray(cartItemsFromStorage) ? cartItemsFromStorage : [],
        shippingAddress: shippingAddressFromStorage 
    },
    userLogin: { userInfo: userInfoFromStorage }
};

console.log('Initial Redux state:', initialState);

const middlewares = [thunk];

const store = createStore(
    reducer, 
    initialState, 
    composeWithDevTools(applyMiddleware(...middlewares))
);

console.log('Redux store created successfully');

export default store;