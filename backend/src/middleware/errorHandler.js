const errorHandler = (err, req, res, next) => {
  console.error(err.stack)

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: '数据验证错误',
      details: err.message
    })
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: '未授权访问'
    })
  }

  if (err.name === 'ForbiddenError') {
    return res.status(403).json({
      error: '禁止访问'
    })
  }

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: '数据已存在'
    })
  }

  res.status(500).json({
    error: '服务器内部错误',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  })
}

module.exports = errorHandler