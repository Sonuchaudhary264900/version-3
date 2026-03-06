/**
 * ============================================
 * SUCCESS RESPONSE
 * ============================================
 */

const successResponse = (res, data = null, message = "Success", status = 200) => {

  return res.status(status).json({
    success: true,
    message,
    data
  });

};



/**
 * ============================================
 * ERROR RESPONSE
 * ============================================
 */

const errorResponse = (res, message = "Something went wrong", status = 500) => {

  return res.status(status).json({
    success: false,
    message
  });

};



/**
 * ============================================
 * PAGINATED RESPONSE
 * ============================================
 */

const paginatedResponse = (res, data, page, limit, total) => {

  return res.status(200).json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });

};



module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse
};