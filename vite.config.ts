import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

const entry = (path: string) => resolve(import.meta.dirname, path);

export default defineConfig({
  plugins: [vue(), libInjectCss()],
  build: {
    cssCodeSplit: true,
    sourcemap: true,
    lib: {
      entry: {
        index: entry('src/index.ts'),
        foundation: entry('src/foundation/index.ts'),
        button: entry('src/controls/button/index.ts'),
        select: entry('src/controls/select/index.ts'),
        toggle: entry('src/controls/toggle/index.ts'),
        tabs: entry('src/controls/tabs/index.ts'),
        'column-picker': entry('src/data/column-picker/index.ts'),
        'data-table': entry('src/data/data-table/index.ts'),
        pagination: entry('src/data/pagination/index.ts'),
        'table-toolbar': entry('src/data/table-toolbar/index.ts'),
        'table-filters': entry('src/data/table-filters/index.ts'),
        'table-view-toggle': entry('src/data/table-view-toggle/index.ts'),
        notice: entry('src/feedback/notice/index.ts'),
        tooltip: entry('src/feedback/tooltip/index.ts'),
        'action-menu': entry('src/overlays/action-menu/index.ts'),
        modal: entry('src/overlays/modal/index.ts'),
        'app-shell': entry('src/shell/app-shell/index.ts'),
        preferences: entry('src/preferences/index.ts')
      },
      formats: ['es'],
      fileName: (_format, name) => `${name}.js`
    },
    rolldownOptions: {
      external: ['vue']
    }
  }
});
