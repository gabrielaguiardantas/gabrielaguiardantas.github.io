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

  test('the focus moves into v1, and back to the button that opened it', async ({ page }) => {
    await openV1(page)
    await expect(frameElement(page)).toBeFocused()
    await backTo2026(page)
    await expect(v2Versions(page).getByRole('button', { name: LABELS.portuguese.open })).toBeFocused()

    await openV1(page)
    await browserBack(page)
    await expect(frameElement(page)).toBeHidden()
    await expect(v2Versions(page).getByRole('button', { name: LABELS.portuguese.open })).toBeFocused()
  })

  // o NVDA não anuncia o foco no iframe: sem este aviso, a viagem ficava em silêncio
  test('screen readers hear the arrival at each version', async ({ page }) => {
    const announcer = page.getByRole('status')
    await expect(announcer).toHaveText('')
    await openV1(page)
    await expect(announcer).toHaveText('Você está na versão 1.0 do portfólio, de 2023.')
    await backTo2026(page)
    await expect(announcer).toHaveText('De volta à versão 2.0, de 2026.')
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

// D18: a volta no tempo, com o <GAD year={2026} /> rolando até 2023 e de volta
test.describe('time travel effect', () => {
  const caption = (page: Page, text: string) => page.getByText(text, { exact: true })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('rolls the year to 2023 and back to 2026 around the switch', async ({ page }) => {
    await openVersionsSection(page)
    await v2Versions(page).getByRole('button', { name: LABELS.portuguese.open }).click()
    // durante o efeito, o contador aparece por cima da v2, e a v1 ainda não
    await expect(caption(page, '// voltando no tempo')).toBeVisible()
    await expect(page.getByText('GAD year={')).toBeVisible()
    await expect(frameElement(page)).toBeVisible()
    // ao fim, a camada sai de cena
    await expect(caption(page, '// voltando no tempo')).toHaveCount(0)

    await v1(page).locator('#versions').getByRole('button', { name: LABELS.portuguese.back }).click()
    await expect(caption(page, '// de volta ao presente')).toBeVisible()
    await expect(frameElement(page)).toBeHidden()
    await expect(caption(page, '// de volta ao presente')).toHaveCount(0)
  })

  test('waits for v1 to load on the first visit', async ({ page }) => {
    // a v1 demora 1,5 s para responder
    await page.route('**/v1.html?**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      await route.continue()
    })
    await openVersionsSection(page)
    const start = Date.now()
    await v2Versions(page).getByRole('button', { name: LABELS.portuguese.open }).click()
    await expect(caption(page, '// carregando 2023…')).toBeVisible()
    await expect(frameElement(page)).toBeVisible({ timeout: 8000 })
    expect(Date.now() - start).toBeGreaterThan(1500)
  })

  test('a Back in the middle of the trip turns it around', async ({ page }) => {
    await openVersionsSection(page)
    await v2Versions(page).getByRole('button', { name: LABELS.portuguese.open }).click()
    await expect(caption(page, '// voltando no tempo')).toBeVisible()
    await browserBack(page)
    await expect(caption(page, '// de volta ao presente')).toBeVisible()
    await expect(caption(page, '// de volta ao presente')).toHaveCount(0, { timeout: 8000 })
    await expect(frameElement(page)).toBeHidden()
    await expect(page).toHaveURL(/#versions$/)
  })

  test('follows the language', async ({ page }) => {
    await page.getByRole('button', { name: 'English' }).click()
    await openVersionsSection(page, 'english')
    await v2Versions(page).getByRole('button', { name: LABELS.english.open }).click()
    await expect(caption(page, '// going back in time')).toBeVisible()
    await expect(frameElement(page)).toBeVisible()
  })

  test('is a quick crossfade, without the counter, with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await openVersionsSection(page)
    // a v1 já carregada, para medir só o efeito
    await v2Versions(page).getByRole('button', { name: LABELS.portuguese.open }).click()
    await expect(frameElement(page)).toBeVisible()
    await v1(page).locator('#versions').getByRole('button', { name: LABELS.portuguese.back }).click()
    await expect(frameElement(page)).toBeHidden()

    const start = Date.now()
    await v2Versions(page).getByRole('button', { name: LABELS.portuguese.open }).click()
    await expect(frameElement(page)).toBeVisible()
    expect(Date.now() - start).toBeLessThan(1000)
    await expect(page.getByText('GAD year={')).toHaveCount(0)
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
