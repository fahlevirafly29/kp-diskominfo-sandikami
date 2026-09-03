import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users,
    UserPlus,
    List,
    CheckCircle2,
    AlertCircle,
    Trash2
} from 'lucide-react';

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
    const [deletingId, setDeletingId] = useState(null);

    const token = localStorage.getItem('token');

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
        }
    };

    // =========================================================
    // MENGAMBIL DATA PENGGUNA
    // =========================================================
    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users', config);

            setUsers(response.data);
        } catch (error) {
            console.error(
                'Gagal mengambil data pengguna:',
                error
            );

            setMessage(
                error.response?.data?.message ||
                'Gagal mengambil data pengguna.'
            );
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // =========================================================
    // HANDLE PERUBAHAN FORM
    // =========================================================
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // =========================================================
    // TAMBAH AKUN
    // =========================================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setMessage('');

        try {
            await axios.post(
                '/api/users',
                formData,
                config
            );

            setMessage(
                'Akun baru berhasil ditambahkan!'
            );

            setFormData({
                name: '',
                username: '',
                password: '',
                role: 'petugas'
            });

            await fetchUsers();

        } catch (error) {
            console.error(
                'Gagal menambahkan akun:',
                error
            );

            const validationErrors =
                error.response?.data?.errors;

            if (validationErrors) {
                const firstError =
                    Object.values(validationErrors)[0]?.[0];

                setMessage(
                    firstError ||
                    'Data yang dimasukkan tidak valid.'
                );
            } else {
                setMessage(
                    error.response?.data?.message ||
                    'Gagal menambahkan akun. Pastikan username belum dipakai.'
                );
            }

        } finally {
            setIsLoading(false);
        }
    };

    // =========================================================
    // HAPUS AKUN
    // =========================================================
    const handleDelete = async (id, name) => {
        const confirmed = window.confirm(
            `Yakin ingin menghapus akun "${name}"?\n\n` +
            `Akun yang dihapus tidak dapat digunakan lagi untuk login.`
        );

        if (!confirmed) {
            return;
        }

        setDeletingId(id);
        setMessage('');

        try {
            await axios.delete(
                `/api/users/${id}`,
                config
            );

            setMessage(
                'Akun berhasil dihapus.'
            );

            await fetchUsers();

        } catch (error) {
            console.error(
                'Gagal menghapus akun:',
                error
            );

            setMessage(
                error.response?.data?.message ||
                'Gagal menghapus akun.'
            );

        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-6">

            {/* =====================================================
                HEADER HALAMAN
            ====================================================== */}
            <div className="flex items-center gap-3 mb-2">

                <div className="p-2.5 bg-blue-50 text-[#0B4A99] rounded-lg">
                    <Users size={24} />
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Manajemen Pengguna
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                        Kelola hak akses dan akun sistem Sandikami.
                    </p>
                </div>

            </div>

            {/* =====================================================
                NOTIFIKASI PESAN
            ====================================================== */}
            {message && (
                <div
                    className={`px-4 py-3 rounded-md border flex items-center gap-3 ${
                        message.includes('berhasil')
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-red-50 border-red-200 text-red-700'
                    }`}
                >

                    {message.includes('berhasil') ? (
                        <CheckCircle2 size={18} />
                    ) : (
                        <AlertCircle size={18} />
                    )}

                    <span className="text-sm font-medium">
                        {message}
                    </span>

                </div>
            )}

            {/* =====================================================
                GRID UTAMA
            ====================================================== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* =================================================
                    FORM TAMBAH PENGGUNA
                ================================================== */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">

                    <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">

                        <UserPlus
                            size={18}
                            className="text-[#0B4A99]"
                        />

                        <h2 className="text-base font-bold text-slate-800">
                            Tambah Akun Baru
                        </h2>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        {/* NAMA */}
                        <div>

                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                Nama Lengkap
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full p-2.5 border border-slate-300 rounded-md focus:border-[#0B4A99] focus:ring-1 focus:ring-[#0B4A99] outline-none text-sm text-slate-700 transition-all"
                            />

                        </div>

                        {/* USERNAME */}
                        <div>

                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                Username
                            </label>

                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full p-2.5 border border-slate-300 rounded-md focus:border-[#0B4A99] focus:ring-1 focus:ring-[#0B4A99] outline-none text-sm text-slate-700 transition-all"
                            />

                        </div>

                        {/* PASSWORD */}
                        <div>

                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full p-2.5 border border-slate-300 rounded-md focus:border-[#0B4A99] focus:ring-1 focus:ring-[#0B4A99] outline-none text-sm text-slate-700 transition-all"
                            />

                        </div>

                        {/* ROLE */}
                        <div>

                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                Role / Hak Akses
                            </label>

                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full p-2.5 border border-slate-300 rounded-md focus:border-[#0B4A99] focus:ring-1 focus:ring-[#0B4A99] outline-none text-sm text-slate-700 bg-white transition-all"
                            >

                                <option value="petugas">
                                    Petugas
                                </option>

                                <option value="admin">
                                    Admin
                                </option>

                                <option value="kadis">
                                    Kepala Dinas
                                </option>

                            </select>

                        </div>

                        {/* BUTTON SIMPAN */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-2 bg-[#0B4A99] hover:bg-[#083670] disabled:bg-slate-400 text-white font-bold py-2.5 rounded-md transition-colors shadow-sm text-sm flex justify-center items-center gap-2"
                        >
                            {isLoading
                                ? 'Menyimpan...'
                                : 'Simpan Akun'}
                        </button>

                    </form>

                </div>

                {/* =================================================
                    TABEL DATA PENGGUNA
                ================================================== */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

                    {/* HEADER TABEL */}
                    <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">

                        <div className="flex items-center gap-2">

                            <List
                                size={18}
                                className="text-slate-500"
                            />

                            <h2 className="text-base font-bold text-slate-800">
                                Daftar Pengguna Sistem
                            </h2>

                        </div>

                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                            Total: {users.length} Akun
                        </span>

                    </div>

                    {/* TABEL */}
                    <div className="overflow-x-auto p-4 pt-0">

                        <table className="w-full text-left border-collapse mt-2 rounded-lg overflow-hidden border border-slate-200">

                            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">

                                <tr>

                                    <th className="px-4 py-3 text-xs">
                                        Nama Lengkap
                                    </th>

                                    <th className="px-4 py-3 text-xs">
                                        Username
                                    </th>

                                    <th className="px-4 py-3 text-xs text-center">
                                        Hak Akses
                                    </th>

                                    <th className="px-4 py-3 text-xs text-center">
                                        Aksi
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-slate-100">

                                {users.map((user) => (

                                    <tr
                                        key={user.id}
                                        className="hover:bg-slate-50 transition-colors"
                                    >

                                        {/* NAMA */}
                                        <td className="px-4 py-3 text-slate-800 text-sm font-medium">
                                            {user.name}
                                        </td>

                                        {/* USERNAME */}
                                        <td className="px-4 py-3 text-slate-500 text-sm">
                                            {user.username}
                                        </td>

                                        {/* ROLE */}
                                        <td className="px-4 py-3 text-sm text-center">

                                            <span
                                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border ${
                                                    user.role === 'admin'
                                                        ? 'bg-red-50 border-red-200 text-red-600'
                                                        : user.role === 'kadis'
                                                        ? 'bg-amber-50 border-amber-200 text-amber-600'
                                                        : 'bg-slate-100 border-slate-200 text-slate-600'
                                                }`}
                                            >
                                                {user.role === 'kadis'
                                                    ? 'Kepala Dinas'
                                                    : user.role}
                                            </span>

                                        </td>

                                        {/* AKSI */}
                                        <td className="px-4 py-3 text-center">

                                            {user.id ===
                                            Number(
                                                localStorage.getItem(
                                                    'user_id'
                                                )
                                            ) ? (

                                                <span className="text-xs text-slate-400">
                                                    Akun Anda
                                                </span>

                                            ) : (

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            user.id,
                                                            user.name
                                                        )
                                                    }
                                                    disabled={
                                                        deletingId ===
                                                        user.id
                                                    }
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-100 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 transition-colors"
                                                >

                                                    <Trash2 size={14} />

                                                    {deletingId ===
                                                    user.id
                                                        ? 'Menghapus...'
                                                        : 'Hapus'}

                                                </button>

                                            )}

                                        </td>

                                    </tr>

                                ))}

                                {/* DATA KOSONG */}
                                {users.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan="4"
                                            className="px-6 py-8 text-center text-slate-400 text-sm"
                                        >
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