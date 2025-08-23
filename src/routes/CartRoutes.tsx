import { Routes, Route } from 'react-router-dom';

// TODO: 페이지 컴포넌트들 추가
import Cart from '@/modules/cart/pages/Cart';

function CartRoutes() {
	return (
		<Routes>
			<Route path='' element={<Cart />}/>
		</Routes>
	)
}

export default CartRoutes;