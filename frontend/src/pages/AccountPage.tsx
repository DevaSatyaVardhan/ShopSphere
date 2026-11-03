import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  UserRound,
  Package,
  Heart,
  MapPin,
  Edit2,
  Plus,
  Trash2,
  LayoutDashboard,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import type { Address } from '../types'
import { INITIAL_ADDRESSES } from '../data/mockData'
import { Modal } from '../components/common/Modal'
import { useToast } from '../context/ToastContext'

export const AccountPage: React.FC = () => {
  const { user, isAdmin, updateProfile } = useAuth()
  const { wishlistCount } = useWishlist()
  const { showToast } = useToast()

  // Address state
  const [addresses, setAddresses] = useState<Address[]>(() => {
    try {
      const stored = localStorage.getItem('shopsphere-addresses')
      return stored ? JSON.parse(stored) : INITIAL_ADDRESSES
    } catch {
      return INITIAL_ADDRESSES
    }
  })

  // Edit Profile Modal
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [editName, setEditName] = useState(user?.name || '')
  const [editPhone, setEditPhone] = useState(user?.phone || '')

  // Add Address Modal
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [addrLabel, setAddrLabel] = useState('Home')
  const [addrRecipient, setAddrRecipient] = useState(user?.name || '')
  const [addrLineOne, setAddrLineOne] = useState('')
  const [addrCity, setAddrCity] = useState('')
  const [addrState, setAddrState] = useState('')
  const [addrPostal, setAddrPostal] = useState('')
  const [addrPhone, setAddrPhone] = useState(user?.phone || '')

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({
      name: editName.trim(),
      phone: editPhone.trim(),
    })
    setIsEditProfileOpen(false)
  }

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault()
    if (!addrLineOne || !addrCity) return

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      label: addrLabel,
      recipientName: addrRecipient,
      lineOne: addrLineOne,
      city: addrCity,
      state: addrState,
      postalCode: addrPostal,
      country: 'United States',
      phone: addrPhone,
      isDefault: addresses.length === 0,
    }

    const next = [...addresses, newAddr]
    setAddresses(next)
    localStorage.setItem('shopsphere-addresses', JSON.stringify(next))
    showToast('Address added', `${newAddr.label} saved to address book`, 'success')

    // Reset
    setAddrLineOne('')
    setAddrCity('')
    setAddrState('')
    setAddrPostal('')
    setIsAddressModalOpen(false)
  }

  const handleDeleteAddress = (id: string) => {
    const next = addresses.filter((a) => a.id !== id)
    setAddresses(next)
    localStorage.setItem('shopsphere-addresses', JSON.stringify(next))
    showToast('Address removed', undefined, 'info')
  }

  const handleSetDefaultAddress = (id: string) => {
    const next = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }))
    setAddresses(next)
    localStorage.setItem('shopsphere-addresses', JSON.stringify(next))
    showToast('Default address updated', undefined, 'success')
  }

  return (
    <main className="page-content account-page-root">
      <div className="account-top-header">
        <div>
          <p className="eyebrow">Your space</p>
          <h1>
            Welcome back, <em>{user.name.split(' ')[0]}.</em>
          </h1>
          <p className="account-email-sub">{user.email}</p>
        </div>

        {isAdmin && (
          <Link to="/admin" className="primary-button admin-entry-btn">
            <LayoutDashboard size={16} /> Open Admin Portal
          </Link>
        )}
      </div>

      {/* Account Metric Shortcuts */}
      <div className="account-metrics-row">
        <Link to="/orders" className="metric-box">
          <Package size={22} />
          <div>
            <strong>My Orders</strong>
            <span>Track purchases and view receipts</span>
          </div>
        </Link>
        <Link to="/wishlist" className="metric-box">
          <Heart size={22} />
          <div>
            <strong>Saved Pieces ({wishlistCount})</strong>
            <span>Your personal wishlist</span>
          </div>
        </Link>
      </div>

      {/* Account Details Sections */}
      <div className="account-grid">
        {/* Profile Card */}
        <section className="account-card">
          <div className="card-top-icon">
            <UserRound size={22} />
          </div>
          <h2>Personal Profile</h2>
          <div className="profile-details-list">
            <div>
              <span>Full Name</span>
              <strong>{user.name}</strong>
            </div>
            <div>
              <span>Email Address</span>
              <strong>{user.email}</strong>
            </div>
            <div>
              <span>Phone</span>
              <strong>{user.phone || 'Not provided'}</strong>
            </div>
            <div>
              <span>Account Role</span>
              <strong className="role-tag">{user.role}</strong>
            </div>
          </div>
          <button
            className="outline-button edit-profile-btn"
            onClick={() => {
              setEditName(user.name)
              setEditPhone(user.phone || '')
              setIsEditProfileOpen(true)
            }}
          >
            <Edit2 size={14} /> Edit Profile
          </button>
        </section>

        {/* Addresses Card */}
        <section className="account-card addresses-card">
          <div className="card-top-icon">
            <MapPin size={22} />
          </div>
          <div className="address-header-row">
            <h2>Saved Addresses</h2>
            <button
              className="add-address-mini-btn"
              onClick={() => setIsAddressModalOpen(true)}
            >
              <Plus size={14} /> Add New
            </button>
          </div>

          <div className="addresses-list">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`address-item ${addr.isDefault ? 'default-addr' : ''}`}
              >
                <div className="address-meta">
                  <div className="address-label-row">
                    <strong>{addr.label}</strong>
                    {addr.isDefault && <span className="default-pill">Default</span>}
                  </div>
                  <p className="addr-recipient">{addr.recipientName}</p>
                  <p className="addr-lines">
                    {addr.lineOne}
                    {addr.lineTwo ? `, ${addr.lineTwo}` : ''}
                  </p>
                  <p className="addr-city">
                    {addr.city}, {addr.state} {addr.postalCode}
                  </p>
                  <p className="addr-phone">{addr.phone}</p>
                </div>

                <div className="address-actions">
                  {!addr.isDefault && (
                    <button
                      className="make-default-link"
                      onClick={() => handleSetDefaultAddress(addr.id)}
                    >
                      Make default
                    </button>
                  )}
                  {addresses.length > 1 && (
                    <button
                      className="delete-address-link"
                      onClick={() => handleDeleteAddress(addr.id)}
                      aria-label="Delete address"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        title="Edit Profile"
      >
        <form onSubmit={handleProfileSave} className="admin-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="outline-button"
              onClick={() => setIsEditProfileOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="primary-button">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Address Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title="Add Delivery Address"
      >
        <form onSubmit={handleAddAddress} className="admin-form">
          <div className="form-grid-2">
            <div className="form-group">
              <label>Address Label</label>
              <input
                type="text"
                required
                value={addrLabel}
                onChange={(e) => setAddrLabel(e.target.value)}
                placeholder="e.g. Home, Studio, Beach House"
              />
            </div>
            <div className="form-group">
              <label>Recipient Name</label>
              <input
                type="text"
                required
                value={addrRecipient}
                onChange={(e) => setAddrRecipient(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              required
              value={addrLineOne}
              onChange={(e) => setAddrLineOne(e.target.value)}
              placeholder="123 Market St, Apt 2"
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                required
                value={addrCity}
                onChange={(e) => setAddrCity(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>State / Region</label>
              <input
                type="text"
                required
                value={addrState}
                onChange={(e) => setAddrState(e.target.value)}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                required
                value={addrPostal}
                onChange={(e) => setAddrPostal(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Contact Phone</label>
              <input
                type="tel"
                required
                value={addrPhone}
                onChange={(e) => setAddrPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="outline-button"
              onClick={() => setIsAddressModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="primary-button">
              Save Address
            </button>
          </div>
        </form>
      </Modal>
    </main>
  )
}
