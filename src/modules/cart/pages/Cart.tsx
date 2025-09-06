import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
	getCartList,
	updateCartCount,
	deleteSelectCartProduct,
	deleteAllCartProduct,
	getOrderProductInfo
} from '@/modules/cart/services/cartService';
import {
	setSelectCartDetail,
	setAllCartDetail,
	setCheckBoxStatus
} from '@/modules/cart/utils/cartUtils';
import { numberComma } from '@/common/utils/formatNumberComma';
import { getProductOption } from '@/common/utils/productOptionUtils';

import { CART_SELECT_CONSTANTS } from '@/modules/cart/constants/cartSelectConstants';
import { CHECK_BOX_CONSTANTS } from '@/common/constants/checkBoxConstants';
import type { CartDetailType, SelectCartDetailType } from '@/modules/cart/types/cartTypes';
import type { AxiosResponse } from 'axios';

import countUpBtn from '@/assets/image/up.jpg';
import countDownBtn from '@/assets/image/down.jpg';
import removeBtn from '@/assets/image/del.jpg';

import ImageForm from '@/common/components/ImageForm';
import DefaultButton from '@/common/components/DefaultButton';

import '@/styles/cart.css';



/*
    장바구니 페이지
    선택 상품 주문, 전체 상품 주문, 선택 상품 삭제, 전체 상품 삭제, 상품별 수량 제어 기능
*/
function Cart() {
	const [cartData, setCartData] = useState<CartDetailType[]>([]);
	const [selectValue, setSelectValue] = useState<SelectCartDetailType[]>([{
		productId: '',
		cartDetailId: 0,
		size: '',
		color: '',
		count: 0,
		originPrice: 0,
		price: 0,
		discount: 0,
		status: true,
	}]);
	const [totalPrice, setTotalPrice] = useState<number>(0);

	const navigate = useNavigate();

	const getCart = async (): Promise<void> => {
		try {
			const res: AxiosResponse = await getCartList();
			const data: CartDetailType[] = res.data;

			setCartData(data);

			if(data.length !== 0) {
				if(selectValue[0].cartDetailId === 0) {
					const selectArr: SelectCartDetailType[] = [];
					for(let i = 0; i < data.length; i++) {
						selectArr.push({
							productId: data[i].productId,
							cartDetailId: Number(data[i].cartDetailId),
							size: data[i].size,
							color: data[i].color,
							count: Number(data[i].count),
							originPrice: Number(data[i].originPrice),
							price: Number(data[i].price),
							discount: Number(data[i].discount),
							status: true
						});
					}

					setSelectValue(selectArr);
				}
				let totalPriceValue: number = 0;
				for(let i = 0; i < data.length; i++) {
					totalPriceValue += Number(data[i].price);
				}

				setTotalPrice(totalPriceValue);
			}
		}catch (error) {
			console.error('getCart error', error);
		}
	}

	useEffect(() => {
		getCart();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// 상품 수량 증가 이벤트
	const handleIncrease = (e: React.MouseEvent<HTMLButtonElement>): void => {
		updateCartCount('increase', Number(e.currentTarget.dataset.id), getCart);
	}	

	// 상품 수량 감소 이벤트
	const handleDecrease = (e: React.MouseEvent<HTMLButtonElement>): void => {
		const cartInput: number = Number(e.currentTarget.parentElement?.previousSibling?.textContent || 0);

		if(cartInput > 1)
			updateCartCount('decrease', Number(e.currentTarget.dataset.id), getCart);
	}

	// 상품 제거 이벤트 ( 상품 Element에서 x 버튼을 통한 제거 제어 )
	const handleRemoveProduct = (e: React.MouseEvent<HTMLButtonElement>): void => {
		const deleteId: number = Number(e.currentTarget.dataset.id);
		
		const selectArr: SelectCartDetailType[] = [...selectValue];
		const deleteValue: SelectCartDetailType | undefined = selectArr.find(
			item => item.cartDetailId === deleteId
		);
		
		if(deleteValue) {
			deleteSelectCartProduct(CART_SELECT_CONSTANTS.SELECT, deleteValue, getCart);
		}
	}

	// 선택 상품 제거 버튼 이벤트
	const handleSelectRemove = (): void => {
		deleteSelectCartProduct(CART_SELECT_CONSTANTS.SELECT_ALL, selectValue, getCart);
	}

	// 전체 상품 제거 버튼 이벤트
	const handleAllRemove = async (): Promise<void> => {
		if(window.confirm('전체 상품을 삭제하시겠습니까?')) {
			try {
				await deleteAllCartProduct();
				setTotalPrice(0);
				getCart();
			} catch (error) {
				console.log(error);
				alert('오류가 발생했습니다.\n문제가 계속된다면 관리자에게 문의해주세요.');
			}
		}
	}

	// 선택 상품 주문 버튼 이벤트
	const handleSelectOrder = (): void => {
		const detailIds: number[] = setSelectCartDetail(selectValue);
		getOrderData(detailIds);
	}

	// 전체 상품 주문 버튼 이벤트
	const handleAllOrder = (): void => {
		const detailIds: number[] = setAllCartDetail(selectValue);
		getOrderData(detailIds);
	}
	
	// 주문 데이터 조회
	// 주문 페이지로 넘어가기 전 변경사항 적용을 위해 데이터 조회 후 페이지로 이동
	const getOrderData = async(detailIds: number[]): Promise<void> => {
		try {
			const res: AxiosResponse = await getOrderProductInfo(detailIds);

			navigate(
				'/payment',
				{
					state: {
						orderProduct: res.data.orderData,
						orderType: 'cart',
						totalPrice: res.data.totalPrice,
					}
				}
			)
		} catch (error) {
			console.error('getOrderData error', error);
		}
	}

	// 상품 check box 체크 이벤트
	const handleSelectCheckBox = (e: React.ChangeEvent<HTMLInputElement>): void => {
		handleCheckBox(CHECK_BOX_CONSTANTS.CHECK, e);
	}

	// 상품 check box 해제 이벤트
	const handleDisableCheckBox = (e: React.ChangeEvent<HTMLInputElement>): void => {
		handleCheckBox(CHECK_BOX_CONSTANTS.DISABLE, e);
	}

	// 상품 check box 이벤트 공통 처리
	const handleCheckBox = (type: string, e: React.ChangeEvent<HTMLInputElement>): void => {
		const idx: number = Number(e.currentTarget.value);
		const arr: SelectCartDetailType[] = setCheckBoxStatus({idx, selectValue});
		
		setSelectValue(arr);

		if(type === CHECK_BOX_CONSTANTS.CHECK)
			setTotalPrice(totalPrice + Number(arr[idx].price));
		else
			setTotalPrice(totalPrice - Number(arr[idx].price));
	}

	return (
        <div className="cart">
            <div className="cart-content">
                <div className="cart-header">
                    <h1>장바구니</h1>
                </div>
                <div className="cart-order-btn-content">
                    <DefaultButton className={'select-productOrder-btn'} onClick={handleSelectOrder} btnText={'선택 상품 주문'} />
                    <DefaultButton className={'all-productOrder-btn'} onClick={handleAllOrder} btnText={'전체 상품 주문'} />
                    <DefaultButton className={'select-delete-btn'} onClick={handleSelectRemove} btnText={'선택 상품 삭제'} />
                    <DefaultButton className={'all-delete-btn'} onClick={handleAllRemove} btnText={'전체 상품 삭제'} />
                </div>
                <CartDetail
                    data={cartData}
					handleIncrease={handleIncrease}
					handleDecrease={handleDecrease}
                    handleRemoveProduct={handleRemoveProduct}
                    handleDisableCheckBox={handleDisableCheckBox}
                    handleSelectCheckBox={handleSelectCheckBox}
                    selectStatus={selectValue}
                />
                <TotalPrice
                    totalPrice={totalPrice}
                />
            </div>
        </div>
    )
}

type TotalPriceProps = {
	totalPrice: number;
}

function TotalPrice(props: TotalPriceProps) {
    const { totalPrice } = props;

	if(totalPrice !== 0){
		return (
            <div className="cart-total-price">
                <span className="total-price">총 {numberComma(totalPrice)} 원</span>
            </div>
        )
	}
}

type CartDetailProps = {
	data: CartDetailType[];
	handleIncrease: (e: React.MouseEvent<HTMLButtonElement>) => void;
	handleDecrease: (e: React.MouseEvent<HTMLButtonElement>) => void;
	handleRemoveProduct: (e: React.MouseEvent<HTMLButtonElement>) => void;
	handleDisableCheckBox: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleSelectCheckBox: (e: React.ChangeEvent<HTMLInputElement>) => void;
	selectStatus: SelectCartDetailType[];
}

function CartDetail(props: CartDetailProps) {
    const { data, 
		handleIncrease, 
		handleDecrease, 
		handleRemoveProduct, 
		handleDisableCheckBox,
		handleSelectCheckBox, 
		selectStatus 
	} = props;

	if(data.length === 0){
		return (
            <div className="content-data">
                <h3>장바구니에 담긴 상품이 없습니다.</h3>
            </div>
        )
	}

	const getDiscountTexts = (discount: number, originPrice: number): {discountText: string, originPriceText: string} => {
		if(discount === 0)
			return { discountText: '', originPriceText: '' };

		return {
			discountText: `-${discount}%`,
			originPriceText: numberComma(originPrice),
		}
	}

	return (
		<div className="content-data">
			{data.map((cart, index) => {
				const { discountText, originPriceText } = getDiscountTexts(cart.discount, cart.originPrice);
				const productOption = getProductOption(cart);

				return (
					<div key={index} className="cart-data">
						<div className="cart-data-header">
							<SelectBoxInput
								status={selectStatus[index]}
								handleDisableCheckBox={handleDisableCheckBox}
								handleSelectCheckBox={handleSelectCheckBox}
								statusIdx={index}
							/>
							<span className={'product-name'}>{cart.productName}</span>
							<button 
								type='button'
								data-id={cart.cartDetailId}
								onClick={handleRemoveProduct}
								className='remove-btn'
							>
								<img src={removeBtn} alt="삭제"/>
							</button>
							
						</div>
						<div className="cart-data-content">
							<ImageForm
								imageName={cart.productThumbnail}
								className={'cart-thumbnail'}
							/>
							<div className="cart-info">
								<span className="productOption">{productOption}</span>

								<div className="cart-input-content">
									<input type={'text'} className={'cart-input'} value={cart.count}
										   readOnly={true}/>
									<div className="cart-count">
									<button 
										type='button'
										data-id={cart.cartDetailId}
										onClick={handleIncrease}
										className='count-up-btn'
									>
										<img src={countUpBtn} alt="상품 수량 증가"/>
									</button>
									<button 
										type='button'
										data-id={cart.cartDetailId}
										onClick={handleDecrease}
										className='count-down-btn'
									>
										<img src={countDownBtn} alt="상품 수량 감소"/>
									</button>
									</div>
								</div>
								<div className="cart-price">
									<p className={'cart-option-price'}>
										{originPriceText && (
											<small className={'cart-option-price-discount'} style={{textDecoration: 'line-through'}}>{originPriceText}</small>
										)}
										{discountText && (
											<strong className={'cart-option-price-discount'}>{discountText}</strong>
										)}
										{numberComma(cart.price)} 원
									</p>
								</div>
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}

type SelectBoxInputProps = {
	status: SelectCartDetailType;
	handleDisableCheckBox: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleSelectCheckBox: (e: React.ChangeEvent<HTMLInputElement>) => void;
	statusIdx: number;
}

function SelectBoxInput(props: SelectBoxInputProps) {
    const { status, handleDisableCheckBox, handleSelectCheckBox, statusIdx } = props;

	const isChecked = status.status;
	const handleChange = isChecked ? handleDisableCheckBox : handleSelectCheckBox;

	return (
		<input type={'checkbox'} value={statusIdx} checked={isChecked} onChange={handleChange}/>
	)
}

export default Cart;