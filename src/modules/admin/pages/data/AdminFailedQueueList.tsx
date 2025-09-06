import { useEffect, useState } from "react";

import { getFailedQueueList, retryDLQMessages } from "@/modules/admin/services/adminDataService";

import { RESPONSE_MESSAGE } from "@/common/constants/responseMessageType";

import type { AxiosError, AxiosResponse } from "axios";
import type { AdminFailedDataType } from "@/modules/admin/types/AdminFailedDataType";

import AdminSideNav from "@/modules/admin/components/AdminSideNav";
import DefaultButton from "@/common/components/DefaultButton";
import {parseStatusAndMessage} from "@/common/utils/responseErrorUtils.ts";

function AdminFailedQueueList() {
	const [data, setData] = useState<AdminFailedDataType[]>([]);

	useEffect(() => {
		const getList = async (): Promise<void> => {
			try {
				const res: AxiosResponse = await getFailedQueueList();

				setData(res.data);
			} catch (err) {
				console.error('Failed to get failed queue list', err);
			}
		}

		getList();
	}, []);

	//재시도 버튼 이벤트
	const handleRetryBtn = async (): Promise<void> => {
		try {
			await retryDLQMessages(data);

            alert('실패한 메시지를 재시도합니다.\n메시지량에 따라 처리 시간이 상이할 수 있습니다.');
		} catch (err) {
			console.error('Failed to retry DLQ messages', err);
			const error = err as AxiosError;
            const { status, message } = parseStatusAndMessage(error);

			if(status === 500 && message === RESPONSE_MESSAGE.ORDER_DATA_FAILED) {
				alert('메시지 재처리가 실패했습니다. Message Queue 연결을 다시 확인해주세요.');
			}
		}
	}
	
	return (
        <div className="mypage">
            <AdminSideNav
                categoryStatus={'data'}
            />
            <div className="admin-content">
                <div className="admin-content-header admin-product-header">
                    <h1>처리 실패 메시지</h1>
                    <FailedQueueBtn
                        data={data}
                        handleRetryBtn={handleRetryBtn}
                    />
                </div>
                <div className="admin-content-content">
                    <FailedListData
                        data={data}
                    />
                </div>
            </div>
        </div>
    )
}

type FailedQueueBtnProps = {
	data: AdminFailedDataType[];
	handleRetryBtn: () => Promise<void>;
}

function FailedQueueBtn(props: FailedQueueBtnProps) {
    const { data, handleRetryBtn } = props;

    if(data.length === 0)
        return null;
    
	return (
		<DefaultButton
			btnText={'재시도'}
			onClick={handleRetryBtn}
		/>
	)
}

type FailedListDataProps = {
	data: AdminFailedDataType[];
}	

function FailedListData(props: FailedListDataProps) {
    const { data } = props;

    if(data.length === 0) {
        return (
            <span>미처리된 실패 메시지가 존재하지 않습니다.</span>
        )
    }else {
        return (
            <table className="admin-content-table">
                <thead>
                    <tr>
                        <th>QueueName</th>
                        <th>메시지 개수</th>
                    </tr>
                </thead>
                <tbody>
                {data.map((data, index) => {
                    return (
                        <tr key={index} className="admin-order-body-tr">
                            <td>{data.queueName}</td>
                            <td>{data.messageCount}</td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        )
    }
}

export default AdminFailedQueueList;