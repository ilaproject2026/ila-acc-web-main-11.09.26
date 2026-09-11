import { MessageCircle, Phone, Mail } from 'lucide-react'

export default function FloatingContact() {
  return (
    <div className="fixed bottom-6 left-6 z-[80] group">
      <div className="absolute bottom-full left-0 mb-4 flex-col gap-2 items-start hidden group-hover:flex">
        <a href="#about" className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-lg hover:bg-brand-50 transition-colors border border-slate-100">
          <span className="text-sm font-medium text-slate-700 whitespace-nowrap">About Us</span>
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
            <span className="font-bold text-xs">ILA</span>
          </div>
        </a>
        <a href="mailto:contact@ilaglobal.com" className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-lg hover:bg-brand-50 transition-colors border border-slate-100">
          <span className="text-sm font-medium text-slate-700 whitespace-nowrap">contact@ilaglobal.com</span>
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
            <Mail className="w-4 h-4" />
          </div>
        </a>
        <a href="tel:+491234567890" className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-lg hover:bg-brand-50 transition-colors border border-slate-100">
          <span className="text-sm font-medium text-slate-700 whitespace-nowrap">+49 123 456 7890</span>
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
            <Phone className="w-4 h-4" />
          </div>
        </a>
      </div>
      <button className="w-14 h-14 bg-brand-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-brand-700 transition-colors hover:scale-105 active:scale-95 group-hover:rotate-12 duration-300">
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  )
}
