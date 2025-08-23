import { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { 
	postJoin,
	getUserIdCheck,
	getNicknameCheck,
} from '@/modules/member/services/memberService';
import { RESPONSE_MESSAGE } from '@/common/constants/responseMessageType';
import { PATTERNS } from '@/common/constants/patterns';
import { INFO_CHECK } from '@/common/constants/infoCheckConstans';
import type { RootState, UserDataType } from '@/common/types/userDataType';
import type { AxiosResponse } from 'axios';


import usePasswordValidator from '@/common/hooks/usePasswordValidator';

import Overlap from '@/common/components/Overlap';
import DefaultButton from '@/common/components/DefaultButton';
import NicknameOverlap from "@/common/components/member/NicknameOverlap";
import PhoneOverlap from "@/common/components/member/PhoneOverlap";
import EmailProvider from "@/common/components/member/EmailProvider";
import EmailOverlap from "@/common/components/member/EmailOverlap";

function Register() {
	const loginStatus: boolean = useSelector((state: RootState) => state.member.loginStatus);
	const [userData, setUserData] = useState<UserDataType>({
		userId: '',
        userPw: '',
        checkPassword: '',
        userName: '',
        nickname: '',
        phone: '',
        email: '',
	});
	const [idCheck, setIdCheck] = useState('');
    const [nameCheck, setNameCheck] = useState('');
    const [nicknameCheck, setNicknameCheck] = useState('');
    const [phoneCheck, setPhoneCheck] = useState('');
    const [emailCheck, setEmailCheck] = useState('');
    const [emailProvider, setEmailProvider] = useState('naver');
    const [emailSuffix, setEmailSuffix] = useState(`${import.meta.env.VITE_EMAIL_SUFFIX_NAVER}`);
    const [birth, setBirth] = useState({
        year: 2024,
        month: 1,
        day: 1,
    });
    const [lastDay, setLastDay] = useState(31);
    const [checkInfo, setCheckInfo] = useState({
        idCheckInfo: false,
        pwCheckInfo: false,
        nicknameCheck: false,
    });

    const idElem = useRef<HTMLInputElement>(null);
    const pwElem = useRef<HTMLInputElement>(null);
    const pwCheckElem = useRef<HTMLInputElement>(null);
    const nameElem = useRef<HTMLInputElement>(null);
    const nicknameElem = useRef<HTMLInputElement>(null);
    const phoneElem = useRef<HTMLInputElement>(null);
    const mailElem = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

	const {
		pwCheck,
		verifyPw,
		pwCheckInfo,
		validateAndSyncPassword,
	} = usePasswordValidator();

	const idPattern = PATTERNS.USERID;
    const emailPattern = PATTERNS.EMAIL;
    const phonePattern = PATTERNS.PHONE;

	useEffect(() => {
		if(loginStatus)
			navigate('/');
	}, [loginStatus, navigate]);

	//input 입력 이벤트
	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = e.target;
		setUserData({ ...userData, [name]: value });

		switch(name){
			case 'userId':
				resetIdCheck();
				break;
			case 'userPw':
				validateAndSyncPassword(name, value, userData);
				break;
			case 'checkPassword':
				validateAndSyncPassword(name, value, userData);
				break;
			case 'userName':
				validateUserName(value);
				break;
			case 'nickname':
				validateNickname();
				break;
			case 'phone':
				validatePhone(value);
				break;
			default:
				break;
		}
	}

	const resetIdCheck = (): void => {
		setCheckInfo({
			...checkInfo,
			idCheckInfo: false,
		});
	}

	// 사용자 이름 검증 및 처리
	const validateUserName = (value: string): void => {
		// 미입력만 검증
		if(value !== '')
			setNameCheck('');
	}

	const validateNickname = (): void => {
		//수정이 발생하면 검증 상태값을 false로 변경
		setCheckInfo({
			...checkInfo,
			nicknameCheck: false,
		});
	}

	const validatePhone = (value: string): void => {
		// 휴대폰 번호 입력값 처리 및 검증
		if(!phonePattern.test(value))
			setPhoneCheck(INFO_CHECK.INVALID);
		else
			setPhoneCheck(INFO_CHECK.VALID);
	}

	// submit 이벤트
	const handleJoinSubmit = async (): Promise<void> => {
		const validation = validateJoin();
		if(!validation.result){
			invalidFocus({ field: validation.field || '', checkValue: validation.checkValue || '' });
			return;
		}

		await handleJoin();
	}

	const getEmail = (): string => userData.email + '@' + emailSuffix;

	const validateJoin = (): { result: boolean, field?: string, checkValue?: string } => {
		const userEmail = getEmail();

		if(!checkInfo.idCheckInfo){
			return {
				result: false,
				field: 'userId',
				checkValue: INFO_CHECK.NOT_DUPLICATED
			};
		}else if(!pwCheckInfo) {
			return {
				result: false,
				field: 'userPw',
				checkValue: INFO_CHECK.INVALID,
			};
		}else if(userData.userName === '') {
			return {
				result: false,
				field: 'userName',
				checkValue: INFO_CHECK.EMPTY,
			};
		}else if(userData.nickname !== '' && !checkInfo.nicknameCheck){
			return {
				result: false,
				field: 'nickname',
				checkValue: INFO_CHECK.NOT_DUPLICATED,
			};
		}else if(!emailPattern.test(userEmail)) {
			return {
				result: false,
				field: 'email',
				checkValue: INFO_CHECK.INVALID,
			};
		}else if(!phonePattern.test(userData.phone)) {
			return {
				result: false,
				field: 'phone',
				checkValue: INFO_CHECK.INVALID,
			};
		}else {
			return { result: true };
		}
	}
	
	
	const invalidFocus = ({ field, checkValue }: { field: string, checkValue: string }): void => {
		switch(field){
			case 'userId':
				setIdCheck(checkValue);
				idElem.current?.focus();
				break;
			case 'userPw':
				pwElem.current?.focus();
				break;
			case 'userName':
				setNameCheck(checkValue);
				nameElem.current?.focus();
				break;
			case 'nickname':
				setNicknameCheck(checkValue);
				nicknameElem.current?.focus();
				break;
			case 'email':
				setEmailCheck(checkValue);
				mailElem.current?.focus();
				break;
			case 'phone':
				setPhoneCheck(checkValue);
				phoneElem.current?.focus();
				break;
			default:
				break;
		}
	}

	const handleJoin = async (): Promise<void> => {
		const userEmail = getEmail();
		const userBirth = birth.year + '/' + birth.month + '/' + birth.day;

		try{
			const res = await postJoin(userData, userEmail, userBirth);

			if(res.data.message === RESPONSE_MESSAGE.OK)
				navigate('/login');
			else
				alert('오류가 발생했습니다.\n문제가 계속된다면 관리자에게 문의해주세요');
		}catch(err){
			console.log(err);
			alert('오류가 발생했습니다.\n문제가 계속된다면 관리자에게 문의해주세요');
		}
	}

	//아이디 중복 체크 버튼 이벤트
	const handleIdCheck = async (): Promise<void> => {
		const userId = userData.userId;

		if(userId === '')
			setIdCheck(INFO_CHECK.EMPTY);
		else if(!idPattern.test(userId))
			setIdCheck(INFO_CHECK.INVALID);
		else {
			try {
				const res: AxiosResponse = await getUserIdCheck(userId);
				const responseMessage = res.data.message;

				if(responseMessage === RESPONSE_MESSAGE.DUPLICATED){
					setCheckInfo({
						...checkInfo,
						idCheckInfo: false,
					});
					setIdCheck(INFO_CHECK.DUPLICATED);
				}else if(responseMessage === RESPONSE_MESSAGE.NO_DUPLICATED){
					setCheckInfo({
						...checkInfo,
						idCheckInfo: true,
					});
					setIdCheck(INFO_CHECK.VALID);
				}
			}catch(err){
				console.error(err);
				setIdCheck(INFO_CHECK.ERROR);
			}
		}
	}

	//닉네임 중복 체크 버튼 이벤트
	const handleNicknameCheck = async (): Promise<void> => {
		if(userData.nickname === '')
			setNicknameCheck(INFO_CHECK.EMPTY);
		else {
			try {
				const res: AxiosResponse = await getNicknameCheck(userData.nickname);
				const responseMessage = res.data.message;

				if(responseMessage === RESPONSE_MESSAGE.DUPLICATED){
					setCheckInfo({
						...checkInfo,
						nicknameCheck: false,
					});
					setNicknameCheck(INFO_CHECK.DUPLICATED);
				}else if(responseMessage === RESPONSE_MESSAGE.NO_DUPLICATED){
					setCheckInfo({
						...checkInfo,
						nicknameCheck: true,
					});
					setNicknameCheck(INFO_CHECK.VALID);
				}
			}catch(err){
				console.error(err);
				setNicknameCheck(INFO_CHECK.ERROR);
			}
		}
	}

	//이메일 suffix select box 이벤트
	const handleEmailSelectOnChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
		const { value } = e.target;
		setEmailProvider(value);
		let suffix;

		if(value === 'naver')
            suffix = import.meta.env.VITE_EMAIL_SUFFIX_NAVER;
        else if(value === 'daum')
            suffix = import.meta.env.VITE_EMAIL_SUFFIX_DAUM;
        else if(value === 'google')
            suffix = import.meta.env.VITE_EMAIL_SUFFIX_GOOGLE;

		setEmailSuffix(suffix || '');
	}

	// 이메일 직접 입력 선택 시 input 입력 이벤트
	const handleEmailSuffixChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { value } = e.target;
		setEmailCheck('');
		setEmailSuffix(value);
	}

	// 생년월일 select box 이벤트
	const handleBirthOnChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
		const { name, value } = e.target;
		setBirth({
			...birth,
			[name]: value,
		});

		if(name !== 'day'){
			const year = name === 'year' ? Number(value) : birth.year;
			const month = name === 'month' ? Number(value) : birth.month;
			const lastDay = new Date(year, month, 0).getDate();
			
			setLastDay(lastDay);
		}
	}

	return (
        <div className="join">
            <div className="join-header">
                <h1>회원가입</h1>
            </div>
            <div className="join-content">
                <div className="join-form">
                    <div>
                        <div>
                            <div>
                                <label>아이디</label>
                            </div>
                            <div>
                                <input type={'text'} name={'userId'} placeholder={'아이디'} onChange={handleOnChange} ref={idElem}/>
                                <DefaultButton onClick={handleIdCheck} btnText={'중복체크'} />
                                <IdOverlap
                                    checkValue={idCheck}
                                />
                            </div>
                        </div>
                        <div>
                            <div>
                                <label>비밀번호</label>
                            </div>
                            <div>
                                <input type={'password'} name={'userPw'} placeholder={'비밀번호'} onChange={handleOnChange} ref={pwElem}/>
                                <PwOverlap
                                    checkValue={pwCheck || INFO_CHECK.EMPTY}
                                />
                            </div>
                        </div>
                        <div>
                            <div>
                                <label>비밀번호 확인</label>
                            </div>
                            <div>
                                <input type={'password'} name={'checkPassword'} placeholder={'비밀번호 확인'} onChange={handleOnChange} ref={pwCheckElem}/>
                                <CheckPwOverlap
                                    checkValue={verifyPw || INFO_CHECK.EMPTY}
                                />
                            </div>
                        </div>
                        <div>
                            <div>
                                <label>이름</label>
                            </div>
                            <div>
                                <input type={'text'} name={'userName'} placeholder={'이름'} onChange={handleOnChange} ref={nameElem}/>
                                <UserNameOverlap
                                    checkValue={nameCheck}
                                />
                            </div>
                        </div>
                        <div>
                            <div>
                                <label>닉네임</label>
                            </div>
                            <div>
                                <input type={'text'} name={'nickname'} placeholder={'닉네임'} onChange={handleOnChange} ref={nicknameElem} />
                                <DefaultButton onClick={handleNicknameCheck} btnText={'중복체크'} />
                                <p className={'nickname-info'}>닉네임을 입력하지 않을 시 활동 내역에 대해 닉네임 대신 이름으로 처리됩니다.</p>
                                <NicknameOverlap
                                    checkValue={nicknameCheck}
                                />
                            </div>
                        </div>
                        <div>
                            <div>
                                <label>연락처</label>
                            </div>
                            <div>
                                <input type={'text'} name={'phone'} placeholder={'-를 제외한 숫자만 입력하세요'} onChange={handleOnChange} ref={phoneElem}/>
                                <PhoneOverlap
                                    checkValue={phoneCheck}
                                />
                            </div>
                        </div>
                        <div>
                            <div>
                                <label>생년월일</label>
                            </div>
                            <div className="join-birth">
                                <BirthSelect
                                    onChange={handleBirthOnChange}
                                    birth={birth}
                                    lastDay={lastDay}
                                />
                            </div>
                        </div>
                        <div>
                            <div>
                                <label>이메일</label>
                            </div>
                            <div>
                                <input type={'text'} name={'email'} placeholder={'이메일'} onChange={handleOnChange} ref={mailElem}/>
                                <span> @ </span>
                                <EmailProvider providerStatus={emailProvider} handleInputChange={handleEmailSuffixChange} emailSuffix={emailSuffix}/>
                                <select className={'email-select'} name={'email-suffix'} onChange={handleEmailSelectOnChange} defaultValue={'naver'}>
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
                </div>
                <DefaultButton className={'join-btn'} onClick={handleJoinSubmit} btnText={'가입'}/>
            </div>
        </div>
    )
}

