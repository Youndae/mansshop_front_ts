import { Routes, Route } from 'react-router-dom';

import AdminProductList from '@/modules/admin/pages/product/AdminProductList';
import AdminProductDetail from '@/modules/admin/pages/product/AdminProductDetail';
import AdminAddProduct from '@/modules/admin/pages/product/AdminAddProduct';
import AdminModifyProduct from '@/modules/admin/pages/product/AdminModifyProduct';
import AdminProductStock from '@/modules/admin/pages/product/AdminProductStock';
import AdminDiscountProductList from '@/modules/admin/pages/product/AdminDiscountProductList';
import AdminProductDiscount from '@/modules/admin/pages/product/AdminProductDiscount';
import AdminNewOrderList from '@/modules/admin/pages/order/AdminNewOrderList';
import AdminAllOrderList from '@/modules/admin/pages/order/AdminAllOrderList';
import AdminProductQnAList from '@/modules/admin/pages/qna/AdminProductQnAList';
import AdminProductQnADetail from '@/modules/admin/pages/qna/AdminProductQnADetail';
import AdminMemberQnAList from '@/modules/admin/pages/qna/AdminMemberQnAList';
import AdminMemberQnADetail from '@/modules/admin/pages/qna/AdminMemberQnADetail';
import AdminQnAClassification from '@/modules/admin/pages/qna/AdminQnAClassification';
import AdminReviewList from '@/modules/admin/pages/review/AdminReviewList';
import AdminReviewDetail from '@/modules/admin/pages/review/AdminReviewDetail';
import AdminMemberList from '@/modules/admin/pages/member/AdminMemberList';
import AdminPeriodSales from '@/modules/admin/pages/sales/AdminPeriodSales';
import AdminPeriodSalesDetail from '@/modules/admin/pages/sales/AdminPeriodSalesDetail';
import AdminPeriodSalesDailyOrderList from '@/modules/admin/pages/sales/AdminPeriodSalesDailyOrderList';
import AdminProductSales from '@/modules/admin/pages/sales/AdminProductSales';
import AdminProductSalesDetail from '@/modules/admin/pages/sales/AdminProductSalesDetail';
import AdminFailedQueueList from '@/modules/admin/pages/data/AdminFailedQueueList';
import AdminFailedOrderList from '@/modules/admin/pages/data/AdminFailedOrderList';

function AdminRoutes() {
	return (
		<Routes>
			<Route path='product' element={<AdminProductList />} />
			<Route path='product/:productId' element={<AdminProductDetail />}/>
			<Route path='product/add' element={<AdminAddProduct />}/>
			<Route path='product/update/:productId' element={<AdminModifyProduct />}/>
			<Route path='product/stock' element={<AdminProductStock />}/>
			<Route path='product/discount' element={<AdminDiscountProductList />}/>
			<Route path='product/discount/setting' element={<AdminProductDiscount />}/>

			<Route path='order' element={<AdminNewOrderList />} />
			<Route path='order/all' element={<AdminAllOrderList />} />

			<Route path='qna/product' element={<AdminProductQnAList />} />
			<Route path='qna/product/:qnaId' element={<AdminProductQnADetail />}/>
			<Route path='qna/member' element={<AdminMemberQnAList />} />
			<Route path='qna/member/:qnaId' element={<AdminMemberQnADetail />}/>
			<Route path='qna/classification' element={<AdminQnAClassification />} />

			<Route path='review' element={<AdminReviewList />}/>
			<Route path='review/all' element={<AdminReviewList />}/>
			<Route path='review/detail/:reviewId' element={<AdminReviewDetail />}/>

			<Route path='member' element={<AdminMemberList />}/>
			
			<Route path='sales/period' element={<AdminPeriodSales />}/>
			<Route path='sales/period/:date' element={<AdminPeriodSalesDetail />} />
			<Route path='sales/period/detail/daily/:selectDate' element={<AdminPeriodSalesDailyOrderList />} />
			<Route path='sales/product' element={<AdminProductSales />} />
			<Route path='sales/product/:productId' element={<AdminProductSalesDetail />} />
			
			<Route path='data/queue' element={<AdminFailedQueueList />} />
			<Route path='data/order' element={<AdminFailedOrderList />} />
		</Routes>
	)
}

export default AdminRoutes;