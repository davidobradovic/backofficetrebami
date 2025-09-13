# Ondemand Admin Analytics - Backend Integration Guide

## Pregled

Ovaj admin panel je sada potpuno integrisan sa `finalbackend` API-jem. Svi API pozivi su centralizovani u `src/utils/api.js` fajlu i povezani sa odgovarajućim backend endpoint-ima.

## Struktura Backend-a

Backend se nalazi u `finalbackend/` folderu i sadrži:

### Dostupni API Endpoint-i:

1. **Users API** (`/api/users`)
   - `GET /` - Svi korisnici (admin only)
   - `GET /:id` - Korisnik po ID-u
   - `GET /stats/overview` - Statistike korisnika
   - `POST /` - Kreiranje korisnika
   - `PUT /:id` - Ažuriranje korisnika
   - `DELETE /:id` - Brisanje korisnika
   - `POST /:id/ban` - Ban/Unban korisnika

2. **Workers API** (`/api/workers`)
   - `GET /` - Svi radnici
   - `GET /:id` - Radnik po ID-u
   - `GET /nearby` - Radnici u blizini
   - `GET /stats/overview` - Statistike radnika
   - `POST /` - Kreiranje radnika
   - `PUT /:id` - Ažuriranje radnika
   - `DELETE /:id` - Brisanje radnika
   - `POST /:id/toggle-availability` - Promena dostupnosti
   - `POST /:id/toggle-verification` - Promena verifikacije

3. **Categories API** (`/api/categories`)
   - `GET /` - Sve kategorije
   - `GET /:id` - Kategorija po ID-u
   - `GET /stats/overview` - Statistike kategorija
   - `POST /` - Kreiranje kategorije
   - `PUT /:id` - Ažuriranje kategorije
   - `DELETE /:id` - Brisanje kategorije

4. **Subcategories API** (`/api/subcategories`)
   - `GET /` - Sve podkategorije
   - `GET /:id` - Podkategorija po ID-u
   - `GET /category/:categoryId` - Podkategorije po kategoriji
   - `GET /stats/overview` - Statistike podkategorija
   - `POST /` - Kreiranje podkategorije
   - `PUT /:id` - Ažuriranje podkategorije
   - `DELETE /:id` - Brisanje podkategorije

5. **Orders API** (`/api/orders`)
   - `GET /` - Sve narudžbe
   - `GET /:id` - Narudžba po ID-u
   - `GET /number/:orderNumber` - Narudžba po broju
   - `GET /customer/:customerId` - Narudžbe po kupcu
   - `GET /worker/:workerId` - Narudžbe po radniku
   - `GET /stats/overview` - Statistike narudžbi
   - `POST /` - Kreiranje narudžbe
   - `PUT /:id` - Ažuriranje narudžbe
   - `DELETE /:id` - Brisanje narudžbe
   - `POST /:id/status` - Promena statusa

6. **Messages API** (`/api/messages`)
   - `GET /` - Sve poruke
   - `GET /:id` - Poruka po ID-u
   - `GET /order/:orderId` - Poruke po narudžbi
   - `GET /conversation/:userId1/:userId2/:orderId` - Konverzacija
   - `GET /user/:userId/unread-count` - Broj nepročitanih poruka
   - `GET /stats/overview` - Statistike poruka
   - `POST /` - Kreiranje poruke
   - `PUT /:id` - Ažuriranje poruke
   - `DELETE /:id` - Brisanje poruke
   - `POST /:id/read` - Označavanje kao pročitano
   - `POST /order/:orderId/user/:userId/read-all` - Označavanje svih kao pročitano

7. **Dashboard API** (`/api/dashboard`)
   - `GET /overview` - Pregled dashboard-a
   - `GET /revenue` - Analitika prihoda
   - `GET /users` - Analitika korisnika
   - `GET /orders` - Analitika narudžbi
   - `GET /geographic` - Geografska analitika
   - `GET /performance` - Metrije performansi

8. **Advertisements API** (`/api/advertisements`)
   - `GET /` - Svi oglasi (admin only)
   - `GET /:id` - Oglas po ID-u
   - `GET /active` - Aktivni oglasi (public)
   - `GET /stats/overview` - Statistike oglasa
   - `POST /` - Kreiranje oglasa
   - `PUT /:id` - Ažuriranje oglasa
   - `DELETE /:id` - Brisanje oglasa
   - `POST /:id/toggle-status` - Promena statusa
   - `POST /:id/impression` - Snimanje impresije
   - `POST /:id/click` - Snimanje klika

9. **Upload API** (`/api/upload`)
   - `POST /general` - Opšti upload fajlova
   - `POST /multiple` - Upload više fajlova
   - `POST /profile` - Upload profil slike
   - `POST /category` - Upload ikone kategorije
   - `POST /advertisement` - Upload slike oglasa

## Pokretanje

### 1. Backend (finalbackend)

```bash
cd finalbackend
npm install
npm run dev
```

Backend će se pokrenuti na `http://localhost:5000`

### 2. Frontend (admin panel)

```bash
npm install
npm run dev
```

Frontend će se pokrenuti na `http://localhost:5173`

## Konfiguracija

### Environment Variables (Backend)

Kreirajte `.env` fajl u `finalbackend/` folderu:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

### API Base URL (Frontend)

U `src/utils/api.js` fajlu, `API_BASE_URL` je postavljen na:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## Autentifikacija

Svi API pozivi (osim javnih endpoint-a) zahtevaju JWT token u Authorization header-u:
```
Authorization: Bearer <token>
```

Token se čuva u localStorage i automatski se dodaje u sve zaštićene API pozive.

## Upload Funkcionalnost

Upload endpoint-i su konfigurisani za:
- **Profile slike**: Maksimalno 5MB, samo slike
- **Kategorije ikone**: Maksimalno 10MB, slike i dokumenti
- **Oglasi slike**: Maksimalno 10MB, slike i dokumenti
- **Opšti upload**: Maksimalno 10MB, slike i dokumenti

## Error Handling

Svi API pozivi imaju ugrađeno error handling:
- Automatsko prikazivanje grešaka u konzoli
- Fallback na mock podatke ako API ne radi
- User-friendly error poruke

## Testiranje

1. Pokrenite backend server
2. Pokrenite frontend aplikaciju
3. Otvorite browser na `http://localhost:5173`
4. Testirajte različite funkcionalnosti:
   - Upravljanje korisnicima
   - Upravljanje radnicima
   - Upravljanje kategorijama
   - Dashboard analitika
   - Upload fajlova

## Swagger Dokumentacija

Backend API dokumentacija je dostupna na:
`http://localhost:5000/api-docs`

## Health Check

Backend health check endpoint:
`http://localhost:5000/health`

## Napomene

- Svi API pozivi su asinhroni i koriste async/await
- Error handling je implementiran u svim komponentama
- Mock podaci se koriste kao fallback ako API ne radi
- Upload funkcionalnost je potpuno integrisana
- CORS je konfigurisan za development i production
