import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { productDetailPagingObject } from '@/common/utils/paginationUtils';
import { getProductOption } from '@/common/utils/productOptionUtils';
import { DEFAULT_PAGING_OBJECT_WITH_TOTAL } from '@/common/constants/pagingObjectConstants';
import type { RootState } from '@/common/types/userDataType';
import type { 
	ProductDetailDataType, 
	ProductDetailOptionType, 
	ProductDetailReviewType, 
	ProductDetailQnAType, 
	ProductDetailType,
	ProductDetailReviewItemType,
	ProductDetailQnAItemType,
	ProductOptionCountType,
	ProductDetailQnAReplyType
} from '@/modules/product/types/productType';
import type { PagingObjectType, PagingObjectWithTotalType } from '@/common/types/paginationType';

import {
	getProductDetail,
	getOrderData,
	addCart,
	likeProduct,
	deLikeProduct,
	getProductReview,
	getProductQnA,
	postProductQnA,
} from '@/modules/product/services/productService';
import { handleLocationPathToLogin } from '@/common/utils/locationPathUtils';
import { getClickPageNumber } from '@/common/utils/paginationUtils';
import { numberComma } from '@/common/utils/formatNumberComma';

import countUpBtn from '@/assets/image/up.jpg';
import countDownBtn from '@/assets/image/down.jpg';
import removeBtn from '@/assets/image/del.jpg';

import ProductDetailThumbnail from '@/modules/product/components/ProductDetailThumbnail';
import Pagination from '@/common/components/Pagination';
import ImageForm from '@/common/components/ImageForm';
import DefaultButton from '@/common/components/DefaultButton';

import '@/styles/productDetail.css';
import type { AxiosResponse } from 'axios';

type SelectOptionType = {
	optionId: number;
	count: number;
	price: number;
	size: string | null;
	color: string | null;
}

