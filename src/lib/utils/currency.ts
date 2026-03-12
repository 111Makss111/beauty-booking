/**
 * Форматує число у валюту PLN (злоті) за польським стандартом.
 * Приклад: 100 -> 100,00 zł
 */
export const formatPrice = (price: number | string): string => {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 0,
  })
    .format(numericPrice || 0)
    .replace("PLN", "zł");
};
