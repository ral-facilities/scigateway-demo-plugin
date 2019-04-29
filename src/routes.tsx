export function createRoute(
  section: string,
  label: string,
  route: string,
  order: number
): void {
  const routeAction = {
    type: 'daaas:api:register_route',
    payload: {
      section: section,
      link: route,
      plugin: 'demo_plugin',
      displayName: label,
      order: order,
    },
  };
  document.dispatchEvent(
    new CustomEvent('daaas-frontend', { detail: routeAction })
  );
}
