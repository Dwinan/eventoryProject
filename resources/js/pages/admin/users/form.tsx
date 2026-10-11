import { Head, Link, useForm } from '@inertiajs/react';
import type { User } from '@/types/domain';

interface Props {
    user: User | null;
}

export default function Form({ user }: Props) {
    const isEdit = user !== null;

    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        role: user?.role ?? 'general',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/users/${user.id}`);
        } else {
            post('/admin/users');
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'} />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'}
                    </h1>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                        {isEdit
                            ? 'Perbarui data akun dan peran akses pengguna.'
                            : 'Buat akun pengguna baru di sistem Eventory.'}
                    </p>
                </div>

                <div className="max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium"
                            >
                                Nama Lengkap
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="mis. John Doe"
                                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium"
                            >
                                Alamat Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                placeholder="user@kampus.ac.id"
                                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="role"
                                className="block text-sm font-medium"
                            >
                                Peran Akses (Role)
                            </label>
                            <select
                                id="role"
                                value={data.role}
                                onChange={(e) =>
                                    setData(
                                        'role',
                                        e.target.value as
                                            | 'general'
                                            | 'organizer'
                                            | 'administrator',
                                    )
                                }
                                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                            >
                                <option value="general">
                                    Mahasiswa (General)
                                </option>
                                <option value="organizer">
                                    Ormawa (Organizer)
                                </option>
                                <option value="administrator">
                                    Administrator
                                </option>
                            </select>
                            {errors.role && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.role}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium"
                            >
                                Password{' '}
                                {isEdit && '(Kosongkan jika tidak diubah)'}
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                placeholder={
                                    isEdit ? '••••••••' : 'Minimal 8 karakter'
                                }
                                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="block text-sm font-medium"
                            >
                                Konfirmasi Password
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                placeholder={
                                    isEdit ? '••••••••' : 'Ulangi password'
                                }
                                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                            />
                        </div>

                        <div className="flex justify-end gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                            <Link
                                href="/admin/users"
                                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                            >
                                {processing
                                    ? 'Menyimpan...'
                                    : isEdit
                                      ? 'Perbarui Pengguna'
                                      : 'Simpan Pengguna'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
