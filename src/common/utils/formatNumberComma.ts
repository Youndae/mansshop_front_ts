//가격 출력 시 3자리 단위 , 표현
export const numberComma = (value: number): string => 
	value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');