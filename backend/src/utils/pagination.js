/**
 * Pagination Utility
 * Handles pagination for API responses
 */

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;


/**
 * Parse pagination parameters
 */
function getPagination(query) {

  let page = parseInt(query.page) || DEFAULT_PAGE;
  let limit = parseInt(query.limit) || DEFAULT_LIMIT;

  if (page < 1) page = DEFAULT_PAGE;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip
  };

}


/**
 * Build paginated response
 */
function buildPaginationResult(data, total, page, limit) {

  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    pagination: {
      totalItems: total,
      totalPages,
      currentPage: page,
      perPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    },
    data
  };

}


/**
 * Main pagination function
 */
async function paginate(model, query = {}, options = {}) {

  const { page, limit, skip } = getPagination(options);

  const total = await model.countDocuments(query);

  const data = await model.find(query)
    .skip(skip)
    .limit(limit)
    .sort(options.sort || { createdAt: -1 })
    .populate(options.populate || "");

  return buildPaginationResult(data, total, page, limit);

}


module.exports = {
  paginate,
  getPagination,
  buildPaginationResult
};