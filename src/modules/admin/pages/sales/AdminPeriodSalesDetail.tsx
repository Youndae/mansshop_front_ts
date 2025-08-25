import {useState, useEffect, useRef} from 'react';
import {useNavigate, useParams} from "react-router-dom";

import {
	getMonthSalesData,
	getMonthDailySalesData,
	getMonthClassificationSalesData
} from '@/modules/admin/services/adminSalesService';

import { numberComma } from '@/common/utils/formatNumberComma';

import type { AxiosResponse } from 'axios';
import type { 
	AdminMonthSalesType,
	AdminPeriodBestProductType,
	AdminPeriodClassificationSalesType,
	AdminPeriodSalesListType,
	AdminDailyModalDataType,
	AdminPeriodClassificationModalDataType
 } from '../../types/AdminSalesType';


import AdminSideNav from '@/modules/admin/components/AdminSideNav';
import DefaultButton from '@/common/components/DefaultButton';
import AdminModal from '../../components/modal/AdminModal';

/*
    월 매출 상세 내역

    매출
    판매량
    주문량
    전년동월 대비
    전년동월 매출
    전년동월 판매량
    전년동월 주문량

    가장 많이 팔린 상품 5개
        상품명
        매출
        판매량
    상품 분류별 매출
        분류명
        매출
        판매량
    일별 매출
        해당 월의 일수만큼 테이블 구조
        일 | 매출 | 판매량 | 주문량
        페이징 처리는 x
 */
