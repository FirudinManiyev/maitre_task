export function paginationItems(page: number, totalPages: number): (number | string)[] {
  if (totalPages <= 4) return Array.from({ length: totalPages }, (_, index) => index + 1)
  const pages = new Set([1, totalPages, page - 1, page, page + 1])
  if (page <= 2) pages.add(3)
  if (page >= totalPages - 1) pages.add(totalPages - 2)
  const validPages = [...pages]
    .filter((item) => item > 0 && item <= totalPages)
    .sort((a, b) => a - b)
  return validPages.flatMap((item, index) =>
    index > 0 && item - validPages[index - 1] > 1 ? [`gap-${item}`, item] : [item],
  )
}
