# 🌊 Google Sheet Translation Tool

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.0-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/React_Query-5.85.5-FF4154?style=for-the-badge&logo=react-query&logoColor=white" alt="React Query" />
  <img src="https://img.shields.io/badge/Headless_UI-2.0-662D91?style=for-the-badge&logo=headlessui&logoColor=white" alt="Headless UI" />
  <img src="https://img.shields.io/badge/CVA-0.7.0-FF6B35?style=for-the-badge" alt="Class Variance Authority" />
</p>

<p align="center">
  <strong>🎨 Công cụ quản lý bản dịch từ Google Sheets với luxury design system, ocean blue theme và trải nghiệm người dùng đỉnh cao.</strong>
</p>

---

## ✨ Tính năng nổi bật

### 📊 **Quản lý Translation Thông Minh**

- 🔗 **Import từ Google Sheets**: Chỉ cần dán link, tự động fetch dữ liệu
- 📁 **Namespace Management**: Tổ chức translations theo từng module/namespace
- 🔍 **Smart Search with Debounce**: Tìm kiếm thông minh với autocomplete suggestions
- 📱 **Responsive Design**: Hoạt động mượt mà trên mọi thiết bị
- 🔗 **Direct Sheet Links**: Copy & share links trực tiếp đến specific sheets

### 🎯 **Workflow Management Pro**

- ⭐ **History & Favorites**: Lưu lịch sử với khả năng đánh dấu yêu thích
- 🔄 **Real-time Sync**: Cập nhật translations trực tiếp lên Google Sheets
- 📥 **Export JSON**: Tải về file JSON cho từng ngôn ngữ
- 🎛️ **Advanced Filtering**: Lọc theo selected languages & missing translations
- 📊 **Progress Tracking**: Real-time progress với color-coded status indicators

### 🎨 **Luxury Design System**

- 🌊 **Ocean Blue Theme**: Thiết kế cao cấp với ocean blue color palette
- 💎 **Advanced Glassmorphism**: 3-layer glass effects với backdrop blur
- ✨ **CVA Variants**: Class Variance Authority cho component styling nhất quán
- 🎭 **Smooth Interactions**: Hover effects, loading states, transitions 500ms
- ♿ **Accessibility First**: Headless UI components với WCAG compliance

### 🛠️ **Developer Experience**

- 🎨 **CVA Design System**: Type-safe component variants với IntelliSense
- 🔧 **Headless UI Integration**: Accessible components out-of-the-box
- 🚫 **No Outline Policy**: Clean focus management với custom focus rings
- 📱 **Mobile-First**: Responsive breakpoints với overflow handling
- 🎯 **TypeScript Strict**: Type safety cho mọi component và hook

---

## 🚀 Demo & Repository

