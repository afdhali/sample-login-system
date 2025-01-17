# Sample Login NextJs

Proyek ini adalah implementasi sistem login menggunakan Next.js 14 dengan berbagai fitur modern dan keamanan yang baik.

## Spesifikasi Proyek

### Teknologi yang Digunakan

- Next.js 14
- TypeScript
- Prisma (ORM)
- SQLite (Database)
- NextAuth.js (Sistem Autentikasi - Client Server & Session Client) -> Bukan External Auth Service Provider
- React Query (State Management & Data API Fetching)
- Zod (Validasi)
- React Hook Form (Form khusus React Compoonent dengan Kustomisasi styling dan integrasi validasi dengan mudah)
- Tailwind CSS
- Lucide React (Icons)
- React Toastify (Notifications)

### Fitur

- Login dengan email dan password
- Registrasi user baru
- Session management
- Protected routes
- Form validation
- Error handling
- Responsive design
- Loading states
- Toast notifications
- Session tracking

## Cara Instalasi

1. Clone repository

```bash
git clone [url-repository]
cd sample-login
```

2. Install dependencies

```bash
npm install
```

3. Setup environment variables
   Buat file `.env` di root project dan isi dengan:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

4. Setup database

```bash
npx prisma generate
npx prisma db push
```

## Konfigurasi

### Database

1. Database SQLite akan otomatis dibuat di folder `/prisma` dengan nama `dev.db`
2. Schema database dapat dilihat dan diubah di `prisma/schema.prisma`

### NextAuth

1. Konfigurasi NextAuth ada di `src/app/api/auth/[...nextauth]/auth.config.ts`
2. Settings untuk session dan JWT ada di file yang sama

### Form Validation

1. Schema validasi ada di `src/schemas/auth.ts`
2. Bisa disesuaikan sesuai kebutuhan

## Cara Menjalankan

1. Development mode

```bash
npm run dev
```

2. Production build

```bash
npm run build
npm start
```

## Monitoring Database

1. Menggunakan Prisma Studio

```bash
npx prisma studio
```

- Buka browser dan akses `http://localhost:5555`
- Di sini Anda bisa:
  - Melihat semua data
  - Menambah data
  - Mengubah data
  - Menghapus data
  - Melakukan query

2. Melihat Database SQLite langsung

- Install SQLite Browser (https://sqlitebrowser.org/)
- Buka file `prisma/dev.db`

## Struktur Folder

```
/src
  /app
    /api  ---> Backend Server (Next JS Route Handler API)
      /users/[id]
      /auth
        /[...nextauth]
        /session-tracking
        /signup
    /auth ---> Halaman Auth
      /login
      /signup
  /components
    /ui
    LoginForm.tsx
    SignUpForm.tsx
  /lib
    /prisma.ts ---> Konfigurasi Prisma ORM
  /hooks
    useAuth.ts (sudah include hooks untuk Login, Logout dan Session yang reusable)
  /types
/prisma
  schema.prisma
```

## Keamanan

- Password di-hash menggunakan bcrypt
- Session menggunakan JWT
- Protected routes dengan middleware
- Form validation di client dan server
- Error handling yang aman
- Session tracking untuk device monitoring

## Troubleshooting

1. Error Database

```bash
# Reset database
npx prisma migrate reset

# Generate ulang client
npx prisma generate
```

2. Error Session

- Hapus cookies di browser
- Pastikan NEXTAUTH_SECRET sudah benar
- Cek file .env

3. Error Prisma Studio

```bash
# Restart Prisma Studio
npx prisma studio --browser none
```

## Catatan Tambahan

- Background image harus diletakkan di `/public/images/`
- Pastikan port 3000 tidak digunakan aplikasi lain
- Untuk development, gunakan email yang valid formatnya
- Password minimal 6 karakter, harus ada huruf besar, angka, dan karakter khusus
