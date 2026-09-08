# FASE 3: Installation Instructions

## 📦 Required Dependencies

### Install Background Removal Library
```bash
npm install @imgly/background-removal
```

**Note:** PowerShell execution policy might block npm. Run in Command Prompt or PowerShell with admin rights:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then retry:
```bash
npm install @imgly/background-removal
```

---

## ✅ Verification

After installation, verify package is in `package.json`:
```json
{
  "dependencies": {
    "@imgly/background-removal": "^1.4.5"
  }
}
```

---

## 🧪 Quick Test

1. Start development server:
```bash
npm run dev
```

2. Navigate to `/beranda`

3. Click Alert Card "Buat Promosi WA" button (if visible)

4. Upload product image

5. Wait for background removal (3-8s)

6. Select frame template

7. Edit price watermark

8. Generate copywriting & share to WhatsApp

---

## 🎨 Frame Assets (Optional)

Create 3 PNG files in `public/frames/`:
- `frame-minimalis.png` (1080×1080px)
- `frame-pasar.png` (1080×1080px)
- `frame-kriya.png` (1080×1080px)

See `public/frames/README.md` for design specifications.

**Note:** App works without these files (emoji fallback).

---

## 🔑 Environment Variables

Ensure `.env.local` has Gemini API key:
```env
GEMINI_API_KEY=your_key_here
```

Copywriting will fallback to template mode if key is missing (no errors).

---

## 🚨 Troubleshooting

### Background Removal Fails
- Check browser console for WASM errors
- Try Manual Bypass button (appears at 50% progress)
- Use lower resolution image (<2MB recommended)

### Gemini Copywriting Error
- Verify API key in `.env.local`
- Check rate limits (15 RPM free tier)
- Fallback template will activate automatically

### WhatsApp Share Not Working
- Check browser support for Web Share API
- Fallback to copy text + manual share
- Ensure WhatsApp is installed on device

---

## ✨ Ready!

FASE 3 is complete and ready to test. See `FASE_3_COMPLETION.md` for full documentation.
