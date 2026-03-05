# Performance Optimization Opportunities

This document identifies potential performance improvements based on Vercel React Best Practices. Items are prioritized by impact (CRITICAL → HIGH → MEDIUM → LOW).

## 🔴 CRITICAL Priority

### 1. Barrel File Imports from `lucide-react`

**Impact:** CRITICAL (200-800ms import cost, slow builds)

**Issue:** Importing from `lucide-react` barrel file loads thousands of unused modules.

**Files Affected:**
- `app/components/ui/dropdown-menu.tsx` - `CheckIcon, ChevronRightIcon, CircleIcon`
- `app/features/vans/components/van-filters.tsx` - `FilterIcon`
- `app/features/pagination/components/pagination.tsx` - `ChevronLeft, ChevronRight`
- `app/components/ui/dialog.tsx` - `XIcon`
- `app/features/navigation/utils/get-nav-items.tsx` - `Info, LogIn, LogOut, Truck, User`
- `app/features/navigation/components/nav.tsx` - `Menu, X`
- `app/features/host/constants/host-nav-items.tsx` - Multiple icons
- `app/features/host/components/review/rating-stars.tsx` - `StarIcon`

**Solution:**
```tsx
// ❌ Current (barrel import)
import { CheckIcon } from 'lucide-react';

// ✅ Optimized (direct import)
import CheckIcon from 'lucide-react/dist/esm/icons/check';
```

**Expected Benefits:**
- 15-70% faster dev boot
- 28% faster builds
- 40% faster cold starts
- Significantly faster HMR

**Note:** Since this is React Router v7 (not Next.js), we can't use `optimizePackageImports`. Direct imports are the solution. 

**Note:** This didn't work on netlify on deployment.

---

## 🟠 HIGH Priority

### 2. Use `.toSorted()` Instead of `.sort()` for Immutability

**Impact:** MEDIUM-HIGH (prevents mutation bugs in React state)

**Issue:** Using `.sort()` mutates arrays, which can cause bugs with React state.

**File Affected:**
- `app/utils/get-elapsed-time.ts:22`

**Current Code:**
```typescript
const sortedItems = [...items].sort((a, b) => {
  // ...
});
```

**Solution:**
```typescript
// ✅ Use toSorted() for immutability
const sortedItems = items.toSorted((a, b) => {
  // ...
});
```

**Note:** `.toSorted()` is available in all modern browsers (Chrome 110+, Safari 16+, Firefox 115+). The spread operator workaround is already in place, but `.toSorted()` is cleaner and more explicit.

---

## 🟡 MEDIUM Priority

### 3. Consider Using `useTransition` More Consistently

**Impact:** MEDIUM (reduces re-renders and improves code clarity)

**Status:** Already using `useTransition` in several places (`app/routes/host/host.tsx`, `app/components/search-input.tsx`, `app/components/sortable.tsx`), which is good!

**Potential Improvements:**
- Review any remaining manual loading states that could use `useTransition`'s built-in `isPending` state
- Ensure all non-urgent state updates (especially frequent ones like scroll tracking) use `startTransition`

**Files to Review:**
- Check for any `useState` with `isLoading` patterns that could be replaced with `useTransition`

---

### 4. Combine Multiple Array Iterations (If Applicable)

**Impact:** LOW-MEDIUM (reduces iterations)

**Status:** The codebase appears to handle array operations efficiently. Most operations are single-pass.

**Potential Areas to Review:**
- `app/features/vans/components/van-filters.tsx` - Multiple filter operations on `types` array (lines 37-40, 63-66) - but these are in different contexts, so combining may not be beneficial
- Review any hot paths where multiple `.filter()`, `.map()`, or `.find()` calls operate on the same array

---

## 🟢 LOW Priority

### 5. Cache Repeated Function Calls (If Applicable)

**Impact:** MEDIUM (avoid redundant computation)

**Potential Areas:**
- Review any functions called repeatedly during render that could benefit from module-level caching
- Check for expensive computations in render loops

**Example Pattern:**
```typescript
// Module-level cache
const cache = new Map<string, string>();

function expensiveFunction(input: string): string {
  if (cache.has(input)) return cache.get(input)!;
  const result = /* expensive computation */;
  cache.set(input, result);
  return result;
}
```

---

### 6. Use Set/Map for O(1) Lookups (If Applicable)

**Impact:** LOW-MEDIUM (O(n) to O(1))

**Status:** The codebase appears to use appropriate data structures. Review any hot paths with repeated `.includes()` or `.find()` calls on arrays.

**Potential Areas:**
- `app/features/vans/components/van-filters.tsx` - `VAN_TYPE_LOWERCASE.includes(t)` checks could use a Set if called frequently
- Review any validation or filtering logic that repeatedly checks array membership

---

## ✅ Already Optimized

### Good Practices Found:

1. **Dynamic Imports** ✅
   - `app/features/host/components/bar-chart/lazy-bar-chart.tsx` - Already using `React.lazy()` for heavy BarChart component

2. **Parallel Data Fetching** ✅
   - `app/routes/host/host.tsx` - Using `Promise.all()` for parallel fetching (lines 61-69)

3. **useTransition** ✅
   - Multiple files already using `useTransition` for non-urgent updates

4. **React Compiler** ✅
   - Project has React Compiler enabled, which automatically handles many optimizations

5. **Optimistic UI** ✅
   - Using `useOptimistic` for filter toggles in `app/features/vans/components/van-filters.tsx`

---

## Implementation Priority

1. **Start with #1 (Barrel Imports)** - Highest impact, relatively straightforward to fix
2. **Then #2 (toSorted)** - Quick win, prevents potential bugs
3. **Review #3-6** - Lower priority, but worth checking during refactoring

---

## Notes

- Some Next.js-specific optimizations (like `optimizePackageImports`, `after()`, `React.cache()`) don't apply to React Router v7
- React Compiler handles many memoization optimizations automatically
- The codebase already follows many best practices (parallel fetching, lazy loading, transitions)

---

## References

- [Vercel React Best Practices](https://github.com/vercel/react-best-practices)
- [How We Optimized Package Imports in Next.js](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
- [React Compiler](https://react.dev/learn/react-compiler)
