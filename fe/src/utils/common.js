import Cookies from 'js-cookie'

export const fetchAuth = async (url, options) => {
  const xsrfToken = Cookies.get('XSRF-TOKEN');
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${xsrfToken}`
    }
  })
}
