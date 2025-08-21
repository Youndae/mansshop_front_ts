import {useEffect, useRef, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import DaumPostcode from 'react-daum-postcode';

import { getProductOption } from '@/common/utils/productOptionUtils';
import { postPayment, postOrderData, orderDataValidate } from '@/modules/order/services/orderService';

import { RESPONSE_MESSAGE } from '@/common/constants/responseMessageType';
import { INFO_CHECK } from '@/common/constants/infoCheckConstans';
import { numberComma } from '@/common/utils/formatNumberComma';
import { PATTERNS, REGEX } from '@/common/constants/patterns';

import DefaultButton from '@/common/components/DefaultButton';

import '@/styles/order.css';
import type { OrderProductType, OrderAddressType, OrderDataType } from '@/modules/order/types/orderType';
import type { AxiosError, AxiosResponse } from 'axios';

type RadioStatusType = {
	card: boolean;
	cash: boolean;
}

declare global {
	interface Window {
		IMP: {
			init: (code: string) => void;
			request_pay: (params: any, callback: (res: any) => void) => void;
		};
	}
}

const FREE_DELIVERY_PRICE: number = 100000;

/*
    주문 페이지
    장바구니 및 상품 페이지에서 주문 버튼 클릭 시 상품 정보를 먼저 조회한 뒤 state에 담아 주문 페이지를 호출하는 형태.
    그래서 주문 페이지에서는 별도의 상품 데이터 요청을 처리하지 않음.

    주소 입력에는 kakao 우편번호 서비스 API를 사용,
    카드 결제는 I'mport 결제 API를 사용.
*/
function Order() {
	const location = useLocation();
    const state = location.state;
	const [orderProduct, setOrderProduct] = useState<OrderProductType[]>([]);
	const [totalPrice, setTotalPrice] = useState<number>(0);
	const [orderType, setOrderType] = useState<string>('');
	const [paymentType, setPaymentType] = useState<string>('card');
	const [radioStatus, setRadioStatus] = useState<RadioStatusType>({
		card: true,
		cash: false,
	});
	const [userAddress, setUserAddress] = useState<OrderAddressType>({
		postCode: '',
		address: '',
		detail: '',
	});
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [orderData, setOrderData] = useState<OrderDataType>({
		recipient: '',
		phone: '',
		orderMemo: '',
	});
	const [deliveryFee, setDeliveryFee] = useState<number>(3500);
    const [addressOverlap, setAddressOverlap] = useState<boolean>(true);
    const [recipientOverlap, setRecipientOverlap] = useState<boolean>(true);
    const [phoneOverlap, setPhoneOverlap] = useState<string>(''); // empty, inValid

    const recipientRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

	useEffect(() => {
		if(state !== null) {
			setOrderProduct(state.orderProduct);
			setTotalPrice(state.totalPrice);
			setOrderType(state.orderType);

			if(state.totalPrice >= FREE_DELIVERY_PRICE)
				setDeliveryFee(0);

			const jquery = document.createElement('script');
			jquery.src = "https://code.jquery.com/jquery-1.12.4.min.js";
            const iamport = document.createElement('script');
            iamport.src = "https://cdn.iamport.kr/js/iamport.payment-1.1.7.js";

			jquery.onerror = () => {
				console.error('jquery 로드 실패');
			}

            document.head.appendChild(jquery);
            document.head.appendChild(iamport);

			return () => {
				document.head.removeChild(jquery);
				document.head.removeChild(iamport);
			}
		}else {
			navigate('/error');
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state]);

	//결제 처리
	const requestPay = (): void => {
		const { IMP } = window;
		IMP.init('');

		const price: number = totalPrice;
		const name: string = orderData.recipient;
		const phone: string = orderData.phone.replaceAll(REGEX.PHONE, "$1-$2-$3");
		const payAddress: string = `${userAddress.address} ${userAddress.detail}`;
		const postCode: string = userAddress.postCode;
		let orderName: string = orderProduct[0].productName;
		if(orderProduct.length > 1)
			orderName = `${orderProduct[0].productName} 외 ${orderProduct.length - 1}건`;

		IMP.request_pay({
			pg: 'danal_tpay',
            pay_method: 'card',
            merchant_uid: new Date().getTime(),
            name: orderName,
            amount: price,
            buyer_email: '',
            buyer_name: name,
            buyer_tel: phone,
            buyer_addr: payAddress,
            buyer_postcode: postCode,
		}, async (res: {
			imp_uid: string;
			paid_amount: number;
			success?: boolean;
			error_msg?: string;
		}): Promise<void> => {
			try {
				const { data } = await postPayment(res.imp_uid);

				if(res.paid_amount === data.response.amount) {
					alert('결제 완료');
					await requestOrder();
				}else {
					alert('결제 실패');
				}
			}catch(err) {
				alert('결제 오류');
				console.error('결제 오류: ', err);
			}
		})
	}

	//주문 데이터 처리 요청
	const requestOrder = async (): Promise<void> => {
		console.log('request Order');

		try {
			const res: AxiosResponse = await postOrderData({
				orderData, 
				userAddress, 
				orderProduct, 
				deliveryFee, 
				totalPrice, 
				paymentType, 
				orderType
			});

			if(res.data.message === RESPONSE_MESSAGE.OK) {
				alert('주문이 완료되었습니다.');
				navigate('/');
			}
		}catch (err) {
			const error = err as AxiosError;
			const errStatus = error.response?.status;
			const errMessage = (error.response?.data as { errorMessage?: string } | undefined)?.errorMessage;
            console.log('requestOrder error');
            console.log(error);
            console.log('errorMessage : ', errMessage);
            if(errStatus === 441 || (errStatus === 500 && errMessage === 'DBConnectionError')) {
                alert('결제가 완료 되었으나 데이터 처리에 문제가 발생했습니다.\n빠르게 조치하겠습니다.\n불편을드려 죄송합니다.');
            }else{
                alert('오류가 발생했습니다.\n관리자에게 문의해주세요.');
            }
		}
	}

	// 주문 데이터 검증 요청
	const validateOrderData = async(): Promise<void> => {
		try {
            console.log('orderProduct : ', orderProduct);

			const res: AxiosResponse = await orderDataValidate({
				orderProduct,
				totalPrice,
			});

			if(res.data.message === RESPONSE_MESSAGE.OK) {
				if(paymentType === 'card')
					requestPay();
				else
					await requestOrder();
			}else {
				alert('주문 세션이 만료되었습니다.\n다시 시도해주세요.');
				navigate('/');
			}
		}catch (err) {
			if((err as AxiosError).status === 440) {
				alert('주문 세션이 만료되었습니다.\n다시 시도해주세요.');
				navigate('/');
			}else {
                console.log('validateOrderData error');
                console.log(err);
				alert('오류가 발생했습니다.\n문제가 계속된다면 관리자에게 문의해주세요.');
			}
		}
	}

	// 결제 버튼 이벤트
	// 주문 데이터를 서버에 전송 후 검증이 정상이라면 결제 API 호출
	const handleOrderSubmit = async(): Promise<void> => {
		if(validateInputData()) 
			await validateOrderData();
	}

	// 입력 데이터 검증
	const validateInputData = (): boolean => {

		if(userAddress.postCode === '') {
            setAddressOverlap(false);
			return false;
        }else if(orderData.recipient === ''){
            setRecipientOverlap(false);
            recipientRef.current?.focus();
			return false;
        }else if(orderData.phone === '') {
            setPhoneOverlap(INFO_CHECK.EMPTY);
            phoneRef.current?.focus();
			return false;
        }else if(!PATTERNS.PHONE.test(orderData.phone)){
            setPhoneOverlap(INFO_CHECK.INVALID);
            phoneRef.current?.focus();
			return false;
        }

		return true;
	}

	// 주소 검색 팝업 창 열기
	const handlePostCodeBtn = (): void => {
		setIsOpen(true);
	}

	// 결제 타입 Radio 이벤트
	const handleRadioSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const value = e.target.value;

		if(value === 'card') {
			setRadioStatus({
				card: true,
				cash: false,
			});

			setPaymentType('card');
		}else if(value === 'cash') {
			setRadioStatus({
				card: false,
				cash: true,
			});

			setPaymentType('cash');
		}
	}

	//DaumPostCode style
	const postCodeStyle = {
		width: '360px',
		height: '480px',
		padding: '15% 45%',
	}

	// 주소 검색 이후 확인 버튼 이벤트
	const handlePostCodeComplete = (data: { address: string, zonecode: string }): void => {
		const { address, zonecode } = data;
		setUserAddress({
			postCode: zonecode,
			address: address,
			detail: '',
		});

		setIsOpen(false);
		setAddressOverlap(true);
	}

	//주소 검색 창 닫기 이벤트
	const handleClose = (state: string): void => {
		if(state === 'FORCE_CLOSE') 
			setIsOpen(false);
		else if(state === 'COMPLETE_CLOSE')
			setIsOpen(false);
	}

	// 상세 주소 input 입력 이벤트
	const handleAddressDetail = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setUserAddress({
			...userAddress,
			detail: e.target.value,
		});
	}

	//주문 정보 input 입력 이벤트
	const handleOrderData = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = e.target;
		setOrderData({
			...orderData,
			[name]: value,
		});

		if(name === 'recipient') 
			setRecipientOverlap(true);
		else if(name === 'phone')
			setPhoneOverlap('');
	}

	if(state === null)
		return null;
	else {
		return (
			<div className="order">
                <div className="order-header">
                    <h1>상품 결제</h1>
                </div>
                <div className="order-content">
                    <div className="order-form">
                        <div className="form-content">
                            <div className="form-content-label">
                                <label>수령인</label>
                            </div>
                            <div className="form-content-input">
                                <input type={'text'} name={'recipient'} onChange={handleOrderData} value={orderData.recipient} ref={recipientRef}/>
                            </div>
                            <RecipientOverlap
                                status={recipientOverlap}
                            />
                        </div>
                        <div className="form-content">
                            <div className="form-content-label">
                                <label>연락처</label>
                            </div>
                            <div className="form-content-input">
                                <input type={'text'} name={'phone'} value={orderData.phone} onChange={handleOrderData} placeholder={'-를 제외한 숫자만 입력'} ref={phoneRef}/>
                            </div>
                            <PhoneOverlap
                                status={phoneOverlap}
                            />
                        </div>
                        <div className="form-content">
                            <div className="form-content-label">
                                <label>배송지 주소</label>
                            </div>
                            <div className="form-content-input-postcode">
                                <input type={'text'} name={'postCode'} placeholder={'우편번호'} value={userAddress.postCode} readOnly/>
                                <DefaultButton onClick={handlePostCodeBtn} btnText={'우편번호 찾기'}/>
                            </div>
                            <div className={'form-content-input-address'}>
                                <input type={'text'} name={'address'} placeholder={'주소'}  value={userAddress.address} readOnly/>
                            </div>
                            <div className="form-content-input-detail-address">
                                <input type={'text'} name={'detailAddress'} value={userAddress.detail} onChange={handleAddressDetail} placeholder={'상세주소'}/>
                            </div>
                            <AddrOverlap
                                status={addressOverlap}
                            />
                            {isOpen && (
                                <div className={'form-postcode'}>
                                    <DaumPostcode
                                        style={postCodeStyle}
                                        onComplete={handlePostCodeComplete}
                                        onClose={handleClose}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="form-content">
                            <div className="form-content-label">
                                <label>배송 메모</label>
                            </div>
                            <div className="form-content-input">
                                <input type={'text'} name={'orderMemo'} value={orderData.orderMemo} onChange={handleOrderData}/>
                            </div>
                        </div>
                    </div>
                    <table className="order-table" border={1}>
                        <thead>
                        <tr>
                            <th>상품명</th>
                            <th>옵션</th>
                            <th>수량</th>
                            <th>가격</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orderProduct.map((product, index) => {
                            return (
                                <OrderTableBody
                                    key={index}
                                    data={product}
                                />
                            )
                        })}
                        </tbody>
                    </table>
                    <OrderTotalPrice
                        orderPrice={totalPrice}
                        deliveryFee={deliveryFee}
                    />
                    <div className="order-payment">
                        <div className="form-content-label">
                            <label>결제 수단</label>
                        </div>
                        <div>
                            <input type={'radio'} value={'card'} checked={radioStatus.card} onChange={handleRadioSelect}/>신용카드
                            <input type={'radio'} value={'cash'} checked={radioStatus.cash} onChange={handleRadioSelect}/>무통장 입금
                        </div>
                    </div>
                    <div className="order-payment-btn">
                        <DefaultButton onClick={handleOrderSubmit} btnText={'결제하기'}/>
                    </div>
                </div>
            </div>
		)
	}
}