function AdminPeriodSalesDetail(){
	const { date } = useParams();

	const [monthSales, setMonthSales] = useState<AdminMonthSalesType>({
        sales: 0,
        salesQuantity: 0,
        orderQuantity: 0,
        lastYearComparison: 0,
        lastYearSales: 0,
        lastYearSalesQuantity: 0,
        lastYearOrderQuantity: 0,
    });
    const [bestProduct, setBestProduct] = useState<AdminPeriodBestProductType[]>([]);
    const [classificationSales, setClassificationSales] = useState<AdminPeriodClassificationSalesType[]>([]);
    const [dailySales, setDailySales] = useState<AdminPeriodSalesListType[]>([]);
    const [dailyModalData, setDailyModalData] = useState<AdminDailyModalDataType>({
        selectDate: '',
        sales: 0,
        salesQuantity: 0,
        orderQuantity: 0,
        classificationList: [],
    });
    const [dailyModalIsOpen, setDailyModalIsOpen] = useState(false);
    const [classificationModalData, setClassificationModalData] = useState<AdminPeriodClassificationModalDataType>({
        name: '',
        sales: 0,
        salesQuantity: 0,
        productList: [],
    })
    const [classificationModalIsOpen, setClassificationModalIsOpen] = useState(false);

    const classificationModalRef = useRef<HTMLDivElement>(null);
    const dailyModalRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

	useEffect(() => {
		const getMonthSales = async (): Promise<void> => {
			if(!date) return;
			try {
				const res: AxiosResponse = await getMonthSalesData(date);
				
				const content = res.data;

                setMonthSales({
                    sales: content.monthSales,
                    salesQuantity: content.monthSalesQuantity,
                    orderQuantity: content.monthOrderQuantity,
                    lastYearComparison: content.lastYearComparison,
                    lastYearSales: content.lastYearSales,
                    lastYearSalesQuantity: content.lastYearSalesQuantity,
                    lastYearOrderQuantity: content.lastYearOrderQuantity,
                });
                setBestProduct(content.bestProduct);
                setClassificationSales(content.classificationSales);
                setDailySales(content.dailySales);
			} catch(err) {
				console.error('Failed to get month sales data', err);
			}
		}

		getMonthSales();
	}, [date]);

	//일 매출 조회 및 Modal Open
	const handleDailyOnClick = async (day: number): Promise<void> => {
		const selectDay = `${date}-${day}`;

		try {
			const res = await getMonthDailySalesData(selectDay);

			const content = res.data;

                setDailyModalData({
                    selectDate: selectDay,
                    sales: content.sales,
                    salesQuantity: content.salesQuantity,
                    orderQuantity: content.orderQuantity,
                    classificationList: content.content,
                })

                setDailyModalIsOpen(true);
		} catch(err) {
			console.log(err);
		}
	}

	// 상품 분류 매출 선택 이벤트
	// 해당 상품 분류의 월 매출 내역 조회 및 Modal Open
	const handleClassificationOnClick = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
		const classificationName = e.currentTarget.value;

		if(!date) return;
		try {
			const res = await getMonthClassificationSalesData(date, classificationName);

			const content = res.data;

                setClassificationModalData({
                    name: content.classification,
                    sales: content.totalSales,
                    salesQuantity: content.totalSalesQuantity,
                    productList: content.productList,
                })

                setClassificationModalIsOpen(true);
		} catch(err) {
			console.log(err);
		}
	}

	// 일 매출 Modal Close 이벤트
	const closeDailyModal = (e: React.MouseEvent<HTMLDivElement>): void => {
		if(dailyModalIsOpen && dailyModalRef.current && !dailyModalRef.current.contains(e.currentTarget)){
            setDailyModalIsOpen(false);
            document.body.style.cssText = '';
        }
	}

	//상품 분류 매출 Modal close
    const closeClassificationModal = (e: React.MouseEvent<HTMLDivElement>): void => {
        if(classificationModalIsOpen && classificationModalRef.current && !classificationModalRef.current.contains(e.currentTarget)){
            setClassificationModalIsOpen(false);
            document.body.style.cssText = '';
        }
    }

    //일 주문내역 버튼 이벤트
    const handleDailyDetailOnClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const selectDate = e.currentTarget.value;

        setDailyModalIsOpen(false);
        document.body.style.cssText = '';

        navigate(`/admin/sales/period/detail/daily/${selectDate}`);
    }

	return (
        <div className="mypage">
            <AdminSideNav
                categoryStatus={'sales'}
            />
            <div className="admin-content">
                <div className="admin-content-header">
                    <h1>{date?.replace('-', ' / ')}</h1>
                </div>
                <div className="admin-content-content">
                    <div className="content-period-detail-month">
                        <div className="form-group">
                            <label>월 매출 : </label>
                            <span>{numberComma(monthSales.sales)}</span>
                        </div>
                        <div className="form-group">
                            <label>월 판매량 : </label>
                            <span>{numberComma(monthSales.salesQuantity)}</span>
                        </div>
                        <div className="form-group">
                            <label>월 주문량 : </label>
                            <span>{numberComma(monthSales.orderQuantity)}</span>
                        </div>
                        <div className="form-group">
                            <label>전년 동월 대비 매출 : </label>
                            <span>{numberComma(monthSales.lastYearComparison)}</span>
                        </div>
                        <div className="form-group">
                            <label>전년 동월 매출 : </label>
                            <span>{numberComma(monthSales.lastYearSales)}</span>
                        </div>
                        <div className="form-group">
                            <label>전년 동월 판매량 : </label>
                            <span>{numberComma(monthSales.lastYearSalesQuantity)}</span>
                        </div>
                        <div className="form-group">
                            <label>전년 동월 주문량 : </label>
                            <span>{numberComma(monthSales.lastYearOrderQuantity)}</span>
                        </div>
                    </div>
                </div>
                <div className="content-period-detail-best-product">
                    <div className="admin-period-detail-best-product-header">
                        <h3>매출 베스트 5</h3>
                    </div>
                    {bestProduct.map((data, index) => {
                        return (
                            <div key={index} className="best-product-content">
                                <div className="form-group best-product-content-header">
                                    <label>상품명 : </label>
                                    <span>{data.productName}</span>
                                </div>
                                <div className="form-group">
                                    <label>매출 : </label>
                                    <span>{numberComma(data.productPeriodSales)}</span>
                                </div>
                                <div className="form-group">
                                    <label>판매량 : </label>
                                    <span>{numberComma(data.productPeriodSalesQuantity)}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="content-period-detail-classification">
                    <div className="admin-period-detail-classification-header">
                        <h3>상품 분류별 매출</h3>
                    </div>
                    {classificationSales.map((data, index) => {
                        return (
                            <div key={index} className="classification-sales">
                                <div className="classification-sales-header">
                                    <DefaultButton
                                        btnText={'상세 내역'}
                                        onClick={handleClassificationOnClick}
                                        className={'classification-sales-btn'}
                                        value={data.classification}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>분류 : </label>
                                    <span>{data.classification}</span>
                                </div>
                                <div className="form-group">
                                    <label>매출 : </label>
                                    <span>{numberComma(data.classificationSales)}</span>
                                </div>
                                <div className="form-group">
                                    <label>판매량 : </label>
                                    <span>{numberComma(data.classificationSalesQuantity)}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
                {classificationModalIsOpen && (
                    <AdminModal
                        closeModal={closeClassificationModal}
                        modalRef={classificationModalRef}
                        modalHeader={`${classificationModalData.name} 매출 정보`}
                        render={() =>
                            <>
                                <div className="admin-period-classification-modal">
                                    <div className="admin-period-modal-content-sales">
                                        <div className="form-group">
                                            <label>매출 : </label>
                                            <span>{numberComma(classificationModalData.sales)}</span>
                                        </div>
                                        <div className="form-group">
                                            <label>판매량 : </label>
                                            <span>{numberComma(classificationModalData.salesQuantity)}</span>
                                        </div>
                                    </div>
                                    <div className="admin-period-modal-content-table">
                                        <table className="admin-period-modal-table">
                                            <thead>
                                            <tr>
                                                <th>상품명</th>
                                                <th>옵션</th>
                                                <th>매출</th>
                                                <th>판매량</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {classificationModalData.productList.map((data, index) => {
                                                const sizeText = `사이즈 : ${data.size}`;
                                                const colorText = `컬러 : ${data.color}`;
                                                let optionText = '';
                                                if(data.size === null){
                                                    if(data.color !== null) {
                                                        optionText = colorText;
                                                    }
                                                }else {
                                                    if(data.color !== null) {
                                                        optionText = `${sizeText}, ${colorText}`;
                                                    }else {
                                                        optionText = sizeText;
                                                    }
                                                }

                                                return (
                                                    <tr key={index}>
                                                        <td>{data.productName}</td>
                                                        <td>{optionText}</td>
                                                        <td>{numberComma(data.productSales)}</td>
                                                        <td>{numberComma(data.productSalesQuantity)}</td>
                                                    </tr>
                                                )
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        }
                    />
                )}
                <div className="content-period-detail-daily">
                    <div className="admin-period-detail-daily-header">
                        <h3>일 매출</h3>
                    </div>
                    <table className="admin-content-table admin-period-table">
                        <thead>
                            <tr>
                                <th>일</th>
                                <th>매출</th>
                                <th>판매량</th>
                                <th>주문량</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dailySales.map((data, index) => {
                                return (
                                    <tr key={index} onClick={() => handleDailyOnClick(data.date)}>
                                        <td>{data.date}</td>
                                        <td>{numberComma(data.sales)}</td>
                                        <td>{numberComma(data.salesQuantity)}</td>
                                        <td>{numberComma(data.orderQuantity)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                {dailyModalIsOpen && (
                    <AdminModal
                        closeModal={closeDailyModal}
                        modalRef={dailyModalRef}
                        modalHeader={`${dailyModalData.selectDate.replaceAll('-', ' / ')} 매출 정보`}
                        render={() =>
                            <>
                                <div className="admin-period-classification-modal">
                                    <DefaultButton
                                        btnText={'주문 내역'}
                                        onClick={handleDailyDetailOnClick}
                                        value={dailyModalData.selectDate}
                                        className="admin-period-daily-header-btn"
                                    />
                                    <div className="admin-period-modal-content-sales">
                                        <div className="form-group">
                                            <label>매출 : </label>
                                            <span>{numberComma(dailyModalData.sales)}</span>
                                        </div>
                                        <div className="form-group">
                                            <label>판매량 : </label>
                                            <span>{numberComma(dailyModalData.salesQuantity)}</span>
                                        </div>
                                        <div className="form-group">
                                            <label>주문량 : </label>
                                            <span>{numberComma(dailyModalData.salesQuantity)}</span>
                                        </div>
                                    </div>
                                    {dailyModalData.classificationList.map((data, index) => {
                                        return (
                                            <div key={index} className="classification-sales daily-classification-sales">
                                                <div className="form-group">
                                                    <label>분류 : </label>
                                                    <span>{data.classification}</span>
                                                </div>
                                                <div className="form-group">
                                                    <label>매출 : </label>
                                                    <span>{numberComma(data.classificationSales)}</span>
                                                </div>
                                                <div className="form-group">
                                                    <label>판매량 : </label>
                                                    <span>{numberComma(data.classificationSalesQuantity)}</span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        }
                    />
                )}
            </div>
        </div>
    )
}

export default AdminPeriodSalesDetail;