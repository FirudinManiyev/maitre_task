const priceFormatter = new Intl.NumberFormat('az-AZ', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatPrice(price: number): string {
  // Some browsers ship without Azerbaijani locale data; keep the design's separators in every locale.
  const amount = priceFormatter
    .formatToParts(price)
    .map((part) => {
      if (part.type === 'decimal') return ','
      if (part.type === 'group') return '.'
      return part.value
    })
    .join('')
  return `${amount} ₼`
}
