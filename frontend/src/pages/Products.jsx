import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros desde URL
  const selectedCategory = searchParams.get('categoria') || '';
  const selectedSubcategory = searchParams.get('subcategoria') || '';
  const searchTerm = searchParams.get('buscar') || '';
  const sortBy = searchParams.get('orden') || 'destacados';

  // 1. Cargar Categorías
  useEffect(() => {
    axios.get(`${API_URL}/categories`)
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error al cargar categorías:", err));
  }, []);

  // 2. Cargar Productos según filtros
  useEffect(() => {
    setLoading(true);
    const params = {};

    if (selectedCategory) {
      params.category = selectedCategory;
    }
    if (searchTerm) {
      params.search = searchTerm;
    }
    if (sortBy === 'precio_asc') {
      params.sort = 'price_asc';
    } else if (sortBy === 'precio_desc') {
      params.sort = 'price_desc';
    }

    axios.get(`${API_URL}/products`, { params })
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setError("Hubo un problema al cargar los productos. Por favor intenta de nuevo.");
        setLoading(false);
      });
  }, [selectedCategory, searchTerm, sortBy]);

  // Subcategorías de la categoría padre seleccionada
  const activeParentCategory = useMemo(() => {
    if (!selectedCategory) return null;
    return categories.find(c => c.name.toLowerCase() === selectedCategory.toLowerCase());
  }, [categories, selectedCategory]);

  // Filtrado adicional por subcategoría en el frontend
  const filteredProducts = useMemo(() => {
    if (!selectedSubcategory) return products;
    return products.filter(p => p.category?.name?.toLowerCase() === selectedSubcategory.toLowerCase());
  }, [products, selectedSubcategory]);

  // Manejo de actualización de filtros en URL
  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    // Si cambia la categoría principal, reseteamos la subcategoría
    if (key === 'categoria') {
      newParams.delete('subcategoria');
    }

    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  // Título dinámico
  const getPageTitle = () => {
    if (searchTerm) return `Resultados para "${searchTerm}"`;
    if (selectedCategory === 'Hombre') return 'Colección Hombre';
    if (selectedCategory === 'Mujer') return 'Colección Mujer';
    if (selectedCategory === 'Accesorios') return 'Accesorios & Complementos';
    return 'Todos los Productos';
  };

  const formatPrice = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return val;
    return '$' + num.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  const getBadgeClass = (prod) => {
    const parentName = prod.category?.parent_name?.toLowerCase() || '';
    const catName = prod.category?.name?.toLowerCase() || '';
    if (parentName.includes('hombre') || catName.includes('hombre')) return 'hombre';
    if (parentName.includes('mujer') || catName.includes('mujer')) return 'mujer';
    return 'accesorios';
  };

  const getBadgeLabel = (prod) => {
    return prod.category?.parent_name || prod.category?.name || 'Colección';
  };

  return (
    <div className="container" style={{ paddingTop: '1.25rem' }}>
      <h1 className="section-title" style={{ marginTop: '1.875rem', marginBottom: '0.9375rem' }}>
        {getPageTitle()}
      </h1>

      {/* PESTAÑAS PRINCIPALES: Todos | Mujer | Hombre | Accesorios */}
      <div className="category-tabs-container">
        <button
          className={`category-tab-btn ${!selectedCategory ? 'active' : ''}`}
          onClick={() => updateFilter('categoria', '')}
        >
          Todos
        </button>
        <button
          className={`category-tab-btn ${selectedCategory === 'Mujer' ? 'active' : ''}`}
          onClick={() => updateFilter('categoria', 'Mujer')}
        >
          Mujer
        </button>
        <button
          className={`category-tab-btn ${selectedCategory === 'Hombre' ? 'active' : ''}`}
          onClick={() => updateFilter('categoria', 'Hombre')}
        >
          Hombre
        </button>
        <button
          className={`category-tab-btn ${selectedCategory === 'Accesorios' ? 'active' : ''}`}
          onClick={() => updateFilter('categoria', 'Accesorios')}
        >
          Accesorios
        </button>
      </div>

      {/* SUBCATEGORÍAS EN FORMA DE PÍLDORAS */}
      {activeParentCategory && activeParentCategory.subcategories?.length > 0 && (
        <div className="subcat-pills-container">
          <button
            className={`subcat-pill-btn ${!selectedSubcategory ? 'active' : ''}`}
            onClick={() => updateFilter('subcategoria', '')}
          >
            Todas
          </button>
          {activeParentCategory.subcategories.map(sub => (
            <button
              key={sub.id}
              className={`subcat-pill-btn ${selectedSubcategory === sub.name ? 'active' : ''}`}
              onClick={() => updateFilter('subcategoria', sub.name)}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      {/* BARRA DE HERRAMIENTAS: CONTADOR, BUSCADOR Y ORDENAMIENTO */}
      <div className="filters-toolbar">
        <div className="filters-counter">
          {loading ? 'Cargando catálogo...' : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'producto' : 'productos'}`}
          {(selectedCategory || selectedSubcategory || searchTerm) && (
            <button
              onClick={clearAllFilters}
              style={{
                marginLeft: '0.9375rem',
                background: 'none',
                border: 'none',
                color: 'var(--lulu-red)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                textDecoration: 'underline'
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="filters-actions">
          {/* BUSCADOR */}
          <div className="search-box-wrapper">
            <input
              type="text"
              placeholder="Buscar prendas..."
              value={searchTerm}
              onChange={(e) => updateFilter('buscar', e.target.value)}
              className="search-box-input"
            />
            {searchTerm && (
              <button
                onClick={() => updateFilter('buscar', '')}
                className="search-box-clear"
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>

          {/* SELECT DE ORDEN */}
          <select
            value={sortBy}
            onChange={(e) => updateFilter('orden', e.target.value)}
            className="sort-select"
          >
            <option value="destacados">Destacados</option>
            <option value="precio_asc">Precio: Menor a Mayor</option>
            <option value="precio_desc">Precio: Mayor a Menor</option>
          </select>
        </div>
      </div>

      {loading && <div className="loader"></div>}

      {error && (
        <div style={{ textAlign: 'center', margin: '2.5rem 0' }}>
          <p className="error-message">{error}</p>
          <button className="btn btn-outline" onClick={() => window.location.reload()} style={{ marginTop: '0.9375rem' }}>
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', margin: '3.75rem 0', padding: '2.5rem', background: '#fafafa', borderRadius: '0.5rem' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.625rem' }}>No encontramos productos con estos filtros.</p>
          <p style={{ color: 'var(--lulu-dark-gray)', marginBottom: '1.25rem' }}>Prueba seleccionando otra categoría o limpiando la búsqueda.</p>
          <button className="btn btn-black" onClick={clearAllFilters}>
            Ver Todo el Catálogo
          </button>
        </div>
      )}

      {/* GRILLA DE PRODUCTOS */}
      {!loading && !error && filteredProducts.length > 0 && (
        <div className="product-grid" style={{ padding: '0 0 3.75rem' }}>
          {filteredProducts.map(product => {
            // Extraer colores únicos de las variantes
            const uniqueColors = product.variants ? Array.from(
              new Map(product.variants.map(v => [v.color, v.hex_color])).entries()
            ).map(([name, hex]) => ({ name, hex })) : [];

            return (
              <Link to={`/productos/${product.id}`} key={product.id} className="product-card">
                <div className="product-img-wrapper">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} loading="lazy" />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#999', fontSize: '0.8rem' }}>Sin imagen</span>
                    </div>
                  )}
                </div>

                <div className="product-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`badge-tag ${getBadgeClass(product)}`}>
                      {getBadgeLabel(product)}
                    </span>
                    <span className="product-brand" style={{ fontSize: '0.75rem' }}>
                      {product.category?.name}
                    </span>
                  </div>

                  <h3 className="product-name">{product.name}</h3>
                  <span className="product-price">{formatPrice(product.price)}</span>

                  {/* MINI SWATCHES DE COLORES DISPONIBLES */}
                  {uniqueColors.length > 0 && (
                    <div className="color-dots-wrapper" title={`Colores: ${uniqueColors.map(c => c.name).join(', ')}`}>
                      {uniqueColors.slice(0, 5).map((c, i) => (
                        <span
                          key={i}
                          className="color-dot"
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                      {uniqueColors.length > 5 && (
                        <span style={{ fontSize: '0.7rem', color: '#888' }}>+{uniqueColors.length - 5}</span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Products;
