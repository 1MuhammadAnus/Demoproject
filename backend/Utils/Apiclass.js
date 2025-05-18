class ApiResponse{
    constructor( status ,data, message = "Success",){
        this.message = message;
        this.status = status;
        this.data = data;
        this.success = status < 400
    }
}

export {ApiResponse}