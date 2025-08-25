import DefaultButton from "@/common/components/DefaultButton";
import ImageForm from "@/common/components/ImageForm";

import type { AdminAddProductDataType, AdminAddProductOptionType } from "@/modules/admin/types/AdminProductType";

type AdminAddProductFormProps = {
	productData: AdminAddProductDataType;
	optionList: AdminAddProductOptionType[];
	headerText: string;
	handleProductOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleAddOption: () => void;
	handleRemoveOption: (e: React.MouseEvent<HTMLButtonElement>) => void;
	handleOptionOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	submitBtnText: string;
	handleSubmitOnClick: () => void;
	handleOptionRadioOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	firstThumbnail: string;
	newFirstThumbnail: File;
	thumbnail: string[];
	newThumbnail: File[];
	infoImage: string[];
	newInfoImage: File[];
	infoImageLength: number;
	classification: string[];
	handleSelectOnChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	handleFirstThumbnailInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleRemoveFirstThumbnail: () => void;
	handleRemoveOriginalFirstThumbnail?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	handleThumbnailInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleRemoveThumbnail: (e: React.MouseEvent<HTMLButtonElement>) => void;
	handleRemoveOriginalThumbnail?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	handleInfoImageInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleRemoveInfoImage: (e: React.MouseEvent<HTMLButtonElement>) => void;
	handleRemoveOriginalInfoImage?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

//상품 추가 및 수정 Form
function AdminAddProductForm(props: AdminAddProductFormProps) {
	const {
		productData,
        optionList,
        headerText,
        handleProductOnChange,
        handleAddOption,
        handleRemoveOption,
        handleOptionOnChange,
        submitBtnText,
        handleSubmitOnClick,
        handleOptionRadioOnChange,
        firstThumbnail,
        newFirstThumbnail,
        thumbnail,
        newThumbnail,
        infoImage,
        newInfoImage,
        infoImageLength,
        classification,
        handleSelectOnChange,
        handleFirstThumbnailInputChange,
        handleRemoveFirstThumbnail,
        handleRemoveOriginalFirstThumbnail,
        handleThumbnailInputChange,
        handleRemoveThumbnail,
        handleRemoveOriginalThumbnail,
        handleInfoImageInputChange,
        handleRemoveInfoImage,
        handleRemoveOriginalInfoImage,
	} = props;

	const clearFileInput = (e: React.MouseEvent<HTMLInputElement>) => {
		if(e.target instanceof HTMLInputElement) {
			e.target.value = '';
		}
	}

	return (
        <div className="admin-content">
            <div className="admin-content-header">
                <h1>{headerText}</h1>
            </div>
            <div className="admin-content-content">
                <DefaultButton
                    btnText={submitBtnText}
                    onClick={handleSubmitOnClick}
                    className={'product-submit-btn'}
                />
                <div className="product-name add-product">
                    <label className="product-label">상품명</label>
                    <input className="product-input" type={'text'} name={'productName'} onChange={handleProductOnChange} value={productData.productName}/>
                </div>
                <div className="product-classification add-product">
                    <label className="product-label">상품 분류</label>
                    <ProductClassification
                        data={classification}
                        value={productData.classification}
                        handleSelectOnChange={handleSelectOnChange}
                    />
                </div>
                <div className="product-price add-product">
                    <label className="product-label">가격</label>
                    <input className="product-input" type={'text'} name={'price'} onChange={handleProductOnChange} value={productData.price}/>
                </div>
                <div className="product-isOpen add-product">
                    <label className="product-label">공개여부</label>
                    <div className="product-isOpen-radio isOpen-radio">
                        <label className="radio-label">공개</label>
                        <input className="radio-input" type={'radio'} name={'isOpen'} onChange={handleProductOnChange} checked={productData.isOpen}/>
                        <label className="radio-label">비공개</label>
                        <input className="radio-input" type={'radio'} name={'isOpen'} onChange={handleProductOnChange} checked={!productData.isOpen}/>
                    </div>
                </div>
                <div className="product-discount add-product">
                    <label className="product-label">할인율(%)</label>
                    <input type='number' className="product-input" name={'discount'} onChange={handleProductOnChange} value={productData.discount}/>
                </div>
                <div className="option-test">
                    <div className="option-header">
                        <h3>상품 옵션</h3>
                        <DefaultButton
                            btnText={'옵션 추가'}
                            onClick={handleAddOption}
                        />
                    </div>
                    {optionList.map((data, index) => {
                        let sizeText = '';
                        let colorText = '';
                        if(data.size !== null)
                            sizeText = data.size;
                        if(data.color !== null)
                            colorText = data.color;
                        return (
                            <div key={index} data-index={index} className="option-detail">
                                <div className="option-detail-header">
                                    <DefaultButton
                                        btnText={'옵션 삭제'}
                                        onClick={handleRemoveOption}
                                        name={String(data.optionId)}
                                        value={index}
                                    />
                                </div>
                                <div className="option-size">
                                    <label className="product-label">사이즈</label>
                                    <input className="product-input" type={'text'} name={'size'} onChange={handleOptionOnChange} value={sizeText}/>
                                </div>
                                <div className="option-color">
                                    <label className="product-label">컬러</label>
                                    <input className="product-input" type={'text'} name={'color'} onChange={handleOptionOnChange} value={colorText}/>
                                </div>
                                <div className="option-stock">
                                    <label className="product-label">재고</label>
                                    <input className="product-input" type={'number'} name={'optionStock'} onChange={handleOptionOnChange} value={data.optionStock}/>
                                </div>
                                <div className="option-isOpen">
                                    <label className="product-label">옵션 공개여부</label>
                                    <div className="product-isOpen-radio isOpen-radio">
                                        <label className="radio-label-label">공개</label>
                                        <input className="radio-input" type={'radio'} name={`optionIsOpen/${index}`} onChange={handleOptionRadioOnChange} checked={data.optionIsOpen}/>
                                        <label className="radio-label">비공개</label>
                                        <input className="radio-input" type={'radio'} name={`optionIsOpen/${index}`} onChange={handleOptionRadioOnChange} checked={!data.optionIsOpen}/>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="add-product-thumbnail">
                    <div className="add-product-first-thumbnail">
                        <div className="first-thumbnail-header thumbnail-header">
                            <h3>대표 썸네일</h3>
                        </div>
                        <div className="first-thumbnail-input thumbnail-input">
                            <label htmlFor="first-thumb">
                                <div className="file-input-btn">
                                    대표 썸네일 업로드
                                </div>
                            </label>
                            <input type='file' id='first-thumb' name='first-thumb' className={'file-input'} onClick={clearFileInput} onChange={handleFirstThumbnailInputChange}/>
                        </div>
                        <div className="first-thumbnail-content thumbnail-content">
                            <FirstThumbnailPreview
                                firstThumbnail={firstThumbnail}
                                newFirstThumbnail={newFirstThumbnail}
                                handleRemoveFirstThumbnail={handleRemoveFirstThumbnail}
                                handleRemoveOriginalFirstThumbnail={handleRemoveOriginalFirstThumbnail}
                            />
                        </div>
                    </div>
                    <div className="add-product-thumbnail">
                        <div className="first-thumbnail-header thumbnail-header">
                            <h3>썸네일</h3>
                        </div>
                        <div className="product-thumbnail-input thumbnail-input">
                            <label htmlFor="product-thumb">
                                <div className="file-input-btn">
                                    썸네일 업로드
                                </div>
                            </label>
                            <input type='file' id='product-thumb' className={'file-input'} onChange={handleThumbnailInputChange} onClick={clearFileInput} multiple/>
                        </div>
                        <div className="product-thumbnail-content thumbnail-content">
                            {thumbnail.map((imageName, index) => {
                                return (
                                    <div key={index}>
                                        <button className="thumbnail-delete-btn image-btn" type={'button'} value={index} onClick={handleRemoveOriginalThumbnail}>
                                            삭제
                                        </button>
                                        <ImageForm
                                            key={index}
                                            imageName={imageName}
                                        />
                                    </div>
                                )
                            })}
                            {newThumbnail.map((file, index) => {
                                return (
                                    <div key={index}>
                                        <button className="thumbnail-delete-btn image-btn" type={'button'} value={index} onClick={handleRemoveThumbnail}>
                                            삭제
                                        </button>
                                        <PreviewImage
                                            key={index}
                                            file={file}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="add-product-info-image">
                        <div className="info-image-header thumbnail-header">
                            <h3>상품 정보 이미지({infoImageLength})</h3>
                        </div>
                        <div className="info-image-input thumbnail-input">
                            <label htmlFor="info-image">
                                <div className="file-input-btn">
                                    상품 정보 업로드
                                </div>
                            </label>
                            <input type='file' id='info-image' className={'file-input'} onChange={handleInfoImageInputChange} onClick={clearFileInput} multiple/>
                        </div>
                        <div className="info-image-content thumbnail-content">
                            {infoImage.map((imageName, index) => {
                                return (
                                    <div key={index} className="info-image-content-image">
                                        <button className="info-image-delete-btn image-btn" type={'button'} value={index} onClick={handleRemoveOriginalInfoImage}>
                                            삭제
                                        </button>
                                        <ImageForm
                                            key={index}
                                            imageName={imageName}
                                        />
                                    </div>
                                )
                            })}
                            {newInfoImage.map((file, index) => {
                                return (
                                    <div key={index} className="info-image-content-image">
                                        <button className="info-image-delete-btn image-btn" type={'button'} value={index} onClick={handleRemoveInfoImage}>
                                            삭제
                                        </button>
                                        <PreviewImage
                                            key={index}
                                            file={file}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

type ProductClassificationProps = {
	data: string[];
	value: string;
	handleSelectOnChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

//상품 분류 select box
function ProductClassification(props: ProductClassificationProps) {
    const { data, value, handleSelectOnChange } = props;

    return (
        <select className="product-classification-select-box product-input" value={value} onChange={handleSelectOnChange}>
            <option value={'default'} disabled={true}>상품 분류를 선택해주세요</option>
            {data.map((option, index) => {
                return (
                    <option key={index} value={option}>{option}</option>
                )
            })}
        </select>
    )
}

type FirstThumbnailPreviewProps = {
	firstThumbnail: string;
	newFirstThumbnail: File;
	handleRemoveFirstThumbnail: () => void;
	handleRemoveOriginalFirstThumbnail?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

//대표 썸네일 preview
function FirstThumbnailPreview(props: FirstThumbnailPreviewProps) {
    const { 
		firstThumbnail, 
		newFirstThumbnail, 
		handleRemoveFirstThumbnail, 
		handleRemoveOriginalFirstThumbnail 
	} = props;

	const isOriginalThumbnail = firstThumbnail.length !== 0;
	const isNewThumbnail = newFirstThumbnail.name !== '';

	if(!isOriginalThumbnail && !isNewThumbnail)
		return null;

	const thumbnailInfo = isOriginalThumbnail
		? {
			onRemove: handleRemoveOriginalFirstThumbnail || (() => {}),
			element: <ImageForm imageName={firstThumbnail}/>
		}
		: {
			onRemove: handleRemoveFirstThumbnail,
			element: <PreviewImage file={newFirstThumbnail}/>
		};

	return (
		<>
			<button className="first-thumbnail-delete-btn image-btn" type={'button'} onClick={thumbnailInfo.onRemove}>
				삭제
			</button>
			{thumbnailInfo.element}
		</>
	)
}

type PreviewImageProps = {
	file: File;
}

//상품 썸네일 및 정보 이미지 preview
function PreviewImage(props: PreviewImageProps) {
    const { file } = props;

    const url = window.URL.createObjectURL(file);

    return (
        <img src={url} alt={''} />
    )
}

export default AdminAddProductForm;