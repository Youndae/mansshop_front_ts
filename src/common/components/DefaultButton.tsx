import styled from 'styled-components';

const ButtonWrapper = styled.button`
	background-color: white;
	border: 1px solid lightgray;
	cursor: pointer;
`;

type DefaultButtonProps = {
	btnText: string;
	className?:string;
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	id?: string;
	name?: string;
	value?: string | number;
}

// 기본 Button UI
function DefaultButton(props: DefaultButtonProps) {
	const { btnText, className, onClick, id, name, value } = props;

	return (
		<ButtonWrapper
			id={id}
			name={name}
			type={'button'}
			className={className}
			onClick={onClick}
			value={value}
		>
			{btnText}
		</ButtonWrapper>
	)
}

export default DefaultButton;