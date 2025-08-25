import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
	getProductClassificationList,
	postProduct
} from '@/modules/admin/services/adminProductService';

import { 
	imageInputChange,
	imageValidation
} from '@/common/utils/imageUtils';

import type { AxiosResponse } from 'axios';
import type { AdminAddProductDataType, AdminAddProductOptionType } from '@/modules/admin/types/AdminProductType';

import AdminSideNav from '@/modules/admin/components/AdminSideNav';
import AdminAddProductForm from '@/modules/admin/components/AdminAddProductForm';

/*
    상품 추가 컴포넌트

    처리 데이터
        상품 분류
        상품명
        가격
        공개 여부
        할인율
        옵션
        대표 썸네일
        썸네일
        상품 정보 이미지
*/
function AdminAddProduct() {
	const [productData, setProductData] = useState<AdminAddProductDataType>({
		classification: 'default',
        productName: '',
        price: 0,
        isOpen: false,
        discount: 0,
	});
	const [newFirstThumbnail, setNewFirstThumbnail] = useState<File | null>(null);
	const [newThumbnail, setNewThumbnail] = useState<File[]>([]);
	const [newInfoImage, setNewInfoImage] = useState<File[]>([]);
	const [classification, setClassification] = useState<string[]>([]);
	const [optionList, setOptionList] = useState<AdminAddProductOptionType[]>([]);
	const [infoImageLength, setInfoImageLength] = useState<number>(0);

	const navigate = useNavigate();

	useEffect(() => {
		const getClassification = async (): Promise<void> => {
			try {
				const res: AxiosResponse = await getProductClassificationList();

				setClassification(res.data);
			} catch (err) {
				console.error('Failed to get classification list', err);
			}
		}

		getClassification();
	}, []);

	// 상품 데이터 input 입력 이벤트
	const handleProductOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const name = e.target.name;
		let value: string | number | boolean = e.target.value;

		if(name === 'price' || name === 'discount') {
			value = Number(value);
		} else if(name === 'isOpen') {
			value = !productData.isOpen;
		}

		setProductData({
			...productData,
			[name]: value,
		});
	}

	//상품 옵션 input 입력 이벤트
	const handleOptionOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const name = e.target.name;
		let value: string | number = e.target.value;
		const idx = Number(e.target.parentElement?.parentElement?.getAttribute('data-index'));
		
		if(name === 'optionStock') {
			value = Number(value);
		}

		optionList[idx] = {
			...optionList[idx],
			[name]: value,
		};

		setOptionList([...optionList]);
	};

	//상품 옵션 공개, 비공개 설정 Radio 이벤트
	const handleOptionRadioOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const radioName = e.target.name.split('/');
		const name = radioName[0];
        const idx = Number(radioName[1]);
        const value = !optionList[idx].optionIsOpen;

		optionList[idx] = {
            ...optionList[idx],
            [name]: value
        };

        setOptionList([...optionList]);
	}

	// 상품 옵션 추가 버튼 이벤트
	const handleAddOption = (): void => {
        const optionArr = [...optionList];

        optionArr.push({
            optionId: 0,
            size: '',
            color: '',
            optionStock: 0,
            optionIsOpen: true
        });

        setOptionList(optionArr);
    }

	//상품 옵션 제거 버튼 이벤트
    const handleRemoveOption = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const idx = Number(e.currentTarget.value);

        const optionArr = [...optionList];

        optionArr.splice(idx, 1);

        setOptionList(optionArr);
    }

	// 상품 추가 submit 이벤트
	const handleSubmitOnClick = async (): Promise<void> => {

		if(newFirstThumbnail) {
			try {
				const res = await postProduct(
					productData, 
					optionList, 
					newFirstThumbnail, 
					newThumbnail, 
					newInfoImage
				);
	
				navigate(`/admin/product/${res.data.id}`);
			} catch(err) {
				console.log(err);
			}
		} else {
			alert('대표 썸네일을 추가해주세요.');
		}
	}
	
	//상품 분류 select box 선택 이벤트
    const handleSelectOnChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        setProductData({
            ...productData,
            classification: e.target.value
        });
    }

    //대표 썸네일 input 이벤트
    const handleFirstThumbnailInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if(imageValidation(e)){
            const file = e.target.files?.[0];

			if(file) {
				setNewFirstThumbnail(file);
			}
        }
    }

    //대표 썸네일 제거 이벤트
    const handleRemoveFirstThumbnail = (): void => {
        if(newFirstThumbnail) {
            window.URL.revokeObjectURL(newFirstThumbnail.name);
            setNewFirstThumbnail(null);
        }
    }

	//상품 썸네일 input 이벤트
    const handleThumbnailInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const files = imageInputChange(e, newThumbnail);

			if(files) {
				setNewThumbnail(files);
			}
    }

    //상품 썸네일 제거 이벤트
    const handleRemoveThumbnail = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const deleteIdx = Number(e.currentTarget.value);
        const files = [...newThumbnail];

        files.splice(deleteIdx, 1);

		setNewThumbnail(files);		
    }

    //상품 정보 이미지 input 이벤트
    const handleInfoImageInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const files = imageInputChange(e, newInfoImage);
	
		if(files) {
			setNewInfoImage(files);
			setInfoImageLength(files.length);
		}
    }

    //상품 정보 이미지 제거 이벤트
    const handleRemoveInfoImage = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const deleteIdx = Number(e.currentTarget.value);
        const files = [...newInfoImage];

        files.splice(deleteIdx, 1);

        setNewInfoImage(files);
        setInfoImageLength(files.length);
    }

    return (
        <div className="mypage">
            <AdminSideNav
                categoryStatus={'product'}
            />
            <AdminAddProductForm
                productData={productData}
                optionList={optionList}
                headerText={'상품 등록'}
                handleProductOnChange={handleProductOnChange}
                handleAddOption={handleAddOption}
                handleRemoveOption={handleRemoveOption}
                handleOptionOnChange={handleOptionOnChange}
                submitBtnText={'추가'}
                handleSubmitOnClick={handleSubmitOnClick}
                handleOptionRadioOnChange={handleOptionRadioOnChange}
                firstThumbnail={''}
                newFirstThumbnail={newFirstThumbnail || new File([], '')}
                thumbnail={[]}
                newThumbnail={newThumbnail || []}
                infoImage={[]}
                newInfoImage={newInfoImage || []}
                infoImageLength={infoImageLength}
                classification={classification}
                handleSelectOnChange={handleSelectOnChange}
                handleFirstThumbnailInputChange={handleFirstThumbnailInputChange}
                handleRemoveFirstThumbnail={handleRemoveFirstThumbnail}
                handleThumbnailInputChange={handleThumbnailInputChange}
                handleRemoveThumbnail={handleRemoveThumbnail}
                handleInfoImageInputChange={handleInfoImageInputChange}
                handleRemoveInfoImage={handleRemoveInfoImage}
            />
        </div>
    )
}

export default AdminAddProduct;