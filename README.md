# Karem Elwardani - Portfolio Website

## المتطلبات (Requirements)
- بيئة خادم محلي مثل XAMPP أو WAMP.
- PHP 8+
- MySQL

## طريقة التشغيل (How to Run)

1. **إعداد الخادم:**
   - قم بتثبيت XAMPP.
   - افتح لوحة التحكم XAMPP Control Panel وقم بتشغيل `Apache` و `MySQL`.

2. **قاعدة البيانات:**
   - اذهب إلى المتصفح واكتب `http://localhost/phpmyadmin`
   - أنشئ قاعدة بيانات جديدة باسم `karem_portfolio`.
   - قم بعمل Import للملف الموجود في `database/database.sql`.

3. **تشغيل الموقع:**
   - ضع المجلد `karem_portfolio` بالكامل داخل مسار `htdocs` في XAMPP (مثال: `C:\xampp\htdocs\karem_portfolio`).
   - افتح المتصفح على الرابط: `http://localhost/karem_portfolio`

4. **لوحة التحكم (Admin Panel):**
   - الرابط: `http://localhost/karem_portfolio/admin/login.php`
   - اسم المستخدم: `admin`
   - كلمة المرور: `admin123`

## الأمان (Security)
- كلمة المرور مشفرة باستخدام `password_hash()`.
- الاتصال بقاعدة البيانات محمي من ثغرات SQL Injection بفضل استخدام `PDO Prepared Statements`.

## بنية المشروع
- `assets/`: الصور، التنسيقات (CSS)، وملفات الـ JavaScript.
- `admin/`: لوحة التحكم لإدارة الفيديوهات والمشاريع.
- `config/`: إعدادات الاتصال بقاعدة البيانات.
- `database/`: ملفات بناء الجداول (SQL).
- `uploads/`: المجلد الذي تحفظ فيه الملفات المرفوعة من لوحة الإدارة.
