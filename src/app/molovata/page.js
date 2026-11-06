import SubpageShell from '../../components/subpage/SubpageShell'
import HeroFade from './HeroFade'
import SwipeGallery from './SwipeGallery'
import { RITUALS, DAY_LOGIC } from './rituals'
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
  }
]

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
                <img src={r.image} alt={r.title} loading="lazy" />
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
            {m.id === 'rituals' && <Rituals />}
          </section>
        ))}
      </div>
    </SubpageShell>
  )
}
