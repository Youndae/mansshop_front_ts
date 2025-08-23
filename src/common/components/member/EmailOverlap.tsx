import { INFO_CHECK } from "@/common/constants/infoCheckConstans";
import type { MemberOverlapPropsType } from "@/common/types/userDataType";

import Overlap from "@/common/components/Overlap";


function EmailOverlap (props: MemberOverlapPropsType) {
    const { checkValue } = props;

    let overlapText = '';

    if(checkValue === INFO_CHECK.INVALID)
        overlapText = '유효하지 않은 이메일 주소입니다.';

    return (
        <Overlap
            overlapText={overlapText}
        />
    )
}

export default EmailOverlap;