import { axiosEnhanced } from '@/common/utils/axios/axiosEnhanced';

export const ImageDisplayApi = {
	getImageData: (thumbnail: string) =>
		axiosEnhanced.get(
			`main/display/${thumbnail}`,
			{ responseType: 'blob' }
		),
}