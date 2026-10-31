import { QueryClientProvider } from '@tanstack/react-query'
import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as api from '../../../maitre_task/api'
import { createQueryClient } from '../../app/queryClient'
import { ProductsPage } from './ProductsPage'

vi.mock('../../../maitre_task/api', async (importOriginal) => {
  const actual = await importOriginal<typeof api>()
  return {
    ...actual,
    getCategories: vi.fn(),
    getProducts: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
  }
})

const product: api.Product = {
  id: 1,
  nameAz: 'Mərci şorbası',
  nameEn: 'Lentil soup',
  categoryId: 1,
  price: 4.5,
  isAvailable: true,
}
const page = { items: [product], total: 48, page: 1, pageSize: 10 }

function renderPage(queryClient = createQueryClient()) {
  render(
    <QueryClientProvider client={queryClient}>
      <ProductsPage />
    </QueryClientProvider>,
  )
  return userEvent.setup()
}

beforeEach(() => {
  vi.mocked(api.getCategories).mockResolvedValue([
    { id: 1, name: 'Şorbalar' },
    { id: 2, name: 'Əsas yeməklər' },
  ])
  vi.mocked(api.getProducts).mockResolvedValue(page)
  vi.mocked(api.createProduct).mockResolvedValue({ ...product, id: 49 })
  vi.mocked(api.updateProduct).mockImplementation(async (id, input) => ({
    ...product,
    ...input,
    id,
  }))
})

