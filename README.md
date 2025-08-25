# 🌐 Google Sheet Translation Manager

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.0-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/React_Query-5.85.5-FF4154?style=for-the-badge&logo=react-query&logoColor=white" alt="React Query" />
</p>

<p align="center">
  <strong>Một công cụ hiện đại để quản lý bản dịch từ Google Sheets với giao diện đẹp mắt và tính năng đầy đủ.</strong>
</p>

---

## ✨ Tính năng nổi bật

### 📊 **Quản lý Translation**

- 🔗 **Import từ Google Sheets**: Chỉ cần dán link, tự động fetch dữ liệu
- 📁 **Namespace Management**: Tổ chức translations theo từng module/namespace
- 🔍 **Tìm kiếm thông minh**: Search trong tất cả hoặc namespace cụ thể
- 📱 **Responsive Design**: Hoạt động mượt mà trên mọi thiết bị

### 🎯 **Workflow Management**

- ⭐ **History & Favorites**: Lưu lịch sử với khả năng đánh dấu yêu thích
- 🔄 **Real-time Sync**: Cập nhật translations trực tiếp lên Google Sheets
- 📥 **Export JSON**: Tải về file JSON cho từng ngôn ngữ
- 🎛️ **Advanced Filtering**: Lọc theo missing translations, namespace

### 🎨 **Modern UI/UX**

- 💎 **Glass Morphism**: Giao diện hiện đại với hiệu ứng kính mờ
- 🌈 **Soft Color Palette**: Màu sắc dịu dàng, dễ chịu cho mắt
- ⚡ **Smooth Animations**: Transitions mượt mà 300ms
- 🎭 **Hover Effects**: Interactive feedback cho mọi thao tác

---

## 🚀 Demo

### Dashboard Overview

```
┌─────────────────────────────────────────────────┐
│ 📊 My Translation Project                       │
├─────────────────────────────────────────────────┤
│ [2] Namespace  [156] Từ khóa  [23] Chưa hoàn thiện │
├─────────────────────────────────────────────────┤
│ 🔍 Tìm kiếm...     📁 🌐 Toàn bộ namespace  ▼  │
├─────────────────────────────────────────────────┤
│ ☑️ Chỉ hiển thị thiếu bản dịch    [Tải JSON] │
└─────────────────────────────────────────────────┘
```

### Translation Management

```
┌─────────────────────────────────────────────────┐
│ 📁 Home Page Translations                       │
├─────────────────────────────────────────────────┤
│ 🔑 home.title                              ⭐ 🗑️│
│ 🇻🇳 Trang chủ                                   │
│ 🇺🇸 Home Page                                   │
│ 🇯🇵 ホームページ                                │
│                                    [Cập nhật]  │
└─────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### **Frontend**

- **Next.js 15.5.0** - React framework với App Router
- **TypeScript 5** - Type safety và developer experience
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Query 5.85.5** - Server state management

### **UI/UX**

- **Glass Morphism** - Modern design trend
- **Custom Components** - Switch, History Panel, Form components
- **Responsive Design** - Mobile-first approach
- **dayjs** - Lightweight date manipulation

### **Data Management**

- **Google Sheets API** - Direct integration
- **localStorage** - History và favorites persistence
- **React Context** - Global state management

### **Development**

- **React 19** - Latest React features
- **ESLint** - Code quality assurance
- **Hot Reload** - Fast development experience

---

## 📦 Cài đặt

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn** or **pnpm**

### Clone Repository

```bash
git clone https://github.com/yourusername/translate-web-excel.git
cd translate-web-excel
```

### Install Dependencies

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### Environment Setup

Tạo file `.env.local`:

```env
# Google Sheets API configuration (if needed)
GOOGLE_API_KEY=your_google_api_key_here
```

### Run Development Server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

---

## 🎯 Cách sử dụng

### 1. **Import Google Sheet**

1. Mở Google Sheets chứa translations
2. Đảm bảo format: Cột đầu là key, các cột tiếp theo là languages
3. Copy link Google Sheets
4. Dán vào input field và click "Lấy dữ liệu"

### 2. **Quản lý Translations**

- **Tìm kiếm**: Sử dụng search box để tìm keys hoặc translations
- **Filter**: Chọn namespace cụ thể hoặc "Toàn bộ namespace"
- **Edit**: Click vào translation để chỉnh sửa trực tiếp
- **Add new**: Click "Thêm từ khóa" để tạo translation mới

### 3. **Export & History**

- **Export**: Click "Tải JSON" để download files cho từng ngôn ngữ
- **History**: Click icon ⏰ để xem lịch sử Google Sheets đã truy cập
- **Favorites**: Click ⭐ để đánh dấu sheets thường dùng

---

## 📁 Cấu trúc dự án

```
translate-web-excel/
├── src/
│   ├── apis/                     # API clients
│   │   ├── axios-client.ts
│   │   └── sheet/
│   ├── app/                      # Next.js App Router
│   │   ├── api/sheet/           # API routes
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page
│   ├── components/               # React components
│   │   ├── detail/              # Translation detail views
│   │   ├── form/                # Form components
│   │   ├── home/                # Home page components
│   │   └── ui/                  # Reusable UI components
│   │     ├── history/           # History management
│   │     └── switch/            # Custom switch component
│   ├── hooks/                   # Custom React hooks
│   │   ├── useHistory.ts        # History management
│   │   ├── useGlobalSpreadsheetFilter.tsx
│   │   └── useFetchSheet.ts
│   ├── models/                  # TypeScript types
│   ├── providers/               # React Context providers
│   └── util/                    # Utility functions
├── public/                      # Static assets
├── package.json
└── README.md
```

---

## 🎨 Design System

### **Color Palette**

```css
/* Primary Colors */
--primary: #6366f1        /* Indigo */
--primary-light: #8b5cf6  /* Purple */
--secondary: #06b6d4      /* Cyan */
--accent: #ec4899         /* Pink */

