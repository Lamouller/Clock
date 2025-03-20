export const ERROR_TYPES = {
  DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
  INVALID_STATUS: 'INVALID_STATUS',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_ROLE: 'INVALID_ROLE',
  DATABASE_ERROR: 'DATABASE_ERROR'
}

export const handleError = (error) => {
  // Handle Supabase specific errors
  if (error?.code) {
    switch (error.code) {
      case '23505': // Postgres unique violation
        return {
          type: ERROR_TYPES.DUPLICATE_EMAIL,
          message: 'Email already registered'
        }
      case '42501': // RLS violation
        return {
          type: ERROR_TYPES.UNAUTHORIZED,
          message: 'Not authorized to perform this action'
        }
      case '23514': // Check constraint violation
        return {
          type: ERROR_TYPES.INVALID_ROLE,
          message: 'Invalid role or status specified'
        }
      default:
        return {
          type: ERROR_TYPES.DATABASE_ERROR,
          message: 'Database error occurred'
        }
    }
  }

  // Handle custom errors
  if (error?.message) {
    if (error.message.includes('Email already registered')) {
      return {
        type: ERROR_TYPES.DUPLICATE_EMAIL,
        message: 'Email already registered'
      }
    }
    if (error.message.includes('Invalid user status')) {
      return {
        type: ERROR_TYPES.INVALID_STATUS,
        message: 'Invalid user status for this operation'
      }
    }
    if (error.message.includes('Unauthorized')) {
      return {
        type: ERROR_TYPES.UNAUTHORIZED,
        message: 'Not authorized to perform this action'
      }
    }
  }

  // Default error
  return {
    type: 'UNKNOWN',
    message: 'An unexpected error occurred'
  }
}
