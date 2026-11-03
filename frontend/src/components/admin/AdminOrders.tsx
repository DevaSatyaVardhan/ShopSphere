import React, { useState } from 'react'
import { Eye, Search } from 'lucide-react'
import type { Order, OrderStatus } from '../../types'
import { Modal } from '../common/Modal'
import { useToast } from '../../context/ToastContext'

interface AdminOrdersProps {
  orders: Order[]
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, onUpdateOrderStatus }) => {
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null)

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    onUpdateOrderStatus(orderId, newStatus)
    showToast('Order status updated', `Order marked as ${newStatus}`, 'success')
  }

  const filtered = orders.filter((order) => {
    const matchStatus = selectedStatus === 'ALL' || order.status === selectedStatus
    const matchQuery =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.shippingAddress.fullName.toLowerCase().includes(search.toLowerCase()) ||
      order.shippingAddress.email.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchQuery
  })

  return (
    <div className="admin-content-inner">
      <div className="admin-section-header">
        <div>
          <span className="eyebrow">Fulfilment & Logistics</span>
          <h1 className="admin-page-title">Customer Orders</h1>
        </div>
        <span className="order-count-badge">{orders.length} Total Orders</span>
      </div>

      {/* Filter bar */}
      <div className="admin-filter-bar">
        <div className="admin-search-input">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by order #, customer name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="admin-select"
        >
          <option value="ALL">All Statuses</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Destination</th>
              <th>Total</th>
              <th>Status</th>
              <th>Fulfillment Action</th>
              <th className="align-right">Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-table-cell">
                  No orders match your filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>#{order.orderNumber}</strong>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="table-customer-cell">
                      <strong>{order.shippingAddress.fullName}</strong>
                      <span>{order.shippingAddress.email}</span>
                    </div>
                  </td>
                  <td>
                    {order.shippingAddress.city}, {order.shippingAddress.country}
                  </td>
                  <td>
                    <strong>${order.total.toFixed(2)}</strong>
                  </td>
                  <td>
                    <span className={`status-tag status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      className="table-status-select"
                    >
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="align-right">
                    <button
                      className="table-action-btn view"
                      onClick={() => setViewingOrder(order)}
                      title="View Order Details"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {viewingOrder && (
        <Modal
          isOpen={!!viewingOrder}
          onClose={() => setViewingOrder(null)}
          title={`Order #${viewingOrder.orderNumber}`}
          maxWidth="640px"
        >
          <div className="order-details-modal">
            {/* Status & Date */}
            <div className="modal-status-banner">
              <div>
                <span className="eyebrow">Placed on</span>
                <p>{new Date(viewingOrder.createdAt).toLocaleString()}</p>
              </div>
              <span className={`status-tag status-${viewingOrder.status.toLowerCase()}`}>
                {viewingOrder.status}
              </span>
            </div>

            {/* Line items */}
            <div className="modal-items-section">
              <h4>Ordered Pieces ({viewingOrder.items.length})</h4>
              <div className="modal-items-list">
                {viewingOrder.items.map((item, idx) => (
                  <div key={idx} className="modal-item-row">
                    <img src={item.image} alt={item.productName} />
                    <div className="modal-item-meta">
                      <strong>{item.productName}</strong>
                      <span>Qty: {item.quantity}</span>
                    </div>
                    <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="modal-cost-breakdown">
              <div>
                <span>Subtotal</span>
                <span>${viewingOrder.subtotal.toFixed(2)}</span>
              </div>
              {viewingOrder.discount > 0 && (
                <div>
                  <span>Discount</span>
                  <span>−${viewingOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div>
                <span>Shipping</span>
                <span>
                  {viewingOrder.shippingFee === 0
                    ? 'Free'
                    : `$${viewingOrder.shippingFee.toFixed(2)}`}
                </span>
              </div>
              <hr />
              <div className="modal-total-row">
                <strong>Total Amount</strong>
                <strong>${viewingOrder.total.toFixed(2)}</strong>
              </div>
            </div>

            {/* Shipping & Payment Info */}
            <div className="modal-info-columns">
              <div className="modal-info-col">
                <h4>Shipping Address</h4>
                <p>{viewingOrder.shippingAddress.fullName}</p>
                <p>{viewingOrder.shippingAddress.address}</p>
                <p>
                  {viewingOrder.shippingAddress.city}, {viewingOrder.shippingAddress.postalCode}
                </p>
                <p>{viewingOrder.shippingAddress.country}</p>
                <p>Phone: {viewingOrder.shippingAddress.phone}</p>
              </div>

              <div className="modal-info-col">
                <h4>Payment Method</h4>
                <p>{viewingOrder.paymentMethod}</p>
                <p>
                  Payment Status:{' '}
                  <strong style={{ color: '#315d4a' }}>
                    {viewingOrder.paymentStatus}
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
