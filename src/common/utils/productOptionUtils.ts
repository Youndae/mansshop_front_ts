// 상풉 옵션 텍스트 생성
export const getProductOption = ({
	size,
	color
}: {
	size: string | null;
	color: string | null;
}): string => {
	if(size && color)
		return `사이즈: ${size} 컬러: ${color}`;
	if(size)
		return `사이즈: ${size}`;
	if(color)
		return `컬러: ${color}`;

	return '';
}