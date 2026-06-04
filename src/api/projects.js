import { http, unwrapPage } from './http'

export async function getProjects(params = {}) {
  return unwrapPage(await http.get('/api/projects', { params }))
}

export async function getProjectStats() {
  return (await http.get('/api/projects/stats')).data
}
