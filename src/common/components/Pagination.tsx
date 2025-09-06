import styled from "styled-components";

import { PAGINATION_BTN } from "@/common/constants/paginationButton";
import type { PagingObjectType } from "@/common/types/paginationType";

const PagingLiWrapper = styled.li`
	list-style: none;
	float: left;
	padding: 10px;
`

type PaginationProps = {
	pagingData: PagingObjectType;
	handlePageBtn: (pageOrType: string) => void;
	className?: string;
}

// Pagination Form
function Pagination(props: PaginationProps) {
	const { pagingData, handlePageBtn, className = '' } = props;
	let prevElem = null;
	let nextElem = null;
	const pagingNumberArr = [];

	if(pagingData.endPage > 1) {
		for(let i = pagingData.startPage; i <= pagingData.endPage; i++) {
            let pagingClassName = 'pagingNumber';

            if(i === Number(pagingData.activeNo))
                pagingClassName += ' active';

            const body = {
                pageNum: i,
                className: pagingClassName,
            }

            pagingNumberArr.push(body);
        }
	}

	if(pagingData.prev) {
        prevElem =
            <PagingLiWrapper>
                <PagingButton
                    btnText={'prev'}
                    className={'pagingPrev'}
                    onClick={() => handlePageBtn(PAGINATION_BTN.PREV)}
                />
            </PagingLiWrapper>;
    }

    if(pagingData.next) {
        nextElem =
            <PagingLiWrapper>
                <PagingButton
                    btnText={'next'}
                    className={'pagingNext'}
                    onClick={() => handlePageBtn(PAGINATION_BTN.NEXT)}
                />
            </PagingLiWrapper>;
    }

    return (
        <div className={`paging ${className}`}>
            <ul>
                {prevElem}
                {pagingNumberArr.map((pagingNum, index) => {
                    return(
                        <PagingNumber
                            key={index}
                            pagingNumberData={pagingNum}
                            btnOnClick={() => handlePageBtn(String(pagingNum.pageNum))}
                        />
                    )
                })}
                {nextElem}
            </ul>
        </div>
    )
}

type PagingNumberProps = {
	pagingNumberData: {
		pageNum: number;
		className: string;
	}
	btnOnClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function PagingNumber(props: PagingNumberProps) {
    const { pagingNumberData, btnOnClick } = props;

    return (
        <PagingLiWrapper>
            <PagingButton
                btnText={String(pagingNumberData.pageNum)}
                className={pagingNumberData.className}
                onClick={btnOnClick}
            />
        </PagingLiWrapper>
    )
}

const PagingButtonBase = styled.button`
	background: none;
	border: none;
	cursor: pointer;
`

const PagingButtonWrapper = styled(PagingButtonBase)`
	color: #17a2b8;
`

const PagingActiveButtonWrapper = styled(PagingButtonBase)`
	color: black;
`

type PagingButtonProps = {
	btnText: string;
	className: string;
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function PagingButton(props: PagingButtonProps) {
    const { btnText, className, onClick } = props;

    if(className.indexOf('active') !== -1) {
        return (
            <PagingActiveButtonWrapper
                className={className}
                onClick={onClick}
                disabled={true}
            >
                {btnText}
            </PagingActiveButtonWrapper>
        )
    }else {
        return (
            <PagingButtonWrapper
                className={className}
                onClick={onClick}
            >
                {btnText}
            </PagingButtonWrapper>
        )
    }
}

export default Pagination;