describe('products page', () => {
  it('shows loading, then names, category, price and sale status', async () => {
    renderPage()
    expect(screen.getByText('Məhsullar yüklənir...')).toBeInTheDocument()
    expect(await screen.findByText('Lentil soup')).toBeInTheDocument()
    expect(screen.getByText('4,50 ₼')).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: 'Mərci şorbası: satış statusu' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })

  it('retries a failed product read', async () => {
    vi.mocked(api.getProducts).mockRejectedValueOnce(
      new api.ApiError(500, 'Server xətası. Yenidən cəhd edin.'),
    )
    const user = renderPage()
    await screen.findByRole('alert')
    await user.click(screen.getByRole('button', { name: 'Yenidən cəhd et' }))
    expect(await screen.findByText('Lentil soup')).toBeInTheDocument()
    expect(api.getProducts).toHaveBeenCalledTimes(2)
  })

  it('retries categories independently and disables forms until categories exist', async () => {
    vi.mocked(api.getCategories).mockRejectedValueOnce(new Error('internal details'))
    const user = renderPage()
    await screen.findByRole('alert')
    expect(screen.getByRole('button', { name: 'Yeni məhsul' })).toBeDisabled()
    expect(screen.queryByText('internal details')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Yenidən cəhd et' }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Yeni məhsul' })).toBeEnabled())
  })

  it('validates required fields and creates with a comma price and null English name', async () => {
    const user = renderPage()
    await screen.findByText('Lentil soup')
    await user.click(screen.getByRole('button', { name: 'Yeni məhsul' }))
    await user.click(screen.getByRole('button', { name: 'Yadda saxla' }))
    expect(await screen.findByText('Azərbaycan dilində ad məcburidir.')).toBeInTheDocument()
    expect(api.createProduct).not.toHaveBeenCalled()
    await user.type(screen.getByLabelText(/Ad \(Azərbaycan/), '  Dovğa  ')
    await user.selectOptions(within(screen.getByRole('dialog')).getByRole('combobox'), '1')
    await user.type(screen.getByLabelText(/Qiymət/), '3,80')
    await user.click(screen.getByRole('button', { name: 'Yadda saxla' }))
    await waitFor(() =>
      expect(api.createProduct).toHaveBeenCalledWith({
        nameAz: 'Dovğa',
        nameEn: null,
        categoryId: 1,
        price: 3.8,
        isAvailable: true,
      }),
    )
    expect(await screen.findByText('Məhsul uğurla əlavə edildi.')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('preserves form values after a write error and supports explicit retry', async () => {
    vi.mocked(api.updateProduct)
      .mockRejectedValueOnce(new api.ApiError(500, 'Server xətası. Yenidən cəhd edin.'))
      .mockResolvedValueOnce({ ...product, price: 6 })
    const user = renderPage()
    await screen.findByText('Lentil soup')
    await user.click(screen.getByRole('button', { name: 'Mərci şorbası: düzəlt' }))
    const priceInput = screen.getByLabelText(/Qiymət/)
    await user.clear(priceInput)
    await user.type(priceInput, '6')
    await user.click(screen.getByRole('button', { name: 'Yadda saxla' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Server xətası')
    expect(priceInput).toHaveValue('6')
    await user.click(screen.getByRole('button', { name: 'Yadda saxla' }))
    expect(await screen.findByText('Dəyişikliklər yadda saxlanıldı.')).toBeInTheDocument()
    expect(api.updateProduct).toHaveBeenCalledTimes(2)
  })

  it('keeps the existing status on failure and retries the requested status', async () => {
    vi.mocked(api.updateProduct)
      .mockRejectedValueOnce(new api.ApiError(500, 'Status yadda saxlanılmadı.'))
      .mockResolvedValueOnce({ ...product, isAvailable: false })
    const user = renderPage()
    const toggle = await screen.findByRole('switch')
    await user.click(toggle)
    await screen.findByRole('alert')
    expect(toggle).toHaveAttribute('aria-checked', 'true')
    await user.click(screen.getByRole('button', { name: 'Yenidən cəhd et' }))
    await waitFor(() => expect(toggle).toHaveAttribute('aria-checked', 'false'))
    expect(api.updateProduct).toHaveBeenLastCalledWith(1, { isAvailable: false })
  })

  it('uses API search and filter parameters, then resets the page', async () => {
    const user = renderPage()
    await screen.findByText('Lentil soup')
    await user.click(screen.getByRole('button', { name: 'Səhifə 3' }))
    await waitFor(() =>
      expect(api.getProducts).toHaveBeenLastCalledWith(expect.objectContaining({ page: 3 })),
    )
    await user.type(screen.getByRole('searchbox'), 'soup')
    await waitFor(() =>
      expect(api.getProducts).toHaveBeenLastCalledWith(
        expect.objectContaining({ search: 'soup', page: 1 }),
      ),
    )
    await user.selectOptions(screen.getByRole('combobox'), '2')
    await waitFor(() =>
      expect(api.getProducts).toHaveBeenLastCalledWith(
        expect.objectContaining({ categoryId: 2, page: 1 }),
      ),
    )
  })

  it('shows empty search and offers filter reset', async () => {
    vi.mocked(api.getProducts).mockResolvedValue({ ...page, items: [], total: 0 })
    window.history.replaceState(null, '', '/?search=missing')
    const user = renderPage()
    expect(await screen.findByText('Məhsul tapılmadı')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Filtrləri təmizlə' }))
    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(await screen.findByText('Hələ məhsul yoxdur')).toBeInTheDocument()
  })

  it('confirms dismissal of dirty forms', async () => {
    const user = renderPage()
    await screen.findByText('Lentil soup')
    await user.click(screen.getByRole('button', { name: 'Yeni məhsul' }))
    const dialog = screen.getByRole('dialog')
    await user.type(within(dialog).getByLabelText(/Ad \(Azərbaycan/), 'Dovğa')
    await user.click(within(dialog).getByRole('button', { name: 'Ləğv et' }))
    expect(within(dialog).getByRole('alert')).toHaveTextContent('Yadda saxlanılmamış dəyişikliklər')
    await user.click(screen.getByRole('button', { name: 'Dəyişiklikləri ləğv et' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders untrusted names as text', async () => {
    const nameAz = '<img src=x onerror=alert(1)>'
    vi.mocked(api.getProducts).mockResolvedValue({ ...page, items: [{ ...product, nameAz }] })
    renderPage()
    expect(await screen.findByText(nameAz)).toBeInTheDocument()
    expect(document.querySelector('img')).toBeNull()
  })

  it('does not cancel a concurrent list refresh when a status write finishes', async () => {
    let finishStatus: ((value: api.Product) => void) | undefined
    let finishRead: ((value: api.PagedResult<api.Product>) => void) | undefined
    vi.mocked(api.updateProduct).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishStatus = resolve
        }),
    )
    const queryClient = createQueryClient()
    const user = renderPage(queryClient)
    const toggle = await screen.findByRole('switch')
    await user.click(toggle)
    vi.mocked(api.getProducts).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishRead = resolve
        }),
    )
    void queryClient.invalidateQueries({ queryKey: ['products'] })
    await waitFor(() => expect(finishRead).toBeTypeOf('function'))
    act(() => finishStatus?.({ ...product, isAvailable: false }))
    await waitFor(() => expect(toggle).toHaveAttribute('aria-checked', 'false'))
    act(() => finishRead?.({ ...page, total: 49, items: [{ ...product, isAvailable: false }] }))
    expect(await screen.findByText('1–10 / 49 məhsul')).toBeInTheDocument()
  })
})
