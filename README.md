# Maitre task

Restoran menyusundakı məhsulları idarə etmək üçün React + TypeScript + Vite + Tailwind CSS tətbiqi. Təqdim olunan API layihədəki `maitre_task/` qovluğundadır və dəyişdirilməyib. Ekranlar təqdim olunan dizayn nümunələrinə əsasən hazırlanıb.

## İşə salmaq

Node.js **22.19 və ya daha yeni 22.x** versiya və npm lazımdır. `package.json` Vercel build üçün Node 22-ni seçir.

```bash
npm ci
npm run dev
```

Terminalda göstərilən lokal ünvanı açın. Production versiyası:

```bash
npm run build
npm run preview
```

API açarı, `.env`, backend və giriş hesabı tələb olunmur. API yaddaşda işləyir: səhifə yenilənəndə məhsul dəyişiklikləri sıfırlanır. API-nin 300–1500 ms gecikməsi və 10% təsadüfi xəta ehtimalı olduğu kimi saxlanılıb.

## Funksionallıq

- Azərbaycan və ingilis adları, kateqoriya, `4,50 ₼` formatında qiymət və satış statusu.
- Hər iki dildə ada görə 350 ms gecikdirilmiş axtarış; kateqoriya filtri; səhifədə 10 məhsul.
- Məhsul yaratma və əvvəlcədən doldurulmuş redaktə forması; siyahıdan status dəyişmə.
- Skeleton yüklənmə, boş menyu, nəticəsiz axtarış və ayrıca təkrar cəhd düyməsi olan API xətaları.
- Mobil/planşetdə kartlar; masaüstündə nümunəyə uyğun cədvəl. 320–1440 px ekran ölçüləri yoxlanılır. Hover və açılma keçidləri azaldılmış hərəkət seçiminə uyğunlaşır.
- URL-də `search`, `category`, `page`; yeniləmə və brauzer tarixçəsi ilə sinxronlaşma.
- Klaviatura ilə idarə olunan modal, fokusun saxlanması və geri qaytarılması, dəyişiklikləri itirmədən bağlama təsdiqi, ekran oxuyucusu üçün etiketlər və bildirişlər.

## Qovluq quruluşu

```text
src/
  app/                     # QueryClient konfiqurasiyası
  components/
    layout/                # Səhifənin ümumi başlığı
    ui/                    # Button, Dialog, Toggle, ErrorMessage və s.
  features/products/
    api/                   # Query açarları, API sorğuları və mutasiyalar
    components/            # Cədvəl, sətir, filtr, forma və səhifələmə
    hooks/                 # URL filtrləri və formanın məntiqi
    utils/                 # Səhifələmə hesablamaları
    validation/            # Zod sxemi
    ProductsPage.tsx        # Məhsullar səhifəsinin yığılması
    constants.ts
  lib/                     # Qiymət formatı və təhlükəsiz xəta mesajları
  test/                    # Test mühitinin sazlanması
config/                    # Production təhlükəsizlik başlıqları
e2e/                       # Real API ilə Playwright testləri
maitre_task/               # Dəyişdirilməmiş API
public/fonts/              # Lokal şriftlər və OFL lisenziyaları
```

Testlər yoxladıqları modulların yanında saxlanılır. UI təqdimatı, server vəziyyəti, URL vəziyyəti və forma validasiyası ayrı məsuliyyətlərdir. TypeScript `strict` rejimindədir; ESLint və Prettier istifadə olunur.

## Əsas qərarlar və açıq məqamlar

