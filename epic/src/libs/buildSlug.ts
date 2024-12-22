export default function buildSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}
