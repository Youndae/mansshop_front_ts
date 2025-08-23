import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { getNotificationList } from '@/modules/mypage/services/mypageNotificationService';
import { mainProductPagingObject } from '@/common/utils/paginationUtils';
import { handlePageChange } from '@/common/utils/paginationUtils';

import type { PagingObjectType } from '@/common/types/paginationType';
import type { MyPageNotificationType } from '@/modules/mypage/types/mypageNotificationType';
import type { AxiosResponse } from 'axios';

import MyPageSideNav from '@/modules/mypage/components/MyPageSideNav';
import Pagination from '@/common/components/Pagination';

const DETAIL_URL: Record<string, string> = {
	PRODUCT_QNA_REPLY: '/my-page/qna/product/detail/',
	MEMBER_QNA_REPLY: '/my-page/qna/member/detail/',
	REVIEW_REPLY: '/my-page/review',
	ORDER_STATUS: '/my-page/order',
}

//알림 목록
function MyPageNotification() {
	const [params] = useSearchParams();
	const { page = '1' } = Object.fromEntries(params);
	const [pagingData, setPagingData] = useState<PagingObjectType>({
		startPage: 0,
		endPage: 0,
		prev: false,
		next: false,
		activeNo: Number(page),
	});
	const [notificationData, setNotificationData] = useState<MyPageNotificationType[]>([]);

	const navigate = useNavigate();

	useEffect(() => {
		window.scrollTo(0, 0);

		const getNotifications = async(): Promise<void> => {
			try {
				const res: AxiosResponse = await getNotificationList(page);

				setNotificationData(res.data.content);

				const pagingObject: PagingObjectType = mainProductPagingObject(Number(page), res.data.totalPages);
				setPagingData({
                    startPage: pagingObject.startPage,
                    endPage: pagingObject.endPage,
                    prev: pagingObject.prev,
                    next: pagingObject.next,
                    activeNo: pagingObject.activeNo,
                });
			}catch (err) {
				console.error('getNotifications error', err);
			}
		}

		getNotifications();
	}, [page]);

	// 페이지네이션 버튼 이벤트
	const handlePageBtn = (type: string): void => {
		handlePageChange({
			typeOrNumber: type,
			pagingData,
			navigate,
		});
	}

	const handleOnClick = (e: React.MouseEvent<HTMLTableCellElement>): void => {
		e.preventDefault();
		const type = e.currentTarget.dataset.type || '';
		const id = e.currentTarget.dataset.id;
		if(type) {
			let url = DETAIL_URL[type];

			if(id && id !== '0' && id !== 'null')
				url += id;
			
			navigate(url);
		}else {
			console.error('handleOnClick error', e);
		}
	}

	return (
		<div className="mypage">
			<MyPageSideNav
                qnaStat={false}
            />
			<div className="mypage-content">
				<div className="mypage-qna-header">
					<h1>알림 목록</h1>
				</div>
				<div className="mypage-qna-content">
					<table className="qna-table">
						<thead>
							<tr>
								<th>제목</th>
							</tr>
						</thead>
						<tbody>
							{notificationData.map((data, index) => {
								return (
									<tr key={index}>
										<td data-type={data.type} data-id={data.relatedId} onClick={handleOnClick}>{data.title}</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
				<Pagination
                    pagingData={pagingData}
                    handlePageBtn={handlePageBtn}
                    className={'like-paging'}
                />
			</div>
		</div>
	)
}

export default MyPageNotification;