# CineScope - Movie Search

Website tra cứu phim toàn thế giới bằng ReactJS + Vite, dùng dữ liệu từ TMDB API.

## Cài đặt

```bash
npm install
npm run dev
```

Các thư viện chính:

```bash
npm install react react-dom react-router-dom axios lucide-react
npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer
```

## Tạo TMDB API key

1. Truy cập [themoviedb.org](https://www.themoviedb.org/) và tạo tài khoản.
2. Vào `Settings` > `API`.
3. Chọn tạo API key dành cho Developer, điền thông tin ứng dụng.
4. Sao chép `API Key` dạng v3 auth.
5. Mở file `.env` và thay giá trị:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
```

Sau khi đổi `.env`, hãy dừng và chạy lại dev server bằng `npm run dev`.

## Cấu trúc chính

```text
src/
  api/
    movieApi.js
  components/
    Header.jsx
    SearchBar.jsx
    MovieCard.jsx
    MovieGrid.jsx
    LoadingSkeleton.jsx
  pages/
    Home.jsx
    MovieDetail.jsx
    SearchResults.jsx
  App.jsx
  main.jsx
  index.css
```

## Tính năng

- Tìm phim theo tên.
- Danh sách phim dạng card với poster, tên phim, năm phát hành và điểm đánh giá.
- Trang chi tiết có poster, thể loại, mô tả, điểm, thời lượng, quốc gia, ngôn ngữ, diễn viên, đạo diễn và trailer YouTube nếu TMDB có dữ liệu.
- Loading skeleton, thông báo không tìm thấy phim, xử lý lỗi API.
- Nút Load more cho danh sách phổ biến và kết quả tìm kiếm.
- Giao diện responsive với Tailwind CSS.
