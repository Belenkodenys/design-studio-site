import SubpageShell from '../../components/subpage/SubpageShell'
import HeroFade from './HeroFade'
import SwipeGallery from './SwipeGallery'
import ScrollDrift from '../../components/subpage/ScrollDrift'
import '../branding/branding.css'
import { RITUALS, DAY_LOGIC } from './rituals'
import { MENU_INTRO, MENU_ITEMS, SIGNATURE_INTRO, SIGNATURE, DRINKS_NOTE, FORMATS } from './kitchen'
import './molovata.css'

// Hidden working page: not linked from the site, not in the sitemap,
// not indexed by search engines (robots: noindex). Filled with material
// section by section as it arrives.
export const metadata = {
  title: 'Molovata',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  openGraph: { title: 'Molovata — Belenko Design Studio' }
}

const MENU = [
  { id: 'architecture', label: 'Архитектура' },
  { id: 'interiors', label: 'Интерьеры' },
  { id: 'branding', label: 'Брендинг' },
  { id: 'kitchen', label: 'Кухня' },
  { id: 'rituals', label: 'Ритуалы' }
]

// Architecture gallery — add images here (src + srcSet with -m variant for phones).
const ARCHITECTURE = [
  {
    src: '/molovata/molovata-architecture-facade.webp',
    srcSet: '/molovata/molovata-architecture-facade-m.webp 1400w, /molovata/molovata-architecture-facade.webp 1746w',
    alt: 'Molovata — фасад из каменных пилонов с остеклением и зелёной кровлей на закате'
  },
  {
    src: '/molovata/molovata-architecture-pool-slide.webp',
    srcSet: '/molovata/molovata-architecture-pool-slide-m.webp 1400w, /molovata/molovata-architecture-pool-slide.webp 1793w',
    alt: 'Molovata — бассейн с горкой, джакузи и шезлонгами под зонтами'
  },
  {
    src: '/molovata/molovata-architecture-pool-terrace.webp',
    srcSet: '/molovata/molovata-architecture-pool-terrace-m.webp 1400w, /molovata/molovata-architecture-pool-terrace.webp 1792w',
    alt: 'Molovata — терраса у бассейна среди валунов и габионных стен'
  },
  {
    src: '/molovata/molovata-architecture-pool-arches.webp',
    srcSet: '/molovata/molovata-architecture-pool-arches-m.webp 1400w, /molovata/molovata-architecture-pool-arches.webp 1793w',
    alt: 'Molovata — бассейн, детская площадка и арочные гроты в зелёном склоне'
  },
  {
    src: '/molovata/molovata-architecture-pool-lane.webp',
    srcSet: '/molovata/molovata-architecture-pool-lane-m.webp 1400w, /molovata/molovata-architecture-pool-lane.webp 1792w',
    alt: 'Molovata — длинный бассейн с шезлонгами вдоль остеклённых фасадов'
  },
  {
    src: '/molovata/molovata-architecture-spa-pool.webp',
    srcSet: '/molovata/molovata-architecture-spa-pool-m.webp 1400w, /molovata/molovata-architecture-spa-pool.webp 2600w',
    alt: 'Molovata — вид сверху: каменный спа-комплекс с бассейном, горкой и зелёными кровлями'
  }
]

