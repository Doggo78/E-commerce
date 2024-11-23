import ProductItem from './ProductItem';

export default function ProductList({ products }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.length > 0 ? (
        products.map(product => <ProductItem key={product.id} product={product} />)
      ) : (
        <p className="text-gray-500">No hay productos que coincidan con la categoría seleccionada.</p>
      )}
    </div>
  );
}
