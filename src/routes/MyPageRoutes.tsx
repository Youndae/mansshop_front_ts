import { Routes, Route } from 'react-router-dom';

import MyPageOrder from '@/modules/mypage/pages/order/MyPageOrder';
import MyPageLikeProduct from '@/modules/mypage/pages/likeProduct/MyPageLikeProduct';
import MyPageProductQnA from '@/modules/mypage/pages/qna/product/MyPageProductQnA';
import MyPageProductQnADetail from '@/modules/mypage/pages/qna/product/MyPageProductQnADetail';
import MyPageMemberQnA from '@/modules/mypage/pages/qna/member/MyPageMemberQnA';
import MyPageMemberQnADetail from '@/modules/mypage/pages/qna/member/MyPageMemberQnADetail';
import MyPageMemberQnAWrite from '@/modules/mypage/pages/qna/member/MyPageMemberQnAWrite';
import MyPageMemberQnAModify from '@/modules/mypage/pages/qna/member/MyPageMemberQnAModify';
import MyPageReview from '@/modules/mypage/pages/review/MyPageReview';
import MyPageReviewWrite from '@/modules/mypage/pages/review/MyPageReviewWrite';
import MyPageReviewModify from '@/modules/mypage/pages/review/MyPageReviewModify';
import MyPageNotification from '@/modules/mypage/pages/notification/MyPageNotification';
import MyPageUpdateInfo from '@/modules/mypage/pages/info/MyPageUpdateInfo';

function MyPageRoutes() {
	return (
		<Routes>
			<Route path='order' element={<MyPageOrder />}/>
			<Route path='like' element={<MyPageLikeProduct />}/>
			<Route path='qna/product' element={<MyPageProductQnA />} />
			<Route path='qna/product/detail/:qnaId' element={<MyPageProductQnADetail />}/>
			<Route path='qna/member' element={<MyPageMemberQnA />} />
			<Route path='qna/member/detail/:qnaId' element={<MyPageMemberQnADetail />}/>
			<Route path='qna/member/write' element={<MyPageMemberQnAWrite />}/>
			<Route path='qna/member/update/:qnaId' element={<MyPageMemberQnAModify />}/>
			<Route path='review' element={<MyPageReview />} />
			<Route path='review/write' element={<MyPageReviewWrite />} />
			<Route path='review/modify/:reviewId' element={<MyPageReviewModify />} />
			<Route path='notification' element={<MyPageNotification />} />
			<Route path='info' element={<MyPageUpdateInfo />} />
		</Routes>
	)
}

export default MyPageRoutes;