// Branding chapter — same scroll-driven drift as /branding. Add cut-outs
// (transparent background) here: { src, alt, size: 'small', gap: true }.
const BRANDING = [
  { src: '/molovata/molovata-branding-logo-cut.webp', srcSet: '/molovata/molovata-branding-logo-cut-m.webp 1000w, /molovata/molovata-branding-logo-cut.webp 2640w', alt: 'Molovata Wellness — логотип со знаком-цветком', size: 'small' },
  { src: '/molovata/molovata-branding-map-mark.webp', srcSet: '/molovata/molovata-branding-map-mark-m.webp 1000w, /molovata/molovata-branding-map-mark.webp 1736w', alt: 'Molovata — знак-цветок повторяет излучину Днестра у Моловаты на спутниковой карте' },
  { src: '/molovata/molovata-branding-tuk-tuk-cut.webp', srcSet: '/molovata/molovata-branding-tuk-tuk-cut-m.webp 1000w, /molovata/molovata-branding-tuk-tuk-cut.webp 1441w', alt: 'Molovata Wellness — трёхколёсный фургончик с полосатым тентом, полотенцами и корзинами' },
  { src: '/molovata/molovata-branding-flower-mark-cut.webp', srcSet: '/molovata/molovata-branding-flower-mark-cut-m.webp 1000w, /molovata/molovata-branding-flower-mark-cut.webp 1048w', alt: 'Molovata — знак-цветок, оливковый орнамент', size: 'small' },
  { src: '/molovata/molovata-branding-robe-look-cut.webp', srcSet: '/molovata/molovata-branding-robe-look-cut-m.webp 1000w, /molovata/molovata-branding-robe-look-cut.webp 606w', alt: 'Molovata Wellness — полосатый халат с тюрбаном, сумкой и шлёпанцами' },
  { src: '/molovata/molovata-branding-umbrella-orig.webp', srcSet: '/molovata/molovata-branding-umbrella-orig-m.webp 1000w, /molovata/molovata-branding-umbrella-orig.webp 1536w', alt: 'Molovata Wellness — полосатый зонт с деревянной ручкой и знаком' },
  { src: '/molovata/molovata-branding-towels-cut.webp', srcSet: '/molovata/molovata-branding-towels-cut-m.webp 1000w, /molovata/molovata-branding-towels-cut.webp 1285w', alt: 'Molovata Wellness — стопка полосатых полотенец с нашивкой' },
  { src: '/molovata/molovata-branding-slippers-cut.webp', srcSet: '/molovata/molovata-branding-slippers-cut-m.webp 1000w, /molovata/molovata-branding-slippers-cut.webp 1146w', alt: 'Molovata Wellness — махровые шлёпанцы с логотипом' },
  { src: '/molovata/molovata-branding-tote-bag-cut.webp', srcSet: '/molovata/molovata-branding-tote-bag-cut-m.webp 1000w, /molovata/molovata-branding-tote-bag-cut.webp 853w', alt: 'Molovata Wellness — махровая полосатая сумка с нашивкой' },
  { src: '/molovata/molovata-branding-tableware-cut.webp', srcSet: '/molovata/molovata-branding-tableware-cut-m.webp 1000w, /molovata/molovata-branding-tableware-cut.webp 1456w', alt: 'Molovata Wellness — набор керамики в полоску: тарелки, чашки, миска' },
  { src: '/molovata/molovata-branding-robe-orig.webp', srcSet: '/molovata/molovata-branding-robe-orig-m.webp 1000w, /molovata/molovata-branding-robe-orig.webp 1024w', alt: 'Molovata Wellness — полосатый банный халат с логотипом на кармане' },
  { src: '/molovata/molovata-branding-robe-editorial.webp', srcSet: '/molovata/molovata-branding-robe-editorial-m.webp 1000w, /molovata/molovata-branding-robe-editorial.webp 1024w', alt: 'Molovata Wellness — образ в полосатом халате с сумкой у полосатой консоли' }
]
const FX = ['slide-l', 'rise', 'slide-r', 'zoom', 'tilt', 'slide-r', 'rise', 'slide-l', 'zoom', 'tilt']
const POS = ['left', 'center', 'right', 'center', 'right', 'left', 'center']

