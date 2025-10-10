export type ApiError = {
	code: number;
	message: string;
	link: string;
	status: string;
	errors: string[];
	error: string | null;
};
