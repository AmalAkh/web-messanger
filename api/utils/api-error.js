class ApiError
{
    constructor(code, clientMessage, devMessage)
    {
        this.code = code;
        this.clientMessage = clientMessage;
        this.devMessage = devMessage;
    }
}

module.exports = ApiError;