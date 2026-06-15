class ApiResponse {
  constructor(statusCode, message, data = null, pagination = null) {
    this.success = statusCode < 400;
    this.message = message;
    if (data !== null) this.data = data;
    if (pagination) this.pagination = pagination;
  }

  static success(res, message, data = null, statusCode = 200) {
    return res.status(statusCode).json(new ApiResponse(statusCode, message, data));
  }

  static created(res, message, data = null) {
    return ApiResponse.success(res, message, data, 201);
  }

  static paginated(res, message, data, pagination) {
    const response = new ApiResponse(200, message, data, pagination);
    return res.status(200).json(response);
  }

  static noContent(res) {
    return res.status(204).send();
  }
}

module.exports = ApiResponse;
