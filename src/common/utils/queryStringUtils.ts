// 요청 Query Parameter 동적 생성 처리 Module
// 존재하는 파라미터만 추가
// 파라미터 객체가 비어있다면 빈 문자열 반환
export const buildQueryString = (
	params: Record<string, string | number | boolean | null | undefined> = {}, 
	prefix: string = '?'
): string => {
	const query: string[] = [];

	Object.entries(params).forEach(([key, value]) => {
        if(value !== undefined && value !== '') {
            query.push(`${key}=${encodeURIComponent(String(value))}`);
        }
    });

	return query.length > 0 ? prefix + query.join('&') : '';
}