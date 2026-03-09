import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Chính sách Bảo mật | Google Sheet Translation Manager",
  description:
    "Chính sách bảo mật cho việc sử dụng Google Sheet Translation Manager",
}

export default function PrivacyPolicyPage() {
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
            Chính sách Bảo mật
          </h1>
          <p className="text-slate-500 mb-10 font-medium pb-8 border-b border-slate-100">
            Cập nhật lần cuối: 15 tháng 12, 2024
          </p>

          <div className="space-y-10 text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                1. Giới thiệu
              </h2>
              <p>
                Google Sheet Translation Manager ("chúng tôi", "ứng dụng") cam
                kết bảo vệ quyền riêng tư của bạn. Chính sách này giải thích
                cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của
                bạn khi sử dụng dịch vụ quản lý bản dịch từ Google Sheets.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                2. Thông tin chúng tôi thu thập
              </h2>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                2.1 Thông tin Google Account
              </h3>
              <p className="mb-2">
                Khi bạn đăng nhập bằng Google OAuth, chúng tôi thu thập:
              </p>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>
                  <strong>Thông tin hồ sơ cơ bản</strong>: Tên, email, ảnh đại
                  diện
                </li>
                <li>
                  <strong>Google Sheets access</strong>: Quyền đọc và chỉnh sửa
                  Google Sheets của bạn
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                2.2 Dữ liệu Google Sheets
              </h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>
                  <strong>Nội dung bản dịch</strong>: Các khóa và giá trị
                  translation trong Google Sheets
                </li>
                <li>
                  <strong>Metadata</strong>: Tên sheet, namespace, ngôn ngữ được
                  cấu hình
                </li>
                <li>
                  <strong>Lịch sử truy cập</strong>: Danh sách Google Sheets bạn
                  đã làm việc
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                2.3 Dữ liệu sử dụng
              </h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>
                  <strong>Preferences</strong>: Ngôn ngữ đã chọn, namespace
                  favorites
                </li>
                <li>
                  <strong>Lịch sử tìm kiếm</strong>: Các từ khóa đã tìm kiếm để
                  cải thiện trải nghiệm
                </li>
                <li>
                  <strong>Analytics cơ bản</strong>: Thống kê sử dụng tính năng
                  (ẩn danh)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                3. Cách chúng tôi sử dụng thông tin
              </h2>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                3.1 Chức năng chính
              </h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>
                  <strong>Hiển thị và chỉnh sửa translations</strong>: Đọc nội
                  dung Google Sheets để hiển thị giao diện quản lý
                </li>
                <li>
                  <strong>Đồng bộ real-time</strong>: Cập nhật thay đổi trực
                  tiếp lên Google Sheets của bạn
                </li>
                <li>
                  <strong>Export dữ liệu</strong>: Tạo file JSON cho các ngôn
                  ngữ từ dữ liệu Google Sheets
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                3.2 Cải thiện trải nghiệm
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Lưu lịch sử</strong>: Ghi nhớ Google Sheets đã truy
                  cập để truy cập nhanh
                </li>
                <li>
                  <strong>Personalization</strong>: Lưu preferences ngôn ngữ và
                  namespace yêu thích
                </li>
                <li>
                  <strong>Smart search</strong>: Cải thiện tính năng tìm kiếm
                  dựa trên thói quen sử dụng
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                4. Chia sẻ thông tin với bên thứ ba
              </h2>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                4.1 Google Services
              </h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>
                  <strong>Google Sheets API</strong>: Tương tác trực tiếp với
                  Google Sheets của bạn
                </li>
                <li>
                  <strong>Google OAuth</strong>: Xác thực và ủy quyền truy cập
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                4.2 Nhà cung cấp dịch vụ
              </h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>
                  <strong>Vercel</strong>: Hosting ứng dụng (không truy cập dữ
                  liệu cá nhân)
                </li>
                <li>
                  <strong>Analytics</strong>: Dữ liệu sử dụng ẩn danh để cải
                  thiện sản phẩm
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                4.3 Cam kết không chia sẻ
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Không bán dữ liệu</strong>: Chúng tôi không bán thông
                  tin cá nhân cho bên thứ ba
                </li>
                <li>
                  <strong>Không quảng cáo</strong>: Không sử dụng dữ liệu cho
                  mục đích quảng cáo
                </li>
                <li>
                  <strong>Chỉ với sự đồng ý</strong>: Chỉ chia sẻ khi có sự đồng
                  ý rõ ràng từ bạn
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                5. Bảo mật dữ liệu
              </h2>
              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                5.1 Mã hóa
              </h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>
                  <strong>HTTPS</strong>: Tất cả truyền tải dữ liệu được mã hóa
                  SSL/TLS
                </li>
                <li>
                  <strong>Token encryption</strong>: Access token được mã hóa
                  trong JWT
                </li>
                <li>
                  <strong>Secure storage</strong>: Dữ liệu lưu trữ với các biện
                  pháp bảo mật tiêu chuẩn
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                5.2 Kiểm soát truy cập
              </h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>
                  <strong>Authentication required</strong>: Chỉ người dùng đã
                  xác thực mới truy cập được
                </li>
                <li>
                  <strong>Session management</strong>: Token có thời hạn và được
                  làm mới định kỳ
                </li>
                <li>
                  <strong>Minimal scope</strong>: Chỉ yêu cầu quyền truy cập cần
                  thiết
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                5.3 Bảo vệ dữ liệu
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Data isolation</strong>: Dữ liệu của mỗi người dùng
                  được tách biệt hoàn toàn
                </li>
                <li>
                  <strong>No persistent storage</strong>: Không lưu trữ dữ liệu
                  Google Sheets trên server
                </li>
                <li>
                  <strong>Client-side processing</strong>: Xử lý dữ liệu chủ yếu
                  trên trình duyệt
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                6. Quyền của bạn
              </h2>
              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                6.1 Quyền truy cập và chỉnh sửa
              </h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>
                  <strong>Xem dữ liệu</strong>: Quyền xem thông tin cá nhân
                  chúng tôi có về bạn
                </li>
                <li>
                  <strong>Chỉnh sửa</strong>: Cập nhật thông tin hồ sơ và
                  preferences
                </li>
                <li>
                  <strong>Export</strong>: Tải xuống dữ liệu cá nhân của bạn
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                6.2 Quyền xóa
              </h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>
                  <strong>Revoke access</strong>: Thu hồi quyền truy cập Google
                  Sheets bất kỳ lúc nào
                </li>
                <li>
                  <strong>Delete account</strong>: Xóa tài khoản và tất cả dữ
                  liệu liên quan
                </li>
                <li>
                  <strong>Clear history</strong>: Xóa lịch sử truy cập và
                  preferences
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
                6.3 Kiểm soát chia sẻ
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Opt-out analytics</strong>: Từ chối thu thập dữ liệu
                  analytics
                </li>
                <li>
                  <strong>Privacy controls</strong>: Cài đặt mức độ riêng tư
                  theo ý muốn
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                7. Lưu trữ và thời hạn dữ liệu
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">
                    7.1 Thời gian lưu trữ
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Session data</strong>: Xóa khi đăng xuất/session
                      hết hạn
                    </li>
                    <li>
                      <strong>Preferences</strong>: Lưu cho đến khi bạn xóa/thay
                      đổi
                    </li>
                    <li>
                      <strong>History</strong>: Lưu tối đa 90 ngày, tự động xóa
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">
                    7.2 Xóa dữ liệu
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Automatic cleanup</strong>: Dữ liệu tạm được xóa
                      định kỳ
                    </li>
                    <li>
                      <strong>On-demand deletion</strong>: Xóa ngay lập tức theo
                      yêu cầu
                    </li>
                    <li>
                      <strong>Account deletion</strong>: Xóa toàn bộ dữ liệu khi
                      xóa tài khoản
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                8. Cookies và Local Storage
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">
                    8.1 Cookies cần thiết
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Session cookies</strong>: Duy trì trạng thái đăng
                      nhập
                    </li>
                    <li>
                      <strong>Security cookies</strong>: Bảo vệ chống CSRF
                      attacks
                    </li>
                    <li>
                      <strong>Preferences</strong>: Lưu cài đặt ngôn ngữ và giao
                      diện
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">
                    8.2 Local Storage
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>History data</strong>: Lịch sử Google Sheets đã
                      truy cập
                    </li>
                    <li>
                      <strong>Filter preferences</strong>: Cài đặt filter và tìm
                      kiếm
                    </li>
                    <li>
                      <strong>UI state</strong>: Trạng thái giao diện người dùng
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                9. Liên hệ
              </h2>
              <p className="mb-4">
                Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu nào về quyền riêng tư,
                vui lòng liên hệ:
              </p>
              <ul className="list-none space-y-2 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <li className="flex items-center">
                  <span className="font-semibold w-32 border-r border-blue-200 mr-4">
                    Email:
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
                    Ngôn ngữ:
                  </span>
                  <span>Hỗ trợ tiếng Việt và tiếng Anh</span>
                </li>
                <li className="flex items-center">
                  <span className="font-semibold w-32 border-r border-blue-200 mr-4">
                    Thời gian:
                  </span>
                  <span>Phản hồi trong 48 giờ làm việc</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
