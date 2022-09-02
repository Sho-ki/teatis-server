export interface GetTerraAuthUrlResponse extends ErrorResponse {
	status: string;
	user_id?: string;
	auth_url?: string;
}

interface ErrorResponse{
    message?:string;
}

export interface GetTerraAuthUrlRequest{
    resource:string;
    reference_id: string;
    auth_success_redirect_url: string;
    auth_failure_redirect_url: string;
}

export interface GetAllCustomersResponse{
	status: string;
	users: {
		user_id: string;
		last_webhook_update: string | null;
		provider: string;
    }[];

}
