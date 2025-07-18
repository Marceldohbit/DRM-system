import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),  tailwindcss()],
  base: './',
  optimizeDeps: {
    include: ['swiper', 'swiper/modules'], // Include Swiper and its modules
  },
});
