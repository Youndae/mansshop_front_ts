import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { tokenRequest } from '@/modules/member/services/memberService';
import { setToken } from '@/common/utils/axios/tokenUtils';

import type { AxiosResponse } from 'axios';


function OAuth() {
	const navigate = useNavigate();

	useEffect(() => {
		const issuedToken = async(): Promise<void> => {
			try {
				const res: AxiosResponse = await tokenRequest();
				const authorization: string = res.data.authorization;
				setToken(authorization);

				const prevUrl: string = window.sessionStorage.getItem('prev') || '/';
				navigate(prevUrl);
			}catch (err) {
				console.error(err);
			}
		}

		issuedToken();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return null;
}

export default OAuth;