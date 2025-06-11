export function createRoute(
  section: string,
  label: string,
  route: string,
  order: number,
  helpText: string,
  unauthorised?: boolean
): void {
  const routeAction = {
    type: 'scigateway:api:register_route',
    payload: {
      section: section,
      link: route,
      plugin: 'demo_plugin',
      displayName: label,
      order: order,
      helpText: helpText,
      unauthorised: unauthorised,
    },
  };
  document.dispatchEvent(
    new CustomEvent('scigateway', { detail: routeAction })
  );
}