- **TanStack Query:** server məlumatlarının keşi, asılı olmayan məhsul/kateqoriya xətaları və mutasiyalar. Yazma sorğuları avtomatik təkrarlanmır. Xətada formadakı məlumatlar və əvvəlki status saxlanılır. Uğurlu status bütün mövcud səhifə keşlərində yenilənir; başqa sorğuların nəticələri ləğv edilmir.
- **React Hook Form + Zod:** eyni sxemlə validasiya, ilk səhv sahəyə fokus və Azərbaycan dilində xəta mesajları. Azərbaycan adı boş ola bilməz; ingilis adı boşdursa `null` göndərilir. Adlar kənar boşluqlardan təmizlənir, 120 simvolla məhdudlaşdırılır və daxili idarəetmə simvolları qəbul edilmir.
- **Qiymət:** həm vergül, həm nöqtə qəbul edilir; ən çox iki onluq rəqəm; sonlu və sıfırdan böyük məbləğ. `NaN`, `Infinity`, eksponent və hex yazılışı qəbul edilmir. Məbləğ JavaScript-in təhlükəsiz tam ədəd diapazonunda qəpiklə təmsil olunmalıdır. Görünüşdə brauzerin lokal məlumatlarından asılı olmayaraq vergül istifadə edilir.
- **Filtrlər:** axtarış/kateqoriya dəyişəndə səhifə 1 olur. Düzgün olmayan URL ədədləri təmizlənir; olmayan kateqoriya sıfırlanır, həddən böyük səhifə son etibarlı səhifəyə yönəlir. Başqa URL parametrləri qorunur. Hər hərfdə brauzer tarixçəsini doldurmamaq üçün `replaceState` istifadə edilir.
- **Yaratma/redaktə:** mövcud filtr və səhifə saxlanılır. API yeni məhsulu sona əlavə edir; yeni məhsul cari filtrə uyğun deyilsə görünməyə bilər. Tapmaq üçün ada görə axtarışdan istifadə etmək olar. Yaratma və redaktədən sonra siyahı yenilənir. Uğurlu yazmadan sonrakı oxuma xətası ayrıca təkrar edilir; yazma sorğusu təkrarlanmır.
- **Dizayn:** 2x PNG 1440 px ekran üçün yarı ölçüdə tətbiq olunub. Stil bələdçisindəki rənglər, Hanken Grotesk/Onest şriftləri, 48 px input/düymələr və 64 px cədvəl sətirləri əsas götürülüb. Şriftlər tətbiqdən təqdim edilir; xarici şrift sorğusu yoxdur.
- **Kontrast:** nümunənin əsas rəngləri dəqiq saxlanılıb. Palitradakı bəzi mətn/fon cütləri WCAG AA kontrast həddindən aşağıdır. `prefers-contrast: more` rejimində mətn və əsas rəng tündləşdirilir. Standart rejimdə semantik əlçatanlıq, yüksək kontrast rejimində isə rəng kontrastı daxil tam avtomatik axe yoxlaması aparılır. Avtomatik yoxlama əl ilə ekran oxuyucusu auditini əvəz etmir.
- **Autentifikasiya və saxlanma:** tapşırıqda tələb olunmadığı üçün əlavə edilməyib. LocalStorage ilə API-nin sıfırlanma davranışı dəyişdirilmir. Başlıqdakı ad müəllifə məxsusdur.

## Təhlükəsizlik və xəta idarəsi

Məlumatlar React vasitəsilə mətn kimi göstərilir; HTML icra edilmir. Formada müştəri validasiyasına əlavə olaraq verilən API öz validasiyasını aparır. Düymələr sorğu müddətində bloklanır, formanın təkrar göndərilməsi ayrıca qorunur. Naməlum xətaların texniki detalları istifadəçiyə açılmır; render xətaları `ErrorBoundary` ilə qarşılanır.

Vercel üçün `vercel.json`, lokal production preview üçün `config/securityHeaders.ts` məhdud CSP, `nosniff`, iframe bloklaması, referrer və cihaz icazəsi siyasətlərini təyin edir. Development HMR üçün CSP dev serverə tətbiq edilmir. Serverə aid autentifikasiya/avtorizasiya kimi tədbirlər real backend inteqrasiyasında server tərəfində qurulmalıdır.

`minimatch` üçün təhlükəsizlik düzəlişli versiya override edilib; uyğunluğu lint və testlərlə yoxlanılıb. Son yoxlamada `npm audit` bütün asılılıqlar üçün **0 boşluq** göstərib.

## Testlər

```bash
npm test                     # Vitest: komponentlər, validasiya, URL, format, səhifələmə
npm run lint                 # ESLint
npm run format:check         # Prettier
npm run build                # Strict TypeScript + production build
npx playwright install chromium   # Yalnız ilk dəfə
npm run test:e2e             # Build-dən sonra: masaüstü və mobil Chromium
npm run check               # Format, lint, unit, build və E2E birlikdə
npm audit
```

## Sərf edilən vaxt və növbəti addımlar

İlkin implementasiya və bu son təmizləmə üçün təxminən 2 saat sərf edilib. Növbəti addımlarım olaraq Safari və Firefox-da əlavə brauzer testləri, əl ilə ekran oxuyucusu yoxlaması və CI üzərində vizual müqayisə əlavə edərdim.

## Vercel deploy

Build əmri `npm run build`, çıxış qovluğu `dist` olmalıdır. `vercel.json` təhlükəsizlik başlıqlarını təyin edir; əlavə SPA rewrite tələb olunmur. GitHub-a push və Vercel deploy müəllif tərəfindən aparılacaq.

Layihə Firudin Maniyev tərəfindən hazırlanıb.
