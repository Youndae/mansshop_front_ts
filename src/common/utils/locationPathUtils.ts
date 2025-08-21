import type { NavigateFunction } from 'react-router-dom';

export function handleLocationPathToLogin(pathname: string, navigate: NavigateFunction): void {
	if(pathname === '/login' || pathname === '/join'){
		pathname = '/';
	}
    
	// 로그인 페이지에서는 location.state?.from을 통해 경로 획득
    navigate('/login', { state: { from: pathname } });
}