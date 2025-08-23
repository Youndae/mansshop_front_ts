# Man's Shop Frontend

## 목적
- 기존 jsx 기반의 React를 TypeScript 기반으로 재구현
- Backend 구조를 Multi-module로 개선하고 Frontend를 분리하는 구조가 되었기 때문에 TypeScript 기반으로 재구현하면서 분리

## 설계
- 기존 jsx 기반과 완전 동일.
- 구조
	- jsx와 동일하게 app, assets, common, modules, styles를 유지.
	- 이번 구조에서는 routes를 추가해 모듈별 라우팅을 분산해서 관리
	- 내부 구조에서는 TypeScript를 사용하는만큼 types를 추가해서 type들을 분리해서 관리

## 설계 규칙
- type
	- 해당 파일(.ts, .tsx)에 완전히 종속적인 타입의 경우 types로 분리하지 않고 내부에 작성
	- Components, pages 컴포넌트의 내부 하위 컴포넌트들의 props는 대부분 종속적이기 때문에 분리하지 않고 내부에 작성
	- 위 2가지 상황에 대해 예외적인 경우가 발생할 수 있으므로 고려해서 처리
- routes 분산
	- 최대한 module을 기준으로 routes를 분산
	- 메인 관련과 같이 URL 문제가 있는것이 아니라면 최대한 분산
	- 하나의 컴포넌트만 존재하고 앞으로 페이지 확장 가능성이 적은 경우 routes로 분산 하지 말것.
- path Mapping
	- src 하위 디렉토리 기준으로만 매핑을 처리

---

# History

### 2025/08/19
> 프로젝트 시작
>> 기본 설정 및 구조 처리   
>> common 모듈 전체 작성

<br/>

### 2025/08/20
> main, order 모듈 구현 완료
>> 브라우저 테스트 수행 결과 정상   
>> 페이지 접근 테스트만 했기 때문에 기능 테스트는 완료 이후 테스트 필요   
>> 페이지네이션 처리 테스트까지만 확인

<br/>

### 2025/08/21
> member, product 모듈 구현 완료
>> 테스트는 미수행   
>> 이대로 빠른 구현 목표

<br/>

### 2025/08/22
> cart 모듈 구현 완료