function BrandingDrift() {
  if (!BRANDING.length) return null
  return (
    <div className="br-gallery mol-branding">
      {BRANDING.map((g, i) => (
        <ScrollDrift key={g.src} fx={FX[i % FX.length]} className={`br-slot br-slot--${POS[i % POS.length]}${g.size === 'small' ? ' br-slot--small' : ''}${g.gap ? ' br-slot--gap' : ''}`}>
          <img
            src={g.src}
            srcSet={g.srcSet}
            sizes="(max-width: 600px) 100vw, 80vw"
            alt={g.alt}
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </ScrollDrift>
      ))}
    </div>
  )
}

// Kitchen chapter — photos in a masonry-like grid; add { src, alt } here.
const KITCHEN = [
  { src: '/molovata/molovata-kitchen-breakfast.webp', alt: 'Molovata — завтрак на террасе: полосатая керамика, бурата с томатами, авокадо-тост, оливки' }
]

// Interiors chapter — same grid as the kitchen; add { src, alt, wide: true }.
const INTERIORS = [
  { src: '/molovata/molovata-interior-stone-table.webp', alt: 'Molovata — общий стол из рыжего камня под парящим светильником-диском, терракотовые стены', wide: true }
]

function Interiors() {
  if (!INTERIORS.length) return null
  return (
    <div className="mol-kitchen">
      {INTERIORS.map((g) => (
        <figure key={g.src} className={`mol-kitchen-item${g.wide ? ' wide' : ''}`}>
          <img src={g.src} alt={g.alt} loading="lazy" />
        </figure>
      ))}
    </div>
  )
}

function Kitchen() {
  return (
    <>
    <div className="mol-kitchen">
      {KITCHEN.map((g) => (
        <figure key={g.src} className="mol-kitchen-item">
          <img src={g.src} alt={g.alt} loading="lazy" />
        </figure>
      ))}
      <div className="mol-kitchen-text">
        <h3 className="mol-kitchen-h">Пример основного меню</h3>
        <p>{MENU_INTRO}</p>
        <ul className="mol-kitchen-list">
          {MENU_ITEMS.map(([k, v]) => <li key={k}><b>{k}:</b> {v}</li>)}
        </ul>
        <h3 className="mol-kitchen-h">Три фирменные позиции</h3>
        <p>{SIGNATURE_INTRO}</p>
        <ol className="mol-kitchen-list">
          {SIGNATURE.map(([k, v]) => <li key={k}><b>{k}</b> — {v}</li>)}
        </ol>
        <p>{DRINKS_NOTE}</p>
      </div>
    </div>
    <table className="mol-kitchen-table">
      <thead><tr><th>Формат</th><th>Что предложить</th><th>Как организовать</th></tr></thead>
      <tbody>
        {FORMATS.map(([a, b, c]) => <tr key={a}><th scope="row">{a}</th><td>{b}</td><td>{c}</td></tr>)}
      </tbody>
    </table>
    </>
  )
}

