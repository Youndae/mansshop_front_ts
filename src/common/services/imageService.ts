import { ImageDisplayApi } from "@/common/api/imageDisplayApi";
import type { AxiosResponse } from "axios";

export const getImageData = async (thumbnail: string): Promise<string> => {
	const res: AxiosResponse<Blob> = await ImageDisplayApi.getImageData(thumbnail);

	return window.URL.createObjectURL(res.data);
}