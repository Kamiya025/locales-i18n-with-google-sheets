# Hướng dẫn Cấu hình OAuth Consent Screen

**Dành cho Google Sheet Translation Tool**

---

## 🎯 Tổng quan

Hướng dẫn này sẽ giúp bạn cấu hình OAuth Consent Screen trong Google Cloud Console để chuẩn bị cho quá trình xác minh ứng dụng của Google.

## 📋 Checklist chuẩn bị

- [ ] Google Cloud Project đã được tạo
- [ ] Google Sheets API đã được kích hoạt
- [ ] Privacy Policy và Terms of Service đã được publish
- [ ] Domain chính thức của ứng dụng
- [ ] Logo ứng dụng (120x120px)

---

## 🔧 Bước 1: Truy cập Google Cloud Console

1. Mở [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn hoặc tạo project cho ứng dụng
3. Đi đến **APIs & Services** > **OAuth consent screen**

## 🎨 Bước 2: Cấu hình OAuth Consent Screen

### 2.1 User Type
- Chọn **External** (cho người dùng bên ngoài tổ chức)
- Click **CREATE**

### 2.2 App Information

#### **App name**
```
Google Sheet Translation Tool
```

#### **User support email**
```
hawk01525@gmail.com
```

#### **App logo**
- Upload logo 120x120px
- Format: PNG, JPG, GIF
- Nền trong suốt được khuyến khích

#### **App domain**
```
Homepage URL: https://locales-brown.vercel.app
Privacy Policy URL: https://locales-brown.vercel.app/privacy-policy
Terms of Service URL: https://locales-brown.vercel.app/terms-of-service
```

### 2.3 App description
```
Google Sheet Translation Tool là công cụ quản lý bản dịch đa ngôn ngữ giúp người dùng:

- Import và quản lý translations từ Google Sheets một cách trực quan
- Chỉnh sửa và đồng bộ nội dung translation real-time với Google Sheets
- Export file JSON cho từng ngôn ngữ để sử dụng trong ứng dụng
- Tìm kiếm và lọc translations thông minh với giao diện hiện đại
- Quản lý lịch sử và bookmark các Google Sheets thường dùng

Ứng dụng cần quyền truy cập Google Sheets để đọc và cập nhật nội dung translation mà người dùng đã tạo, giúp streamline quy trình quản lý đa ngôn ngữ cho các dự án phần mềm.
```

### 2.4 Authorized domains
```
locales-brown.vercel.app
vercel.app
```

### 2.5 Developer contact information
```
Email addresses: hawk01525@gmail.com
```

---

## 🔐 Bước 3: Scopes Configuration

### 3.1 Add Scopes
Click **ADD OR REMOVE SCOPES**

### 3.2 Chọn các scopes cần thiết:

#### **User Profile Scopes (Non-sensitive)**
- [ ] `../auth/userinfo.email` - Xem email address
- [ ] `../auth/userinfo.profile` - Xem thông tin hồ sơ cơ bản
- [ ] `openid` - Xác thực danh tính

#### **Google Sheets Scope (Sensitive)**
- [ ] `../auth/spreadsheets` - Xem và quản lý spreadsheets trong Google Drive

### 3.3 Justification cho Sensitive Scope

**Scope**: `https://www.googleapis.com/auth/spreadsheets`

**Justification**:
```
Ứng dụng Google Sheet Translation Tool cần quyền truy cập Google Sheets để:

1. ĐỌC DỮ LIỆU TRANSLATION:
   - Import nội dung từ Google Sheets do người dùng cung cấp
   - Hiển thị translations trong giao diện quản lý trực quan
   - Phân tích cấu trúc dữ liệu (keys, languages, namespaces)

2. CẬP NHẬT TRANSLATION REAL-TIME:
   - Lưu thay đổi translation trực tiếp vào Google Sheets
   - Thêm keys mới và ngôn ngữ mới theo yêu cầu người dùng
   - Đồng bộ dữ liệu giữa ứng dụng và Google Sheets

3. QUẢN LÝ CẤU TRÚC SHEET:
   - Tạo sheet mới cho namespace khác nhau
   - Thêm cột ngôn ngữ mới khi cần thiết
   - Tối ưu hóa format cho việc quản lý translation

Ứng dụng KHÔNG:
- Truy cập sheets không được người dùng cho phép
- Lưu trữ dữ liệu spreadsheet trên server
- Chia sẻ nội dung với bên thứ ba
- Sử dụng dữ liệu cho mục đích quảng cáo

Quyền này là thiết yếu cho chức năng chính của ứng dụng - là một công cụ quản lý translation từ Google Sheets.
```

---

## 🧪 Bước 4: Test Users (Development Phase)

### 4.1 Thêm Test Users
Trong giai đoạn development, thêm các email test:

```
hawk01525@gmail.com
test1@example.com
test2@example.com
```

### 4.2 Giới hạn Test Users
- Tối đa 100 test users trong development mode
- Test users có thể sử dụng ứng dụng trước khi verification

---

## 📝 Bước 5: Summary và Review

### 5.1 Kiểm tra thông tin
- [ ] App name và description rõ ràng
- [ ] Support email chính xác
- [ ] Privacy Policy và Terms of Service accessible
- [ ] Authorized domains đúng
- [ ] Scopes được justify hợp lý

### 5.2 Save Configuration
Click **SAVE AND CONTINUE** để hoàn tất cấu hình

---

## 🚀 Bước 6: Publishing Request

### 6.1 Khi nào submit verification?
- [ ] Ứng dụng đã hoàn thành và stable
- [ ] Tất cả tài liệu legal đã ready
- [ ] Test thoroughly với test users
- [ ] Production domain đã được setup

### 6.2 Verification Process
1. **Submit for verification** trong OAuth consent screen
2. **Upload additional documents** nếu được yêu cầu:
   - Application screenshots
   - Demo video
   - Technical documentation
3. **Wait for review** (4-6 tuần)
4. **Respond to feedback** nếu cần thiết

---

## ⚠️ Lưu ý quan trọng

### 6.1 Development vs Production
- **Development**: Giới hạn 100 users, warning screen hiển thị
- **Published**: Không giới hạn users, no warning screen

### 6.2 Sensitive Scopes Requirements
- **Security assessment**: Google sẽ đánh giá bảo mật ứng dụng
- **Documentation**: Cần cung cấp tài liệu chi tiết về cách sử dụng scope
- **Video demo**: Có thể yêu cầu video demo chức năng

### 6.3 Compliance
- **Privacy Policy**: Phải accessible publicly
- **Terms of Service**: Phải rõ ràng về cách sử dụng data
- **Data handling**: Tuân thủ các quy định về bảo vệ dữ liệu

---

## 🎯 Mẫu Email cho Verification Request

```
Subject: OAuth App Verification Request - Google Sheet Translation Tool

Dear Google OAuth Review Team,

I am submitting our application "Google Sheet Translation Tool" for OAuth app verification.

APPLICATION DETAILS:
- App Name: Google Sheet Translation Tool
- Project ID: [YOUR_PROJECT_ID]
- Client ID: [YOUR_CLIENT_ID]
- Domain: locales-brown.vercel.app

SCOPE JUSTIFICATION:
Our application requires the "spreadsheets" scope to provide translation management functionality:

1. Reading Google Sheets content to display translations in our UI
2. Updating translations directly in user's Google Sheets
3. Creating new sheets and adding languages as needed

SECURITY MEASURES:
- All data transmission encrypted via HTTPS
- OAuth tokens securely stored with JWT encryption
- No persistent storage of user's spreadsheet data
- Access limited to user-authorized sheets only

COMPLIANCE:
- Privacy Policy: https://locales-brown.vercel.app/privacy-policy
- Terms of Service: https://locales-brown.vercel.app/terms-of-service
- GDPR compliant data handling

ADDITIONAL INFORMATION:
- Demo video: [YOUTUBE_LINK]
- Technical documentation: [GITHUB_LINK]
- Test account: hawk01525@gmail.com

Please let me know if you need any additional information.

Best regards,
Quang Hưng
hawk01525@gmail.com
```

---

## 🔍 Troubleshooting

### Common Issues

**Issue**: "App domain verification failed"
**Solution**: Đảm bảo domain ownership đã được verify trong Google Search Console

**Issue**: "Privacy Policy not accessible"
**Solution**: Kiểm tra URL trả về 200 status và content rõ ràng

**Issue**: "Scope justification insufficient"
**Solution**: Cung cấp mô tả chi tiết hơn về cách sử dụng sensitive scope

**Issue**: "Security assessment required"
**Solution**: Chuẩn bị tài liệu bảo mật và có thể cần security review

---

## 📞 Support

**Email**: hawk01525@gmail.com  
**Response time**: 24-48 giờ  
**Documentation**: [Google OAuth Verification Guide](https://support.google.com/cloud/answer/13463073)

---

**Cập nhật**: 15/12/2024  
**Version**: 1.0
