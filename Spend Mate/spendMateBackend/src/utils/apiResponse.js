class apiResponse {
    constructor(statusCode, message = "Success", data = [] ) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = true;
    }
}

export default apiResponse;
