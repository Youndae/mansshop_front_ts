import { useEffect, useState } from "react";

import { getImageData } from "@/common/services/imageService";

type ImageFormProps = {
	imageName: string;	
	className?: string;
}

function ImageForm(props: ImageFormProps) {
	const { imageName, className } = props;
	const [imageSrc, setImageSrc] = useState<string>('');

	useEffect(() => {
		const getImageDisplay = async() => {
			try{
				const res = await getImageData(imageName);
				setImageSrc(res);
			}catch(err) {
				console.error(err);
			}
		}

		if(imageName !== '')
			getImageDisplay();
	}, [imageName]);

	return (
        <img src={imageSrc} alt={''} className={className}/>
    )
}

export default ImageForm;