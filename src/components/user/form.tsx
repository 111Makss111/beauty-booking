import Link from "next/link";

export default function Form() {
  return (
    <form
      className="w-full max-w-sm mx-auto flex flex-col gap-4"
      autoComplete="off"
    >
      <input
        type="text"
        name="fullName"
        placeholder="Повне ім'я"
        className="input-field"
        required
        autoComplete="off"
      />

      <input
        type="email"
        name="email"
        placeholder="Електронна пошта"
        className="input-field"
        required
        autoComplete="off"
      />

      <div className="flex gap-2">
        <select
          name="countryCode"
          className="input-field w-28 bg-white/80 cursor-pointer px-2"
        >
          <option value="+380">UA (+380)</option>
          <option value="+48">PL (+48)</option>
          <option value="+44">EN (+44)</option>
        </select>
        <input
          type="tel"
          name="phone"
          placeholder="Номер телефону"
          className="input-field flex-1"
          required
          autoComplete="off"
        />
      </div>

      <input
        type="password"
        name="password"
        placeholder="Придумайте пароль"
        className="input-field"
        required
        autoComplete="new-password"
      />

      <button type="submit" className="btn-primary w-full mt-2">
        Створити акаунт
      </button>

      <div className="text-center mt-4 text-sm text-slate-500 flex flex-col gap-3">
        <p>
          У вас вже є акаунт?{" "}
          <Link
            href="/login"
            className="text-slate-800 font-semibold hover:text-pink-500 transition-colors"
          >
            Увійти
          </Link>
        </p>
        <Link href="#terms" className="text-xs text-slate-400 hover:underline">
          Умови використання
        </Link>
      </div>
    </form>
  );
}