type IdOverlapProps = {
	checkValue: string;
}

function IdOverlap(props: IdOverlapProps) {
    const { checkValue } = props;

    let overlapText = '';
    if(checkValue === INFO_CHECK.EMPTY)
        overlapText = '아이디를 입력하세요';
    else if(checkValue === INFO_CHECK.INVALID)
        overlapText = '영문자와 숫자를 사용한 5 ~ 15 자리만 가능합니다';
    else if(checkValue === INFO_CHECK.DUPLICATED)
        overlapText = '이미 사용중인 아이디입니다';
    else if(checkValue === INFO_CHECK.VALID)
        overlapText = '사용 가능한 아이디입니다';
    else if(checkValue === INFO_CHECK.ERROR)
        overlapText = '오류가 발생했습니다. 문제가 계속되면 문의해주세요';
    else if(checkValue === INFO_CHECK.NOT_DUPLICATED)
        overlapText = '아이디 중복 체크를 해주세요';


    return (
        <Overlap
            overlapText={overlapText}
        />
    )
}

type PwOverlapProps = {
	checkValue: string;
}

function PwOverlap(props: PwOverlapProps) {
    const { checkValue } = props;

    let overlapText = '';
    if(checkValue === INFO_CHECK.EMPTY)
        overlapText = '비밀번호를 입력하세요';
    else if(checkValue === INFO_CHECK.INVALID)
        overlapText = '비밀번호는 영어, 특수문자, 숫자가 포함되어야 합니다.';
    else if(checkValue === INFO_CHECK.VALID)
        overlapText = '사용가능한 비밀번호입니다';
    else if(checkValue === INFO_CHECK.SHORT)
        overlapText = '비밀번호는 8자리 이상이어야 합니다'

    return (
        <Overlap
            overlapText={overlapText}
        />
    )
}

