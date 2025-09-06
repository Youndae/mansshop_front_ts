import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { getLikeProductList, deLikeProduct } from '@/modules/mypage/services/mypageLikeService';
import { mainProductPagingObject } from '@/common/utils/paginationUtils';
import { numberComma } from '@/common/utils/formatNumberComma';
import { handlePageChange } from '@/common/utils/paginationUtils';

import type { AxiosResponse } from 'axios';
import type { PagingObjectType } from '@/common/types/paginationType';
import type { MyPageLikeProductType } from '@/modules/mypage/types/mypageLikeType';

import removeBtn from '@/assets/image/del.jpg';

import MyPageSideNav from '@/modules/mypage/components/MyPageSideNav';
import Pagination from '@/common/components/Pagination';
import ImageForm from '@/common/components/ImageForm';

// 관심상품 목록 페이지
function LikeProduct() {
	const [params] = useSearchParams();
	const { page = '1' } = Object.fromEntries(params);

	const [likeData, setLikeData] = useState<MyPageLikeProductType[]>([]);
	const [pagingData, setPagingData] = useState<PagingObjectType>({
		startPage: 0,
        endPage: 0,
        prev: false,
        next: false,
        activeNo: Number(page),
	});

	const navigate = useNavigate();

	const getLikeProduct = async(): Promise<void> => {
		try {
			const res: AxiosResponse = await getLikeProductList(page);

			const pagingObject: PagingObjectType = mainProductPagingObject(Number(page), res.data.totalPages);
			setPagingData({
				startPage: pagingObject.startPage,
				endPage: pagingObject.endPage,
				prev: pagingObject.prev,
				next: pagingObject.next,
				activeNo: pagingObject.activeNo,
			});

			setLikeData(res.data.content);
		}catch (err) {
			console.error('likeProductList error', err);
		}
	}

	useEffect(() => {
		window.scrollTo(0, 0);
		getLikeProduct();

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

	// 관심상품 제거 이벤트
	const handleRemoveProductLike = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
		try {
			const id: string = String(e.currentTarget.dataset.id);
			await deLikeProduct(id);

			getLikeProduct();
		} catch (err) {
			console.log(err);
			alert('오류가 발생했습니다.\n문제가 계속된다면 관리자에게 문의해주세요.');
		}
	}
	
	return (
        <div className="mypage">
            <MyPageSideNav
                qnaStat={false}
            />
            <div className="mypage-content test-div">
                <div className="mypage-like-header">
                    <h1>관심 상품</h1>
                </div>
                <div className="mypage-like-content">
                    <div className="mypage-like-content-list">
                        {likeData.map((data, index) => {
                            return (
                                <div key={index} className="mypage-like-detail">
                                    <LikeListContent
                                        data={data}
                                        handleRemoveProductLike={handleRemoveProductLike}
                                    />
                                </div>
                            )
                        })}
                    </div>
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

type LikeListContentProps = {
	data: MyPageLikeProductType;
	handleRemoveProductLike: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function LikeListContent(props: LikeListContentProps) {
    const { data, handleRemoveProductLike } = props;

    return (
        <div className="mypage-like-data-detail">
            <div className="mypage-like-detail-content">
                <div className="mypage-like-remove">
					<button 
						type='button'
						data-id={data.productId}
						onClick={handleRemoveProductLike}
					>
						<img className="mypage-like-delete-btn" src={removeBtn} alt={''}/>
					</button>
                </div>
                <div className="mypage-like-thumb">
                    <ImageForm imageName={data.thumbnail} className={'mypage-like-thumbnail'}/>
                    <div className="mypage-like-info">
                        <Link to={`/product/${data.productId}`}>
                            <span className="like-data-product-name">{data.productName}</span>
                        </Link>
                        <span className="like-data-product-price">{numberComma(data.productPrice)} 원</span>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default LikeProduct;