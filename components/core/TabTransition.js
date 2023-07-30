import { motion } from "framer-motion";
const customEase = [0.6, -0.05, 0.01, 0.99];

const TabTransition = ({ children }) => (
    <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 1.5, type: "cubic-bezier", ease: customEase }}
    >
        <div className="min-h-screen py-5">
            {children}
        </div>
    </motion.div>
);
export default TabTransition;