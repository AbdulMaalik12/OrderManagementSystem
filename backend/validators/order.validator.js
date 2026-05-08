const Joi = require('joi');
const { ORDER_STATUSES } = require('../models/Order');

const createOrderSchema = Joi.object({
  customerName: Joi.string().trim().min(1).max(200).required().messages({
    'any.required': 'Customer name is required',
    'string.max': 'Customer name cannot exceed 200 characters',
  }),
  phone: Joi.string().trim().min(1).max(20).required().messages({
    'any.required': 'Phone number is required',
  }),
  product: Joi.string().trim().min(1).max(300).required().messages({
    'any.required': 'Product name is required',
    'string.max': 'Product name cannot exceed 300 characters',
  }),
  quantity: Joi.number().integer().min(1).default(1).messages({
    'number.min': 'Quantity must be at least 1',
  }),
  size: Joi.string().trim().max(50).optional().allow(''),
  price: Joi.number().min(0).required().messages({
    'any.required': 'Price is required',
    'number.min': 'Price cannot be negative',
  }),
  address: Joi.string().trim().min(1).max(500).required().messages({
    'any.required': 'Address is required',
  }),
  city: Joi.string().trim().max(100).optional().allow(''),
  status: Joi.string()
    .valid(...ORDER_STATUSES)
    .default('Pending'),
  notes: Joi.string().trim().max(1000).optional().allow(''),
});

const updateOrderSchema = Joi.object({
  customerName: Joi.string().trim().min(1).max(200),
  phone: Joi.string().trim().min(1).max(20),
  product: Joi.string().trim().min(1).max(300),
  quantity: Joi.number().integer().min(1),
  size: Joi.string().trim().max(50).allow(''),
  price: Joi.number().min(0),
  address: Joi.string().trim().min(1).max(500),
  city: Joi.string().trim().max(100).allow(''),
  status: Joi.string().valid(...ORDER_STATUSES),
  notes: Joi.string().trim().max(1000).allow(''),
}).min(1); // At least one field must be provided

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...ORDER_STATUSES)
    .required()
    .messages({
      'any.required': 'Status is required',
      'any.only': `Status must be one of: ${ORDER_STATUSES.join(', ')}`,
    }),
});

const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string().valid(...ORDER_STATUSES),
  search: Joi.string().trim().max(200).allow(''),
  sortBy: Joi.string().valid('createdAt', 'price', 'customerName', 'status').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

module.exports = {
  createOrderSchema,
  updateOrderSchema,
  updateStatusSchema,
  querySchema,
};
