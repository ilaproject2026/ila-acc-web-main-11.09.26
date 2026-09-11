import { useState, useRef, useEffect } from 'react'
import { Plus, Minus, DollarSign, Receipt, TrendingUp, TrendingDown, Users, FileText, Printer, CheckCircle, Trash2, ShoppingCart, SendHorizontal, Building2, Wallet } from 'lucide-react'

interface LedgerEntry {
  id: string
  type: 'income' | 'expense'
  category: string
  description: string
  amount: number
  date: string
}

interface CommissionItem {
  id: string
  consultantName: string
  referralCode: string
  leadName: string
  program: string
  amount: number
  commissionRate: number
  status: 'Pending' | 'Paid'
  date: string
}

interface FranchiseIncome {
  id: string
  franchiseName: string
  source: string
  amount: number
  date: string
  status: 'Verified' | 'Pending'
}

interface FundPool {
  id: string
  fundName: string
  category: 'Operations' | 'Marketing' | 'Reserve' | 'Emergency'
  allocatedAmount: number
  utilizedAmount: number
}

import DepartmentApprovalsTab from './DepartmentApprovalsTab';
import DepartmentUpdatesTab from './DepartmentUpdatesTab';

export default function FinanceCommissionHub() {
  const [subTab, setSubTab] = useState<'ledger' | 'sales' | 'requests' | 'commission' | 'franchise' | 'funds' | 'approvals' | 'updates'>('ledger')

  // Sales/Payment milestones state
  const [salesRecords, setSalesRecords] = useState<any[]>(() => {
    const saved = localStorage.getItem('ilas_sales_records')
    return saved ? JSON.parse(saved) : [
      { id: 'S-101', clientName: 'Abhijith R', item: 'German A1-B2 Nursing Pathway', totalAmount: 145000, paidAmount: 45000, dueDate: '2026-09-10', status: 'Pending', flag: 'Pending' },
      { id: 'S-102', clientName: 'Meera Nair', item: 'Study Abroad Tech Premium', totalAmount: 45000, paidAmount: 45000, dueDate: '2026-08-01', status: 'Paid', flag: 'On Time' },
      { id: 'S-103', clientName: 'Sanjay Kumar', item: 'German Ausbildung Fast-Track', totalAmount: 95000, paidAmount: 20000, dueDate: '2026-08-10', status: 'Pending', flag: 'Delayed ⚠️' }
    ]
  })

  const [newSaleClient, setNewSaleClient] = useState('')
  const [newSaleItem, setNewSaleItem] = useState('German A1-B2 Nursing Pathway')
  const [newSaleTotal, setNewSaleTotal] = useState('')
  const [newSalePaid, setNewSalePaid] = useState('')
  const [newSaleDueDate, setNewSaleDueDate] = useState('')

  // Inter-department fund requests state
  const [fundRequests, setFundRequests] = useState<any[]>(() => {
    const saved = localStorage.getItem('ilas_fund_requests')
    return saved ? JSON.parse(saved) : [
      { id: 'REQ-201', department: 'Marketing Studio', amount: 15000, purpose: 'Meta Ads for B2 Nursing Campaign', priority: 'High', status: 'Pending' },
      { id: 'REQ-202', department: 'HR Hub', amount: 8000, purpose: 'ID Card printer ribbons & laminates', priority: 'Medium', status: 'Approved' }
    ]
  })

  const [reqDept, setReqDept] = useState<'Marketing Studio' | 'HR Hub' | 'Sales Team'>('Marketing Studio')
  const [reqAmount, setReqAmount] = useState('')
  const [reqPurpose, setReqPurpose] = useState('')
  const [reqPriority, setReqPriority] = useState<'Low' | 'Medium' | 'High'>('High')

  const [ledger, setLedger] = useState<LedgerEntry[]>(() => {
    const saved = localStorage.getItem('ilas_ledger')
    return saved ? JSON.parse(saved) : [
      { id: '1', type: 'income', category: 'Tuition Fee', description: 'German A1 Standard - Rahul K', amount: 15000, date: '2026-08-15' },
      { id: '2', type: 'income', category: 'Visa Processing', description: 'Student Visa Filing - Priya S', amount: 8500, date: '2026-08-14' },
      { id: '3', type: 'expense', category: 'Instructor Cost', description: 'Weekly payment - German Tutor (A1)', amount: 6000, date: '2026-08-14' },
      { id: '4', type: 'income', category: 'Tuition Fee', description: 'German A2 Fast-track - Amit V', amount: 18000, date: '2026-08-13' },
      { id: '5', type: 'expense', category: 'Instructor Cost', description: 'IELTS Tutor fee - Batch 3', amount: 4500, date: '2026-08-12' },
    ]
  })

  const [commissions, setCommissions] = useState<CommissionItem[]>(() => {
    const saved = localStorage.getItem('ilas_commissions')
    return saved ? JSON.parse(saved) : [
      { id: 'c1', consultantName: 'Anil Kumar', referralCode: 'ANIL-GER-2026', leadName: 'Rahul K', program: 'German Ausbildung Path', amount: 15000, commissionRate: 0.10, status: 'Paid', date: '2026-08-15' },
      { id: 'c2', consultantName: 'Sneha Patel', referralCode: 'SNEHA-MKT-99', leadName: 'Amit V', program: 'Study Abroad (Berlin Tech)', amount: 18000, commissionRate: 0.15, status: 'Pending', date: '2026-08-13' },
      { id: 'c3', consultantName: 'Vipin Das', referralCode: 'VIPIN-SALES-5', leadName: 'Geetha M', program: 'Nursing Job Placement', amount: 25000, commissionRate: 0.12, status: 'Pending', date: '2026-08-10' },
    ]
  })

  // New States for Franchise & Fund Pools
  const [franchiseIncomes, setFranchiseIncomes] = useState<FranchiseIncome[]>(() => {
    const saved = localStorage.getItem('ilas_franchise_incomes')
    return saved ? JSON.parse(saved) : [
      { id: 'F-01', franchiseName: 'Bangalore Central Branch', source: 'Franchise Royalty & Share', amount: 50000, date: '2026-08-18', status: 'Verified' },
      { id: 'F-02', franchiseName: 'Calicut Hub', source: 'Course Registration Split', amount: 25000, date: '2026-08-16', status: 'Verified' }
    ]
  })
  const [newFranchiseName, setNewFranchiseName] = useState('')
  const [newFranchiseAmount, setNewFranchiseAmount] = useState('')

  const [fundPools] = useState<FundPool[]>(() => {
    const saved = localStorage.getItem('ilas_fund_pools')
    return saved ? JSON.parse(saved) : [
      { id: 'FP-1', fundName: 'Core Operations Pool', category: 'Operations', allocatedAmount: 500000, utilizedAmount: 180000 },
      { id: 'FP-2', fundName: 'Q3 Marketing Reserve', category: 'Marketing', allocatedAmount: 200000, utilizedAmount: 95000 },
      { id: 'FP-3', fundName: 'Emergency Backup', category: 'Emergency', allocatedAmount: 300000, utilizedAmount: 0 }
    ]
  })

  // Ledger state inputs
  const [ledgerType, setLedgerType] = useState<'income' | 'expense'>('income')
  const [ledgerCategory, setLedgerCategory] = useState('Tuition Fee')
  const [ledgerDesc, setLedgerDesc] = useState('')
  const [ledgerAmount, setLedgerAmount] = useState('')
  const [ledgerDate, setLedgerDate] = useState(new Date().toISOString().split('T')[0])

  // Commission state inputs
  const [consultantName, setConsultantName] = useState('')
  const [refCode, setRefCode] = useState('')
  const [leadName, setLeadName] = useState('')
  const [programName, setProgramName] = useState('')
  const [dealAmount, setDealAmount] = useState('')
  const [commissionRate, setCommissionRate] = useState('10')

  // Invoice view state
  const [selectedInvoice, setSelectedInvoice] = useState<LedgerEntry | null>(null)
  const invoiceRef = useRef<HTMLDivElement>(null)

  // Sync state to localStorage whenever it changes
  useEffect(() => { localStorage.setItem('ilas_sales_records', JSON.stringify(salesRecords)) }, [salesRecords])
  useEffect(() => { localStorage.setItem('ilas_fund_requests', JSON.stringify(fundRequests)) }, [fundRequests])
  useEffect(() => { localStorage.setItem('ilas_ledger', JSON.stringify(ledger)) }, [ledger])
  useEffect(() => { localStorage.setItem('ilas_commissions', JSON.stringify(commissions)) }, [commissions])
  useEffect(() => { localStorage.setItem('ilas_franchise_incomes', JSON.stringify(franchiseIncomes)) }, [franchiseIncomes])
  useEffect(() => { localStorage.setItem('ilas_fund_pools', JSON.stringify(fundPools)) }, [fundPools])

  // Listen for payroll sync from HR Hub
  useEffect(() => {
    const handleLedgerChange = () => {
      const savedLedger = localStorage.getItem('ilas_ledger')
      if (savedLedger) {
        setLedger(JSON.parse(savedLedger))
      }
    }
    window.addEventListener('ilas-ledger-changed', handleLedgerChange)
    return () => window.removeEventListener('ilas-ledger-changed', handleLedgerChange)
  }, [])

  const handleAddSaleRecord = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSaleClient || !newSaleTotal || !newSalePaid) return

    const total = parseFloat(newSaleTotal)
    const paid = parseFloat(newSalePaid)
    const balance = total - paid
    const status = balance <= 0 ? 'Paid' : 'Pending'
    const isDelayed = newSaleDueDate && new Date(newSaleDueDate) < new Date()
    const flag = status === 'Paid' ? 'On Time' : (isDelayed ? 'Delayed ⚠️' : 'Pending')

    const newSale = {
      id: 'S-' + Math.floor(100 + Math.random() * 900),
      clientName: newSaleClient,
      item: newSaleItem,
      totalAmount: total,
      paidAmount: paid,
      dueDate: newSaleDueDate || new Date().toISOString().split('T')[0],
      status: status,
      flag: flag
    }

    setSalesRecords([newSale, ...salesRecords])
    setNewSaleClient('')
    setNewSaleTotal('')
    setNewSalePaid('')
    setNewSaleDueDate('')
  }

  const handleUpdatePayment = (id: string, amount: number) => {
    setSalesRecords(prev => prev.map(s => {
      if (s.id === id) {
        const newPaid = Math.min(s.totalAmount, s.paidAmount + amount)
        const status = s.totalAmount - newPaid <= 0 ? 'Paid' : 'Pending'
        return {
          ...s,
          paidAmount: newPaid,
          status,
          flag: status === 'Paid' ? 'On Time' : s.flag
        }
      }
      return s
    }))
  }

  const handleAddFundRequest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reqAmount || !reqPurpose) return

    const newReq = {
      id: 'REQ-' + Math.floor(200 + Math.random() * 800),
      department: reqDept,
      amount: parseFloat(reqAmount),
      purpose: reqPurpose,
      priority: reqPriority,
      status: 'Pending'
    }

    setFundRequests([newReq, ...fundRequests])
    setReqAmount('')
    setReqPurpose('')
  }

  const handleFundRequestAction = (id: string, action: 'Approved' | 'Rejected') => {
    setFundRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r))
  }

  const handleAddLedger = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ledgerDesc || !ledgerAmount) return
    const entry: LedgerEntry = {
      id: Date.now().toString(),
      type: ledgerType,
      category: ledgerCategory,
      description: ledgerDesc,
      amount: parseFloat(ledgerAmount),
      date: ledgerDate,
    }
    setLedger([entry, ...ledger])
    setLedgerDesc('')
    setLedgerAmount('')
  }

  const handleAddCommission = (e: React.FormEvent) => {
    e.preventDefault()
    if (!consultantName || !refCode || !leadName || !dealAmount) return
    const amt = parseFloat(dealAmount)
    const rate = parseFloat(commissionRate) / 100
    const comm: CommissionItem = {
      id: 'c-' + Date.now(),
      consultantName,
      referralCode: refCode,
      leadName,
      program: programName || 'German Language Training',
      amount: amt,
      commissionRate: rate,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    }
    setCommissions([comm, ...commissions])
    setConsultantName('')
    setRefCode('')
    setLeadName('')
    setProgramName('')
    setDealAmount('')
  }

  const handleAddFranchiseIncome = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFranchiseName || !newFranchiseAmount) return
    const newInc: FranchiseIncome = {
      id: 'F-' + Math.floor(100 + Math.random() * 900),
      franchiseName: newFranchiseName,
      source: 'Direct Franchise Portal',
      amount: parseFloat(newFranchiseAmount),
      date: new Date().toISOString().split('T')[0],
      status: 'Verified'
    }
    setFranchiseIncomes([newInc, ...franchiseIncomes])
    setNewFranchiseName('')
    setNewFranchiseAmount('')
  }

  const handleDeleteLedger = (id: string) => {
    setLedger(ledger.filter(item => item.id !== id))
    if (selectedInvoice?.id === id) {
      setSelectedInvoice(null)
    }
  }

  const handleToggleCommissionStatus = (id: string) => {
    setCommissions(commissions.map(c => c.id === id ? { ...c, status: c.status === 'Paid' ? 'Pending' : 'Paid' } : c))
  }

  const handlePrint = () => {
    if (!invoiceRef.current) return
    const printContent = invoiceRef.current.innerHTML
    const originalContent = document.body.innerHTML

    document.body.innerHTML = `
      <div style="padding: 40px; font-family: sans-serif;">
        ${printContent}
      </div>
    `
    window.print()
    document.body.innerHTML = originalContent
    window.location.reload()
  }

  const totalIncome = ledger.filter(item => item.type === 'income').reduce((sum, item) => sum + item.amount, 0)
  const totalExpense = ledger.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0)
  const netMargin = totalIncome - totalExpense

  return (
    <div className="space-y-6">
      {/* Top sub-tab switcher */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto no-scrollbar py-1">
        <button onClick={() => setSubTab('approvals')} className={`px-4 py-2 text-xs md:text-sm font-black border-b-2 transition-all whitespace-nowrap cursor-pointer ${subTab === 'approvals' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>✅ Approvals</button>
        <button onClick={() => setSubTab('updates')} className={`px-4 py-2 text-xs md:text-sm font-black border-b-2 transition-all whitespace-nowrap cursor-pointer ${subTab === 'updates' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>📡 Updates</button>
        <button
          onClick={() => setSubTab('ledger')}
          className={`px-4 py-2 text-xs md:text-sm font-black border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'ledger' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          💳 Income & Ledger
        </button>
        <button
          onClick={() => setSubTab('sales')}
          className={`px-4 py-2 text-xs md:text-sm font-black border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'sales' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🛒 Product Sales & POS
        </button>
        <button
          onClick={() => setSubTab('franchise')}
          className={`px-4 py-2 text-xs md:text-sm font-black border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'franchise' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🏢 Franchise Income
        </button>
        <button
          onClick={() => setSubTab('funds')}
          className={`px-4 py-2 text-xs md:text-sm font-black border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'funds' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          👛 Fund Management
        </button>
        <button
          onClick={() => setSubTab('requests')}
          className={`px-4 py-2 text-xs md:text-sm font-black border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'requests' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🏦 Inter-Dept Budgets
        </button>
        <button
          onClick={() => setSubTab('commission')}
          className={`px-4 py-2 text-xs md:text-sm font-black border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'commission' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          💰 Commission Payouts
        </button>
      </div>

      {/* 1. LEDGER SUB-TAB */}
      {subTab === 'ledger' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10">
                <TrendingUp className="w-48 h-48" />
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold opacity-90 uppercase tracking-wider">Total Revenue</span>
                <DollarSign className="w-5 h-5 bg-white/20 p-1 rounded-lg" />
              </div>
              <div className="text-3xl font-black">₹{totalIncome.toLocaleString('en-IN')}</div>
              <p className="text-[11px] mt-2 opacity-80">Tuition fees, visa & admissions</p>
            </div>

            <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10">
                <TrendingDown className="w-48 h-48" />
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold opacity-90 uppercase tracking-wider">Operating Expenses</span>
                <Minus className="w-5 h-5 bg-white/20 p-1 rounded-lg" />
              </div>
              <div className="text-3xl font-black">₹{totalExpense.toLocaleString('en-IN')}</div>
              <p className="text-[11px] mt-2 opacity-80">Instructors, utilities, and server expenses</p>
            </div>

            <div className={`bg-gradient-to-br ${netMargin >= 0 ? 'from-slate-800 to-slate-900' : 'from-amber-600 to-amber-700'} rounded-3xl p-6 text-white shadow-md relative overflow-hidden`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold opacity-90 uppercase tracking-wider">Net Margin (P&L)</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded font-black">
                  {netMargin >= 0 ? 'Profit' : 'Loss'}
                </span>
              </div>
              <div className="text-3xl font-black">₹{netMargin.toLocaleString('en-IN')}</div>
              <p className="text-[11px] mt-2 opacity-80">Real-time bottom line operating efficiency</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="font-black text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-brand-600" />
                Double-Entry Income & Expense Ledger
              </h3>
              <span className="text-xs bg-brand-50 text-brand-800 font-bold px-2.5 py-1 rounded-full">Live Audit Ledger</span>
            </div>

            <form onSubmit={handleAddLedger} className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
              <div className="col-span-2 flex items-center justify-between">
                <label className="font-bold text-slate-700">Transaction Type:</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setLedgerType('income'); setLedgerCategory('Tuition Fee'); }}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      ledgerType === 'income' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-200'
                    }`}
                  >
                    <Plus className="w-3 h-3" /> Income
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLedgerType('expense'); setLedgerCategory('Instructor Cost'); }}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      ledgerType === 'expense' ? 'bg-rose-600 text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-200'
                    }`}
                  >
                    <Minus className="w-3 h-3" /> Expense
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Category</label>
                <select
                  value={ledgerCategory}
                  onChange={(e) => setLedgerCategory(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl bg-white font-semibold text-slate-700 outline-none"
                >
                  {ledgerType === 'income' ? (
                    <>
                      <option value="Tuition Fee">Tuition Fee</option>
                      <option value="Visa Processing">Visa Processing</option>
                      <option value="Consultancy Fee">Consultancy Fee</option>
                      <option value="Franchise Share">Franchise Share</option>
                    </>
                  ) : (
                    <>
                      <option value="Instructor Cost">Instructor Cost</option>
                      <option value="Office Administrative">Office Administrative</option>
                      <option value="Marketing Spend">Marketing Spend</option>
                      <option value="Commission Payout">Commission Payout</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Date</label>
                <input
                  type="date"
                  value={ledgerDate}
                  onChange={(e) => setLedgerDate(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl bg-white font-semibold text-slate-700 outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-slate-600 font-bold mb-1">Description / Memo</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., German B2 Batch Course Fee"
                  value={ledgerDesc}
                  onChange={(e) => setLedgerDesc(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl font-medium outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-slate-600 font-bold mb-1">Amount (INR)</label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={ledgerAmount}
                  onChange={(e) => setLedgerAmount(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none"
                />
              </div>

              <button
                type="submit"
                className={`col-span-2 py-2 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                  ledgerType === 'income' ? 'bg-slate-900 hover:bg-slate-800' : 'bg-rose-900 hover:bg-rose-800'
                }`}
              >
                <Plus className="w-4 h-4" /> Add Transaction to Ledger
              </button>
            </form>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {ledger.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${item.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {item.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900">{item.description}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.category} • {item.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`font-black text-sm ${item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {item.type === 'income' ? '+' : '-'}₹{item.amount.toLocaleString('en-IN')}
                    </div>
                    <button
                      onClick={() => setSelectedInvoice(item)}
                      className="p-1 hover:bg-slate-100 rounded-md text-slate-500 cursor-pointer"
                      title="Generate Invoice Preview"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLedger(item.id)}
                      className="p-1 hover:bg-red-50 rounded-md text-red-500 cursor-pointer"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. SALES & POS SUB-TAB */}
      {subTab === 'sales' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="font-black text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-brand-600" />
                Product Sales & Milestone Payment Engine
              </h3>
              <span className="text-xs bg-brand-50 text-brand-800 font-bold px-2.5 py-1 rounded-full">Point of Sale</span>
            </div>

            <form onSubmit={handleAddSaleRecord} className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
              <div className="col-span-2">
                <label className="block text-slate-600 font-bold mb-1">Student / Client Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Mohammed Fayiz"
                  value={newSaleClient}
                  onChange={(e) => setNewSaleClient(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl font-semibold outline-none bg-white"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-slate-600 font-bold mb-1">Course / Product Category</label>
                <select
                  value={newSaleItem}
                  onChange={(e) => setNewSaleItem(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl bg-white font-semibold text-slate-700 outline-none"
                >
                  <option value="German A1-B2 Nursing Pathway">German Language & Nursing Pathway</option>
                  <option value="German Ausbildung Fast-Track">German Ausbildung Fast-Track</option>
                  <option value="Study Abroad Tech Premium">Study Abroad Consultation</option>
                  <option value="Visa Processing Service">Visa Processing Service</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Total Fee (INR)</label>
                <input
                  type="number"
                  required
                  placeholder="145000"
                  value={newSaleTotal}
                  onChange={(e) => setNewSaleTotal(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl font-bold outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Advance Paid (INR)</label>
                <input
                  type="number"
                  required
                  placeholder="45000"
                  value={newSalePaid}
                  onChange={(e) => setNewSalePaid(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl font-bold outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Next Due Date</label>
                <input
                  type="date"
                  value={newSaleDueDate}
                  onChange={(e) => setNewSaleDueDate(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl bg-white font-semibold outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-sm cursor-pointer"
                >
                  Log Product Sale
                </button>
              </div>
            </form>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {salesRecords.map((s) => (
                <div key={s.id} className="p-3 bg-white border border-slate-100 rounded-2xl flex justify-between items-center text-xs font-semibold text-slate-700">
                  <div>
                    <div className="font-extrabold text-slate-900">{s.clientName}</div>
                    <div className="text-[10px] text-slate-400 font-bold">{s.item} • Due: {s.dueDate}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Paid: ₹{s.paidAmount.toLocaleString('en-IN')} / Total: ₹{s.totalAmount.toLocaleString('en-IN')}</div>
                      <div className={`font-black ${s.flag.includes('Delayed') ? 'text-rose-600' : 'text-emerald-600'}`}>{s.flag}</div>
                    </div>
                    {s.status !== 'Paid' && (
                      <button
                        onClick={() => handleUpdatePayment(s.id, 10000)}
                        className="px-2 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200 hover:bg-emerald-100 text-[10px] cursor-pointer"
                      >
                        +₹10k Pay
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. FRANCHISE INCOME SUB-TAB */}
      {subTab === 'franchise' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                Franchise Portal & Branch Income Hub
              </h3>
              <span className="text-xs bg-indigo-50 text-indigo-800 font-bold px-2.5 py-1 rounded-full">Regional Branches</span>
            </div>

            <form onSubmit={handleAddFranchiseIncome} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Franchise / Branch Name</label>
                <input type="text" required placeholder="e.g., Kochi Metro Branch" value={newFranchiseName} onChange={(e) => setNewFranchiseName(e.target.value)} className="w-full p-2 border rounded-xl bg-white outline-none font-medium" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Revenue Share Amount (INR)</label>
                <input type="number" required placeholder="35000" value={newFranchiseAmount} onChange={(e) => setNewFranchiseAmount(e.target.value)} className="w-full p-2 border rounded-xl bg-white outline-none font-bold" />
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full py-2 bg-indigo-600 text-white font-bold rounded-xl cursor-pointer">Register Franchise Income</button>
              </div>
            </form>

            <div className="space-y-2">
              {franchiseIncomes.map(f => (
                <div key={f.id} className="p-3 bg-slate-50 border rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <div className="font-black text-slate-900">{f.franchiseName}</div>
                    <div className="text-[10px] text-slate-400">{f.source} • Date: {f.date}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-emerald-600 text-sm">₹{f.amount.toLocaleString('en-IN')}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">{f.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. FUND MANAGEMENT SUB-TAB */}
      {subTab === 'funds' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="font-black text-slate-900 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-600" />
                Enterprise Fund Pools & Allocation
              </h3>
              <span className="text-xs bg-amber-50 text-amber-800 font-bold px-2.5 py-1 rounded-full">Liquidity Control</span>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {fundPools.map(fp => (
                <div key={fp.id} className="p-4 bg-slate-50 border rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-slate-900 text-xs">{fp.fundName}</span>
                    <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-bold">{fp.category}</span>
                  </div>
                  <div className="text-lg font-black text-slate-800">₹{fp.allocatedAmount.toLocaleString('en-IN')}</div>
                  <div className="text-[11px] text-slate-500">Utilized: ₹{fp.utilizedAmount.toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. INTER-DEPT FUND REQUESTS */}
      {subTab === 'requests' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="font-black text-slate-900 flex items-center gap-2">
                <SendHorizontal className="w-5 h-5 text-brand-600" />
                Inter-Departmental Fund & Budget Requests
              </h3>
              <span className="text-xs bg-brand-50 text-brand-800 font-bold px-2.5 py-1 rounded-full">Budget Approvals</span>
            </div>

            <form onSubmit={handleAddFundRequest} className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Requesting Dept</label>
                <select
                  value={reqDept}
                  onChange={(e) => setReqDept(e.target.value as any)}
                  className="w-full p-2 border border-slate-200 rounded-xl bg-white font-semibold outline-none"
                >
                  <option value="Marketing Studio">Marketing Studio</option>
                  <option value="HR Hub">HR Hub</option>
                  <option value="Sales Team">Sales Team</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Required Amount (INR)</label>
                <input
                  type="number"
                  required
                  placeholder="25000"
                  value={reqAmount}
                  onChange={(e) => setReqAmount(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl font-bold outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Priority</label>
                <select
                  value={reqPriority}
                  onChange={(e) => setReqPriority(e.target.value as any)}
                  className="w-full p-2 border border-slate-200 rounded-xl bg-white font-bold outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-700 text-white font-bold rounded-xl hover:bg-indigo-800 shadow-sm cursor-pointer"
                >
                  Submit Request
                </button>
              </div>

              <div className="col-span-2 md:col-span-4">
                <label className="block text-slate-600 font-bold mb-1">Purpose / Justification</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Regional campus brochure printing and event banner setup"
                  value={reqPurpose}
                  onChange={(e) => setReqPurpose(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl font-medium outline-none bg-white"
                />
              </div>
            </form>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {fundRequests.map((r) => (
                <div key={r.id} className="p-3 bg-white border border-slate-100 rounded-2xl flex justify-between items-center text-xs font-semibold text-slate-700">
                  <div>
                    <div className="font-extrabold text-slate-900">{r.purpose}</div>
                    <div className="text-[10px] text-slate-400 font-bold">{r.department} • Priority: {r.priority}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm text-slate-900">₹{r.amount.toLocaleString('en-IN')}</span>
                    {r.status === 'Pending' ? (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleFundRequestAction(r.id, 'Approved')}
                          className="px-2 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px] cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleFundRequestAction(r.id, 'Rejected')}
                          className="px-2 py-1 bg-rose-600 text-white font-bold rounded-lg text-[10px] cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {r.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. COMMISSION SUB-TAB */}
      {subTab === 'commission' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h3 className="font-black text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-600" />
              Commission Calculator & Referrals
            </h3>
            <span className="text-xs bg-indigo-50 text-indigo-800 font-bold px-2.5 py-1 rounded-full">Junior Consultants</span>
          </div>

          <form onSubmit={handleAddCommission} className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
            <div>
              <label className="block text-slate-600 font-bold mb-1">Consultant Name</label>
              <input
                type="text"
                required
                placeholder="Sneha Patel"
                value={consultantName}
                onChange={(e) => setConsultantName(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-xl font-medium outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Referral Code</label>
              <input
                type="text"
                required
                placeholder="SNEHA-MKT-99"
                value={refCode}
                onChange={(e) => setRefCode(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-xl font-black text-slate-800 uppercase outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Enrolled Lead Name</label>
              <input
                type="text"
                required
                placeholder="Rahul K"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-xl font-medium outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Program / Package</label>
              <input
                type="text"
                placeholder="Study Abroad (Berlin Tech)"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-xl font-medium outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Deal Volume (INR)</label>
              <input
                type="number"
                required
                placeholder="15000"
                value={dealAmount}
                onChange={(e) => setDealAmount(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Commission Rate (%)</label>
              <select
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-700 outline-none"
              >
                <option value="5">5% (Standard)</option>
                <option value="10">10% (Associate)</option>
                <option value="12">12% (Executive)</option>
                <option value="15">15% (Special Campaign)</option>
              </select>
            </div>

            <button
              type="submit"
              className="col-span-2 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Compute & Attribute Commission
            </button>
          </form>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {commissions.map((c) => {
              const totalPayout = c.amount * c.commissionRate
              return (
                <div key={c.id} className="p-3 bg-white border border-slate-100 rounded-2xl flex justify-between items-center text-xs font-semibold text-slate-700">
                  <div>
                    <div className="font-extrabold text-slate-900">{c.consultantName}</div>
                    <div className="text-[10px] text-slate-400 font-bold">Referral ID: <span className="text-brand-700">{c.referralCode}</span> • Lead: {c.leadName}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-semibold">Stipend ({(c.commissionRate * 100)}%)</div>
                      <div className="font-black text-slate-900 text-sm">₹{totalPayout.toLocaleString('en-IN')}</div>
                    </div>
                    <button
                      onClick={() => handleToggleCommissionStatus(c.id)}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                        c.status === 'Paid' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'
                      }`}
                    >
                      <CheckCircle className="w-3 h-3" /> {c.status}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {subTab === 'approvals' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <DepartmentApprovalsTab departmentName="Finance Hub" />
        </div>
      )}

      {subTab === 'updates' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <DepartmentUpdatesTab departmentName="Finance Hub" />
        </div>
      )}

      {/* INVOICE MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedInvoice(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl flex flex-col border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-3xl">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-brand-700" />
                <h3 className="font-bold text-slate-900">View / Print Generated Invoice</h3>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm bg-white p-1 rounded-lg border border-slate-100 shadow-sm cursor-pointer"
              >
                Close Preview
              </button>
            </div>

            <div className="p-8" ref={invoiceRef}>
              <div className="border border-slate-200 rounded-2xl p-6 bg-white space-y-6 text-xs text-slate-600">
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">ILA GLOBAL ACADEMY</h2>
                    <p className="text-[10px] text-slate-400 leading-normal font-bold">Empowering Global Professional Careers</p>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1">Cochin, Kerala, India • admin@ilas.global</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-brand-900 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider mb-2">
                      Official Invoice
                    </span>
                    <div className="text-[10px] text-slate-400 font-semibold">Invoice No: <span className="font-bold text-slate-800">INV-{selectedInvoice.id}</span></div>
                    <div className="text-[10px] text-slate-400 font-semibold">Date: <span className="font-bold text-slate-800">{selectedInvoice.date}</span></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="font-bold text-slate-700">Billing Category Summary</div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <div className="font-extrabold text-slate-900">{selectedInvoice.description}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{selectedInvoice.category}</div>
                    </div>
                    <div className="font-black text-sm text-slate-900">
                      ₹{selectedInvoice.amount.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-800">Declaration & Terms:</div>
                    <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
                      Computer-generated transaction record for ILAS Global programs.
                    </p>
                  </div>
                  <div className="text-right min-w-[120px]">
                    <div className="text-[10px] text-slate-400 font-bold">Grand Total (INR)</div>
                    <div className="text-xl font-black text-slate-900">₹{selectedInvoice.amount.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-3xl">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-200 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Close View
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print or Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}