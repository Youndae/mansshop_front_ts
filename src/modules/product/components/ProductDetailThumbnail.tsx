import { useEffect, useState } from 'react';

import { getImageData } from '@/common/services/imageService';

type ProductDetailThumbnailProps = {
	imageName: string[];
}

/*
    상품 상세 페이지에서 썸네일 폼
    MouseOver 시 상단의 대표 이미지 위치에 해당 이미지를 출력하는 이벤트 발생
*/
function ProductDetailThumbnail(props: ProductDetailThumbnailProps) {
	const { imageName } = props;
	const [firstThumb, setFirstThumb] = useState<string>('');
	const [thumbnail, setThumbnail] = useState<string[]>([]);

	useEffect(() => {
		const getImage = async (): Promise<void> => {
			try {
				const imageArr: string[] = [];
				if(imageName.length !== 0) {
					for(let i = 0; i < imageName.length; i++) {
						const url = await getImageData(imageName[i]);
						imageArr.push(url);
					}
					setThumbnail(imageArr);
				}

				setFirstThumb(imageArr[0]);
			}catch (err) {
				console.error('productDetailThumbnail getImage error : ', err);
			}
		}

		getImage();
	}, [imageName]);

	//MouseOver 발생 시 대표 썸네일 위치의 이미지를 해당 썸네일로 변경하는 이벤트
	const handleThumbnailOnClick = (e: React.MouseEvent<HTMLImageElement>): void => {
		const idx = Number(e.currentTarget.dataset.index);

		setFirstThumb(thumbnail.at(idx) || '');
	}

	return (
		<div className="product-thumbnail product-detail-first-thumbnail">
			<div className="first-thumbnail">
				<img src={firstThumb} alt="" />
			</div>
			<div className="thumbnail product-detail-thumbnail-list">
				{thumbnail.map((image, index) => {
					return (
						<img key={index} data-index={index} src={image} alt="" onMouseOver={handleThumbnailOnClick} />
					)
				})}
			</div>
		</div>
	);
}

export default ProductDetailThumbnail;