type OverlapBooleanStatusProps = {
	status: boolean;
}

function AddrOverlap(props: OverlapBooleanStatusProps) {
    const { status } = props;

    if(!status){
        return (
            <OrderOverlap
                text={'주소를 입력해주세요'}
            />
        )
    }
}

type OverlapStringStatusProps = {
	status: string;
}

function PhoneOverlap(props: OverlapStringStatusProps) {
    const { status } = props;

	let text = '';
	if(status === INFO_CHECK.EMPTY)
		text = '연락처를 입력해주세요';
	else if(status === INFO_CHECK.INVALID)
		text = '유효하지 않은 연락처입니다.';

	return (
		<OrderOverlap text={text} />
	)
}

function RecipientOverlap(props: OverlapBooleanStatusProps) {
    const { status } = props;

    if(!status){
        return (
            <OrderOverlap
                text={'받는사람을 입력해주세요'}
            />
        )
    }
}

type OverlapTextProps = {
	text: string;
}

function OrderOverlap(props: OverlapTextProps) {
    const { text } = props;

    return (
        <span style={{color: "red"}}>{text}</span>
    )
}

type OrderTotalPriceProps = {
	orderPrice: number;
	deliveryFee: number;
}

function OrderTotalPrice(props: OrderTotalPriceProps) {
    const { orderPrice, deliveryFee } = props;

    let deliveryFeeText = '무료';
    let totalPrice = orderPrice;
    if(totalPrice < FREE_DELIVERY_PRICE) {
        deliveryFeeText = `${numberComma(deliveryFee)} 원`;
        totalPrice += deliveryFee;
    }

    return (
        <div className="order-price">
            <span className="delivery-fee">배송비 {deliveryFeeText}</span>
            <span className="total-price">총 주문 금액 : {numberComma(totalPrice)} 원</span>
        </div>
    )
}

type OrderTableBodyProps = {
	data: OrderProductType;
}

function OrderTableBody(props: OrderTableBodyProps) {
    const { data } = props;

    const optionText = getProductOption({size: data.size, color: data.color});

    return (
        <tr>
            <td>{data.productName}</td>
            <td>{optionText}</td>
            <td>{data.count}</td>
            <td>{numberComma(data.price)} 원</td>
        </tr>
    )
}

export default Order;