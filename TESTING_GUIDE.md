# VokaSync Testing Guide — FASE 2

## 🧪 Testing Advisory Engine

### 1. Setup Test Data

Untuk menguji Advisory Engine, Anda perlu data transaksi di database Supabase.

#### Quick Test Data Script

```sql
-- Insert test products
INSERT INTO products (user_id, product_name, selling_price, cost_price, status_label) VALUES
  ('your-user-id', 'Bawang Merah', 15000, 14500, 'pertahankan'),  -- Margin 3.3% → RED
  ('your-user-id', 'Bawang Putih', 25000, 22000, 'pertahankan'), -- Margin 12% → YELLOW
  ('your-user-id', 'Cabai Rawit', 80000, 60000, 'dorong');       -- Margin 25% → GREEN

-- Insert test transactions (24 jam terakhir)
INSERT INTO transactions (user_id, product_id, transaction_type, quantity, unit_price, input_method, transaction_date) VALUES
  ('your-user-id', (SELECT id FROM products WHERE product_name = 'Bawang Merah'), 'penjualan', 5, 15000, 'manual', NOW()),
  ('your-user-id', (SELECT id FROM products WHERE product_name = 'Bawang Merah'), 'penjualan', 10, 15000, 'manual', NOW() - INTERVAL '2 hours'),
  ('your-user-id', (SELECT id FROM products WHERE product_name = 'Bawang Merah'), 'penjualan', 3, 15000, 'manual', NOW() - INTERVAL '5 hours'),
  ('your-user-id', (SELECT id FROM products WHERE product_name = 'Bawang Putih'), 'penjualan', 2, 25000, 'manual', NOW());
```

### 2. Test Local Math Fallback

**File**: `lib/advisory/local-math-fallback.ts`

```typescript
import { evaluateMarginLocal, aggregateProductMetrics } from '@/lib/advisory/local-math-fallback';

// Test data
const mockProducts = [
  {
    productId: '1',
    productName: 'Bawang Merah',
    marginPercentage: 3.3,
    marginAbsolute: 500,
    sellingPrice: 15000,
    costPrice: 14500,
    recentTransactionCount: 5,  // > 3 → RED alert
    salesTrend: -10,
  },
  {
    productId: '2',
    productName: 'Bawang Putih',
    marginPercentage: 12,
    marginAbsolute: 3000,
    sellingPrice: 25000,
    costPrice: 22000,
    recentTransactionCount: 2,
    salesTrend: -35,  // < -30 → YELLOW alert (tren turun)
  },
  {
    productId: '3',
    productName: 'Cabai Rawit',
    marginPercentage: 25,
    marginAbsolute: 20000,
    sellingPrice: 80000,
    costPrice: 60000,
    recentTransactionCount: 8,
    salesTrend: 15,  // > 10 → GREEN
  },
];

const result = evaluateMarginLocal(mockProducts);

console.log('Alert Status:', result.alertStatus);  // Expected: 'RED'
console.log('Alert Message:', result.alertMessage);
console.log('Product Labels:', result.productLabels);
```

**Expected Output**:
```json
{
  "alertStatus": "RED",
  "alertMessage": "⚠️ 1 produk memiliki margin kritis (< 5%)",
  "recommendedAction": "Segera tinjau harga jual atau biaya produksi produk: Bawang Merah...",
  "productLabels": [
    {
      "productId": "1",
      "productName": "Bawang Merah",
      "label": "kurangi",
      "reason": "Margin kritis 3.3%. Evaluasi untuk menaikkan harga..."
    },
    {
      "productId": "2",
      "productName": "Bawang Putih",
      "label": "perbaiki",
      "reason": "Margin 12.0% dengan penjualan menurun -35.0%..."
    },
    {
      "productId": "3",
      "productName": "Cabai Rawit",
      "label": "dorong",
      "reason": "Margin tinggi (25.0%) dan penjualan meningkat +15.0%..."
    }
  ]
}
```

### 3. Test Advisory Server Action

**Development Console**:

```bash
# Start development server
npm run dev

# Open browser console di /beranda
# Cek Network tab untuk request ke advisory.actions
```

**Manual Test via Route Handler**:

Create `app/api/test-advisory/route.ts`:

```typescript
import { evaluateAdvisory } from '@/app/actions/advisory.actions';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await evaluateAdvisory();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

Test:
```bash
curl http://localhost:3000/api/test-advisory
```

### 4. Test Gemini Enhancement (Optional)

**Check if Gemini API is working**:

```typescript
// Test Gemini connection
import { getGeminiModelJSON } from '@/lib/gemini/client';

const model = getGeminiModelJSON();
const result = await model.generateContent({
  contents: [{
    role: 'user',
    parts: [{ text: 'Test: { "status": "ok" }' }],
  }],
});

