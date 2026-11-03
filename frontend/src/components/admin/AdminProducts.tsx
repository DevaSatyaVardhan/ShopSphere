import React, { useState } from 'react'
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react'
import type { Product } from '../../types'
import { Modal } from '../common/Modal'
import { CATEGORIES } from '../../data/mockData'
import { useToast } from '../../context/ToastContext'

interface AdminProductsProps {
  products: Product[]
  onAddProduct: (product: Omit<Product, 'id'>) => void
  onUpdateProduct: (product: Product) => void
  onDeleteProduct: (id: number) => void
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('All pieces')

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  // Add form fields
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Apparel')
  const [price, setPrice] = useState('')
  const [oldPrice, setOldPrice] = useState('')
  const [stock, setStock] = useState('')
  const [image, setImage] = useState('')
  const [description, setDescription] = useState('')

  const resetForm = () => {
    setName('')
    setCategory('Apparel')
    setPrice('')
    setOldPrice('')
    setStock('')
    setImage('')
    setDescription('')
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !price || !image.trim() || !stock) {
      showToast('Please fill out required fields', undefined, 'error')
      return
    }

    onAddProduct({
      name: name.trim(),
      category,
      price: parseFloat(price),
      oldPrice: oldPrice ? parseFloat(oldPrice) : undefined,
      stock: parseInt(stock, 10),
      image: image.trim(),
      images: [image.trim()],
      description: description.trim() || 'A thoughtful piece made with care.',
      rating: 5.0,
      reviewCount: 0,
    })

    showToast('Product created', `${name} added to catalog`, 'success')
    resetForm()
    setIsAddOpen(false)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    onUpdateProduct(editingProduct)
    showToast('Product updated', `${editingProduct.name} has been updated`, 'success')
    setEditingProduct(null)
  }

  const filtered = products.filter((p) => {
    const matchCat = selectedCat === 'All pieces' || p.category === selectedCat
    const matchQuery = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchQuery
  })

  return (
    <div className="admin-content-inner">
      <div className="admin-section-header">
        <div>
          <span className="eyebrow">Inventory Catalog</span>
          <h1 className="admin-page-title">Manage Products</h1>
        </div>
        <button className="primary-button" onClick={() => setIsAddOpen(true)}>
          <Plus size={16} /> Add New Piece
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        <div className="admin-search-input">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search products by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="admin-select"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th className="align-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-table-cell">
                  <Package size={24} /> No products found matching your search.
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img src={product.image} alt={product.name} className="table-thumbnail" />
                  </td>
                  <td>
                    <strong className="table-item-title">{product.name}</strong>
                    {product.badge && (
                      <span className="table-badge">{product.badge}</span>
                    )}
                  </td>
                  <td>{product.category}</td>
                  <td>
                    <strong>${product.price.toFixed(2)}</strong>
                    {product.oldPrice && (
                      <del className="table-old-price">${product.oldPrice.toFixed(2)}</del>
                    )}
                  </td>
                  <td>
                    <span className={`stock-tag ${product.stock < 10 ? 'low' : 'ok'}`}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td>
                    ★ {product.rating.toFixed(1)} ({product.reviewCount})
                  </td>
                  <td className="align-right">
                    <button
                      className="table-action-btn edit"
                      onClick={() => setEditingProduct({ ...product })}
                      title="Edit Product"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      className="table-action-btn delete"
                      onClick={() => setDeleteConfirmId(product.id)}
                      title="Delete Product"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Product">
        <form onSubmit={handleCreateSubmit} className="admin-form">
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Minimalist Linen Shirt"
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.slice(1).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Stock Units *</label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="20"
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Sale Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="75.00"
              />
            </div>

            <div className="form-group">
              <label>Original Price ($) (Optional)</label>
              <input
                type="number"
                step="0.01"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                placeholder="95.00"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL *</label>
            <input
              type="url"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short poetic description of materials, origin, and fit..."
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="outline-button"
              onClick={() => setIsAddOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="primary-button">
              Save Piece
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Product Modal */}
      {editingProduct && (
        <Modal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          title={`Edit ${editingProduct.name}`}
        >
          <form onSubmit={handleEditSubmit} className="admin-form">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                required
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, name: e.target.value })
                }
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, category: e.target.value })
                  }
                >
                  {CATEGORIES.slice(1).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Stock Units</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={editingProduct.stock}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      stock: parseInt(e.target.value, 10) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Old Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.oldPrice ?? ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      oldPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>Badge</label>
              <input
                type="text"
                value={editingProduct.badge ?? ''}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    badge: e.target.value || undefined,
                  })
                }
                placeholder="e.g. New, −20%, Popular"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                rows={3}
                value={editingProduct.description}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, description: e.target.value })
                }
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="outline-button"
                onClick={() => setEditingProduct(null)}
              >
                Cancel
              </button>
              <button type="submit" className="primary-button">
                Update Piece
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <Modal
          isOpen={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId(null)}
          title="Confirm Deletion"
        >
          <div className="delete-modal-content">
            <p>
              Are you sure you want to remove this piece from the catalog? This action cannot be undone.
            </p>
            <div className="form-actions">
              <button
                className="outline-button"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
              <button
                className="delete-button"
                onClick={() => {
                  onDeleteProduct(deleteConfirmId)
                  setDeleteConfirmId(null)
                  showToast('Product deleted', undefined, 'info')
                }}
              >
                Delete Piece
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
