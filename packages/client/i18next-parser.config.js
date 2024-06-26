export default {
  locales: ['en', 'es'],
  output: 'public/locales/$LOCALE/$NAMESPACE.json',
  input: ['src/**/*.{ts,tsx}'],
  sort: true,
  createOldCatalogs: true
}
