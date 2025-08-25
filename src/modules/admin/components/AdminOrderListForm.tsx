import dayjs from "dayjs";

import type { AdminOrderListType } from "@/modules/admin/types/AdminOrderType";
import type { PagingObjectType } from "@/common/types/paginationType";

import AdminModal from "@/modules/admin/components/modal/AdminModal";
import Pagination from "@/common/components/Pagination";

type AdminOrderListFormProps = {
	header: string;
	data: AdminOrderListType[];
	handleOnClick: (index: number) => void;
	modalIsOpen: boolean;
	closeModal: (e: React.MouseEvent<HTMLDivElement>) => void;
	modalRef: React.RefObject<HTMLDivElement | null>;
	keywordSelectValue: string;
	handleSelectOnChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	handleKeywordOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	keywordInput: string;
	pagingData: PagingObjectType;
	handlePageBtn: (pageOrType: string) => void;
	handleSearchBtn: () => void;
	render: () => React.ReactNode;
}

function AdminOrderListForm(props: AdminOrderListFormProps) {
	const {
		header,
        data,
        handleOnClick,
        modalIsOpen,
        closeModal,
        modalRef,
        keywordSelectValue,
        handleSelectOnChange,
        handleKeywordOnChange,
        keywordInput,
        pagingData,
		handlePageBtn,
		handleSearchBtn,
	} = props;

	return (
        <div className="admin-content">
            <div className="admin-content-header">
                <h1>{header}</h1>
            </div>
            <div className="admin-content-content">
                <table className="admin-content-table">
                    <thead>
                        <tr>
                            <th>받는사람</th>
                            <th>사용자 아이디</th>
                            <th>연락처</th>
                            <th>주문일</th>
                            <th>처리 상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((bodyData, index) => {
                            return (
                                <tr key={index} onClick={() => handleOnClick(index)} className="admin-order-body-tr">
                                    <td>{bodyData.recipient}</td>
                                    <td>{bodyData.userId}</td>
                                    <td>{bodyData.phone}</td>
                                    <td>{dayjs(bodyData.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                                    <td>{bodyData.orderStatus}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {modalIsOpen && (
                    <AdminModal
                        closeModal={closeModal}
                        modalRef={modalRef}
                        render={() => props.render()}
                    />
                )}
                <div className="admin-search">
                    <select className="admin-order-search" value={keywordSelectValue} onChange={handleSelectOnChange}>
                        <option value={'recipient'}>받는 사람</option>
                        <option value={'userId'}>사용자 아이디</option>
                    </select>
                    <input type={'text'} onChange={handleKeywordOnChange} value={keywordInput}/>
                    <img alt={''} src={"https://as1.ftcdn.net/v2/jpg/03/25/73/68/1000_F_325736897_lyouuiCkWI59SZAPGPLZ5OWQjw2Gw4qY.jpg"} onClick={handleSearchBtn}/>
                    <Pagination
                        pagingData={pagingData}
                        handlePageBtn={handlePageBtn}
                        className={'like-paging'}
                    />
                </div>
            </div>
        </div>
    )
}

export default AdminOrderListForm;