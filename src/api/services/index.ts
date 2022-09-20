import { api } from '..'

export const syncPostChanges = async () => {
  api.post('/sync')
}