console.log(result.response.text());
```

**Simulate Rate Limit (429)**:

Set invalid API key temporarily:
```env
GEMINI_API_KEY=invalid_key_for_testing_fallback
```

Expected: Advisory Engine tetap jalan dengan `usedFallback: true`

### 5. Test Dashboard UI

#### Test Cases:

1. **Not Logged In**
   - Expected: OnboardingState dengan welcome message
   - Action: Tidak crash

2. **Logged In, No Transactions**
   - Expected: EmptyState dengan Getting Started guide
   - Action: CTA button → /catat

3. **Logged In, Has Transactions, No Alert**
   - Expected: SummaryCards dengan data real
   - Expected: GREEN alert "Sistem belum mengevaluasi..."
   - Action: Quick Action button hidden

4. **Logged In, Has Transactions, RED Alert**
   - Expected: SummaryCards dengan data real
   - Expected: RED AlertCard dengan warning message
   - Action: Quick Action button visible
   - Action: onClick console.log 'Open AI Virtual Studio'

5. **Loading State**
   - Expected: DashboardSkeleton dengan skeleton cards
   - Action: Suspense boundary shows skeleton immediately

### 6. Test Header Navigation

1. **Clock Icon**
   - Click → Navigate to `/riwayat`
   - Expected: Placeholder page with "Coming Soon"

2. **Settings Icon**
   - Click → Navigate to `/settings`
   - Expected: Placeholder page with settings preview

3. **Back Button** (on /riwayat or /settings)
   - Click → Navigate back to `/beranda`

### 7. Test Responsive Design

#### Breakpoints:

- **Mobile (320px - 767px)**: Header + Cards stack
- **Tablet (768px - 1023px)**: Grid 2 columns
- **Desktop (≥1024px)**: Max-w-2xl container centered

#### Test Devices:

- iPhone SE (320px)
- iPhone 12 (390px)
- Samsung Galaxy (360px)
- iPad (768px)
- Desktop (1024px+)

### 8. Test Accessibility

#### WCAG AA Compliance:

1. **Color Contrast**
   ```bash
   # Use browser DevTools Lighthouse
   # Or axe DevTools extension
   ```

   Expected:
   - Text on RED background: ≥ 4.5:1
   - Text on YELLOW background: ≥ 4.5:1
   - Text on GREEN background: ≥ 4.5:1

2. **Touch Targets**
   - All buttons/links: ≥ 44×44px
   - Test: Header icons, Quick Action button, AlertCard button

3. **Keyboard Navigation**
   - Tab through all interactive elements
   - Enter/Space activates buttons/links

4. **Screen Reader**
   - aria-label pada ikon-only buttons
   - aria-live pada AlertCard (polite)
   - role="alert" pada AlertCard

## 🔍 Debugging Tips

### 1. Check Supabase Logs

```bash
# Supabase Dashboard → Logs → API
# Filter: "advisory" or "alerts"
```

### 2. Check Browser Console

```javascript
// Log all advisory-related data
console.log('User:', user);
console.log('Latest Alert:', latestAlert);
console.log('Today Transactions:', todayTransactions);
```

### 3. Check Database Directly

```sql
-- Check alerts
SELECT * FROM ai_alerts 
WHERE user_id = 'your-user-id' 
ORDER BY generated_at DESC 
LIMIT 10;

-- Check products with labels
SELECT product_name, margin_percentage, status_label 
FROM products 
WHERE user_id = 'your-user-id';

-- Check today's transactions
SELECT * FROM transactions 
WHERE user_id = 'your-user-id' 
  AND transaction_date >= CURRENT_DATE;
```

### 4. Test Gemini Fallback Manually

```typescript
// Force fallback
try {
  throw new Error('Simulated Gemini failure');
} catch (error) {
  console.log('Using fallback...');
  const localResult = evaluateMarginLocal(products);
  console.log('Fallback result:', localResult);
}
```

## ✅ Acceptance Criteria Checklist

From PRD.md FR-2:

- [ ] **Skenario 1**: Produk dengan margin < 5% dan ≥3 transaksi/24h → RED alert
- [ ] RED alert menampilkan pesan margin kritis
- [ ] Tombol [Buat Promosi WA] muncul pada RED alert
- [ ] **Skenario 2**: Semua produk margin > 15% dan tren stabil → GREEN alert
- [ ] GREEN alert tidak menampilkan tombol [Buat Promosi WA]
- [ ] **Skenario 3**: Gemini API 429 → fallback ke local math
- [ ] Field `usedFallback: true` pada response
- [ ] Pengguna tetap menerima AlertCard tanpa error visible

## 🐛 Known Issues & Workarounds

### Issue 1: Gemini API Key Invalid

**Symptom**: Alert selalu usedFallback=true

**Solution**:
1. Check `.env.local` → `GEMINI_API_KEY` valid
2. Verify key di [Google AI Studio](https://aistudio.google.com)
3. Restart dev server setelah update key

### Issue 2: No Transactions Showing

**Symptom**: EmptyState meskipun ada data di database

**Solution**:
1. Check user_id matching antara auth.users dan transactions
2. Verify transaction_date ≥ today
3. Check RLS policies enabled

### Issue 3: Alert Card Not Updating

**Symptom**: Alert status tidak berubah setelah tambah transaksi

**Solution**:
1. Manually call `evaluateAdvisory()` di browser console
2. Implement cron/scheduled task (FASE 3)
3. Add refresh button untuk re-evaluate

---

**Testing Status**: Ready for QA — All core features testable with manual data
