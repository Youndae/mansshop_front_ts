import type { ChangeEvent } from 'react';

// 이미지 input시 파일 타입 검증 및 대기중인 파일 배열에 추가 후 배열 반환
export const imageInputChange = (e: ChangeEvent<HTMLInputElement>, files: File[]): File[] | null => {
	const validationResult: boolean = imageValidation(e);

	if(validationResult) {
		const fileList = e.target.files;
		if(!fileList) return null;
		const fileArr = [...files];

		for(let i = 0; i < fileList.length; i++) {
			fileArr.push(fileList[i]);
		}

		return fileArr;
	}

	return null;
}

//이미지 타입 검증
export const imageValidation = (e: ChangeEvent<HTMLInputElement>): boolean => {
	const files = e.target.files;
	if(!files) return false;

	for(let i = 0; i < files.length; i++) {
		const fileName = files[i].name;
		const fileNameExtensionIndex = fileName.lastIndexOf('.') + 1;
		const fileNameExtension = fileName.toLowerCase().substring(fileNameExtensionIndex, fileName.length);

		if(
			!(fileNameExtension === 'jpg') && 
			!(fileNameExtension === 'gif') && 
			!(fileNameExtension === 'png') && 
			!(fileNameExtension === 'jpeg')
		) {
            return false;
		}
	}

	return true;
}