export interface dtoTypes {
	email?: string;
	password?: string;
}

export interface dtoLoginInfo {
	user?: {
		id: number;
		email: string;
		first_name: string;
		last_name: string;
		patronymic: string;
		phone: string;
		role: string;
		salary: number;
		avatar: string;
	};
	notification: any;
	tabs?: {
		id: number;
		name: string;
		code: string;
		link: string;
	};
}

export interface formFieldT {
	editMode?: boolean;
	form?: FieldT[];
}

export interface FieldT {
	code?: string;
	type?: string;
	value?: string;
	placeholder?: string;
}
