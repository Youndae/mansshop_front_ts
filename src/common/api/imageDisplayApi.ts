import { axiosEnhanced } from '@/common/utils/axios/axiosEnhanced';

export const ImageDisplayApi = {
	getImageData: (thumbnail: string) =>
		axiosEnhanced.get(
			`api/main/display/${thumbnail}`,
			{ responseType: 'blob' }
		),
}