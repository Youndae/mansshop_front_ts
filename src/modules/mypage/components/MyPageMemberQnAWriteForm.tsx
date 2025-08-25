import type { MyPageMemberQnAInputType } from "@/modules/mypage/types/mypageQnAType";
import type { QnAClassificationType } from "@/common/types/qnaType";

type MyPageMemberQnAWriteFormProps = {
	inputData: MyPageMemberQnAInputType;
	classificationId: number;
	classification: QnAClassificationType[];
	handleInputOnChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	handleSelectOnChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	handleSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
	btnText: string;
}

//회원 문의 작성 폼
function MyPageMemberQnAWriteForm(props: MyPageMemberQnAWriteFormProps) {
	const { 
		inputData, 
		classificationId, 
		classification, 
		handleInputOnChange, 
		handleSelectOnChange, 
		handleSubmit, 
		btnText 
	} = props;

	return (
        <div className="mypage-qna-content">
            <div className="mypage-qna-write-title">
                <label>제목 : </label>
                <input type={'text'} value={inputData.title} name={'title'} onChange={handleInputOnChange}/>
                <select className="classification-box" defaultValue={classificationId} value={classificationId} onChange={handleSelectOnChange}>
                    {classification.map((option, index) => {
                        return (
                            <MemberQnAClassificationOption
                                key={index}
                                option={option}
                            />
                        )
                    })}
                </select>
            </div>
            <div className="mypage-qna-content-textarea">
                <textarea className="qna-content" name={'content'} onChange={handleInputOnChange} value={inputData.content}>{inputData.content}</textarea>
            </div>
            <div className="mypage-qna-content-btn">
                <button type={'button'} onClick={handleSubmit}>{btnText}</button>
            </div>
        </div>
    )
}

type MemberQnAClassificationOptionProps = {
	option: QnAClassificationType;
}

function MemberQnAClassificationOption(props: MemberQnAClassificationOptionProps) {
    const { option } = props;

    return (
        <option value={option.id}>{option.name}</option>
    )
}

export default MyPageMemberQnAWriteForm;