function Rituals() {
  return (
    <div className="mol-rituals">
      {RITUALS.map((r, i) =>
        r.divider ? (
          <h3 key={`d${i}`} className="mol-rituals-divider">{r.divider}</h3>
        ) : (
          <article key={r.n} className={`mol-ritual${r.image ? ' has-image' : ''}${i % 2 ? ' is-flipped' : ''}`}>
            <div className="mol-ritual-text">
              <div className="mol-ritual-num">{String(r.n).padStart(2, '0')}</div>
              <h3 className="mol-ritual-title">
                {r.title} <span className="mol-ritual-sub">— {r.sub}</span>
              </h3>
              <p className="mol-ritual-meta">{r.meta}</p>
              <p className="mol-ritual-body">{r.body}</p>
              <p className="mol-ritual-why"><span>Зачем:</span> {r.why}</p>
            </div>
            {r.image && (
              <figure className="mol-ritual-figure">
                <img src={r.image} srcSet={`${r.image.replace(".webp", "-m.webp")} 1000w, ${r.image} 1536w`} sizes="(max-width: 820px) 100vw, 45vw" alt={r.title} loading="lazy" />
              </figure>
            )}
          </article>
        )
      )}
      <div className="mol-daylogic">
        <h3 className="mol-rituals-divider">{DAY_LOGIC.title}</h3>
        {DAY_LOGIC.paragraphs.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
      </div>
    </div>
  )
}

export default function MolovataPage() {
  return (
    <SubpageShell current="/molovata" wide>
      {/* Full-screen hero: the pool terrace, edge to edge, under the fixed
          header. On scroll the photo evaporates like steam; the logo stays. */}
      <HeroFade>
        <div className="mol-hero-steam">
          <img
            className="mol-hero-bg"
            src="/molovata/molovata-hero-pool.webp"
            srcSet="/molovata/molovata-hero-pool-m.webp 1400w, /molovata/molovata-hero-pool.webp 3586w"
            sizes="100vw"
            alt="Molovata — pool terrace with stone gabion walls, loungers and hot tubs"
            fetchPriority="high"
          />
          <span className="mol-hero-mist" aria-hidden="true" />
        </div>
        <img className="mol-hero-logo" src="/molovata/molovata-logo-white.png" alt="" aria-hidden="true" />
        <h1 className="mol-hero-title visually-hidden">Molovata Wellness</h1>
      </HeroFade>
      <div className="mol-page">
        <section className="mol-section mol-intro">
          <div className="mol-intro-text">
          <p>
            В основе концепции — мировой сдвиг в велнес-индустрии: сауна выходит из подвала фитнес-клуба и
            превращается в самостоятельную экосистему гостеприимства, построенную вокруг тепла, холода, ритуала и
            общения. Molovata переносит эту логику на берег реки. Гостевой маршрут собран как драматургия: парение с
            мастером, охлаждение в Днестре, отдых у огня, чай из местных трав, общая трапеза. Плавучие сауны и понтоны
            выводят баню прямо на воду; тропы, гребля и зимние купания продолжают опыт за пределами стен.
          </p>
          <p>
            Удалённость участка — паромная переправа, непростая логистика — стала не ограничением, а идентичностью.
            Гастрономия строится на продуктовой автономии: собственная выпечка, копчение и ферментация, закупки у
            соседних хозяйств, короткое банное меню и ужины с общей подачей. Кухня места вместо ресторана «про всё».
          </p>
          <p>
            Проект задуман как бизнес-продукт: входной билет, ритуалы, проживание, события, членство и фермерская лавка
            формируют несколько источников дохода, а дизайн пространства работает на возвращаемость гостя. Технологии —
            браслет, предбронирование, управление водой и теплом — остаются невидимыми: сложная система внутри, простой
            и телесный опыт снаружи.
          </p>
          </div>
          <figure className="mol-intro-figure">
            <img src="/molovata/molovata-dniester-view.webp" alt="Днестр у Моловаты — вид с высокого берега" loading="lazy" />
          </figure>
        </section>
        {/* In-page menu: a horizontal strip of the landing's chapters. */}
        <nav className="mol-menu" aria-label="Разделы">
          {MENU.map((m, i) => (
            <a key={m.id} href={`#${m.id}`} className="mol-menu-item">
              <span className="mol-menu-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="mol-menu-label">{m.label}</span>
            </a>
          ))}
        </nav>

        {/* Chapters — filled with material as it comes in. */}
        {MENU.map((m) => (
          <section key={m.id} id={m.id} className="mol-section mol-chapter">
            <h2 className="mol-chapter-title">
              <img src={`/molovata/heading-${m.id}.png`} alt={m.label} />
            </h2>
            {m.id === 'architecture' && <SwipeGallery images={ARCHITECTURE} />}
            {m.id === 'branding' && <BrandingDrift />}
            {m.id === 'interiors' && <Interiors />}
            {m.id === 'kitchen' && <Kitchen />}
            {m.id === 'rituals' && <Rituals />}
          </section>
        ))}
      </div>
    </SubpageShell>
  )
}