type CheckPwOverlapProps = {
	checkValue: string;
}

function CheckPwOverlap(props: CheckPwOverlapProps) {
    const { checkValue } = props;

    let overlapText = '';
    if(checkValue === INFO_CHECK.INVALID || checkValue === INFO_CHECK.EMPTY)
        overlapText = '비밀번호가 일치하지 않습니다.';

    return (
        <Overlap
            overlapText={overlapText}
        />
    )
}

type UserNameOverlapProps = {
	checkValue: string;
}

function UserNameOverlap(props: UserNameOverlapProps) {
    const { checkValue } = props;

	const overlapText = checkValue === INFO_CHECK.EMPTY ? '이름을 입력해주세요' : '';

    return (
        <Overlap
            overlapText={overlapText}
        />
    )
}

type BirthSelectProps = {
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	birth: { year: number, month: number, day: number };
	lastDay: number;
}

function BirthSelect(props: BirthSelectProps) {
    const { onChange, birth, lastDay } = props;

    const today = new Date();
    const currentYear = today.getFullYear();
    const startYear = currentYear - 100;

    const yearArr = Array.from(
        { length: currentYear - startYear + 1 },
        (_, i) => currentYear - i
    );
    const monthArr = Array.from(
        { length: 12 },
        (_, i) => i + 1
    );
    const dayArr = Array.from(
        { length: lastDay },
        (_, i) => i + 1
    );

    const selectRender = (name: string, options: number[], value: number) => (
      <select name={name} onChange={onChange} value={value}>
          {options.map((num) => (
              <option key={num} value={num}>{num}</option>
          ))}
      </select>
    );

    return (
        <>
            {selectRender('year', yearArr, birth.year)}년
            {selectRender('month', monthArr, birth.month)}월
            {selectRender('day', dayArr, birth.day)}일
        </>
    )
}

export default Register;