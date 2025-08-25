// adminSideNavConstants.ts
export type SideMenuItem = {
    link: string;
    text: string;
};

export type MainMenuItem = {
    key: string;
    label: string;
    link: string;
    hasSubmenu: boolean;
    submenu: SideMenuItem[]; // optional 제거
};

export const ADMIN_SIDE_MENU_MAP: readonly MainMenuItem[] = Object.freeze([
    {
        key: 'product',
        label: '상품 관리',
        link: '/admin/product',
        hasSubmenu: true,
        submenu: [
            { link: '/admin/product', text: '상품 목록' },
            { link: '/admin/product/stock', text: '재고 관리' },
            { link: '/admin/product/discount', text: '할인 설정' },
        ]
    },
    {
        key: 'order',
        label: '주문 관리',
        link: '/admin/order',
        hasSubmenu: true,
        submenu: [
            { link: '/admin/order', text: '미처리 목록' },
            { link: '/admin/order/all', text: '전체 목록' },
        ]
    },
    {
        key: 'qna',
        label: '문의 관리',
        link: '/admin/qna/product',
        hasSubmenu: true,
        submenu: [
            { link: '/admin/qna/product', text: '상품 문의' },
            { link: '/admin/qna/member', text: '회원 문의' },
            { link: '/admin/qna/classification', text: '문의 카테고리 설정' },
        ]
    },
    {
        key: 'review',
        label: '리뷰 관리',
        link: '/admin/review',
        hasSubmenu: true,
        submenu: [
            { link: '/admin/review', text: '미답변 목록' },
            { link: '/admin/review/all', text: '전체 목록' },
        ]
    },
    {
        key: 'member',
        label: '회원 관리',
        link: '/admin/member',
        hasSubmenu: false,
        submenu: [] // 빈 배열로 명시
    },
    {
        key: 'sales',
        label: '매출 관리',
        link: '/admin/sales/period',
        hasSubmenu: true,
        submenu: [
            { link: '/admin/sales/period', text: '기간별 매출' },
            { link: '/admin/sales/product', text: '상품별 매출' },
        ]
    },
    {
        key: 'data',
        label: '데이터 관리',
        link: '/admin/data/queue',
        hasSubmenu: true,
        submenu: [
            { link: '/admin/data/queue', text: '실패 메시지 관리'},
            { link: '/admin/data/order', text: '실패 주문 관리'}
        ]
    }
] as const);

export type SideMenuCategory = typeof ADMIN_SIDE_MENU_MAP[number]['key'];