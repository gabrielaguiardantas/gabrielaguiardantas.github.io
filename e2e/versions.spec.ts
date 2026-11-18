import type { Page } from '@playwright/test'
import { ENGLISH, PORTUGUESE, expect, expectLanguage, test } from './fixtures.ts'

type Language = 'portuguese' | 'english'

const LABELS = {
  portuguese: { open: 'Voltar para 2023', back: 'Voltar para 2026', explore: 'Explorar as seções', versions: 'Versões' },
  english: { open: 'Back to 2023', back: 'Back to 2026', explore: 'Explore the sections', versions: 'Versions' },
}

const frameElement = (page: Page) => page.locator('iframe')
const v1 = (page: Page) => page.frameLocator('iframe')
const v1Hash = (page: Page) => page.frame({ url: /\/v1\.html/ })!.evaluate(() => location.hash)
const isV2Inert = (page: Page) => page.evaluate(() => document.getElementById('root')!.inert)

// a seção Versões da v2, aberta no painel da direita
const v2Versions = (page: Page) => page.locator('[data-section="versions"]')

// na v2, abre a órbita e a seção Versões, como um visitante faria
async function openVersionsSection(page: Page, language: Language = 'portuguese') {
  await page.getByRole('button', { name: LABELS[language].explore }).click()
  await page.getByRole('button', { name: LABELS[language].versions, exact: true }).click()
  await expect(page).toHaveURL(/#versions$/)
}

// clica no card v1.0 da v2 e espera a v1 aparecer no iframe
async function openV1(page: Page, language: Language = 'portuguese') {
  if (!page.url().endsWith('#versions')) await openVersionsSection(page, language)
  await v2Versions(page).getByRole('button', { name: LABELS[language].open }).click()
  await expect(frameElement(page)).toBeVisible()
  await expect(v1(page).locator('#versions')).toBeAttached()
}

// clica no botão "Voltar para 2026" da v1 e espera a v2 voltar
async function backTo2026(page: Page, language: Language = 'portuguese') {
  await v1(page).locator('#versions').getByRole('button', { name: LABELS[language].back }).click()
  await expect(frameElement(page)).toBeHidden()
}

const browserBack = (page: Page) => page.evaluate(() => history.back())
const browserForward = (page: Page) => page.evaluate(() => history.forward())

// envia uma mensagem à v2, a partir dela mesma ou da v1, e devolve quantos passos
// ela empilhou no histórico: 0 significa que a v2 ignorou a mensagem
async function historyStepsAfterMessage(page: Page, from: 'v2' | 'v1', data: unknown) {
  const before = await page.evaluate(() => {
    // registrado depois do listener da v2, então só resolve quando ela já tratou a mensagem
    const received = new Promise((resolve) => addEventListener('message', resolve, { once: true }))
    Reflect.set(window, '__received', received)
    return history.length
  })
  if (from === 'v2') await page.evaluate((message) => window.postMessage(message, '*'), data)
  else await page.frame({ url: /\/v1\.html/ })!.evaluate((message) => parent.postMessage(message, location.origin), data)
  const after = await page.evaluate(() => (Reflect.get(window, '__received') as Promise<unknown>).then(() => history.length))
  return after - before
}

test.describe('switching between v2 and v1', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('opens v1 over v2 and comes back to the same spot', async ({ page }) => {
    await openV1(page)
    await expectLanguage(v1(page), PORTUGUESE)
    // a v2 fica montada atrás, mas inerte
    expect(await isV2Inert(page)).toBe(true)

    await backTo2026(page)
    expect(await isV2Inert(page)).toBe(false)
    // a v2 continua na seção Versões
    await expect(page).toHaveURL(/#versions$/)
    await expect(v2Versions(page).getByRole('button', { name: LABELS.portuguese.open })).toBeVisible()
  })

  test('browser back from v1 returns to the versions section, then to the orbit', async ({ page }) => {
    await openV1(page)
    await browserBack(page)
    await expect(frameElement(page)).toBeHidden()
    await expect(page).toHaveURL(/#versions$/)

    await browserBack(page)
    await expect(page).toHaveURL(/#explore$/)
    await expect(page.getByRole('button', { name: LABELS.portuguese.versions, exact: true })).toBeVisible()
  })

  test('carries the current language to v1', async ({ page }) => {
    await page.getByRole('button', { name: 'English' }).click()
    await openV1(page, 'english')
    await expectLanguage(v1(page), ENGLISH)
    await backTo2026(page, 'english')
  })

  test('reloads v1 in the new language when it changes between visits', async ({ page }) => {
    await openV1(page)
    await backTo2026(page)
    await page.getByRole('button', { name: 'English' }).click()

    await openV1(page, 'english')
    await expectLanguage(v1(page), ENGLISH)
    await expect(frameElement(page)).toHaveCount(1)
  })

  test('only accepts switch messages from the v1 iframe', async ({ page }) => {
    await openV1(page)

    expect(await historyStepsAfterMessage(page, 'v2', { type: 'switch-version', version: 'v2' })).toBe(0)
    expect(await historyStepsAfterMessage(page, 'v1', { type: 'something-else' })).toBe(0)
    expect(await historyStepsAfterMessage(page, 'v1', { type: 'switch-version', version: 'v1' })).toBe(0)
    await expect(frameElement(page)).toBeVisible()

    expect(await historyStepsAfterMessage(page, 'v1', { type: 'switch-version', version: 'v2' })).toBe(1)
    await expect(frameElement(page)).toBeHidden()
  })

  test('browser forward reopens v1', async ({ page }) => {
    await openV1(page)
    await browserBack(page)
    await expect(frameElement(page)).toBeHidden()

    await browserForward(page)
    await expect(frameElement(page)).toBeVisible()
  })

  // D10: o "Voltar" do navegador desfaz uma ação por vez
  test.describe('browser back (D10)', () => {
    test.skip(({ viewport }) => viewport!.width <= 1024, 'the v1 nav is hidden on mobile')

    test('undoes the v1 sections one by one, then returns to 2026', async ({ page }) => {
      await openV1(page)
      await v1(page).locator('#a_stacks').click()
      await v1(page).locator('#a_projects').click()
      await expect.poll(() => v1Hash(page)).toBe('#projects')

      await browserBack(page)
      await expect.poll(() => v1Hash(page)).toBe('#stacks')
      await browserBack(page)
      await expect.poll(() => v1Hash(page)).toBe('')
      await expect(frameElement(page)).toBeVisible()

      await browserBack(page)
      await expect(frameElement(page)).toBeHidden()
    })

    test('after the back-to-2026 button, reopens v1 where it was', async ({ page }) => {
      await openV1(page)
      await v1(page).locator('#a_stacks').click()
      await expect.poll(() => v1Hash(page)).toBe('#stacks')
      await backTo2026(page)

      await browserBack(page)
      await expect(frameElement(page)).toBeVisible()
      await expect.poll(() => v1Hash(page)).toBe('#stacks')

      await browserBack(page)
      await expect.poll(() => v1Hash(page)).toBe('')
      await expect(frameElement(page)).toBeVisible()

      await browserBack(page)
      await expect(frameElement(page)).toBeHidden()
    })
  })
})

test.describe('v1 opened on its own', () => {
  test('reads the initial language from ?lang', async ({ page }) => {
    await page.goto('/v1.html?lang=english')
    await expectLanguage(page, ENGLISH)

    await page.goto('/v1.html?lang=klingon')
    await expectLanguage(page, PORTUGUESE)
  })

  test('the back-to-2026 button goes to v2', async ({ page }) => {
    await page.goto('/v1.html')
    await page.locator('#versions').getByRole('button', { name: LABELS.portuguese.back }).click()
    await expect(page).toHaveURL('/')
    await expect(page.getByRole('button', { name: LABELS.portuguese.explore })).toBeVisible()
  })
})
