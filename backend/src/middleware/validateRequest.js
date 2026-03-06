/**
 * Validate Request Middleware
 * Validates incoming request data using a schema
 */

const validateRequest = (schema) => {

  return (req, res, next) => {

    try {

      const validationErrors = [];

      /**
       * Validate body fields
       */
      if (schema.body) {

        for (const field in schema.body) {

          const rule = schema.body[field];
          const value = req.body[field];

          if (rule.required && (value === undefined || value === "")) {

            validationErrors.push(`${field} is required`);
            continue;

          }

          if (value !== undefined && rule.type) {

            if (rule.type === "string" && typeof value !== "string") {
              validationErrors.push(`${field} must be a string`);
            }

            if (rule.type === "number" && typeof value !== "number") {
              validationErrors.push(`${field} must be a number`);
            }

            if (rule.type === "boolean" && typeof value !== "boolean") {
              validationErrors.push(`${field} must be a boolean`);
            }

          }

          if (rule.minLength && value?.length < rule.minLength) {
            validationErrors.push(
              `${field} must be at least ${rule.minLength} characters`
            );
          }

          if (rule.maxLength && value?.length > rule.maxLength) {
            validationErrors.push(
              `${field} must be less than ${rule.maxLength} characters`
            );
          }

          if (rule.enum && !rule.enum.includes(value)) {
            validationErrors.push(
              `${field} must be one of: ${rule.enum.join(", ")}`
            );
          }

        }

      }


      /**
       * Validate query parameters
       */
      if (schema.query) {

        for (const field in schema.query) {

          const rule = schema.query[field];
          const value = req.query[field];

          if (rule.required && !value) {

            validationErrors.push(`${field} query parameter is required`);

          }

        }

      }


      /**
       * Validate URL parameters
       */
      if (schema.params) {

        for (const field in schema.params) {

          const rule = schema.params[field];
          const value = req.params[field];

          if (rule.required && !value) {

            validationErrors.push(`${field} parameter is required`);

          }

        }

      }


      /**
       * Return validation errors
       */
      if (validationErrors.length > 0) {

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validationErrors
        });

      }


      next();

    } catch (error) {

      console.error("Validation middleware error:", error);

      return res.status(500).json({
        success: false,
        message: "Request validation failed"
      });

    }

  };

};

module.exports = validateRequest;