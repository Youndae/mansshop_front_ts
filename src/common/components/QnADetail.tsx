import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import DefaultButton from "@/common/components/DefaultButton";
import type { QnAData, QnAReplyData } from "@/common/types/qnaType";
import type { RootState } from "@/common/types/userDataType";

type QnADetailProps = {
	data: QnAData;
	replyData: QnAReplyData[];
	handleReplyModifyElement?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	handleModifyOnChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	modifyTextValue: string;
	handleModifySubmit?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	handleInputOnChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	inputValue: string;
	handleInputSubmit?: () => void;
	titleText: string;
	type: string;
	handleDeleteBtn?: () => void;
	handleCompleteBtn?: () => void;
	replyStatus?: boolean;
}

/*
    문의 상세 페이지 component
    마이페이지와 관리자의 회원 문의, 상품 문의 상세 페이지에 사용되는 Component
 */
function QnADetail(props: QnADetailProps) {
	const { 
        data,
        replyData,
        handleReplyModifyElement,
        handleModifyOnChange,
        modifyTextValue,
        handleModifySubmit,
        handleInputOnChange,
        inputValue,
        handleInputSubmit,
        titleText,
        type,
        handleDeleteBtn,
        handleCompleteBtn,
        replyStatus = true
    } = props;

	const userId = useSelector((state: RootState) => state.member.id) || '';
	const navigate = useNavigate();

	//수정 버튼 이벤트
	//수정은 회원 문의만 가능하기 때문에 회원 문의에서만 동작
	const handleModifyBtn = () => {
		const qnaId = data.qnAId;
		navigate(`/my-page/qna/member/update/${qnaId}`);
	}

	return (
		<div className="mypage-content">
            <div className="mypage-qna-header">
                <h1>{titleText}</h1>
            </div>
            <div className="mypage-qna-content">
                <div className="mypage-qna-content-header-btn">
                    <HeaderBtn
                        userId={userId}
                        status={data.qnaStatus}
                        type={type}
                        handleModifyBtn={handleModifyBtn}
                        handleDeleteBtn={handleDeleteBtn}
                        handleCompleteBtn={handleCompleteBtn}
                    />
                </div>
                <div className="mypage-qna-content-title">
                    <QnATitle data={data}/>
                </div>
                <div className="mypage-qna-content-content">
                    <p className="qna-detail-content">
                        {data.qnaContent}
                    </p>
                </div>
                <ReplyInput
                    status={replyStatus}
                    handleInputOnChange={handleInputOnChange}
                    inputValue={inputValue}
                    handleInputSubmit={handleInputSubmit}
                />
                <div className="mypage-qna-content-reply">
                    {replyData.map((reply, index) => {
                        return (
                            <MyPageQnADetailReply
                                key={index}
                                data={reply}
                                userId={userId}
                                index={index}
                                handleReplyModifyElement={handleReplyModifyElement}
                                handleModifyOnChange={handleModifyOnChange}
                                modifyTextValue={modifyTextValue}
                                handleModifySubmit={handleModifySubmit}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
	)
}

type ReplyInputProps = {
	status: boolean;
	handleInputOnChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	inputValue: string;
	handleInputSubmit?: () => void;
}

function ReplyInput(props: ReplyInputProps) {
    const { status, handleInputOnChange, inputValue, handleInputSubmit } = props;

	if(!status)
		return null;

	return (
		<div className="qna-reply-input">
			<textarea className="reply-input-textarea" onChange={handleInputOnChange} value={inputValue}>{inputValue}</textarea>
			<DefaultButton onClick={handleInputSubmit} btnText={'작성'}/>
		</div>
	)
}

type HeaderBtnProps = {
	userId: string;
	status: boolean;
	type: string;
	handleModifyBtn?: () => void;
	handleDeleteBtn?: () => void;
	handleCompleteBtn?: () => void;
}

//type은 member, undefined(product)
function HeaderBtn(props: HeaderBtnProps) {
    const { userId, status, type, handleModifyBtn, handleDeleteBtn, handleCompleteBtn } = props;

    console.log('userID : ', userId);
	const isAdmin = userId === 'admin';
	const isAnswer = status;
	const isMember = type === 'member';
	const isUnanswer = !status;

	if(isAdmin) {
		return isAnswer ? null : (
			<DefaultButton className={'header-btn-modify'} onClick={handleCompleteBtn} btnText={'답변 완료 처리'}/>
		)
	}

	if(isMember && isUnanswer) {
		return (
			<>
				<DefaultButton className={'header-btn-modify'} onClick={handleModifyBtn} btnText={'수정'}/>
				<DefaultButton className={'header-btn-delete'} onClick={handleDeleteBtn} btnText={'삭제'}/>
			</>
		)
	}

	return (
		<DefaultButton className={'header-btn-delete'} onClick={handleDeleteBtn} btnText={'삭제'}/>
	);
}

type QnATitleProps = {
	data: QnAData;
}

function QnATitle(props: QnATitleProps) {
    const { data } = props;
    let statusText = '미답변';
    if(data.qnaStatus)
        statusText = '답변 완료';

    return (
        <>
            <h2>{data.title}({statusText})</h2>
            <small className="qna-reply-date">{data.date}</small>
        </>
    )
}

type MyPageQnADetailReplyProps = {
	data: QnAReplyData;
	userId: string;
	index: number;
	handleReplyModifyElement?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	handleModifyOnChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	modifyTextValue: string;
	handleModifySubmit?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function MyPageQnADetailReply(props: MyPageQnADetailReplyProps) {
    const { 
		data, 
		userId, 
		index, 
		handleReplyModifyElement,
		handleModifyOnChange, 
		modifyTextValue, 
		handleModifySubmit 
	} = props;


	const isWriter = userId === data.writer;

	return (
		<div className="qna-detail-reply">
                <div className="qna-reply-writer">
                    <strong>{data.writer}</strong>
                    <small className="qna-reply-date">{data.updatedAt}</small>
                </div>
                <div className="qna-reply-content">
                    <p>{data.replyContent}</p>

					{isWriter && (
						<QnAModifyButton
							index={index}
							handleReplyModifyElement={handleReplyModifyElement}
							inputStatus={data.inputStatus}
                    	/>
					)}
                </div>

				{isWriter && (
					<QnAModifyArea
                    	index={index}
						handleModifyOnChange={handleModifyOnChange}
						modifyTextValue={modifyTextValue}
						handleModifySubmit={handleModifySubmit}
						inputStatus={data.inputStatus}
					/>
				)}
			</div>
		)
}

type QnAModifyButtonProps = {
	index: number;
	handleReplyModifyElement?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	inputStatus: boolean;
}

function QnAModifyButton(props: QnAModifyButtonProps) {
    const { index, handleReplyModifyElement, inputStatus } = props;

	const btnText = inputStatus ? '닫기' : '댓글 수정';

    return (
        <DefaultButton onClick={handleReplyModifyElement} value={index} btnText={btnText}/>
    )
}

type QnAModifyAreaProps = {
	index: number;
	handleModifyOnChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	modifyTextValue: string;
	handleModifySubmit?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	inputStatus: boolean;
}

function QnAModifyArea(props: QnAModifyAreaProps) {
    const { index, handleModifyOnChange, modifyTextValue, handleModifySubmit, inputStatus } = props;

	if(!inputStatus)
		return null;

	return (
		<div className="qna-reply-modify-input">
			<textarea onChange={handleModifyOnChange} className="qna-reply-modify-text" value={modifyTextValue}>{modifyTextValue}</textarea>
			<div className="qna-reply-modify-btn">
				<DefaultButton onClick={handleModifySubmit} value={index} btnText={'수정'}/>
			</div>
		</div>
	)
}

export default QnADetail;