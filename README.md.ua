💅 Beauty Salon Intelligence Platform

Інтелектуальна SaaS-платформа для керування салоном краси з бездоганним клієнтським UX та повним контролем для адміністратора.

🎯 Vision

Створити сучасну, масштабовану систему керування салоном краси, де:

Клієнт отримує інтуїтивний та магічний досвід запису

Адміністратор контролює розклад, фінанси, персонал та комунікацію

Власник бачить живу аналітику прибутку

Система готова до масштабування (декілька майстрів, філії, CRM)

🏗 Architecture Overview
Tech Stack

Frontend: Next.js (App Router)

Styling: Tailwind CSS

Backend: Next.js API Routes

Database: PostgreSQL (Neon)

ORM: Prisma

Auth: Role-based authentication (Admin / Client)

Email: Resend

Storage: Cloudinary / Uploadthing

Realtime (planned): Polling → WebSockets

Bot integration: Telegram Bot API

✅ Current State (MVP 1.0)
Infrastructure

 Next.js initialized

 Tailwind CSS configured

 Prisma ORM configured

 PostgreSQL (Neon) connected

Authentication

 Role system (Admin / Client)

 Protected dashboards

 Session validation

Core System

 Basic Appointment API

 Initial Client Dashboard

 Initial Admin Dashboard

🗺 Development Roadmap
🧱 Milestone 1 — Foundation: Database & Roles Expansion
1. Employee Model (Staff)
Model: Employee

Fields:

id

name

photo

rating

description

createdAt

updatedAt

Ціль:

Підтримка декількох майстрів

Відображення рейтингу

Масштабування структури

2. Working Hours Model
Model: WorkingHours

Fields:

id

employeeId

dayOfWeek

startTime

endTime

isDayOff

Ціль:

Індивідуальний графік для кожного майстра

Можливість вихідного дня

API перевірка доступності

3. Financial System Refactor
Currency Strategy

Валюта: Złoty (zł)

Зберігання: Integer (копійки)

Відображення: ділення на 100

Причина:
Уникнення floating point помилок.

4. Online Status

User model field:

lastSeen: DateTime

Логіка:

Якщо lastSeen < 5 хвилин → показуємо зелений статус

Реалізація через polling (30 секунд)

5. Avatar Strategy

Якщо фото відсутнє → показуємо SVG placeholder

Можливість випадкового стилю

Зберігання зображень у хмарі

✨ Milestone 2 — Magic Booking Flow 2.0
Step 1 — Interactive Calendar
Features:

Month grid layout

Блокування минулих дат

Disabled кліки

Step 2 — Dynamic Time Slots

Генерація слотів:

Інтервал: 2 години

09:00

11:00

13:00

15:00

17:00

Логіка:

Якщо сьогодні 14:00 → 09:00 та 11:00 приховані

Перевірка зайнятих слотів через API

Врахування тривалості послуги

Step 3 — Service & Employee Selection

Після вибору часу:

Відображення послуг

Відображення майстрів

Показ рейтингу

Step 4 — Summary Screen

Фінальна картка:

23 травня
15:00
Манікюр
Майстер: Анастасія

Кнопки:

Confirm

Edit (повернення на конкретний крок)

🧠 Milestone 3 — Smart Admin Panel
Smart Dashboard
Dynamic Revenue System

Рахуються лише Confirmed записи

Declined → автоматичне віднімання

Реальне оновлення через revalidation

Appointment Control

Статуси:

Pending

Confirmed

Cancelled

Blocked

Block Mode (God Mode)

Адмін:

Натискає на годину

Створюється технічний запис типу BLOCKED

Клієнти цей слот не бачать

Promotions Module

Модель:

id

title

description

discountPercent

isActive

Відображення:

Клієнтська панель

Права колонка

💬 Milestone 4 — CRM & Communication
Email Notifications

Новий запис → email адміну

Підтвердження → email клієнту

Telegram Bot

Повідомлення:

Ім'я клієнта

Послуга

Дата

Час

Reminder System

Cron job

Перевірка за 24 години

Автоматичний email

Internal Chat

Sidebar → Messages

Client → Admin

Реалізація через polling

Майбутнє: WebSocket

Reviews System

Після завершення:

1–5 зірок

Коментар

Автооновлення рейтингу майстра

👤 Milestone 5 — Profile Management
Client Profile

Редагування імені

Телефон

Завантаження аватара

Appointment History

Секції:

Active

Archive

🧮 Technical Notes
Time Slot Logic

Перевіряємо:

Робочі години майстра

Blocked записи

Confirmed записи

Тривалість послуги

API Protection

Якщо слот заблокований адміном → API не повертає його

Клієнт не може створити запис на невалідний час

Finance Strategy

Усі розрахунки:

price = 25000 // 250.00 zł

Відображення:

price / 100
📦 Planned Prisma Models

User

Employee

WorkingHours

Service

Appointment

Promotion

Review

Message

Notification

🚀 Immediate Action Plan
Step 1 — Оновлення schema.prisma

Додати:

Employee

WorkingHours

Appointment status enum (Pending, Confirmed, Cancelled, Blocked)

Service category

Price integer system

🔮 Scalability Vision

Система повинна:

Підтримувати декілька майстрів

Підтримувати декілька філій

Підтримувати розширену CRM

Бути готовою до SaaS-моделі

📈 Long-Term Expansion

Mobile PWA

Subscription system

Loyalty system

Multi-language

Stripe integration

AI scheduling optimization

🧠 Philosophy

Ми будуємо не просто CRUD-панель.

Ми будуємо:

UX-first booking system

Finance-aware dashboard

CRM-ready architecture

Production-level structure