**🌐 Live Application**: [locales-brown.vercel.app](https://locales-brown.vercel.app)  
**📦 Source Code**: [github.com/Kamiya025/locales-i18n-with-google-sheets](https://github.com/Kamiya025/locales-i18n-with-google-sheets)

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

### **Core Framework**

- **Next.js 15.5.0** - React framework với App Router + RSC
- **React 19** - Latest React features với concurrent rendering
- **TypeScript 5** - Strict type safety và IntelliSense (96.1% codebase)
- **Node.js 18+** - Modern JavaScript runtime
- **CSS3** - Custom styles và utilities (3.9% codebase)

### **Styling & Design System**

- **Tailwind CSS 4** - Utility-first CSS framework
- **CVA (Class Variance Authority)** - Type-safe component variants
- **clsx + tailwind-merge** - Conditional classNames với conflict resolution
- **Custom CSS Properties** - Ocean blue theme variables
- **Glassmorphism** - Advanced backdrop-blur effects

### **UI Components & Accessibility**

- **Headless UI 2.0** - Unstyled, accessible UI primitives
- **React Hot Toast** - Elegant notification system
- **Custom Components** - Design system với luxury variants
- **WCAG 2.1 Compliance** - Screen reader + keyboard navigation support

### **State Management & Data**

- **React Query 5.85.5** - Server state management với caching
- **React Context** - Global state management
- **Google Sheets API** - Direct spreadsheet integration
- **localStorage** - History, favorites, preferences persistence

### **Date & Utilities**

- **dayjs** - Lightweight date manipulation với i18n
- **Vietnamese locale** - Localized relative time formatting
- **Custom hooks** - useDebounce, useHistory, useGlobalFilter

### **Developer Experience**

- **ESLint** - Code quality assurance
- **TypeScript Strict** - Zero any types policy
- **Hot Reload** - Fast development với HMR
- **Bundle Analysis** - Performance monitoring

---

## 📦 Cài đặt

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn** or **pnpm**

### Clone Repository

```bash
git clone https://github.com/Kamiya025/locales-i18n-with-google-sheets.git
cd locales-i18n-with-google-sheets
```

### Install Dependencies

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

#### 🔧 **Key Dependencies Installed:**

```json
{
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0",
  "@headlessui/react": "^2.0.0",
  "react-hot-toast": "^2.4.1",
  "dayjs": "^1.11.10"
}
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

### 🌐 **Live Demo**

Xem ứng dụng đang chạy tại: **[locales-brown.vercel.app](https://locales-brown.vercel.app)**

### 📊 **Project Stats**

- **Repository**: [github.com/Kamiya025/locales-i18n-with-google-sheets](https://github.com/Kamiya025/locales-i18n-with-google-sheets)
- **Language Composition**:
  - TypeScript: 96.1% (Type-safe codebase)
  - CSS: 3.9% (Custom styling & themes)
- **Total Commits**: 11+
- **Current Version**: v1.0.0

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
locales-i18n-with-google-sheets/
├── src/
│   ├── apis/                     # API clients
│   │   ├── axios-client.ts
│   │   └── sheet/
│   ├── app/                      # Next.js App Router
│   │   ├── api/sheet/           # API routes
│   │   ├── globals.css          # Ocean blue theme + CVA utilities
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page
│   ├── components/               # React components
│   │   ├── detail/              # Translation detail views
│   │   ├── form/                # Form components
│   │   ├── home/                # Home page components
│   │   └── ui/                  # Luxury UI component system
│   │     ├── button/            # CVA Button component
│   │     ├── card/              # Glassmorphism Card variants
│   │     ├── input/             # Form Input with variants
│   │     ├── badge/             # Status Badge components
│   │     ├── dialog/            # Headless UI Dialog wrapper
│   │     ├── tooltip/           # Accessible Tooltip
│   │     ├── history/           # History & Favorites management
│   │     └── footer/            # Personal branding footer
│   ├── hooks/                   # Custom React hooks
│   │   ├── useHistory.ts        # History management with localStorage
│   │   ├── useGlobalSpreadsheetFilter.tsx # Smart filtering
│   │   ├── useFetchSheet.ts     # Google Sheets integration
│   │   └── useDebounce.ts       # Input debouncing
│   ├── lib/                     # Utility libraries
│   │   ├── utils.ts            # cn() utility với clsx + tailwind-merge
│   │   └── variants.ts         # CVA component variants
│   ├── models/                  # TypeScript types & interfaces
│   ├── providers/               # React Context providers
│   └── util/                    # Helper functions
├── public/                      # Static assets
├── package.json
└── README.md
```

---

## 🎨 Luxury Design System

### **Ocean Blue Color Palette**

```css
/* Ocean Blue Theme - High Contrast & Readable 🌊 */
--primary: #0369a1; /* Ocean Blue */
--primary-light: #0ea5e9; /* Sky Blue */
--primary-dark: #0c4a6e; /* Deep Ocean */
--primary-accent: #06b6d4; /* Cyan Blue */

/* Secondary Blues */
--secondary: #3b82f6; /* Bright Blue */
--secondary-light: #60a5fa; /* Light Blue */
--tertiary: #1e40af; /* Royal Blue */

/* Surface & Glass Effects - High Contrast */
--surface: rgba(255, 255, 255, 0.95);
--surface-hover: rgba(255, 255, 255, 0.98);
--surface-blue: rgba(240, 249, 255, 0.9);
--surface-blue-hover: rgba(224, 242, 254, 0.95);

/* Borders & Shadows */
--border: rgba(59, 130, 246, 0.15);
--border-light: rgba(147, 197, 253, 0.3);
--shadow: rgba(59, 130, 246, 0.08);
--shadow-blue: rgba(59, 130, 246, 0.15);

/* Status Colors with Blue Tints */
--success: #059669;
--warning: #d97706;
--error: #dc2626;
--info: #0284c7;
```

### **CVA Variant System**

```typescript
// Example: Button variants with type safety
const buttonVariants = cva(
  "font-medium rounded-xl transition-all duration-500 ease-out",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600",
        glass: "bg-white/80 backdrop-blur-xl border border-white/50",
        outline: "bg-white/60 backdrop-blur-xl border-2 border-slate-300",
      },
      size: {
        sm: "px-4 py-2.5 text-sm",
        md: "px-6 py-3.5 text-base",
        lg: "px-8 py-4.5 text-lg",
      },
    },
  }
)
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

- **Components**: CVA variants với type-safe props, Headless UI integration
- **Styling**: CVA + Tailwind CSS, cn() utility cho className merging
- **Accessibility**: Headless UI components, WCAG 2.1 compliance, semantic HTML
- **Types**: Strict TypeScript, zero any types, variant prop typing
- **State**: React Query + Context, selected language filtering
- **Hooks**: Custom hooks với debouncing, local storage persistence

### **Performance Optimizations**

- **Code Splitting**: Automatic với Next.js + React 19
- **CVA Tree Shaking**: Only load used component variants
- **tailwind-merge**: Efficient className deduplication
- **React Query Caching**: Smart server state management
- **Local Storage**: History & preferences persistence
- **Debounced Search**: Reduced API calls với 300ms delay

### **Accessibility Features**

- **Keyboard Navigation**: Full keyboard support với Headless UI
- **Screen Reader**: ARIA labels, semantic HTML, focus management
- **Color Contrast**: WCAG AA compliance với ocean blue theme
- **Focus Indicators**: Custom focus rings thay vì browser outlines
- **Touch Targets**: 44px minimum cho mobile accessibility
- **Motion**: Respects `prefers-reduced-motion` user preference

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

- **GitHub Issues**: [Create an issue](https://github.com/Kamiya025/locales-i18n-with-google-sheets/issues)
- **Email**: hawk01525@gmail.com

---

<p align="center">
  <strong>🎨 Được xây dựng với passion & precision bởi <a href="https://github.com/Kamiya025">Quang Hưng (Kamiya)</a></strong>
</p>

<p align="center">
  <em>Frontend Developer specializing in React, Next.js & luxury UI/UX design</em>
</p>

<p align="center">
  <a href="#top">⬆️ Về đầu trang</a>
</p>
