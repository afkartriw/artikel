'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import api from '@/utils/api';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const EditCategoryPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth and fetch category data
  useEffect(() => {
    if (user?.role !== 'Admin') {
      router.push('/');
      return;
    }

    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/categories/${id}`);
        setFormData({
          name: data.data.name,
        });
      } catch (error) {
        toast.error('Failed to fetch category data');
        console.error('Error:', error);
        router.push('/admin/categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [id, user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Category name must be at least 3 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
      };

      const { data } = await api.put(`/categories/${id}`, payload);

      toast.success('Category updated successfully');
      router.push('/admin/categories');
    } catch (error) {
      console.error('Update error:', error.response?.data || error);
      
      const errorMessage = error.response?.data?.message || 
                         'Failed to update category. It may be in use by articles.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== 'Admin') return null;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Category</h1>
        <Link
          href="/admin/categories"
          className="text-gray-600 hover:text-gray-800"
        >
          Back to Categories
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter category name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/categories')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md text-white ${
                isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Updating...' : 'Update Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryPage;