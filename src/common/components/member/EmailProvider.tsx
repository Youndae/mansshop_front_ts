type EmailProviderProps = {
	providerStatus: string;
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	emailSuffix: string;
}

function EmailProvider (props: EmailProviderProps) {
    const { providerStatus, handleInputChange, emailSuffix } = props;

	if(providerStatus !== 'none')
		return null;

	return (
		<input type={'text'} name={'email-suffix-input'} value={emailSuffix} onChange={handleInputChange}/>
	)
}

export default EmailProvider;