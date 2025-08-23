import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { login, logout } from '@/modules/member/memberSlice';
import { getMemberStatus } from '@/common/services/authService';
import { getToken, removeToken } from '@/common/utils/axios/tokenUtils';
import type { AppDispatch } from '@/app/store';

import Navbar from '@/common/components/Navbar';
import CartRoutes from '@/routes/CartRoutes';
import MyPageRoutes from '@/routes/MyPageRoutes';
import AdminRoutes from '@/routes/AdminRoutes';
import ErrorRoutes from '@/routes/ErrorRoutes';

import Best from '@/modules/main/pages/Best';
import New from '@/modules/main/pages/New';
import MainClassification from '@/modules/main/pages/MainClassification';
import SearchProduct from '@/modules/main/pages/SearchProduct';
import AnonymousOrderInfo from '@/modules/main/pages/AnonymousOrderInfo';
import AnonymousOrderList from '@/modules/main/pages/AnonymousOrderList';

import Login from '@/modules/member/pages/Login';
import OAuth from '@/modules/member/pages/OAuth';
import Register from '@/modules/member/pages/Register';
import ResetPassword from '@/modules/member/pages/ResetPassword';
import SearchId from '@/modules/member/pages/SearchId';
import SearchPw from '@/modules/member/pages/SearchPw';

import Order from '@/modules/order/pages/Order';

import ProductDetail from '@/modules/product/pages/ProductDetail';

function App() {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		const accessToken = getToken();

		if(!accessToken) {
			dispatch(logout());
			return;
		}

		getMemberStatus()
			.then(({ userId, role }) => {
				dispatch(login({ userId, role }));
			})
			.catch((err) => {
				console.error('회원 상태 확인 실패: ', err);

				if(err.response?.status === 403){
					removeToken();
				}

				dispatch(logout());
			})
	}, [dispatch]);

  return (
	<BrowserRouter>
		<div className='container'>
			<Navbar />
			<Routes>
				{/* 로그인 등 회원 관련, 메인, 주문 페이지 라우팅. 공통 prefix 경로가 없기 때문에 직접 라우팅 */}

				{/* 메인 페이지 라우팅 */}
				<Route index element={<Best />} />
				<Route path='/new' element={<New />} />
				<Route path='/category/:classification' element={<MainClassification />} />
				<Route path="/search" element={<SearchProduct />} />

				<Route path='/order/info' element={<AnonymousOrderInfo />}/>
				<Route path='/order/detail' element={<AnonymousOrderList />}/>

				{/* 로그인 관련 회원 페이지 라우팅 */}
				<Route path='/login' element={<Login />} />
              	<Route path='/register' element={<Register />} />
				<Route path='/oAuth' element={<OAuth />} />
				<Route path='/search-id' element={<SearchId />}/>
				<Route path='/search-pw' element={<SearchPw />}/>
				<Route path='/reset-pw' element={<ResetPassword />} />

				{/* 주문 페이지 라우팅 */}
				<Route path='/order' element={<Order />} />

				{/* 상품 페이지 라우팅 */}
				<Route path='/product/:productId' element={<ProductDetail />} />

				{/* 장바구니 페이지 라우팅 */}
				<Route path='/cart/*' element={<CartRoutes />} />

				{/* 마이페이지 라우팅 */}
				<Route path='/my-page/*' element={<MyPageRoutes />} />

				{/* 관리자 페이지 라우팅 */}
				<Route path='/admin/*' element={<AdminRoutes />} />

				{/* 에러 페이지 라우팅 */}
				<Route path='/*' element={<ErrorRoutes />} />
			</Routes>
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
		</div>
	</BrowserRouter>    
  )
}

export default App