/* Surface Colors */
--surface: rgba(255, 255, 255, 0.9)
--border: rgba(148, 163, 184, 0.2)
--shadow: rgba(148, 163, 184, 0.1)

/* Status Colors */
--success: #10b981        /* Emerald */
--warning: #f59e0b        /* Amber */
--error: #ef4444          /* Red */
```

### **Typography**

- **Primary Font**: Geist Sans
- **Mono Font**: Geist Mono
- **Scale**: 12px → 14px → 16px → 18px → 24px → 32px

### **Spacing & Layout**

- **Base Unit**: 4px (0.25rem)
- **Border Radius**: 8px, 12px, 16px, 24px
- **Shadows**: Soft multi-layer shadows
- **Glass Effect**: backdrop-blur(10px) + rgba backgrounds

---

## 🔧 Development

### **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm run lint        # Run ESLint
npm run type-check  # TypeScript type checking
```

### **Development Guidelines**

- **Components**: Tách nhỏ, tái sử dụng, có TypeScript types
- **Hooks**: Custom hooks cho logic phức tạp
- **Styling**: Tailwind CSS classes, custom CSS properties
- **State**: React Query cho server state, Context cho global state

### **Performance Optimizations**

- **Code Splitting**: Automatic với Next.js
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Built-in bundle analyzer
- **Caching**: React Query + localStorage

---

## 🤝 Contributing

Chúng tôi rất hoan nghênh contributions! Xin vui lòng:

1. **Fork** repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

### **Development Setup**

1. Clone và install dependencies
2. Tạo branch mới cho feature
3. Thực hiện thay đổi với proper TypeScript types
4. Test trên nhiều browsers/devices
5. Đảm bảo code passes ESLint

---

## 📄 License

Dự án này được phân phối dưới **MIT License**. Xem file `LICENSE` để biết thêm chi tiết.

---

## 🙏 Acknowledgments

- **Next.js Team** - Framework tuyệt vời
- **Tailwind CSS** - Utility-first CSS
- **Vercel** - Deployment platform
- **Google Sheets API** - Data source
- **dayjs** - Date manipulation library

---

## 📞 Support

Nếu gặp vấn đề hoặc có câu hỏi:

- **GitHub Issues**: [Create an issue](https://github.com/yourusername/translate-web-excel/issues)
- **Email**: your.email@example.com
- **Documentation**: [Wiki](https://github.com/yourusername/translate-web-excel/wiki)

---

<p align="center">
  <strong>Được xây dựng với ❤️ bởi [Your Name]</strong>
</p>

<p align="center">
  <a href="#top">⬆️ Về đầu trang</a>
</p>
