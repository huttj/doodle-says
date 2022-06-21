export default function getQuery() {
  return (window.location.search || '').slice(1).split('&').reduce((acc, n) => {
    const [key, value] = n.split('=');
    acc[key] = value;
    return acc;
  }, {});
}