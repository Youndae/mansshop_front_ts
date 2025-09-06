import {useEffect, useRef, useState} from "react";

import { getUserData, patchUserData } from "@/modules/mypage/services/mypageMemberService";
import { getNicknameCheck } from "@/modules/member/services/memberService";

import { RESPONSE_MESSAGE } from "@/common/constants/responseMessageType";
import { PATTERNS } from "@/common/constants/patterns";
import { INFO_CHECK } from "@/common/constants/infoCheckConstans";
import type {AxiosError, AxiosResponse} from "axios";
import type { MyPageMemberPatchType } from "@/modules/mypage/types/mypageMemberType";

import MyPageSideNav from "@/modules/mypage/components/MyPageSideNav";
import DefaultButton from "@/common/components/DefaultButton";
import NicknameOverlap from "@/common/components/member/NicknameOverlap";
import PhoneOverlap from "@/common/components/member/PhoneOverlap";
import EmailProvider from "@/common/components/member/EmailProvider";
import EmailOverlap from "@/common/components/member/EmailOverlap";
import {parseStatusAndMessage} from "@/common/utils/responseErrorUtils.ts";


/*
	회원 정보 수정
	현재는 토큰 기반으로 로그인 상태면 바로 접근이 가능한데
	어떻게 수정할지 고민 중.
	로컬 사용자의 경우 비밀번호를 재입력 하는 것으로 인증이 가능하지만,
	OAuth 사용자의 경우 저장된 비밀번호가 존재하지 않기 때문에 고민 중.
*/
function MyPageUpdateInfo() {
	const [userData, setUserData] = useState<MyPageMemberPatchType>({
		nickname: '',
		phone: '',
		mail: '',
	});
	const [nicknameCheck, setNicknameCheck] = useState<string>('');
	const [phoneCheck, setPhoneCheck] = useState<string>('');
    const [emailCheck, setEmailCheck] = useState<string>('');
    const [emailProvider, setEmailProvider] = useState<string>('');
    const [emailSuffix, setEmailSuffix] = useState<string>(``);
    const [nicknameCheckInfo, setNicknameCheckInfo] = useState<boolean>(false);

    const nicknameElem = useRef<HTMLInputElement>(null);
    const phoneElem = useRef<HTMLInputElement>(null);
    const mailElem = useRef<HTMLInputElement>(null);

	const getUserInfo = async(): Promise<void> => {
		try {
			const res: AxiosResponse = await getUserData();
			const contentData = res.data;

			setUserData({
				nickname: contentData.nickname,
				phone: contentData.phone,
				mail: contentData.mailPrefix,
			});

			setEmailProvider(contentData.mailType);
			setEmailSuffix(contentData.mailSuffix);
		}catch(err) {
			console.error('getUserInfo error', err);
		}
	}

	useEffect(() => {
		getUserInfo();
	}, []);

	//input 입력 이벤트
	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = e.target;

		setUserData({
			...userData,
			[name]: value,
		});

		if(name === 'nickname')
			setNicknameCheckInfo(false);
	}

	//닉네임 중복 체크 요청 이벤트
	const handleNicknameCheck = async(): Promise<void> => {
		try {
			await getNicknameCheck(userData.nickname as string);

			setNicknameCheckInfo(true);
			setNicknameCheck(INFO_CHECK.VALID);
		} catch (error) {
			console.log(error);

			const axiosError: AxiosError = error as AxiosError;
			const { status, message } = parseStatusAndMessage(axiosError);

			if(status === 409 && message === RESPONSE_MESSAGE.CONFLICT){
				setNicknameCheckInfo(false);
				setNicknameCheck(INFO_CHECK.DUPLICATED);
			}else
				alert('오류가 발생했습니다.\n문제가 계속되면 관리자에게 문의해주세요.');
		}
	}
	
	//이메일 suffix select box 이벤트
	const handleEmailSelectOnChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
		const value = e.target.value;
		setEmailProvider(value);
		let suffix = '';

		if(value === 'naver')
            suffix = import.meta.env.VITE_EMAIL_SUFFIX_NAVER;
        else if(value === 'daum')
            suffix = import.meta.env.VITE_EMAIL_SUFFIX_DAUM;
        else if(value === 'google')
            suffix = import.meta.env.VITE_EMAIL_SUFFIX_GOOGLE;

        setEmailSuffix(suffix || '');
	}

	// 이메일 직접 입력 선택 시 input 이벤트
	const handleEmailSuffixChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setEmailCheck('');
		setEmailSuffix(e.target.value);
	}

	// 수정 요청 시 데이터 검증
	const validateData = (email: string): boolean => {
		if(!nicknameCheckInfo && userData.nickname !== '') {
            setNicknameCheck(INFO_CHECK.NOT_DUPLICATED);
            nicknameElem.current?.focus();
			return false;
        }else if(!PATTERNS.EMAIL.test(email)) {
            setEmailCheck(INFO_CHECK.INVALID);
            mailElem.current?.focus();
			return false;
        }else if(!PATTERNS.PHONE.test(userData.phone)){
            setPhoneCheck(INFO_CHECK.INVALID);
            phoneElem.current?.focus();
			return false;
        }

		return true;
	}

	//수정 요청 이벤트
	const handleSubmit = async(): Promise<void> => {
		const userEmail = userData.mail + '@' + emailSuffix;
		if(validateData(userEmail)) {
			try {
				await patchUserData(userData, userEmail);

				alert('수정되었습니다.');
				getUserInfo();
			} catch (error) {
				console.log(error);
				alert('오류가 발생했습니다.\n문제가 계속된다면 관리자에게 문의해주세요');
			}
		}
	}

	return (
        <div className="mypage">
            <MyPageSideNav qnaStat={false} />
            <div className="mypage-content">
                <div className="mypage-content-header">
                    <h1>정보 수정</h1>
                </div>
                <div className="mypage-user-info-content">
                    <div className="form-content">
                        <div>
                            <label>닉네임</label>
                        </div>
                        <div>
                            <input type={'text'} name={'nickname'} placeholder={'닉네임'} onChange={handleOnChange} ref={nicknameElem} value={userData.nickname || ''} />
                            <DefaultButton className={'nickname-check-btn'} onClick={handleNicknameCheck} btnText={'중복체크'} />
                            <p className={'nickname-info'}>닉네임을 입력하지 않을 시 활동 내역에 대해 닉네임 대신 이름으로 처리됩니다.</p>
                            <NicknameOverlap
                                checkValue={nicknameCheck}
                            />
                        </div>
                    </div>
                    <div className="form-content">
                        <div>
                            <label>연락처</label>
                        </div>
                        <div>
                            <input type={'text'} name={'phone'} placeholder={'-를 제외한 숫자만 입력하세요'} onChange={handleOnChange} ref={phoneElem} value={userData.phone}/>
                            <PhoneOverlap
                                checkValue={phoneCheck}
                            />
                        </div>
                    </div>
                    <div className="form-content">
                        <div>
                            <label>이메일</label>
                        </div>
                        <div>
                            <input type={'text'} name={'email'} placeholder={'이메일'} onChange={handleOnChange} ref={mailElem} value={userData.mail}/>
                            <span> @ </span>
                            <EmailProvider providerStatus={emailProvider} handleInputChange={handleEmailSuffixChange} emailSuffix={emailSuffix}/>
                            <select className={'email-select'} name={'email-suffix'} onChange={handleEmailSelectOnChange} value={emailProvider}>
                                <option value={'naver'}>네이버</option>
                                <option value={'daum'}>다음</option>
                                <option value={'google'}>구글</option>
                                <option value={'none'}>직접입력</option>
                            </select>
                            <EmailOverlap
                                checkValue={emailCheck}
                            />
                        </div>
                    </div>
                </div>
                <DefaultButton className={'info-submit-btn'} onClick={handleSubmit} btnText={'수정'}/>
            </div>
        </div>
    )
}



export default MyPageUpdateInfo;