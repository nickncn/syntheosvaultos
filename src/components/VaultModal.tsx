import { AnimatePresence, motion } from "framer-motion";

export default function VaultModal({ open, onClose, children }: any) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-starknet-surface text-white p-6 rounded-2xl shadow-xl max-w-md w-full"
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                        <button
                            onClick={onClose}
                            className="mt-4 text-sm text-starknet-soft hover:underline"
                        >
                            Close
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
