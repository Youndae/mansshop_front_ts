import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/modules/member/memberSlice';

import { setTokenFromAxios } from '@/common/utils/axios/tokenUtils';
import { postLogin } from '@/modules/member/services/memberService';
import { enhancedResponseInterceptor } from '@/common/utils/axios/axiosInterceptors';
import { RESPONSE_MESSAGE } from '@/common/constants/responseMessageType';
import type { RootState, LoginUserDataType } from '@/common/types/userDataType';
import type { AxiosError, AxiosResponse } from 'axios';

import googleOAuthBtn from '@/assets/image/web_light_sq_ctn@1x.png';
import naverOAuthBtn from '@/assets/image/btnG_official.png';
import kakaoOAuthBtn from '@/assets/image/kakao_login_medium_narrow.png';

import DefaultButton from '@/common/components/DefaultButton';

import '@/styles/member.css';


function Login() {
	const loginStatus = useSelector((state: RootState) => state.member.loginStatus);
	const [userData, setUserData] = useState<LoginUserDataType>({
		userId: '',
		userPw: '',
	});
	const [loginRequestStatus, setLoginRequestStatus] = useState<string>('');

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();
	const state = location.state?.from;

	useEffect(() => {
		if(loginStatus) {
			navigate('/');
		}
	}, [loginStatus]);

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>): void => {
		e.preventDefault();

		if(userData.userId === '') {
			setLoginRequestStatus('id');
		}else if(userData.userPw === '') {
			setLoginRequestStatus('pw');
		}else {
			loginSubmit();
		}
	}
	
	const loginSubmit = async (): Promise<void> => {
		try {
			const res: AxiosResponse = await postLogin(userData);
			setTokenFromAxios(res);
			dispatch(login(res.data));
			navigate(state);
		}catch (err) {
			const axiosError: AxiosError = err as AxiosError;
			console.error('login error  : ', axiosError);

			const errStatus = axiosError.response?.status;
			const errMessage = (axiosError.response?.data as { errorMessage?: string } | undefined)?.errorMessage;

			if((errStatus === 401 && errMessage === RESPONSE_MESSAGE.UNAUTHORIZED) || errStatus === 403) {
				setLoginRequestStatus('fail');
			}else {
				enhancedResponseInterceptor(axiosError);
			}
		}
	}

	//input 이벤트
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = e.target;
		setUserData({ ...userData, [name]: value });
	}
	
	//회원가입 버튼 이벤트
	const handleRegister = (): void => {
		navigate('/register');
	}

	//아이디 찾기 버튼 이벤트
	const handleSearchId = (): void => {
		navigate('/search-id');
	}

	// 비밀번호 찾기 버튼 이벤트
	const handleSearchPw = (): void => {
		navigate('/search-pw');
	}

	// OAuth2 로그인 버튼 이벤트
	//href 요청으로 인해 이전 페이지 이동을 state로 처리할 수 없으므로
    //sessionStorage에 담아뒀다가 oAuth 컴포넌트에서 꺼내서 처리.
	const handleOAuth = (e: React.MouseEvent<HTMLButtonElement>): void => {
		const target = e.target as HTMLButtonElement;
        const oAuthClient = target.name;

        window.sessionStorage.setItem('prev', state?.toString() || '/');

        if(oAuthClient === 'google')
            window.location.href='http://localhost:8080/oauth2/authorization/google';
        else if(oAuthClient === 'naver')
            window.location.href='http://localhost:8080/oauth2/authorization/naver';
        else if(oAuthClient === 'kakao')
            window.location.href='http://localhost:8080/oauth2/authorization/kakao';
    }

	return (
        <div className="content login-content">
            <div className="login-header">
                <h1>로그인</h1>
            </div>
            <div className="login-form">
                <div className="form-group">
                    <input type="text" className="form-control" name={'userId'} placeholder={'아이디'} onChange={handleChange} value={userData.userId} autoFocus={true}/>
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" name={'userPw'} placeholder={'비밀번호'} onChange={handleChange} value={userData.userPw}/>
                </div>
                <LoginOverlap
                    status={loginRequestStatus}
                />
                <div className="login-form-btn-area">
                    <div className="login-btn">
                        <DefaultButton className={'login-btn'} onClick={handleSubmit} btnText={'Login'}/>
                    </div>
                    <div className="join-search-area">
                        <DefaultButton className={'join-btn'} onClick={handleRegister} btnText={'회원가입'}/>
                        <DefaultButton className={'search-id-btn'} onClick={handleSearchId} btnText={'아이디 찾기'}/>
                        <DefaultButton className={'search-pw-btn'} onClick={handleSearchPw} btnText={'비밀번호 찾기'}/>
                    </div>
                    <div className="oauth-area">
                        <div className="oauth-btn">
                            <div className="oauth-btn">
                                <label htmlFor={'oauth-google'}>
                                    <img src={googleOAuthBtn} alt={'구글 로그인'}/>
                                </label>
                            </div>
                            <div className="oauth-btn">
                            <label htmlFor={'oauth-naver'}>
                                <img src={naverOAuthBtn} alt={'네이버 로그인'}/>
                            </label>
                            </div>
                            <div className="oauth-btn">
                                <label htmlFor={'oauth-kakao'}>
                                    <img src={kakaoOAuthBtn} alt={'카카오 로그인'}/>
                                </label>
                            </div>
                        </div>
                        <button id={'oauth-google'} name={'google'} onClick={handleOAuth} style={{display: 'none'}}/>
                        <button id={'oauth-naver'} name={'naver'} onClick={handleOAuth} style={{display: 'none'}}/>
                        <button id={'oauth-kakao'} name={'kakao'} onClick={handleOAuth} style={{display: 'none'}}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

function LoginOverlap({ status }: { status: string }) {
	let text = '';

	if(status === 'id')
		text = '아이디를 입력해주세요.';
	else if(status === 'pw')
		text = '비밀번호를 입력해주세요.';
	else if(status === 'fail')
		text = '아이디 또는 비밀번호가 일치하지 않습니다.';
	
	return (
		<div className="login-overlap">
			<span>{text}</span>
		</div>
	)
}

export default Login;