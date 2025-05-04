'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import api from '@/utils/api';
import Swal from 'sweetalert2';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const CreateCategoryPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name || name.length < 3) {
      setErrors({ name: 'Nama kategori minimal 3 karakter' });
      Swal.fire({
        icon: 'error',
        title: 'Validasi Gagal',
        text: 'Nama kategori minimal 3 karakter',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await api.post('/categories', { name });
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Kategori berhasil dibuat',
        confirmButtonColor: '#3085d6',
      });
      router.push('/admin/categories');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: error.response?.data?.message || 'Gagal membuat kategori',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== 'Admin') return null;

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen py-10 px-4 bg-gray-100"
        style={{
          backgroundImage: 'url("https://sso.uns.ac.id/module.php/uns/img/symphony.png")',
          backgroundRepeat: 'repeat',
        }}
      >
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
          <div className="px-6 py-5">
            <p className="text-3xl font-bold text-blue-800">TAMBAH KATEGORI</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="border-y border-gray-200 px-6 py-4 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Kategori
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama kategori"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({});
                    }}
                    className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center border-gray-200 px-6 py-4">
              <Link
                href="/admin/categories"
                className="inline-flex items-center px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded-md transition"
              >
                Kembali
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateCategoryPage;