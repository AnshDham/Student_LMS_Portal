import { motion } from "framer-motion";
export default function PageHeader({ title, subtitle, emoji, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center justify-between gap-4 mb-6"
    >
      <div>
        <h1 className="text-3xl font-extrabold flex items-center gap-3">
          {emoji && <span className="text-4xl">{emoji}</span>}
          <span className="gradient-text">{title}</span>
        </h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <div className="flex gap-2">{children}</div>
    </motion.div>
  );
}
