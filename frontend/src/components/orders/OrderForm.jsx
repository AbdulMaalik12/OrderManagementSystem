import { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { ORDER_STATUSES } from '../../utils/constants';

/**
 * Form for creating and editing orders.
 */
export default function OrderForm({ order = null, onSubmit, onCancel, loading = false }) {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    product: '',
    quantity: 1,
    size: '',
    price: '',
    address: '',
    city: '',
    status: 'Pending',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (order) {
      setFormData({
        customerName: order.customerName || '',
        phone: order.phone || '',
        product: order.product || '',
        quantity: order.quantity || 1,
        size: order.size || '',
        price: order.price || '',
        address: order.address || '',
        city: order.city || '',
        status: order.status || 'Pending',
        notes: order.notes || '',
      });
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.product.trim()) newErrors.product = 'Product name is required';
    if (!formData.price || Number(formData.price) < 0) newErrors.price = 'Valid price is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (formData.quantity < 1) newErrors.quantity = 'Quantity must be at least 1';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Customer Name"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          placeholder="e.g. Ahmed Khan"
          error={errors.customerName}
          required
        />
        <Input
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="e.g. 03001234567"
          error={errors.phone}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Product"
          name="product"
          value={formData.product}
          onChange={handleChange}
          placeholder="e.g. Black T-Shirt"
          error={errors.product}
          required
          className="sm:col-span-1"
        />
        <Input
          label="Quantity"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          min="1"
          error={errors.quantity}
          required
        />
        <Input
          label="Size"
          name="size"
          value={formData.size}
          onChange={handleChange}
          placeholder="e.g. L, XL"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Price (Rs.)"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="e.g. 2000"
          min="0"
          error={errors.price}
          required
        />
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={ORDER_STATUSES}
          placeholder=""
        />
      </div>

      <Input
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Full delivery address"
        error={errors.address}
        required
      />

      <Input
        label="City"
        name="city"
        value={formData.city}
        onChange={handleChange}
        placeholder="e.g. Lahore, Karachi"
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-surface-700">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Internal notes (e.g. COD, gift wrap)"
          className="w-full px-3 py-2 rounded-lg border border-surface-300 text-sm
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            hover:border-surface-400 transition-colors placeholder:text-surface-400 resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2 border-t border-surface-100">
        <Button variant="secondary" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {order ? 'Update Order' : 'Create Order'}
        </Button>
      </div>
    </form>
  );
}
