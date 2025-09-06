import { useEffect, useState } from 'react';

import {
	getQnAClassificationList,
	postQnAClassification,
	deleteQnAClassification
} from '@/modules/admin/services/adminQnAService';

import type {AxiosResponse} from 'axios';
import type { QnAClassificationType } from '@/common/types/qnaType';

import AdminSideNav from '@/modules/admin/components/AdminSideNav';
import DefaultButton from '@/common/components/DefaultButton';

function AdminQnAClassification() {
	const [data, setData] = useState<QnAClassificationType[]>([]);
	const [inputStatus, setInputStatus] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState<string>('');

	const getList = async(): Promise<void> => {
		try {
			const res: AxiosResponse = await getQnAClassificationList();
			setData(res.data);
		} catch(err) {
			console.error('Failed to get qna classification list', err);
		}
	}

	useEffect(() => {
		getList();
	}, []);

	//추가 버튼 이벤트
    //추가 elements 출력
    const handleAddBtn = (): void => {
        setInputStatus(!inputStatus);
    }

    //추가시 문의명 input 입력 이벤트
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputValue(e.target.value);
    }

	// 문의 분류 추가 이벤트
	const handleSubmit = async(): Promise<void> => {
		try {
			await postQnAClassification(inputValue);

			setInputStatus(false);
			setInputValue('');
			getList();
		} catch(err) {
			console.log(err);
		}
	}

	// 문의 분류 제거 이벤트
	const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
		const classificationName = e.currentTarget.value;

		try {
			await deleteQnAClassification(classificationName);

			getList();
		} catch(err) {
			console.log(err);
		}
	}

	return (
		<div className="mypage">
            <AdminSideNav
                categoryStatus={'qna'}
            />
            <div className="admin-content">
                <div className="admin-content-header">
                    <h1>문의 카테고리 설정</h1>
                    <QnAClassificationHeaderBtn
                        status={inputStatus}
                        handleAddBtn={handleAddBtn}
                    />
                </div>
                <div className="admin-content-content admin-qna-classification-content">
                    <QnAClassificationInput
                        status={inputStatus}
                        inputValue={inputValue}
                        onChange={handleOnChange}
                        onClick={handleSubmit}
                    />
                    {data.map((value, index) => {
                        return (
                            <div key={index} className="admin-qna-classification">
                                <div className="admin-qna-classification-info">
                                    <label>카테고리명 : </label>
                                    <span className="admin-qna-classification-name">{value.name}</span>
                                </div>
                                <div className="admin-qna-classification-delete-btn">
                                    <DefaultButton
                                        btnText={'카테고리 삭제'}
                                        onClick={handleDelete}
                                        value={value.id}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
	)
}

type QnAClassificationInputProps = {
	status: boolean;
	inputValue: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onClick: () => void;
}

function QnAClassificationInput(props: QnAClassificationInputProps) {
    const { status, inputValue, onChange, onClick } = props;

    if(status) {
        return (
            <div className="admin-qna-classification-input">
                <div className="classification-input-content">
                    <label>카테고리명 : </label>
                    <input type={'text'} className="admin-classification-input" value={inputValue} onChange={onChange}/>
                </div>
                <div className="classification-input-btn">
                    <DefaultButton
                        btnText={'추가'}
                        className={'classification-submit-btn'}
                        onClick={onClick}
                    />
                </div>
            </div>
        )
    }else{
        return null;
    }
}

type QnAClassificationHeaderBtnProps = {
	status: boolean;
	handleAddBtn: () => void;
}

function QnAClassificationHeaderBtn (props: QnAClassificationHeaderBtnProps) {
    const { status, handleAddBtn } = props;

	const btnText = status ? '닫기' : '카테고리 추가';

	return (
		<DefaultButton
			btnText={btnText}
			className={'admin-qna-classification-add-btn'}
			onClick={handleAddBtn}
		/>
	)
}

export default AdminQnAClassification;