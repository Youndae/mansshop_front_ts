import { useState } from "react";
import { PATTERNS } from "@/common/constants/patterns";

import type { UserDataType } from "@/common/types/userDataType";
import { INFO_CHECK } from "@/common/constants/infoCheckConstans";


type CheckResultType = typeof INFO_CHECK[keyof typeof INFO_CHECK];

export default function usePasswordValidator() {
	const [pwCheck, setPwCheck] = useState<CheckResultType | null>(null);
	const [verifyPw, setVerifyPw] = useState<CheckResultType | null>(null);
	const [pwCheckInfo, setPwCheckInfo] = useState<boolean>(false);

	const validatePassword = (value: string): boolean => {
		if(value.length < 8) {
			setPwCheck(INFO_CHECK.SHORT);
			return false;
		}else if(!PATTERNS.PASSWORD.test(value)) {
			setPwCheck(INFO_CHECK.INVALID);
			return false;
		}else {
			setPwCheck(INFO_CHECK.VALID);
			return true;
		}
	};

	const validatePasswordCheck = (password: string, checkPassword: string): void => {
		if(password === checkPassword) {
			setVerifyPw(INFO_CHECK.VALID);
		}else {
			setVerifyPw(INFO_CHECK.INVALID);
		}
	}

	const validateAndSyncPassword = (name: string, value: string, userData: UserDataType): void => {
		if (name === 'userPw') {
			if (validatePassword(value)) 
				setPwCheckInfo(true);
			else
				setPwCheckInfo(false);
			
			validatePasswordCheck(value, userData.checkPassword);
		} else if (name === 'checkPassword') 
			validatePasswordCheck(userData.userPw, value);
	};

	return {
		pwCheck,
		verifyPw,
		pwCheckInfo,
		validatePassword,
		validatePasswordCheck,
		validateAndSyncPassword,
	}
}