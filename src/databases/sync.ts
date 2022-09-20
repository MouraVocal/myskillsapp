import { SYNC_API_URL } from '@env'
import { synchronize } from '@nozbe/watermelondb/sync'
import { database } from '.'

export async function sync() {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt }) => {
      const response = await fetch(SYNC_API_URL, {
        body: JSON.stringify({ lastPulledAt })
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const { changes, timestamp } = await response.json()

      return { changes, timestamp }
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      const response = await fetch(
        `${SYNC_API_URL}?lastPulledAt=${lastPulledAt}`,
        { method: 'POST', body: JSON.stringify(changes) }
      )

      if (!response.ok) {
        throw new Error(await response.text())
      }
    }
  })
}
