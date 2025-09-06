import { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getSearchId } from '@/modules/member/services/memberService';
import { PATTERNS } from '@/common/constants/patterns';
import { RESPONSE_MESSAGE } from '@/common/constants/responseMessageType';
import { SEARCH_STATUS } from "@/modules/member/constants/searchInfoStatusConstants.ts";

import type { RootState } from '@/common/types/userDataType';

import DefaultButton from '@/common/components/DefaultButton';
import type {AxiosError} from "axios";
import {parseStatusAndMessage} from "@/common/utils/responseErrorUtils.ts";

type SearchIdDataType = {
	username: string;
	userPhone: string;
	userEmail: string;
	emailSuffix: string;
}

/*
    아이디 찾기 페이지
    로그인한 사용자인 경우 메인페이지로 강제 이동
 */
function SearchId() {
	const loginStatus = useSelector((state: RootState) => state.member.loginStatus);
	const [data, setData] = useState<SearchIdDataType>({
		username: '',
		userPhone: '',
		userEmail: '',
		emailSuffix: '',
	});
	const [phoneStatus, setPhoneStatus] = useState(true);
    const [emailStatus, setEmailStatus] = useState(false);
    const [overlapStatus, setOverlapStatus] = useState('');
    const [searchId, setSearchId] = useState('');

    const nameElem = useRef<HTMLInputElement>(null);
    const phoneElem = useRef<HTMLInputElement>(null);
    const emailElem = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();
	
	const emailPattern = PATTERNS.EMAIL;
	const phonePattern = PATTERNS.PHONE;

	useEffect(() => {
		if(loginStatus)
			navigate('/');
	}, [loginStatus, navigate]);
	
	// input 입력 이벤트
	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = e.target;
		setData({
			...data,
			[name]: value,
		});
	}

	//userName 입력 여부 확인. 입력하지 않았다면 focus
	const checkUserName = (): boolean => {
		const name = data.username;

		if(name === ''){
			setOverlapStatus(SEARCH_STATUS.NAME);
			nameElem.current?.focus();
			return false;
		}

		return true;
	}

	//이름과 연락처 기반 검색 submit 이벤트
	const handleSearchPhoneSubmit = (): void => {
		if(checkUserName()){
			if(data.userPhone === '' || !phonePattern.test(data.userPhone)){
				setOverlapStatus(SEARCH_STATUS.PHONE);
				phoneElem.current?.focus();
			}else
				submitRequest(SEARCH_STATUS.PHONE);
		}
	}

	//이름과 이메일 기반 검색 submit 이벤트
	const handleSearchEmailSubmit = (): void => {
		if(checkUserName()){

			if(data.userEmail === '' || data.emailSuffix === '' || !emailPattern.test(getEmail())){
				setOverlapStatus(SEARCH_STATUS.EMAIL);
				emailElem.current?.focus();
			}else
				submitRequest(SEARCH_STATUS.EMAIL);
		}
	}

	//이메일 조합
	const getEmail = () => data.userEmail + '@' + data.emailSuffix;

	//아이디 검색 요청 처리
	const submitRequest = async (type: string): Promise<void> => {
		const value = type === SEARCH_STATUS.PHONE ? data.userPhone : getEmail();

		try{
			const res = await getSearchId(data.username, type, value);
			setOverlapStatus(SEARCH_STATUS.FOUND);
			setSearchId(res.data);
		}catch(err){
			console.log(err);

			const axiosError: AxiosError = err as AxiosError;
			const { status, message } = parseStatusAndMessage(axiosError);

			if(status === 400 && message === RESPONSE_MESSAGE.BAD_REQUEST)
				setOverlapStatus(SEARCH_STATUS.NOT_FOUND);
		}
		
	}

	//연락처, 이메일 기반 선택 radio 버튼 이벤트
	const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const name = e.target.name;

		if(name === SEARCH_STATUS.PHONE){
			setPhoneStatus(true);
			setEmailStatus(false);
		}else{
			setPhoneStatus(false);
			setEmailStatus(true);
		}
	}

	// 비밀번호 찾기 페이지로 이동
	const handleSearchPassword = (): void => {
		navigate('/search-pw');
	}

	return (
        <div className="content login-content">
            <div className="login-header">
                <h1>아이디 찾기</h1>
            </div>
            <div className="search-id-radio isOpen-radio">
                <label className="radio-label">휴대폰 번호로 검색</label>
                <input className="radio-input" type={'radio'} name={SEARCH_STATUS.PHONE} onChange={handleRadioChange} checked={phoneStatus}/>
                <label className="radio-label">이메일로 검색</label>
                <input className="radio-input" type={'radio'} name={SEARCH_STATUS.EMAIL} onChange={handleRadioChange} checked={emailStatus}/>
            </div>
            <div className="search-id-form">
                <SearchPhone
                    data={data}
                    status={phoneStatus}
                    onChange={handleOnChange}
                    searchStatus={overlapStatus}
                    handleSubmit={handleSearchPhoneSubmit}
                    searchId={searchId}
                    nameElem={nameElem}
                    phoneElem={phoneElem}
                    handleSearchPassword={handleSearchPassword}
                />
                <SearchEmail
                    data={data}
                    status={emailStatus}
                    onChange={handleOnChange}
                    searchStatus={overlapStatus}
                    handleSubmit={handleSearchEmailSubmit}
                    searchId={searchId}
                    nameElem={nameElem}
                    emailElem={emailElem}
                    handleSearchPassword={handleSearchPassword}
                />
            </div>
        </div>
    )
}

