# Troubleshooting Guide

## Build Issues

### npm install fails

**Symptoms**: Build fails with "npm install failed" error

**Solutions**:

1. **Clear npm cache**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

2. **Check Node version**
```bash
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
```

3. **Use alternative package managers**
```bash
# Using Yarn
yarn install
yarn build

# Using pnpm
pnpm install
pnpm build
```

4. **Manual dependency installation**
```bash
npm install react@19.2.3 react-dom@19.2.3
npm install -D @vitejs/plugin-react@5.1.1 vite@7.2.4
npm install -D typescript@5.9.3 tailwindcss@4.1.17
npm run build
```

### TypeScript errors

**Symptoms**: Type errors in components

**Solutions**:

1. **Check tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

2. **Install type definitions**
```bash
npm install -D @types/react@19.2.7 @types/react-dom@19.2.3 @types/node
```

### Tailwind CSS not working

**Symptoms**: Styles not applying

**Solutions**:

1. **Check index.css**
```css
@import "tailwindcss";
```

2. **Verify Tailwind config**
```bash
# Should have @tailwindcss/vite plugin
npm list @tailwindcss/vite
```

3. **Check vite.config.ts**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

## Runtime Issues

### Components not rendering

**Symptoms**: Blank screen or errors in console

**Solutions**:

1. **Check browser console** (F12)
   - Look for error messages
   - Check network tab for failed imports

2. **Verify imports**
```typescript
// All imports should use correct paths
import LandingPage from './components/LandingPage'  // ✅
import LandingPage from './LandingPage'             // ❌
```

3. **Check component exports**
```typescript
// Use default exports
export default function Component() { ... }  // ✅
export function Component() { ... }          // ❌ (without default)
```

### State not updating

**Symptoms**: Changes not reflected in UI

**Solutions**:

1. **Verify useState usage**
```typescript
const [state, setState] = useState(initialValue)
setState(newValue)  // ✅
state = newValue    // ❌
```

2. **Check component re-renders**
```typescript
// Use React DevTools to monitor component tree
// Check if props are changing
```

### Navigation not working

**Symptoms**: Can't switch between pages

**Solutions**:

1. **Verify page state**
```typescript
type Page = 'home' | 'scanner' | 'dashboard' | 'features'
const [currentPage, setCurrentPage] = useState<Page>('home')
```

2. **Check button onClick handlers**
```typescript
<button onClick={() => setCurrentPage('scanner')}>  // ✅
<button onClick={setCurrentPage('scanner')}>        // ❌
```

## Analysis Issues

### No vulnerabilities detected in vulnerable code

**Symptoms**: Clean report for code with known issues

**Solutions**:

1. **Check analyzer.ts patterns**
   - Verify regex patterns match the code
   - Test with example contract

2. **Add console logging**
```typescript
console.log('Code:', code)
console.log('Vulnerabilities:', vulnerabilities)
```

3. **Verify vulnerability detection functions**
   - Each function should push to vulnerabilities array
   - Check pattern matching logic

### Risk score calculation incorrect

**Symptoms**: Score doesn't match vulnerability count

**Solutions**:

1. **Check scoring logic**
```typescript
calculateRiskScore(vulnerabilities)
// Critical: +25
// High: +15
// Medium: +8
// Low: +3
```

2. **Verify getRiskLevel thresholds**
```typescript
0: safe
1-19: low
20-39: medium
40-69: high
70+: critical
```

## UI/UX Issues

### Styles look broken

**Symptoms**: Layout issues, missing colors

**Solutions**:

1. **Check Tailwind classes**
   - Ensure all classes are valid
   - Use Tailwind IntelliSense

2. **Verify gradient backgrounds**
```typescript
className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
```

3. **Check responsive classes**
```typescript
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

### Animations not working

**Symptoms**: No smooth transitions

**Solutions**:

1. **Add transition classes**
```typescript
className="transition-all duration-300"
```

2. **Check animation classes**
```typescript
className="animate-pulse"
className="animate-spin"
```

3. **Verify custom animations in index.css**

### Mobile layout broken

**Symptoms**: Overflow, tiny text on mobile

**Solutions**:

1. **Add viewport meta tag** (should be in index.html)
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

2. **Use responsive utilities**
```typescript
className="text-base md:text-lg lg:text-xl"
className="px-4 sm:px-6 lg:px-8"
```

3. **Test in responsive mode** (Chrome DevTools)

## Performance Issues

### Slow analysis

**Symptoms**: Takes longer than 2-3 seconds

**Solutions**:

1. **Check code length**
   - Very large contracts will take longer
   - Consider adding length limits

2. **Optimize regex patterns**
   - Use simple patterns where possible
   - Avoid nested regex

3. **Add progress updates**
   - Already implemented in Scanner.tsx
   - Adjust timing if needed

### Memory issues

**Symptoms**: Browser slow or crashes

**Solutions**:

1. **Limit code size**
```typescript
const MAX_CODE_LENGTH = 50000  // characters
if (code.length > MAX_CODE_LENGTH) {
  alert('Code too large')
  return
}
```

2. **Clear state when needed**
```typescript
const handleClear = () => {
  setCode('')
  setAuditResult(null)
}
```

## Development Tips

### Hot reload not working

**Solutions**:
```bash
# Restart dev server
npm run dev

# Clear .vite cache
rm -rf node_modules/.vite
npm run dev
```

### ESLint errors

**Solutions**:
```bash
# Install ESLint (optional)
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Add .eslintrc.json
{
  "extends": ["react-app"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "warn"
  }
}
```

### Git issues

**Solutions**:
```bash
# Add .gitignore
node_modules/
dist/
.env
.DS_Store

# Reset if needed
git reset --hard HEAD
npm install
```

## Getting Help

### Resources
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [TypeScript Documentation](https://www.typescriptlang.org)

### Community Support
- Stack Overflow: Tag with `reactjs`, `vite`, `tailwindcss`
- GitHub Issues: Create detailed issue reports
- Discord: Join React/Vite communities

### Debugging Steps
1. Check browser console (F12)
2. Check terminal output
3. Review error messages carefully
4. Google the error message
5. Check similar issues on GitHub
6. Create minimal reproducible example
7. Ask for help with code snippets

## Common Error Messages

### "Cannot find module"
```bash
# Solution: Install missing dependency
npm install [module-name]
```

### "Unexpected token"
```bash
# Solution: Check syntax, missing imports
# Usually a JavaScript/TypeScript syntax error
```

### "Module not found: Can't resolve"
```bash
# Solution: Check import path
# Use relative paths: './Component' not 'Component'
```

### "Type 'X' is not assignable to type 'Y'"
```bash
# Solution: Fix TypeScript types
# Check interface definitions in types.ts
```

---

**Still having issues?**

Create a GitHub issue with:
1. Error message (full stack trace)
2. What you were trying to do
3. What you expected to happen
4. What actually happened
5. Your environment (Node version, OS, browser)
