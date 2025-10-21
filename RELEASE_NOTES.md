# Release v1.0.0

## 🎉 Initial Release

This is the first stable release of Ethiopian Calendar UI component!

### Features

- ✅ Full Ethiopian calendar with 13 months support
- ✅ Beautiful, responsive popup UI
- ✅ Mobile-friendly design
- ✅ Automatic conversion between Ethiopian and Gregorian calendars
- ✅ Merged calendar view option (display both calendars in one grid)
- ✅ Framework integration support:
  - Vanilla JavaScript
  - React (with hooks)
  - Vue 3 (with composition API)
  - Angular (with TypeScript)
  - PHP (with server-side helper class)
- ✅ Multiple module formats:
  - ES Modules (ESM)
  - CommonJS (CJS)
  - Universal Module Definition (UMD)
- ✅ Zero dependencies
- ✅ TypeScript-ready
- ✅ Comprehensive documentation and examples
- ✅ PHP helper class for server-side date handling (uses andegna/calender)

### Ethiopian Calendar Support

All 13 months are supported:
1. Meskerem (መስከረም) - 30 days
2. Tikimt (ጥቅምት) - 30 days
3. Hidar (ኅዳር) - 30 days
4. Tahsas (ታኅሣሥ) - 30 days
5. Tir (ጥር) - 30 days
6. Yekatit (የካቲት) - 30 days
7. Megabit (መጋቢት) - 30 days
8. Miazia (ሚያዝያ) - 30 days
9. Ginbot (ግንቦት) - 30 days
10. Sene (ሰኔ) - 30 days
11. Hamle (ሐምሌ) - 30 days
12. Nehase (ነሐሴ) - 30 days
13. Pagume (ጳጉሜን) - 5 or 6 days

### Installation

```bash
npm install ethcal-ui
```

or via CDN:

```html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/ethcal-ui@1.0.0/dist/ethcal-ui.css">

<!-- JavaScript (UMD) -->
<script src="https://unpkg.com/ethcal-ui@1.0.0/dist/ethcal-ui.umd.js"></script>
```

### Quick Start

```javascript
import { EthiopianCalendarUI } from 'ethcal-ui';

const calendar = new EthiopianCalendarUI({
  inputElement: document.getElementById('dateInput'),
  onSelect: (date) => {
    console.log('Ethiopian:', date.ethiopian);
    console.log('Gregorian:', date.gregorian);
  }
});

calendar.show();
```

### Documentation

Full documentation available in the [README.md](https://github.com/BenTade/ethcal-ui#readme)

### Examples

Check out the `/examples` folder for complete working examples with different frameworks.

### License

MIT
