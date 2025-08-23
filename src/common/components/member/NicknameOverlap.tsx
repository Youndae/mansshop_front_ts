import { INFO_CHECK } from "@/common/constants/infoCheckConstans";
import type { MemberOverlapPropsType } from "@/common/types/userDataType";

import Overlap from "@/common/components/Overlap";




function NicknameOverlap(props: MemberOverlapPropsType) {
    const { checkValue } = props;

    let overlapText = '';

    if(checkValue === INFO_CHECK.EMPTY)
        overlapText = '닉네임을 입력하세요';
    else if(checkValue === INFO_CHECK.DUPLICATED)
        overlapText = '이미 사용중인 닉네임입니다';
    else if(checkValue === INFO_CHECK.VALID)
        overlapText = '사용 가능한 닉네임입니다';
    else if(checkValue === INFO_CHECK.ERROR)
        overlapText = '오류가 발생했습니다. 문제가 계속되면 문의해주세요';
    else if(checkValue === INFO_CHECK.NOT_DUPLICATED)
        overlapText = '닉네임 중복 체크를 해주세요';

    return (
        <Overlap
            overlapText={overlapText}
        />
    )
}

export default NicknameOverlap;