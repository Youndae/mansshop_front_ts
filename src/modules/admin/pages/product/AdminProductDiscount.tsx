import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";

import {
	getProductClassificationList,
	getProductListByClassification,
	setProductDiscount
} from '@/modules/admin/services/adminProductService';

import { numberComma } from '@/common/utils/formatNumberComma';

import { RESPONSE_MESSAGE } from '@/common/constants/responseMessageType';

import type { AxiosResponse } from 'axios';
import type { AdminSelectClassificationProductType } from '@/modules/admin/types/AdminProductType';

import AdminSideNav from '@/modules/admin/components/AdminSideNav';
import DefaultButton from '@/common/components/DefaultButton';

/*
    상품 할인 설정 페이지
    상품 정보 수정에서 개별적인 설정이 아닌
    한번에 여러개의 상품 할인율을 수정하기 위함.
    상품 분류를 선택하면 그걸 기반으로 상품명 select box가 갱신.
    상품명 select box를 선택하면 해당 상품 Element가 동적으로 생성
*/
function AdminProductDiscount() {
	const [classification, setClassification] = useState<string[]>([]);
	const [product, setProduct] = useState<AdminSelectClassificationProductType[]>([]);
	const [selectProductData, setSelectProductData] = useState<AdminSelectClassificationProductType[]>([]);
	const [selectClassificationValue, setSelectClassificationValue] = useState<string>('default');
	const [selectProductValue, setSelectProductValue] = useState<string>('default');
	const [discount, setDiscount] = useState<number>(0);
	

	const navigate = useNavigate();

	useEffect(() => {
		const getClassification = async (): Promise<void> => {
			try {
				const res: AxiosResponse = await getProductClassificationList();

				setClassification(res.data);
			} catch(err) {
				console.error('Failed to get product classification list', err);
			}
		}

		getClassification();
	}, []);

	// 선택된 상품 분류에 해당하는 상품 조회
	const getSelectProduct = async (classificationName: string): Promise<void> => {
		try {
			const res = await getProductListByClassification(classificationName);

			setProduct(res.data);
		} catch(err) {
			console.log(err);
		}
	}
	
	// 상품 분류 select box 이벤트
	const handleClassificationOnChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
		const value = e.target.value;

		setSelectClassificationValue(value);
		setSelectProductValue('default');

		getSelectProduct(value);
	}

	// 상품 select box 이벤트
	const handleProductOnChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
		const idx = Number(e.target.value);
		const productData = product[idx];
		const productArr = [...selectProductData];
		productArr.push(productData);

		setSelectProductValue(String(idx));
		setSelectProductData(productArr);
	}

	//할인율 input 입력 이벤트
    const handleDiscountOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setDiscount(Number(e.target.value));
    }

	//할인율 적용 submit 이벤트
	const handleDiscountSubmit = async (): Promise<void> => {
		if(selectProductData.length === 0) 
			alert('상품을 선택해주세요');
		else{
			try {
				const res = await setProductDiscount(selectProductData, discount);

				if(res.data.message === RESPONSE_MESSAGE.OK) 
					navigate('/admin/product/discount');
			} catch(err) {
				console.log(err);
			}
		}
	}

	//상품 제거 이벤트
	const handleDeleteDiscountProduct = (e: React.MouseEvent<HTMLButtonElement>): void => {
		const idx = Number(e.currentTarget.value);
        const selectProductArr = [...selectProductData];
        selectProductArr.splice(idx, 1);
        setSelectProductData(selectProductArr);
	}

	return (
        <div className="mypage">
            <AdminSideNav
                categoryStatus={'product'}
            />
            <div className="admin-content">
                <div className="admin-content-header">
                    <h1>할인 설정</h1>
                    <DefaultButton
                        btnText={'할인 적용'}
                        onClick={handleDiscountSubmit}
                        className={'discount-btn'}
                    />
                </div>
                <div className="admin-content-content">
                    <div className="discount-content-header">
                        <div className="discount-classification-select">
                            <label>상품 분류 : </label>
                            <select className={'discount-classification-select-box'} value={selectClassificationValue} onChange={handleClassificationOnChange}>
                                <option value={'default'} disabled={true}>상품 분류를 선택해주세요</option>
                                {classification.map((data, index) => {
                                    return (
                                        <option key={index} value={data}>{data}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="discount-product-select">
                            <label>상품 : </label>
                            <select className={'discount-product-select-box'} value={selectProductValue} onChange={handleProductOnChange}>
                                <option value={'default'} disabled={true}>상품 분류를 먼저 선택해주세요</option>
                                {product.map((data, index) => {
                                    return (
                                        <option key={data.productId} value={index}>{data.productName}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <DiscountContent
                        data={selectProductData}
                        discount={discount}
                        handleDiscountOnChange={handleDiscountOnChange}
                        handleDeleteDiscountProduct={handleDeleteDiscountProduct}
                    />
                </div>
            </div>
        </div>
    )
}

type DiscountContentProps = {
	data: AdminSelectClassificationProductType[];
	discount: number;
	handleDiscountOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleDeleteDiscountProduct: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function DiscountContent(props: DiscountContentProps) {
    const { 
		data, 
		discount, 
		handleDiscountOnChange, 
		handleDeleteDiscountProduct 
	} = props;

    return (
        <div className="discount-content-content">
            <div className="discount-input">
                <label>할인율 (%) : </label>
                <input type={'number'} value={discount} onChange={handleDiscountOnChange}/>
            </div>
            <div className="discount-product">
                {data.map((product, index) => {
                    const discountPrice = Number(Math.ceil(product.productPrice * (1 - (discount / 100))));
                    return (
                        <div key={index} className="discount-product-content">
                            <div className="discount-product-content-header">
                                <h3>{product.productName}</h3>
								<DefaultButton
                                    btnText={'삭제'}
                                    onClick={handleDeleteDiscountProduct}
                                    value={index}
                                />
                            </div>
                            <div className="discount-product-content-content">
                                <div className="form-group">
                                    <label className="discount-product-label">가격 : </label>
                                    <span className="discount-product-price">{numberComma(product.productPrice)}</span>
                                </div>
                                <div className="form-group">
                                    <label className="discount-product-label">할인 적용가 : </label>
                                    <span className="discount-product-price">{numberComma(discountPrice)}</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default AdminProductDiscount;