import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-10 lg:p-20 items-center">
        <div className="space-y-6">
          <motion.h1
            className="text-4xl lg:text-6xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Интерьеры, которые влюбляют с первого взгляда
          </motion.h1>
          <p className="text-lg text-gray-700">
            Мы создаём атмосферные пространства для ресторанов, отелей и музеев по всему миру. От концепции до открытия — под ключ.
          </p>
          <button className="text-lg px-8 py-4 rounded-2xl shadow-lg bg-black text-white">
            Обсудить проект
          </button>
        </div>
        <motion.img
          src="/hero-project.jpg"
          alt="Проект дизайн-студии"
          className="w-full rounded-2xl shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </section>
    </main>
  );
}
