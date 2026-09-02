import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '@/modules/member/memberSlice';

import { tokenRequest } from '@/modules/member/services/memberService';

import type { AxiosResponse } from 'axios';
import {useDispatch} from "react-redux";


function OAuth() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const issuedToken = async(): Promise<void> => {
			try {
				const res: AxiosResponse = await tokenRequest();

				dispatch(login(res.data));

				const prevUrl: string = window.sessionStorage.getItem('prev') || '/';
				navigate(prevUrl);
			}catch (err) {
				console.error(err);
			}
		}

		issuedToken();
	}, []);

	return null;
}

export default OAuth;