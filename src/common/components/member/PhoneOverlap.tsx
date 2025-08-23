import { INFO_CHECK } from "@/common/constants/infoCheckConstans";
import type { MemberOverlapPropsType } from "@/common/types/userDataType";

import Overlap from "@/common/components/Overlap";

function PhoneOverlap(props: MemberOverlapPropsType) {
    const { checkValue } = props;

    let overlapText = '';
    if(checkValue === INFO_CHECK.EMPTY)
        overlapText = '연락처를 입력해주세요';
    else if (checkValue === INFO_CHECK.INVALID)
        overlapText = '유효한 연락처가 아닙니다.';

    return (
        <Overlap
            overlapText={overlapText}
        />
    )
}

export default PhoneOverlap;