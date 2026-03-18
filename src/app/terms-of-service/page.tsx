import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Điều khoản Dịch vụ | Google Sheet Translation Tool",
  description:
    "Điều khoản dịch vụ cho việc sử dụng Google Sheet Translation Tool",
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Quay lại trang chủ
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 md:p-12 shadow-xl shadow-blue-900/5">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Điều khoản Dịch vụ
          </h1>
          <p className="text-slate-500 mb-10 font-medium pb-8 border-b border-slate-100">
            Cập nhật lần cuối: 15 tháng 12, 2024
          </p>

          <div className="space-y-10 text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                1. Chấp nhận Điều khoản
              </h2>
              <p>
                Bằng việc truy cập và sử dụng Google Sheet Translation Tool
                ("Dịch vụ", "ứng dụng"), bạn đồng ý tuân thủ và bị ràng buộc bởi
                các điều khoản và điều kiện sau đây. Nếu bạn không đồng ý với
                bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng
                dịch vụ.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                2. Mô tả Dịch vụ
              </h2>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                2.1 Chức năng chính
              </h3>
              <p className="mb-2">
                Google Sheet Translation Tool là một ứng dụng web cung cấp:
              </p>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>
                  <strong>Quản lý bản dịch</strong>: Import và quản lý
                  translations từ Google Sheets
                </li>
                <li>
                  <strong>Tích hợp Google Sheets</strong>: Đọc, chỉnh sửa và
                  đồng bộ dữ liệu với Google Sheets
                </li>
                <li>
                  <strong>Export dữ liệu</strong>: Tạo file JSON cho từng ngôn
                  ngữ
                </li>
                <li>
                  <strong>Smart filtering</strong>: Tìm kiếm và lọc translations
                  theo nhiều tiêu chí
                </li>
                <li>
                  <strong>History management</strong>: Lưu lịch sử và đánh dấu
                  yêu thích
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                2.2 Phạm vi dịch vụ
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Platform</strong>: Ứng dụng web chạy trên trình duyệt
                </li>
                <li>
                  <strong>Compatibility</strong>: Hỗ trợ các trình duyệt hiện
                  đại (Chrome, Firefox, Safari, Edge)
                </li>
                <li>
                  <strong>Accessibility</strong>: Thiết kế responsive cho
                  desktop và mobile
                </li>
                <li>
                  <strong>Integration</strong>: Tích hợp với Google Sheets API
                  và Google OAuth 2.0
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                3. Tài khoản và Truy cập
              </h2>
              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                3.1 Yêu cầu tài khoản
              </h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>
                  <strong>Google Account</strong>: Cần có tài khoản Google để sử
                  dụng dịch vụ
                </li>
                <li>
                  <strong>Độ tuổi</strong>: Người dùng phải từ 13 tuổi trở lên
                </li>
                <li>
                  <strong>Verification</strong>: Có thể yêu cầu xác minh email
                  hoặc thông tin bổ sung
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                3.2 Quyền truy cập
              </h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>
                  <strong>Google Sheets scope</strong>: Quyền đọc và chỉnh sửa
                  Google Sheets của bạn
                </li>
                <li>
                  <strong>Profile information</strong>: Truy cập thông tin hồ sơ
                  cơ bản (tên, email, ảnh)
                </li>
                <li>
                  <strong>Limited access</strong>: Chỉ truy cập dữ liệu cần
                  thiết cho chức năng dịch vụ
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                3.3 Bảo mật tài khoản
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Authentication</strong>: Xác thực thông qua Google
                  OAuth 2.0
                </li>
                <li>
                  <strong>Token management</strong>: Quản lý access token an
                  toàn với thời hạn có hạn
                </li>
                <li>
                  <strong>Session security</strong>: Bảo vệ phiên làm việc khỏi
                  các cuộc tấn công
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                4. Quyền và Trách nhiệm của Người dùng
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">
                    4.1 Quyền sử dụng
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Free access</strong>: Sử dụng miễn phí tất cả tính
                      năng hiện có
                    </li>
                    <li>
                      <strong>Data ownership</strong>: Bạn giữ quyền sở hữu hoàn
                      toàn đối với dữ liệu Google Sheets
                    </li>
                    <li>
                      <strong>Privacy control</strong>: Kiểm soát mức độ chia sẻ
                      và quyền riêng tư
                    </li>
                    <li>
                      <strong>Export rights</strong>: Quyền export và backup dữ
                      liệu bất kỳ lúc nào
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">
                    4.2 Trách nhiệm & Cấm
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Accurate information</strong> &{" "}
                      <strong>Lawful use</strong>
                    </li>
                    <li>
                      <strong>Secure credentials</strong> &{" "}
                      <strong>Backup data</strong>
                    </li>
                    <li>
                      <strong>Unauthorized access</strong>: Không truy cập trái
                      phép web, dữ liệu
                    </li>
                    <li>
                      <strong>System abuse</strong>: Không gây quá tải/tấn công
                      hệ thống
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                5. Quyền Sở hữu Trí tuệ
              </h2>
              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                5.1 Quyền của chúng tôi
              </h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>
                  <strong>Application code</strong>: Mã nguồn ứng dụng thuộc
                  quyền sở hữu của chúng tôi
                </li>
                <li>
                  <strong>Design system</strong>: Thiết kế giao diện và trải
                  nghiệm người dùng
                </li>
                <li>
                  <strong>Brand assets</strong> & <strong>Innovation</strong>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                5.2 Quyền của người dùng
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>User data</strong>: Bạn giữ quyền sở hữu hoàn toàn dữ
                  liệu cá nhân
                </li>
                <li>
                  <strong>Google Sheets content</strong>: Nội dung Google Sheets
                  thuộc về bạn
                </li>
                <li>
                  <strong>Generated files</strong>: File JSON export thuộc quyền
                  của bạn
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                6. Miễn trừ Trách nhiệm & Giới hạn
              </h2>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>
                  <strong>"AS IS" basis</strong>: Dịch vụ được cung cấp "như
                  hiện có", không bảo hành độ chính xác.
                </li>
                <li>
                  <strong>Third-party services</strong>: Không chịu trách nhiệm
                  về Google Services hoặc sự cố mất dữ liệu.
                </li>
                <li>
                  <strong>Indirect damages</strong>: Không chịu trách nhiệm về
                  thiệt hại kinh doanh gián tiếp.
                </li>
                <li>
                  <strong>Maximum liability</strong>: Trách nhiệm bồi thường tối
                  đa bằng $0 (do đây là dịch vụ miễn phí).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                7. Thông tin Liên hệ
              </h2>
              <p className="mb-4">
                Bạn có thể gửi yêu cầu hỗ trợ, báo cáo vấn đề an ninh bảo mật
                theo địa chỉ:
              </p>
              <ul className="list-none space-y-2 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <li className="flex items-center">
                  <span className="font-semibold w-32 border-r border-blue-200 mr-4">
                    Email hỗ trợ:
                  </span>
                  <a
                    href="mailto:hawk01525@gmail.com"
                    className="text-blue-600 hover:underline"
                  >
                    hawk01525@gmail.com
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="font-semibold w-32 border-r border-blue-200 mr-4">
                    Giờ làm việc:
                  </span>
                  <span>9:00 - 17:00 (GMT+7), Thứ 2 - Thứ 6</span>
                </li>
                <li className="flex items-center">
                  <span className="font-semibold w-32 border-r border-blue-200 mr-4">
                    Thông báo:
                  </span>
                  <span>Nhóm hỗ trợ sẽ phản hồi trong 48 giờ.</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