/*
    상품 상세 페이지
    현재는 백엔드에서 한번의 요청으로 모든 데이터를 전달해주는 형태.
*/
function ProductDetail() {
	const loginStatus = useSelector((state: RootState) => state.member.loginStatus);
	const { pathname } = useLocation();
	const { productId } = useParams();
	const [productData, setProductData] = useState<ProductDetailDataType>({
		productId: '',
		productName: '',
		productPrice: 0,
		productLikeStat: false,
		discount: 0,
		discountPrice: 0,
	});
	const [productOption, setProductOption] = useState<ProductDetailOptionType[]>([]);
	const [thumbnail, setThumbnail] = useState<string[]>([]);
	const [infoImage, setInfoImage] = useState<string[]>([]);
	const [productReview, setProductReview] = useState<ProductDetailReviewItemType[]>([]);
	const [reviewPagingObject, setReviewPagingObject] = useState<PagingObjectWithTotalType>(DEFAULT_PAGING_OBJECT_WITH_TOTAL);
	const [productQnA, setProductQnA] = useState<ProductDetailQnAItemType[]>([]);
	const [productQnAPagingObject, setProductQnAPagingObject] = useState<PagingObjectWithTotalType>(DEFAULT_PAGING_OBJECT_WITH_TOTAL);
	const [selectOption, setSelectOption] = useState<SelectOptionType[]>([]);
	const [totalPrice, setTotalPrice] = useState<number>(0);
	const [qnaInputValue, setQnaInputValue] = useState<string>('');

	const productInfoElem = useRef<HTMLDivElement>(null);
	const productReviewElem = useRef<HTMLDivElement>(null);
	const productQnAElem = useRef<HTMLDivElement>(null);
	const productOrderInfoElem = useRef<HTMLDivElement>(null);

	const navigate = useNavigate();

	useEffect(() => {
		window.scrollTo(0, 0);

		const getDetailData = async(): Promise<void> => {
			try {
				const res: AxiosResponse = await getProductDetail(productId as string);
				const productContent: ProductDetailType = res.data;
				const productReview: ProductDetailReviewType = productContent.productReviewList;
				const productQnA: ProductDetailQnAType = productContent.productQnAList;
				
				setProductData({
					productId: productContent.productId,
                    productName: productContent.productName,
                    productPrice: productContent.productPrice,
                    productLikeStat: productContent.likeStat,
                    discount: productContent.discount,
                    discountPrice: productContent.discountPrice,
				});

				// 대표썸네일과 그 외 썸네일
				const thumbnailArr = [
					productContent.productImageName,
					...productContent.productThumbnailList,
				];

				setThumbnail(thumbnailArr);
				setInfoImage(productContent.productInfoImageList);
				setProductOption(productContent.productOptionList);
				setProductReview(productReview.content);
				setProductQnA(productQnA.content);

				const reviewPagingObject: PagingObjectType = productDetailPagingObject(productReview.number + 1, productReview.totalPages);
				setReviewPagingObject({
                    startPage: reviewPagingObject.startPage,
                    endPage: reviewPagingObject.endPage,
                    prev: reviewPagingObject.prev,
                    next: reviewPagingObject.next,
                    activeNo: productReview.number + 1,
                    totalElements: productReview.totalElements,
                });
				const qnaPagingObject: PagingObjectType = productDetailPagingObject(productQnA.number + 1, productQnA.totalPages);
				setProductQnAPagingObject({
                    startPage: qnaPagingObject.startPage,
                    endPage: qnaPagingObject.endPage,
                    prev: qnaPagingObject.prev,
                    next: qnaPagingObject.next,
                    activeNo: productQnA.number + 1,
                    totalElements: productQnA.totalElements,
                });
			}catch (err) {
				console.error('product detail error : ', err);
			}
		}

		getDetailData();
	}, [productId]);
	
	//옵션 select box 이벤트
	const handleSelectBoxOnChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
		const elementValue: string = e.target.value;
		const valueArr: string[] = elementValue.split('/');
		const optionId: number = Number(valueArr[0]);
		let size: string | null = null;
		let color: string | null = null;
		
		for(let i = 1; i < valueArr.length; i++){
            if(valueArr[i].startsWith('s'))
                size = valueArr[i].substring(2);
            else if(valueArr[i].startsWith('c'))
                color = valueArr[i].substring(2);
        }

		const arr: SelectOptionType[] = [...selectOption];
        arr.push({
            optionId: optionId,
            count: 1,
            price: productData.discountPrice,
            size: size,
            color: color,
        })

        setSelectOption(arr);
        setTotalPrice(totalPrice + productData.discountPrice);
	}

	//옵션 선택 이후 상품 수량 증가 버튼 이벤트
    const handleCountUp = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const idx: number = Number(e.currentTarget.dataset.index);
		const price: number = totalPrice + productData.discountPrice;
        countUpDown(idx, 1, price);
    }

    //옵션 선택 이후 상품 수량 감소 버튼 이벤트
    const handleCountDown = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const idx: number = Number(e.currentTarget.dataset.index);
        const count: number = selectOption[idx].count;

        if(count !== 1) {
			const price = totalPrice - productData.discountPrice;
            countUpDown(idx, -1, price);
        }
    }

	// 상품 수량 증감 처리
	const countUpDown = (idx: number, count: number, price: number): void => {
		const newSelectOption: SelectOptionType[] = [...selectOption];
		newSelectOption[idx] = {
            optionId: selectOption[idx].optionId,
            count: selectOption[idx].count + count,
            price: productData.discountPrice * (selectOption[idx].count + count),
            size: selectOption[idx].size,
            color: selectOption[idx].color,
        }

		setSelectOption(newSelectOption);
		setTotalPrice(price);
	}

	//선택 옵션 제거 이벤트
	const handleOptionRemove = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const idx: number = Number(e.currentTarget.dataset.index);

        const arr: SelectOptionType[] = [...selectOption];
        const optionPrice: number = arr[idx].price;
        arr.splice(idx, 1);

        setSelectOption(arr);
        setTotalPrice(totalPrice - optionPrice);
    }

	// 바로 구매 버튼 이벤트
	const handleBuyBtn = (): void => {
		if(selectOption.length === 0) 
			alert('상품 옵션을 선택해주세요.');
		else {
			const orderProductArr: ProductOptionCountType[] = [];

			for(let i = 0; i < selectOption.length; i++) {
				orderProductArr.push({
					optionId: selectOption[i].optionId,
					count: selectOption[i].count,
				});
			}

			getOrderProductData(orderProductArr);
		}
	}

	// 선택 상품 데이터 체크 요청 이후 주문 페이지로 이동
	const getOrderProductData = async (selectData: ProductOptionCountType[]): Promise<void> => {
		try {
			const res = await getOrderData(selectData);
			
			navigate(
				'/payment',
				{
					state: {
						orderProduct: res.data.orderData,
						orderType: 'direct',
						totalPrice: res.data.totalPrice,
					}
				}
			)
		} catch (err) {
			console.error('get order product data error : ', err);
		}
	}

	// 장바구니 담기 버튼 이벤트
	const handleCartBtn = (): void => {
		if(selectOption.length === 0)
			alert('상품 옵션을 선택해주세요.');
		else {
			const addList: ProductOptionCountType[] = [];

			for(let i = 0; i < selectOption.length; i++) {
				addList.push({
					optionId: selectOption[i].optionId,
					count: selectOption[i].count,
				});
			}

			postAddCart(addList);
		}
	}

	// 장바구니 담기 요청
	const postAddCart = async (addList: ProductOptionCountType[]): Promise<void> => {
		try {
			await addCart(addList);

			alert('장바구니에 상품을 추가했습니다.');
		} catch (err) {
			console.error('post add cart error : ', err);
			alert('오류가 발생했습니다.\n문제가 계속된다면 관리자에게 문의해주세요.');
		}
	}

	//관심상품 등록 버튼 이벤트
	const handleLikeBtn = (): void => {
		if(!loginStatus){
			if(window.confirm('로그인 사용자만 관심상품 등록이 가능합니다.\n로그인 하시겠습니까?'))
				handleLocationPathToLogin(pathname, navigate);
		}else {
			const likeStatus: boolean = productData.productLikeStat;

			postLikeProduct(productId as string, likeStatus);
		}
	}

	// 관심상품 등록 요청
	const postLikeProduct = async (productId: string, likeStatus: boolean): Promise<void> => {
		try {
			console.log('like product Id : ', productId);
			await likeProduct(productId);

			setProductData({
				...productData,
				productLikeStat: !likeStatus,
			});
		} catch (err) {
			console.error('post like product error : ', err);
			alert('오류가 발생했습니다.\n문제가 계속된다면 관리자에게 문의해주세요.');
		}
	}

	//관심상품 등록 해제 버튼 이벤트
	const handleDeLikeBtn = (): void => {
		const productId: string = productData.productId;
		const likeStatus: boolean = productData.productLikeStat;

		deleteLikeProduct(productId, likeStatus);
	}

	// 관심상품 등록 해제 요청
	const deleteLikeProduct = async (productId: string, likeStatus: boolean): Promise<void> => {
		try {
			await deLikeProduct(productId);

			setProductData({
				...productData,
				productLikeStat: !likeStatus,
			});
		} catch (err) {
			console.error('delete like product error : ', err);
			alert('오류가 발생했습니다.\n문제가 계속된다면 관리자에게 문의해주세요.');	
		}
	}


	//UI내 상품 정보, 리뷰, 문의 버튼 클릭 시 스크롤 이동 이벤트
    const handleDetailBtn = (e: React.MouseEvent<HTMLButtonElement>): void => {
		const name = e.currentTarget.name;
        const elemMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
			detail: productInfoElem,
			review: productReviewElem,
			qna: productQnAElem,
			orderInfo: productOrderInfoElem,
		};
		const targetRef = elemMap[name as keyof typeof elemMap];
		const blockOption = name === 'detail' ? 'start' : 'center';

		targetRef.current?.scrollIntoView({ behavior: 'smooth', block: blockOption });
    }

	// 상품 리뷰 페이지네이션 버튼 이벤트
	const handleReviewPaginBtn = (type: string): void => {
		const targetPage = getClickPageNumber(type, reviewPagingObject);
		if(targetPage)
			getReview(productId as string, targetPage);
	}

	// 상품 리뷰 페이지네이션 버튼 이벤트로 인한 리뷰 데이터 조회
	const getReview = async (productId: string, page: number): Promise<void> => {
		try {
			const res: AxiosResponse = await getProductReview(productId, String(page));
			setProductReview(res.data.content);

			const reviewPagingObject: PagingObjectType = productDetailPagingObject(page, res.data.totalPages);
			setReviewPagingObject({
				startPage: reviewPagingObject.startPage,
				endPage: reviewPagingObject.endPage,
				prev: reviewPagingObject.prev,
				next: reviewPagingObject.next,
				activeNo: page,
				totalElements: res.data.totalElements,
			});
		} catch (error) {
			console.error('get review error : ', error);
		}
	}

	//상품 문의 페이지네이션 버튼 이벤트
	const handleQnAPaginationBtn = (type: string): void => {
		const targetPage = getClickPageNumber(type, productQnAPagingObject);
		if(targetPage)
			getQnA(productId as string, targetPage);
	}

	// 상품 문의 페이지네이션 버튼 이벤트로 인한 문의 데이터 조회
	const getQnA = async (productId: string, page: number): Promise<void> => {
		try {
			const res: AxiosResponse = await getProductQnA(productId, String(page));
			setProductQnA(res.data.content);

			const qnaPagingObject: PagingObjectType = productDetailPagingObject(page, res.data.totalPages);
			setProductQnAPagingObject({
				startPage: qnaPagingObject.startPage,
				endPage: qnaPagingObject.endPage,
				prev: qnaPagingObject.prev,
				next: qnaPagingObject.next,
				activeNo: page,
				totalElements: res.data.totalElements,
			});
		} catch (error) {
			console.error('get qna error : ', error);
		}
	}

	// 상품 문의 작성 textarea 이벤트
	const handleQnAOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
		setQnaInputValue(e.target.value);
	}

	// 상품 문의 작성 버튼 이벤트
	const handleQnAOnClick = (): void => {
		if(!loginStatus) {
			if(window.confirm('상품 문의는 로그인시에만 가능합니다.\n로그인 하시겠습니까?'))
				handleLocationPathToLogin(pathname, navigate);
		}else {
			postQnA(productId as string, qnaInputValue);
		}
	}

	// 상품 문의 작성 요청
	const postQnA = async (productId: string, qnaInputValue: string): Promise<void> => {
		try {
			await postProductQnA(productId, qnaInputValue);

			setQnaInputValue('');
			handleQnAPaginationBtn('1');
		} catch (error) {
			console.error('post qna error : ', error);
			alert('오류가 발생했습니다.\n문제가 계속된다면 관리자에게 문의해주세요.');
		}
	}
	
	return (
		<div className="product-detail-content">
            <div className="product-detail-header">
                <ProductDetailThumbnail
                    imageName={thumbnail}
                />

                <div className="product-detail-option">
                    <div className="product-detail-option-detail">
                        <div className="product-default-info">
                            <div className="product-name mgt-4">
                                <label>상품명</label>
                                <span className="name">{productData.productName}</span>
                            </div>
                            <div className="product-price mgt-4">
                                <label>가격</label>
                                <ProductPrice productData={productData}/>
                            </div>
                            <ProductDetailSelect
                                productOption={productOption}
                                onChange={handleSelectBoxOnChange}
                            />
                        </div>
                        <div className="product-info temp-order mgt-4">
                            <table className="temp-order-table">
                                <tbody className="temp-order-table-body">
                                    {selectOption.map((option, index) => {
                                        return (
                                            <TempOrderTableBody
                                                key={index}
                                                idx={index}
                                                selectOption={option}
                                                handleCountUp={handleCountUp}
                                                handleCountDown={handleCountDown}
                                                handleOptionRemove={handleOptionRemove}
                                            />
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <DefaultButton onClick={handleBuyBtn} btnText={'바로구매'}/>
                        <DefaultButton onClick={handleCartBtn} btnText={'장바구니'}/>
                        <ProductLikeBtn
                            likeStatus={productData.productLikeStat}
                            handleLikeBtn={handleLikeBtn}
                            handleDeLikeBtn={handleDeLikeBtn}
                        />
                        <TotalPrice
                            totalPrice={totalPrice}
                        />
                    </div>
                </div>
            </div>

            <div className="product-detail-content">
                <div className="product-detail-content-btn">
                    <label htmlFor="detail-btn">상품정보</label>
                    <button id={'detail-btn'} name={'detail'} onClick={handleDetailBtn}></button>
                    <label htmlFor="review-btn">리뷰({reviewPagingObject.totalElements})</label>
                    <button id={'review-btn'} name={'review'}  onClick={handleDetailBtn}></button>
                    <label htmlFor="qna-btn">QnA({productQnAPagingObject.totalElements})</label>
                    <button id={'qna-btn'} name={'qna'} onClick={handleDetailBtn}></button>
                    <label htmlFor="order-info-btn">주문정보</label>
                    <button id={'order-info-btn'} name={'orderInfo'} onClick={handleDetailBtn}></button>
                </div>
                <div className="product-detail-info" ref={productInfoElem}>
                    <h2>상품 정보</h2>
                    {infoImage.map((image, index) => {
                        return (
                            <div key={index} className={'info-image-div'}>
                                <ImageForm className={'info-image'} imageName={image}/>
                            </div>
                        )
                    })}
                </div>
                <div className="product-detail-review" ref={productReviewElem}>
                    <div className="product-detail-review-header">
                        <h2>상품 리뷰</h2>
                    </div>
                    <div className="product-detail-review-content">
                        <ul>
                            {productReview.map((review, index) => {
                                return (
                                    <Review
                                        data={review}
                                        key={index}
                                    />
                                )
                            })}
                        </ul>
                    </div>
                    <div className="product-detail-review-paging">
                        <Pagination
                            pagingData={reviewPagingObject}
                            handlePageBtn={handleReviewPaginBtn}
                        />
                    </div>
                </div>
                <div className="product-detail-qna" ref={productQnAElem}>
                    <div className="product-detail-qna-header">
                        <h2>상품 문의</h2>
                        <div className="qna-input">
                            <textarea name="qna-text" value={qnaInputValue} onChange={handleQnAOnChange}>{qnaInputValue}</textarea>
                        </div>
                        <DefaultButton onClick={handleQnAOnClick} btnText={'문의하기'}/>
                    </div>
                    <div className="product-detail-qna-content">
                        <ul>
                            {productQnA.map((qna, index) => {
                                return (
                                    <QnA
                                        data={qna}
                                        key={index}
                                    />
                                )
                            })}
                        </ul>
                    </div>
                    <div className="product-detail-qna-paging">
                        <Pagination
                            pagingData={productQnAPagingObject}
                            handlePageBtn={handleQnAPaginationBtn}
                        />
                    </div>
                </div>

                <div className="product-detail-order-info" ref={productOrderInfoElem}>
                    <div className="product-detail-order-info-header">
                        <h2>배송 정보</h2>
                    </div>
                    <div className="product-detail-order-info-content">
                        <table className="delivery-info" border={1}>
                            <tbody>
                                <tr>
                                    <th>배송 방법</th>
                                    <td>순차 배송</td>
                                </tr>
                                <tr>
                                    <th>묶음배송 여부</th>
                                    <td>가능</td>
                                </tr>
                                <tr>
                                    <th>배송비</th>
                                    <td>
                                        <ul>
                                            <li>3,500원 / 10만원 이상 구매시 무료배송</li>
                                            <li>제주, 도서산간 지역 배송은 5,000원 / 10만원 이상 구매시 무료배송</li>
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <th>배송기간</th>
                                    <td>결제일 기준 평균 2 ~ 4일 소요</td>
                                </tr>
                                <tr>
                                    <th>무통장입금 계좌번호</th>
                                    <td>
                                        <ul>
                                            <li>농협 000-000000-000</li>
                                            <li>기업은행 0000-00000-000</li>
                                        </ul>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="product-detail-order-info-header">
                        <h2>교환 / 반품 안내</h2>
                    </div>
                    <div className="product-detail-order-info-content">
                        <table className="delivery-info" border={1}>
                            <tbody>
                                <tr>
                                    <th>교환/반품 비용</th>
                                    <td>
                                        5,000원
                                        <ul>
                                            <li>단, 고객의 변심의 경우에만 발생</li>
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <th>교환 반품 신청 기준일</th>
                                    <td>
                                        <ul>
                                            <li>
                                                상품 수령 후 7일 이내 마이페이지%gt;문의사항을 통해 접수.
                                            </li>
                                            <li>
                                                타 택배사 이용 시 2,500원을 동봉해 선불로 보내주셔야 합니다.
                                            </li>
                                        </ul>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="product-detail-order-info-header">
                        <h2>교환 / 반품 제한사항</h2>
                    </div>
                    <div className="product-detail-order-info-content">
                        <ul>
                            <li>향수등의 냄새가 배거나 착용흔적이 보이는 제품, 오랜기간 방치로 인한 제품의 가치가 하락한 제품등의 경우는 교환/환불이 어려울 수 있습니다.</li>
                            <li>착용흔적, 훼손이 있을 경우에는 교환/환불 처리가 어려울 수 있기 때문에 개별적으로 연락을 드립니다.</li>
                            <li>불량품, 오배송의 경우는 mansShop에서 배송비를 부담합니다.</li>
                            <li>반드시 우체국 택배를 통해 보내주셔야 합니다. 그외 택배사 이용시 선불로 택배를 보내주셔야 합니다. 착불 시 추가적 배송비는 고객님이 부담하게 됩니다.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
	)
}

type ProductPriceProps = {
	productData: ProductDetailDataType;
}

// 상품 가격 폼
function ProductPrice(props: ProductPriceProps) {
	const { productData } = props;

	if(productData.discount === 0)
        return (
            <span className="price">{numberComma(productData.productPrice)}원</span>
        )

	return (
		<>
			<span className="original-price">{numberComma(productData.productPrice)}</span>
			<span className="discount-value">{productData.discount}%</span>
			<span className="discount-Price">{numberComma(productData.discountPrice)}원</span>
		</>
	)
}

type ProductDetailSelectProps = {
	productOption: ProductDetailOptionType[];
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

// 상품 옵션 select box 폼
function ProductDetailSelect(props: ProductDetailSelectProps) {
	const { productOption, onChange } = props;
	
	if(productOption.length === 0)
		return;

	return (
		<div className="product-detail-select mgt-4">
			<label>옵션</label>
			<select id={'product-detail-option-select-box'} defaultValue={'default'} onChange={onChange}>
				<option value={'default'} disabled={true}>옵션을 선택해주세요</option>
				{productOption.map((option, index) => {
					return(
						<ProductDetailSelectOption
							key={index}
							productOption={option}
						/>
					)
				})}
			</select>
		</div>
	)
}

type ProductDetailSelectOptionProps = {
	productOption: ProductDetailOptionType;
}

//상품 옵션 select box option 태그 폼
function ProductDetailSelectOption(props: ProductDetailSelectOptionProps) {
    const { productOption } = props;

	const { size, color, stock, optionId }: ProductDetailOptionType = productOption;

	const optionTextParts: string[] = [];
	const valueTextParts: string[] = [String(optionId)];

	if(size) {
		optionTextParts.push(`사이즈 : ${size}`);
		valueTextParts.push(`/s:${size}`);
	}

	if(color) {
		optionTextParts.push(`컬러 : ${color}`);
		valueTextParts.push(`/c:${color}`);
	}

	const optionText = optionTextParts.length > 0 ? optionTextParts.join(', ') : '단일 옵션';
	const valueText = valueTextParts.join('');

	return (
		<option value={valueText}  disabled={stock === 0}>
			{stock === 0 ? '(품절) ' : ''}{optionText}
		</option>
	)
}

type TempOrderTableBodyProps = {
	idx: number;
	selectOption: SelectOptionType;
	handleCountUp: (e: React.MouseEvent<HTMLButtonElement>) => void;
	handleCountDown: (e: React.MouseEvent<HTMLButtonElement>) => void;
	handleOptionRemove: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

//옵션 선택 시 출력 폼
function TempOrderTableBody(props: TempOrderTableBodyProps) {
    const { idx, selectOption, handleCountUp, handleCountDown, handleOptionRemove } = props;

    if(!selectOption)
        return null;

	const optionText = getProductOption(
		{ size: selectOption.size, color: selectOption.color}
	);

	return (
		<>
			<tr className="product-temp-cart">
				<td>{optionText}</td>
				<td className="product-temp-cart-input">
					<input type={'text'} value={selectOption.count} readOnly={true}/>
					<div className="product-temp-count">
						<div className="count-up-down">
							<button 
								type='button'
								data-index={String(idx)}
								onClick={handleCountUp}
							>
								<img src={countUpBtn} alt={'증가'}/>
							</button>
							<button 
								type='button'
								data-index={String(idx)}
								onClick={handleCountDown}
							>
								<img src={countDownBtn} alt={'감소'}/>
							</button>
						</div>
						<div className="count-remove">
							<button 
								type='button'
								data-index={String(idx)}
								onClick={handleOptionRemove}
							>
								<img src={removeBtn} alt={'삭제'}/>
							</button>
						</div>
					</div>
				</td>
				<td className={'product-price'}>
					<span>{`${numberComma(selectOption.price)} 원`}</span>
				</td>
			</tr>
		</>
	)
}

type TotalPriceProps = {
	totalPrice: number;
}

//옵션 선택에 따른 전체 금액 출력 폼
function TotalPrice(props: TotalPriceProps) {
    const { totalPrice } = props;

	if(totalPrice !== 0)
		return (
			<div className="total-price">
				<p>
					총 금액 : <span>{`${numberComma(totalPrice)} 원`}</span>
				</p>
			</div>
		)
}

type ReviewProps = {
	data: ProductDetailReviewItemType;
}

//상품 리뷰 폼
function Review(props: ReviewProps) {
    const { data } = props;

    return (
        <>
			<li className={'review-content-default'}>
				<div key={data.reviewWriter} className="review-content-header">
					<strong className="reviewer">{data.reviewWriter}</strong>
					<small className={'pull-right text-muted'}>{data.reviewCreatedAt}</small>
				</div>
				<div className="review-content-content">
					<p>{data.reviewContent}</p>
				</div>
			</li>

            {data.answerContent && (
				<div className="review-content-reply">
					<li className={'review-content'}>
						<div className="review-content-header">
							<strong className="reviewer">관리자</strong>
							<small className={'pull-right text-muted'}>{data.answerCreatedAt}</small>
						</div>
						<div className="review-content-content">
							<p>{data.answerContent}</p>
						</div>
					</li>
				</div>
			)}
        </>
    )
}

type QnAProps = {
	data: ProductDetailQnAItemType;
}

//상품 문의 폼
function QnA(props: QnAProps) {
    const { data } = props;

	const replyList = data.replyList;
	const hasReplies = replyList.length > 0;
	const statElem = data.productQnAStat && <small className={'pull-right answer'}>답변완료</small>;

	return (
		<>
			<li className="qna-content-default">
				<div className="qna-content-header">
					<strong className="qna-writer">{data.writer}</strong>
					<small className={'pull-right text-muted'}>{data.createdAt}</small>
					{statElem}
				</div>
				<div className="qna-content-content">
					<p>{data.qnaContent}</p>
				</div>
			</li>
			{hasReplies &&
				replyList.map((reply, index) => {
					return (
						<QnAReply
							data={reply}
							key={index}
						/>
					)
				})
			}
		</>
	)
}

type QnAReplyProps = {
	data: ProductDetailQnAReplyType;
}

//상품 문의 답변 폼
function QnAReply(props: QnAReplyProps) {
    const { data } = props;

    if(!data)
        return null;

	return (
		<div className="qna-content-reply">
			<li className="qna-content">
				<div>
					<div className="qna-content-header">
						<strong className="qna-writer">{data.writer}</strong>
						<small className={'pull-right text-muted'}>{data.createdAt}</small>
					</div>
					<div className="qna-content-content">
						<p>{data.content}</p>
					</div>
				</div>
			</li>
		</div>
	)
}

type ProductLikeBtnProps = {
	likeStatus: boolean;
	handleLikeBtn: () => void;
	handleDeLikeBtn: () => void;
}

//관심상품 버튼 폼
function ProductLikeBtn(props: ProductLikeBtnProps) {
    const { likeStatus, handleLikeBtn, handleDeLikeBtn } = props;

	const btnAttr = likeStatus
		? {callback: handleDeLikeBtn, text: '관심상품 해제'}
		: {callback: handleLikeBtn, text: '관심상품 등록'}

	return (
		<DefaultButton onClick={btnAttr.callback} btnText={btnAttr.text}/>
	)
}

export default ProductDetail;