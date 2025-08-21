import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/modules/member/memberSlice";
import { toast } from "react-toastify";

import { postLogout } from "@/modules/member/services/memberService";
import { connect, disconnect } from "@/common/services/webSocketService";

import { handleLocationPathToLogin } from "@/common/utils/locationPathUtils";
import { removeToken } from "@/common/utils/axios/tokenUtils";
import { RESPONSE_MESSAGE } from "@/common/constants/responseMessageType";
import type { RootState } from "@/common/types/userDataType";
import type { NotificationData } from "@/common/services/webSocketService";
import "@/styles/header.css";

//페이지 상단 헤더 navbar
function Navbar() {
	const status = useSelector((state: RootState) => state.member);
	const loginStatus = status.loginStatus;
	const adminStatus = status.role === 'admin';
	const userId = status.id;
	const { pathname } = useLocation();

	const [keyword, setKeyword] = useState<string>('');

	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		setKeyword('');
	}, [pathname]);

	const handleNewNotification = useCallback((notification: NotificationData): void => {
		toast.info(
			notification.title,
			{
				position: 'top-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				onClick: () => {
					navigate(`/my-page/notification`);
				}
			}
		)
	}, [navigate]);

	useEffect(() => {
		console.log("hi mansShop");
		if(loginStatus && userId) {
			console.log('WebSocket connect?');
			connect(userId, handleNewNotification);
		}else {
			console.log('WebSocket disconnect?');
			disconnect();
			console.log("WebSocket disconnected");
		}

		return () => {
			if(loginStatus && userId) {
				disconnect();
			}
		}
	}, [loginStatus, userId, handleNewNotification]);

	const handleKeywordOnchange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setKeyword(e.target.value);
	}

	const handleLoginBtn = (): void => {
		handleLocationPathToLogin(pathname, navigate);
	}

	const handleLogoutBtn = async (): Promise<void> => {
		const errorMessage: string = '오류가 발생했습니다.\n문제가 계속되면 관리자에게 문의해주세요';

		try {
			const res = await postLogout();
			if(res.data.message === RESPONSE_MESSAGE.OK){
				removeToken();
				dispatch(logout());
				navigate('/');
			}else{
				alert(errorMessage);
			}
		}catch {
			alert(errorMessage);
		}
	}

	//장바구니 버튼 이벤트
    const handleCartBtn = (): void => {
        navigate('/cart');
    }

    //주문 조회 버튼 이벤트
    const handleOrderBtn = (): void => {
        navigate('/order/info');
    }

    //마이페이지 버튼 이벤트
    const handleMyPageBtn = (): void => {
        navigate('/my-page/order');
    }

    //검색 버튼 이벤트
    const handleSearchBtn = (): void => {
        navigate(`/search?keyword=${keyword}`);
    }

	//상품 분류 버튼 이벤트
    const handleClassificationBtn = (e: React.MouseEvent<HTMLButtonElement>): void => {
		const target = e.currentTarget;
        const btnName: string = target.textContent?.trim() || '';

        if(btnName === 'BEST')
            navigate('/');
        else if(btnName === 'NEW')
            navigate('/new');
        else
            navigate(`/category/${btnName}`);
    }

    //관리자 페이지 버튼 이벤트
    const handleAdminPageBtn = (): void => {
        navigate('/admin/product');
    }

	return (
        <div className="header">
            <div className="header-nav">
                <div className="header-nav logo">
                    <Link className="logo-link" to={'/'}>
                        <span>Man's Shop</span>
                    </Link>
                </div>
                <div className="header-nav menu">
                    <ul className="menu-nav">
                        <NavbarBtn
                            loginState={loginStatus}
                            adminStatus={adminStatus}
                            handleLoginBtn={handleLoginBtn}
                            handleLogoutBtn={handleLogoutBtn}
                            handleCartBtn={handleCartBtn}
                            handleOrderListBtn={handleOrderBtn}
                            handleMyPageBtn={handleMyPageBtn}
                            handleAdminPageBtn={handleAdminPageBtn}
                        />
                        <li>
                            <div className="main-search-form">
                                <input type={'text'} id={'keyword'} value={keyword} onChange={handleKeywordOnchange}/>
                                <div className="search-btn">
                                    <button className="search-button" type={'button'} onClick={handleSearchBtn}>
                                        <img alt={''} src={"https://as1.ftcdn.net/v2/jpg/03/25/73/68/1000_F_325736897_lyouuiCkWI59SZAPGPLZ5OWQjw2Gw4qY.jpg"}/>
                                    </button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="header-nav top">
                    <button type={'button'} onClick={handleClassificationBtn}>BEST</button>
                    <button type={'button'} onClick={handleClassificationBtn}>NEW</button>
                    <button type={'button'} onClick={handleClassificationBtn}>OUTER</button>
                    <button type={'button'} onClick={handleClassificationBtn}>TOP</button>
                    <button type={'button'} onClick={handleClassificationBtn}>PANTS</button>
                    <button type={'button'} onClick={handleClassificationBtn}>SHOES</button>
                    <button type={'button'} onClick={handleClassificationBtn}>BAGS</button>
                </div>
            </div>
        </div>
    )
}

type NavbarBtnProps = {
	loginState: boolean;
	adminStatus: boolean;
	handleLoginBtn: () => void;
	handleLogoutBtn: () => void;
	handleCartBtn: () => void;
	handleOrderListBtn: () => void;
	handleMyPageBtn: () => void;
	handleAdminPageBtn: () => void;
}

function NavbarBtn(props: NavbarBtnProps) {
    const { 
		loginState, 
		adminStatus, 
		handleLoginBtn, 
		handleLogoutBtn, 
		handleCartBtn, 
		handleOrderListBtn, 
		handleMyPageBtn, 
		handleAdminPageBtn
	} = props;

	const buttons = [];
	const btnClass = 'header-btn';

	if(loginState) {
		buttons.push(
				<button className={btnClass} type={'button'} onClick={handleLogoutBtn}>로그아웃</button>
		);

		if(adminStatus) {
			buttons.push(
					<button className={btnClass} type={'button'} onClick={handleAdminPageBtn}>관리자페이지</button>
			);
		}else{
			buttons.push(
					<button className={btnClass} type={'button'} onClick={handleMyPageBtn}>마이페이지</button>
			);
		}
	}else {
		buttons.push(
				<button className={btnClass} type={'button'} onClick={handleLoginBtn}>로그인</button>,
				<button className={btnClass} type={'button'} onClick={handleOrderListBtn}>주문조회</button>
		);
	}

	buttons.push(
			<button className={btnClass} type={'button'} onClick={handleCartBtn}>장바구니</button>
	);

	return (
		<>
			{buttons.map((button, index) => (
				<li key={index}>{button}</li>
			))}
		</>
	);
}

export default Navbar;