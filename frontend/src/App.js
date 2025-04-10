import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Screens
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import SearchResultScreen from './screens/SearchResultScreen';
import ProductsScreen from './screens/ProductsScreen';

// Language Provider
import { LanguageProvider } from './context/LanguageContext';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		console.error('Error caught by ErrorBoundary:', error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return <h1>Something went wrong. Please refresh the page.</h1>;
		}

		return this.props.children;
	}
}

const App = () => {
	return (
		<ErrorBoundary>
			<LanguageProvider>
				<Router>
					<Header />
					<main className='py-3'>
						<Container>
							<Routes>
								<Route path='/orders/:id' element={<OrderScreen />} />
								<Route path='/shipping' element={<ShippingScreen />} />
								<Route path='/payment' element={<PaymentScreen />} />
								<Route path='/placeorder' element={<PlaceOrderScreen />} />
								<Route path='/login' element={<LoginScreen />} />
								<Route path='/register' element={<RegisterScreen />} />
								<Route path='/profile' element={<ProfileScreen />} />
								<Route path='/product/:id' element={<ProductScreen />} />
								<Route path='/cart/:id?' element={<CartScreen />} />
								<Route path='/admin/userlist' element={<UserListScreen />} />
								<Route path='/admin/user/:id/edit' element={<UserEditScreen />} />
								<Route path='/admin/productlist' element={<ProductListScreen />} />
								<Route path='/admin/productlist/:pageNumber' element={<ProductListScreen />} />
								<Route path='/admin/product/:id/edit' element={<ProductEditScreen />} />
								<Route path='/admin/orderlist' element={<OrderListScreen />} />
								<Route path='/search' element={<SearchResultScreen />} />
								<Route path='/products' element={<ProductsScreen />} />
								<Route path='/page/:pageNumber' element={<HomeScreen />} />
								<Route path='/' element={<HomeScreen />} />
							</Routes>
						</Container>
					</main>
					<Footer />
				</Router>
			</LanguageProvider>
		</ErrorBoundary>
	);
};

export default App;
