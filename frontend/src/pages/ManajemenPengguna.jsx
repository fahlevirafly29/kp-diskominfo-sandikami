import { useState, useEffect } from 'react';
import axios from 'axios';

const ManajemenPengguna = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        role: 'petugas'
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const token = localStorage.getItem('token'); 

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/users', config);
            setUsers(response.data);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            await axios.post('http://localhost:8000/api/users', formData, config);
            setMessage('Akun baru berhasil ditambahkan!');
            setFormData({ name: '', username: '', password: '', role: 'petugas' });
            fetchUsers(); 
        } catch (error) {
            setMessage(error.response?.data?.message || 'Gagal menambahkan akun. Pastikan username belum dipakai.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="border-b border-gray-200 pb-5 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h1>
                <p className="text-gray-500 text-sm mt-1">Kelola hak akses dan akun sistem Sandikami.</p>
            </div>

            {message && (
                <div className={`p-4 mb-6 rounded border ${message.includes('berhasil') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Tambah Pengguna */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 h-fit">
                    <h2 className="text-lg font-semibold text-gray-800 mb-5">Tambah Akun Baru</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input type="text" name="username" value={formData.username} onChange={handleChange} required
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role / Hak Akses</label>
                            <select name="role" value={formData.role} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                                <option value="petugas">Petugas</option>
                                <option value="admin">Admin</option>
                                <option value="kadis">Kepala Dinas</option>
                            </select>
                        </div>
                        <button type="submit" disabled={isLoading}
                            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded transition-colors">
                            {isLoading ? 'Menyimpan...' : 'Simpan Akun'}
                        </button>
                    </form>
                </div>

                {/* Tabel Data Pengguna */}
                <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 bg-white">
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Nama</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Username</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-800 text-sm">{user.name}</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{user.username}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2.5 py-1 rounded-sm text-xs font-medium border
                                                ${user.role === 'admin' ? 'bg-red-50 border-red-200 text-red-600' : 
                                                  user.role === 'kadis' ? 'bg-purple-50 border-purple-200 text-purple-600' : 
                                                  'bg-blue-50 border-blue-200 text-blue-600'}`}>
                                                {user.role.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-8 text-center text-gray-500 text-sm">
                                            Belum ada data pengguna.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManajemenPengguna;