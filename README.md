# GOM Web - React Frontend

Frontend cho hệ thống giám định gốm sứ. React 19 + Vite + Tailwind CSS.

## Tính năng

- Authentication (Email/Password, Google OAuth One-Tap)
- Upload ảnh gốm sứ và xem kết quả phân tích
- Lịch sử phân tích
- Chat với AI
- Thanh toán và quản lý token
- Xem dòng gốm (Ceramic Lines)
- Admin dashboard
- Dark mode
- Đa ngôn ngữ (Tiếng Việt, English)
- Animations (Framer Motion, GSAP)
- 3D effects (Three.js)

## Tech stack

- React 19.2.5
- Vite 8.0.10
- React Router 7.14.2 (hash-based)
- Tailwind CSS 3.4.19
- Framer Motion 12.38.0
- GSAP 3.15.0
- Three.js 0.184.0
- i18next 23.16.8
- Axios 1.15.2

## Yêu cầu

- Node.js 18+ (khuyến nghị 20+)
- npm 9+ hoặc yarn 1.22+

## Cài đặt

```bash
cd gom-web
npm install
```

Nếu lỗi peer dependencies:
```bash
npm install --legacy-peer-deps
```

## Cấu hình

Tạo `.env.development`:

```env
VITE_API_BASE=http://127.0.0.1:8000/api
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

Tạo `.env.production`:

```env
VITE_API_BASE=https://api.gom.vn/api
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

Lấy Google Client ID:
1. Google Cloud Console
2. APIs & Services → Credentials
3. Create OAuth 2.0 Client ID
4. Add Authorized JavaScript origins: http://localhost:3000

## Chạy dev server

```bash
npm run dev
```

App chạy tại http://localhost:3000

## Build production

```bash
npm run build
```

Output: `build/`

Serve:
```bash
npm install -g serve
serve -s build -p 3000
```

## Cấu trúc

```
src/
├── components/
│   ├── ui/              # Button, Card, Input, Modal...
│   ├── auth/            # Login, Register...
│   ├── layout/          # Header, Footer, Nav...
│   ├── motion/          # Animated components
│   └── 3d/              # Three.js components
├── pages/               # Home, Debate, History, Profile, Payment, Admin
├── router/              # routes.jsx
├── lib/                 # api.js, constants.js, utils.js
├── hooks/               # Custom hooks
├── contexts/            # React contexts
├── i18n.js             # i18next config
├── App.jsx
├── main.jsx
└── index.css

public/
├── images/
├── models/              # 3D models
└── locales/
    ├── en/translation.json
    └── vi/translation.json
```

## Design System

Colors:
```
navy: #0F265C (primary)
ceramic: #C9D8E6 (accent)
ivory: #F7F2E8 (background)
clay: #8B3A3A (secondary)

Dark mode:
dark-bg: #0A0F1F
dark-surface: #111827
dark-text: #F3F4F6
```

Typography:
- Heading: Playfair Display
- Body: Be Vietnam Pro

Border radius: 12px, 20px, 24px, 32px

## i18n

Thêm ngôn ngữ mới:

1. Tạo `public/locales/{lang}/translation.json`
2. Copy từ `vi/translation.json`
3. Dịch các keys
4. Update `src/i18n.js`

Sử dụng:
```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('welcome')}</h1>;
}
```

## Testing

```bash
npm run test:api
npm run build
npm run preview
```

## Troubleshooting

Module not found:
```bash
rm -rf node_modules package-lock.json
npm install
```

Port 3000 in use:
```javascript
// vite.config.js
export default defineConfig({
  server: { port: 3001 }
});
```

CORS error: Check VITE_API_BASE và backend CORS config

Google OAuth not working:
- Check VITE_GOOGLE_CLIENT_ID
- Check Authorized origins
- Enable cookies

Build fails:
```bash
rm -rf node_modules/.vite
npm run build
```

## Deployment

Vercel:
```bash
npm i -g vercel
vercel
vercel --prod
```

Netlify:
- Build command: `npm run build`
- Publish directory: `build`
- Environment variables: VITE_API_BASE, VITE_GOOGLE_CLIENT_ID

Docker:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "build", "-p", "3000"]
EXPOSE 3000
```

## Tài liệu khác

- src/components/README.md - Component guide
- src/lib/README.md - API usage
