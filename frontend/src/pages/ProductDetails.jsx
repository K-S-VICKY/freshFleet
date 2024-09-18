import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import data from '../data/data.json';
import ProductInfo from '../components/customer/ProductInfo';
import VendorOfferings from '../components/customer/VendorOfferings';
import SortOptions from '../components/customer/SortOptions';
import useCart from '../hooks/useCart'; // Import useCart hook

const ProductDetails = () => {
  const { name } = useParams();
  const [productData, setProductData] = useState([]);
  const [productInfo, setProductInfo] = useState(null);
  const [sortOption, setSortOption] = useState('price');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);  // Add loading state
  const { addToCart } = useCart(); 
  const userId = localStorage.getItem('customerId'); 

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const url = `${API_BASE_URL}/api/products/name/${name}`;
        const response = await axios.get(url);
        setProductData(response.data);

        // Find product in data.json
        const product = data.ingredients.find((item) => item.name === name);

        setProductInfo(product);

        if (!product) {
          console.error('Product not found in data.json');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);  // Set loading to false when the fetch completes
      }
    };

    fetchProductData();
  }, [name]);

  // Handle sorting changes
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Sort vendor offerings
  const sortVendorOfferings = (offerings) => {
    return offerings.sort((a, b) => {
      let comparison = 0;
      if (sortOption === 'price') {
        comparison = a.pricePerKg - b.pricePerKg;
      } else if (sortOption === 'quantity') {
        comparison = a.totalQuantityWeight - b.totalQuantityWeight;
      } else if (sortOption === 'date') {
        comparison = new Date(a.dateAdded) - new Date(b.dateAdded);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const sortedProductData = sortVendorOfferings(productData);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Product Details</h2>

      {loading ? (
        <p>Loading product details...</p>  // Display loading indicator
      ) : (
        <div className="flex gap-6">
          <ProductInfo productInfo={productInfo} />
          <div>
            <SortOptions
              sortOption={sortOption}
              sortOrder={sortOrder}
              handleSortChange={handleSortChange}
              handleSortOrderChange={handleSortOrderChange}
            />
            <VendorOfferings
              sortedProductData={sortedProductData}
              handleAddToCart={addToCart}
              userId={userId}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
