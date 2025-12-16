# Man'sShop Frontend

Man's Shop 서비스의 Frontend Application입니다.   
Backend API와 연동하여 사용자 인터페이스와 사용자 흐름을 담당합니다.

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Redux Toolkit
- Axios
- styled-components
- dayjs
- React Toastify
- WebSocket (STOMP, SockJS)

## Backend Integration

Frontend는 Backend와 완전히 분리된 프로젝트로 구성되어 있으며 API 기반 통신을 통해 인증 상태 관리 및 비즈니스 흐름을 처리합니다.

- 인증 상태 및 토큰 관리
- API 요청 / 응답 흐름
- 공통 에러 처리 전략

해당 설계 및 구현에 대한 상세 내용은 Backend Repository에 정리되어 있습니다.

[Backend Repository README](https://github.com/Youndae/mansShop_multi/blob/master/README.md)

## Run (Local)

```bash
npm install
npm run dev
```

- 로컬 환경에서 Frontend를 실행합니다.
- Backend API 서버와 연동하여 동작합니다.

## Note

해당 프로젝트는 Backend 중심 포트폴리오의 일부이며,  
Frontend는 실제 서비스 흐름을 기준으로 사용자 인터페이스와 상태 관리를 담당합니다.