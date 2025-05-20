import { promises as fs } from 'fs'
import { join } from 'path'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async (nuxtApp) => {
  const filePath = join(process.cwd(), 'public/_data', 'menus.json')

  try {
    const fileContent = await fs.readFile(filePath, 'utf8')
    const menuData = JSON.parse(fileContent)

    nuxtApp.provide('menuData', menuData.menu)
  } catch (err) {
    console.warn('menus.json not found or failed to load:', (err as Error).message)
    nuxtApp.provide('menuData', []) // fallback to empty array or null
  }
})
