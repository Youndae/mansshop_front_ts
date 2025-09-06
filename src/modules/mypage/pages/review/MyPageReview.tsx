import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { getReviewList, deleteReview } from '@/modules/mypage/services/mypageReviewService';
import { mainProductPagingObject } from '@/common/utils/paginationUtils';
import { handlePageChange } from '@/common/utils/paginationUtils';

import type { AxiosResponse } from 'axios';
import type { MyPageReviewType } from '@/modules/mypage/types/mypageReviewType';
import type { PagingObjectType } from '@/common/types/paginationType';

import removeBtn from '@/assets/image/del.jpg'

import MyPageSideNav from '@/modules/mypage/components/MyPageSideNav';
import Pagination from '@/common/components/Pagination';
import ImageForm from '@/common/components/ImageForm';
import MyPageModal from '@/modules/mypage/components/modal/MyPageModal';

//작성한 리뷰 목록
function MyPageReview() {
	const [params] = useSearchParams();
	const { page = '1' } = Object.fromEntries(params);

	const [pagingData, setPagingData] = useState<PagingObjectType>({
		startPage: 0,
        endPage: 0,
        prev: false,
        next: false,
        activeNo: Number(page),
	});
	const [data, setData] = useState<MyPageReviewType[]>([]);
	const [modalData, setModalData] = useState<MyPageReviewType | undefined>(undefined);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	
	const modalRef = useRef<HTMLDivElement | null>(null);

	const navigate = useNavigate();

	const getReview = async(): Promise<void> => {
		try {
			const res: AxiosResponse = await getReviewList(page);
			
			setData(res.data.content);

			const pagingObject: PagingObjectType = mainProductPagingObject(Number(page), res.data.totalPages);

			setPagingData({
				startPage: pagingObject.startPage,
				endPage: pagingObject.endPage,
				prev: pagingObject.prev,
				next: pagingObject.next,
				activeNo: pagingObject.activeNo,
			});
		} catch (err) {
			console.log('reviewList get error', err);
		}
	}

	useEffect(() => {
		window.scrollTo(0, 0);
		getReview();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	// 페이지네이션 버튼 이벤트
	const handlePageBtn = (type: string): void => {
		handlePageChange({
			typeOrNumber: type,
			pagingData,
			navigate,
		});
	}

	// 리뷰 삭제 이벤트
	const handleDeleteReview = async(e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
		if(window.confirm('리뷰를 삭제하시겠습니까?\n삭제 이후 재작성은 불가합니다.')){
			const reviewId = e.currentTarget.dataset.id;

			try {
				await deleteReview(Number(reviewId));
				getReview();
			} catch (err) {
				console.log('review delete error', err);
			}
		}
	}

	//목록에서 리뷰 클릭 이벤트.
	//Open Modal
	const handleReviewOnClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
		const idx = Number(e.currentTarget.id);
		setModalData(data[idx]);
		setIsOpen(true);
	}

	//Modal 닫기 이벤트
	const closeModal = (e: React.MouseEvent<HTMLDivElement>): void => {
		if(isOpen && modalRef.current && !modalRef.current.contains(e.target as Node)){
            setIsOpen(false);
            document.body.style.cssText = '';
        }
	}
	
	return (
        <div className="mypage">
            <MyPageSideNav
                qnaStat={false}
            />
            <div className="mypage-content">
                <div className="mypage-content-header">
                    <h1>리뷰 내역</h1>
                </div>
                <div className="mypage-like-content mypage-review-content">
                    <div className="mypage-like-content-list mypage-review-content-list">
                        {data.map((data, index) => {
                            return (
                                <div key={index} className="mypage-like-detail mypage-review-detail">
                                    <ReviewListContent
                                        data={data}
                                        index={index}
                                        handleDeleteReview={handleDeleteReview}
                                        handleReviewOnClick={handleReviewOnClick}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
                {isOpen && modalData && (
                    <MyPageModal
                        closeModal={closeModal}
                        data={modalData}
                        modalRef={modalRef}
                    />
                )}
                <Pagination
                    pagingData={pagingData}
                    handlePageBtn={handlePageBtn}
                    className={'like-paging'}
                />
            </div>
        </div>
    )
}

type ReviewListContentProps = {
	data: MyPageReviewType;
	index: number;
	handleDeleteReview: (e: React.MouseEvent<HTMLButtonElement>) => void;
	handleReviewOnClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function ReviewListContent(props: ReviewListContentProps) {
    const { data, index, handleDeleteReview, handleReviewOnClick } = props;

    let createdAt = `${data.createdAt}`;

    if(data.createdAt !== data.updatedAt)
        createdAt = `${data.createdAt} 작성, ${data.updatedAt} 수정`;

    return (
        <div className="mypage-like-data-detail">
            <div className="mypage-like-detail-content">
                <div className="mypage-like-remove">
					<button 
						type='button'
						data-id={data.reviewId}
						onClick={handleDeleteReview}
					>
						<img className="mypage-like-delete-btn" src={removeBtn} alt={''}/>
					</button>
                </div>
                <div className="mypage-like-thumb" >
                    <ImageForm imageName={data.thumbnail} className={'mypage-like-thumbnail'} />
                    <div className="mypage-like-info">
                        <div>
                            <span className="like-data-product-name" id={String(index)} onClick={handleReviewOnClick}>{data.productName}</span>
                        </div>
                        <span className="mypage-review-detail-date">{createdAt}</span>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default MyPageReview;