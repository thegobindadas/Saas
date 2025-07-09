
// Central route config
export const PUBLIC_ROUTES = [
  "/",
  "/home",
  "/sign-in",
  "/sign-up",
  "/api/webhook/register",
];


export const REDIRECTS = {
  UNAUTHENTICATED: "/sign-up",
  AUTHENTICATED: "/home",
  AUTH_FORBIDDEN: ["/sign-in", "/sign-up"],
  ADMIN_HOME: "/admin/home",
  USER_HOME: "/home",
  ERROR: "/error",
};


// Route matcher function
export const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.includes(pathname);
};
