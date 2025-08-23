import { Routes, Route } from 'react-router-dom';

// TODO: 페이지 컴포넌트들 추가
import Error from '@/modules/error/pages/Error';

function ErrorRoutes() {
	return (
		<Routes>
			<Route path='error' element={<Error />} />
			<Route path='*' element={<Error />} />
		</Routes>
	)
}

export default ErrorRoutes;