import styled from "styled-components";

const OverlapDiv = styled.div`
    color: red;
`

type OverlapProps = {
    overlapText: string;
}

//회원가입, 로그인, 정보 수정 등에서 사용될 overlap 폼
function Overlap(props: OverlapProps) {
    const { overlapText } = props;

    return (
        <OverlapDiv>
            {overlapText}
        </OverlapDiv>
    )
}

export default Overlap;