@echo off

echo Installing Backend Dependencies...
cd backend

npm install bcrypt cloudinary cookie-parser cors dotenv express js-cookie jsonwebtoken jwt-decode mongoose multer node-cron nodemailer nodemon pdfkit pdfkit-table razorpay validator

echo Backend dependencies installed.
echo.

cd ..

echo Installing Frontend Dependencies...
cd frontend

npm install @tailwindcss/vite axios bcryptjs js-cookie jwt-decode lucide-react papaparse react react-dom react-hot-toast react-router-dom tailwindcss

echo Frontend dependencies installed.
echo.

echo All dependencies installed successfully!
pause