type SearchPhoneProps = {
	data: SearchIdDataType;
	status: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	searchStatus: string;
	handleSubmit: () => void;
	searchId: string;
	nameElem: React.RefObject<HTMLInputElement | null>;
	phoneElem: React.RefObject<HTMLInputElement | null>;
	handleSearchPassword: () => void;
}

function SearchPhone(props: SearchPhoneProps) {
    const { 
		data, 
		status, 
		onChange, 
		searchStatus, 
		handleSubmit, 
		searchId, 
		nameElem, 
		phoneElem, 
		handleSearchPassword 
	} = props;

    if(status){
        return (
            <>
                <div className="form-group">
                    <label>이름</label>
                    <input type="text" className="form-control" name={'username'} onChange={onChange} value={data.username} ref={nameElem}/>
                </div>
                <div className="form-group">
                    <label>휴대폰 번호</label>
                    <input type="text" className="form-control" name={'userPhone'} onChange={onChange} value={data.userPhone} ref={phoneElem} placeholder={'-를 제외한 숫자만 입력'}/>
                </div>
                <SearchOverlap
                    status={searchStatus}
                    searchId={searchId}
                />
                <div className="login-form-btn-area">
                    <div className="search-info">
                        <DefaultButton
                            className={'search-info-btn'}
                            onClick={handleSubmit}
                            btnText={'아이디 찾기'}
                        />
                        <DefaultButton
                            className={'search-info-btn'}
                            onClick={handleSearchPassword}
                            btnText={'비밀번호 찾기'}
                        />
                    </div>
                </div>
            </>
        )
    }

	return null;
}

type SearchEmailProps = {
	data: SearchIdDataType;
	status: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	searchStatus: string;
	handleSubmit: () => void;
	searchId: string;
	nameElem: React.RefObject<HTMLInputElement | null>;
	emailElem: React.RefObject<HTMLInputElement | null>;
	handleSearchPassword: () => void;
}

function SearchEmail(props: SearchEmailProps) {
    const { 
		data, 
		status, 
		onChange, 
		searchStatus, 
		handleSubmit, 
		searchId, 
		nameElem, 
		emailElem, 
		handleSearchPassword 
	} = props;

    if(status){
        return (
            <>
                <div className="form-group">
                    <label>이름</label>
                    <input type="text" className="form-control" name={'username'} onChange={onChange} value={data.username} ref={nameElem}/>
                </div>
                <div className="form-group">
                    <label>이메일</label>
                    <input type="text" className="form-control" name={'userEmail'} onChange={onChange} value={data.userEmail} ref={emailElem}/>
                    <span>@</span>
                    <input type={'text'} name={'emailSuffix'} onChange={onChange} value={data.emailSuffix}/>
                </div>
                <SearchOverlap
                    status={searchStatus}
                    searchId={searchId}
                />
                <div className="login-form-btn-area">
                    <div className="login-btn">
                        <DefaultButton
                            className={'search-info-btn'}
                            onClick={handleSubmit}
                            btnText={'아이디 찾기'}
                        />
                        <DefaultButton
                            className={'search-info-btn'}
                            onClick={handleSearchPassword}
                            btnText={'비밀번호 찾기'}
                        />
                    </div>
                </div>
            </>
        )
    }

	return null;
}

type SearchOverlapProps = {
	status: string;
	searchId: string;
}

function SearchOverlap(props: SearchOverlapProps) {
    const { status, searchId } = props;

	let className = '';
	let text = '';

	if(status === SEARCH_STATUS.NOT_FOUND){
		className = 'not-found-overlap';
		text = '일치하는 정보가 없습니다.';
	}else if(status === SEARCH_STATUS.FOUND){
		className = 'found-id';
		text = `회원님의 아이디는 ${searchId} 입니다.`;
	}else if(status === SEARCH_STATUS.NAME){
		className = 'not-found-overlap';
		text = '이름을 입력해주세요';
	}else if(status === SEARCH_STATUS.PHONE){
		className = 'not-found-overlap';
		text = '휴대폰 번호를 입력해주세요';
	}else if(status === SEARCH_STATUS.EMAIL){
		className = 'not-found-overlap';
		text = '이메일을 입력해주세요';
	}

	return (
		<div className="search-id-overlap">
			<span className={className}>{text}</span>
		</div>
	)
}

export default SearchId;