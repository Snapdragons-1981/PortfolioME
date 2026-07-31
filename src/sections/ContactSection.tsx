"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-20 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-4xl bg-slate-900/90 backdrop-blur-xl border border-pink-500/40 rounded-2xl p-8 shadow-2xl shadow-pink-500/20">
        <h1 className="text-4xl font-bold font-mono text-pink-400 mb-8 tracking-widest">
          CONTACT
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 p-4 bg-pink-500/10 rounded-xl border border-pink-500/30"
          >
            <Phone className="text-pink-400" size={32} />
            <div>
              <h3 className="text-white font-semibold">Phone</h3>
              <a href="tel:+639650649357" className="text-pink-300 font-mono hover:text-pink-200 transition">
                +63 965 064 9357
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 p-4 bg-pink-500/10 rounded-xl border border-pink-500/30"
          >
            <Mail className="text-pink-400" size={32} />
            <div>
              <h3 className="text-white font-semibold">Email</h3>
              <a href="mailto:ganaswenrick90@gmail.com" className="text-pink-300 font-mono hover:text-pink-200 transition">
                ganaswenrick90@gmail.com
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 p-4 bg-pink-500/10 rounded-xl border border-pink-500/30"
          >
            <MapPin className="text-pink-400" size={32} />
            <div>
              <h3 className="text-white font-semibold">Address</h3>
              <p className="text-pink-300 font-mono">
                9 Manuel Vega St., Consolacion, Cagayan De Oro City
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
