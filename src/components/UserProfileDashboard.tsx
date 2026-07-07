import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, db } from '@/firebaseConfig';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/components/ui/Toast';
import { 
  User as UserIcon, 
  Phone, 
  Building, 
  Briefcase, 
  History, 
  FileDown, 
  RotateCcw, 
  X, 
  Loader2, 
  Edit3, 
  Check, 
  LogOut,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { generateInvoicePDF } from '@/services/pdfService';

interface UserProfile {
  name: string;
  email: string;
  contact: string;
  to: string;
  attn: string;
}

interface OrderRecord {
  id: string;
  to: string;
  attn: string;
  name: string;
  contact: string;
  email: string;
  date: unknown;
  dateTime: string;
  location: string;
  quantity: number;
  meals: string[];
  menu: string;
  notes: string;
  status?: string;
  createdAt?: { seconds: number; nanoseconds: number };
}

interface UserProfileDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onReorder: (orderData: OrderRecord) => void;
}

export default function UserProfileDashboard({ isOpen, onClose, onReorder }: UserProfileDashboardProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit fields state
  const [editName, setEditName] = useState('');
  const [editContact, setEditContact] = useState('');
  const [editTo, setEditTo] = useState('');
  const [editAttn, setEditAttn] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Translation helpers
  const t = (en: string, bm: string) => (language === 'bm' ? bm : en);

  const fetchUserProfile = async (user: User) => {
    setIsLoadingProfile(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        setProfile(data);
        setEditName(data.name || '');
        setEditContact(data.contact || '');
        setEditTo(data.to || '');
        setEditAttn(data.attn || '');
      } else {
        // If profile doesn't exist yet, construct from Google login or defaults
        const defaultProfile: UserProfile = {
          name: user.displayName || '',
          email: user.email || '',
          contact: user.phoneNumber || '',
          to: '',
          attn: '',
        };
        setProfile(defaultProfile);
        setEditName(defaultProfile.name);
        setEditContact(defaultProfile.contact);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const fetchUserOrders = async (uid: string) => {
    if (!uid) return;
    setIsLoadingOrders(true);
    try {
      const ordersRef = collection(db, 'orders');
      // Read orders for this customer based on userId
      const q = query(
        ordersRef, 
        where('userId', '==', uid)
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedOrders: OrderRecord[] = [];
      querySnapshot.forEach((docSnap) => {
        fetchedOrders.push({
          id: docSnap.id,
          ...docSnap.data()
        } as OrderRecord);
      });

      // Sort by createdAt descending manually since composite index might not exist in sandbox
      fetchedOrders.sort((a, b) => {
        const aTime = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.dateTime || 0).getTime();
        const bTime = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.dateTime || 0).getTime();
        return bTime - aTime;
      });

      setOrders(fetchedOrders);
    } catch (err) {
      console.error('Error fetching user orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        fetchUserProfile(user);
        fetchUserOrders(user.uid);
      } else {
        setProfile(null);
        setOrders([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSaving(true);
    try {
      const updatedProfile = {
        name: editName,
        contact: editContact,
        to: editTo,
        attn: editAttn,
        updatedAt: new Date().toISOString()
      };

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, updatedProfile);
      
      setProfile((prev) => prev ? { ...prev, ...updatedProfile } : null);
      setIsEditing(false);
      
      toast({
        title: t('Profile Updated', 'Profil Dikemaskini'),
        description: t('Your profile details have been saved successfully.', 'Butiran profil anda telah berjaya disimpan.'),
        variant: 'success'
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      toast({
        title: t('Update Failed', 'Kemaskini Gagal'),
        description: t('Failed to update your corporate profile.', 'Gagal mengemaskini profil korporat anda.'),
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      toast({
        title: t('Signed Out', 'Log Keluar Berjaya'),
        description: t('Successfully signed out of your account.', 'Berjaya log keluar daripada akaun anda.'),
        variant: 'success'
      });
      onClose();
    } catch (err) {
      console.error('Sign Out error:', err);
    }
  };

  const handleDownloadPDF = (order: OrderRecord) => {
    try {
      toast({
        title: t('Downloading PDF...', 'Memuat Turun PDF...'),
        description: t('Generating your official preliminary document.', 'Menjana dokumen awal rasmi anda.'),
        variant: 'default'
      });

      // Standardize date and initial values
      const pdfData = {
        ...order,
        date: order.date || format(new Date(order.dateTime), 'yyyy-MM-dd'),
      };

      const pdfDoc = generateInvoicePDF(pdfData, false, language);
      pdfDoc.save(`Invois_Wawasan_${order.id}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      toast({
        title: t('Download Failed', 'Muat Turun Gagal'),
        description: t('Could not generate PDF document.', 'Gagal menjana dokumen PDF.'),
        variant: 'destructive'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'diluluskan':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'dibilkan':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'rejected':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'cancelled':
        return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
      case 'menunggu':
      default:
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'diluluskan':
        return t('Approved', 'Diluluskan');
      case 'dibilkan':
        return t('Billed (Official)', 'Telah Dibilkan');
      case 'rejected':
        return t('Rejected', 'Ditolak');
      case 'cancelled':
        return t('Cancelled', 'Dibatalkan');
      case 'menunggu':
      default:
        return t('Pending / Menunggu', 'Pending / Menunggu');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1500] flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0B0B0C]/85 backdrop-blur-sm"
        />

        {/* Sliding Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-xl h-full bg-[#141417] border-l border-[#222226] shadow-2xl flex flex-col z-10"
        >
          {/* Header */}
          <div className="h-[76px] px-6 border-b border-[#222226] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-[#F4F4F6] tracking-wide">
                  {t('Member Portal', 'Portal Ahli')}
                </h2>
                <p className="text-[10px] text-[#8E8E93] uppercase tracking-widest">
                  Restoran Wawasan
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleSignOut}
                title={t('Log Out', 'Log Keluar')}
                className="p-2 text-[#8E8E93] hover:text-[#rose-400] hover:bg-rose-500/10 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-[#8E8E93] hover:text-[#F4F4F6] hover:bg-[#222226] rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 font-sans">
            
            {/* 1. PROFILE PROFILE MANAGEMENT */}
            <div className="bg-[#0B0B0C] border border-[#222226] rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-1.5 bg-[#141417] border border-[#222226] text-[#C5A059] hover:text-[#F4F4F6] hover:border-[#C5A059]/40 rounded-lg transition-all duration-200"
                >
                  {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                </button>
              </div>

              <h3 className="text-xs uppercase tracking-wider font-bold text-[#C5A059] mb-4 flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                {t('Billing Profile Details', 'Profil Pengebilan Korporat')}
              </h3>

              {isLoadingProfile ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-[#C5A059]" />
                </div>
              ) : isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-4 text-sm text-[#F4F4F6]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#8E8E93] uppercase font-bold">{t('Name', 'Nama')}</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full h-10 px-3 bg-[#141417] border border-[#222226] rounded-lg text-xs text-[#F4F4F6] focus:border-[#C5A059]/50 focus:ring-1 focus:ring-[#C5A059]/50 outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#8E8E93] uppercase font-bold">{t('Contact', 'Telefon')}</label>
                      <input
                        type="text"
                        value={editContact}
                        onChange={(e) => setEditContact(e.target.value)}
                        className="w-full h-10 px-3 bg-[#141417] border border-[#222226] rounded-lg text-xs text-[#F4F4F6] focus:border-[#C5A059]/50 focus:ring-1 focus:ring-[#C5A059]/50 outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#8E8E93] uppercase font-bold">{t('Organization', 'Syarikat')}</label>
                      <input
                        type="text"
                        value={editTo}
                        onChange={(e) => setEditTo(e.target.value)}
                        className="w-full h-10 px-3 bg-[#141417] border border-[#222226] rounded-lg text-xs text-[#F4F4F6] focus:border-[#C5A059]/50 focus:ring-1 focus:ring-[#C5A059]/50 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#8E8E93] uppercase font-bold">{t('Attention (Attn)', 'Untuk Perhatian')}</label>
                      <input
                        type="text"
                        value={editAttn}
                        onChange={(e) => setEditAttn(e.target.value)}
                        className="w-full h-10 px-3 bg-[#141417] border border-[#222226] rounded-lg text-xs text-[#F4F4F6] focus:border-[#C5A059]/50 focus:ring-1 focus:ring-[#C5A059]/50 outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="h-10 px-4 bg-[#C5A059] text-[#0B0B0C] rounded-lg text-xs font-semibold hover:bg-[#E2C792] transition-colors duration-200 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    {t('Save Saved Details', 'Simpan Butiran Profil')}
                  </button>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#F4F4F6]">
                  <div className="flex gap-2.5 items-start">
                    <UserIcon className="w-4 h-4 text-[#8E8E93] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[9px] text-[#8E8E93] uppercase font-bold">{t('PIC Name', 'Nama PIC')}</span>
                      <span className="font-medium text-[#F4F4F6]">{profile?.name || '—'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <Phone className="w-4 h-4 text-[#8E8E93] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[9px] text-[#8E8E93] uppercase font-bold">{t('Phone Number', 'No. Telefon')}</span>
                      <span className="font-medium text-[#F4F4F6]">{profile?.contact || '—'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <Building className="w-4 h-4 text-[#8E8E93] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[9px] text-[#8E8E93] uppercase font-bold">{t('Company / Org', 'Organisasi / Syarikat')}</span>
                      <span className="font-medium text-[#F4F4F6]">{profile?.to || '—'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <Briefcase className="w-4 h-4 text-[#8E8E93] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[9px] text-[#8E8E93] uppercase font-bold">{t('Attention (Attn)', 'Untuk Perhatian (Attn)')}</span>
                      <span className="font-medium text-[#F4F4F6]">{profile?.attn || '—'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. ORDER HISTORY SECTION */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#C5A059] flex items-center gap-2">
                <History className="w-4 h-4" />
                {t('Catering Order History', 'Sejarah Tempahan Katering')}
              </h3>

              {isLoadingOrders ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#C5A059]" />
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-[#0B0B0C] border border-[#222226] rounded-xl p-8 text-center">
                  <p className="text-xs text-[#8E8E93]">
                    {t('No past catering orders found.', 'Tiada rekod tempahan katering dijumpai.')}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div 
                      key={order.id}
                      className="bg-[#0B0B0C] border border-[#222226] hover:border-[#C5A059]/20 rounded-xl p-4 transition-all duration-300 space-y-4"
                    >
                      {/* Top Row: Invoice + Status */}
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[10px] text-[#C5A059] font-mono block">
                            {order.invoiceNo || `RW-${order.id.slice(0, 8).toUpperCase()}`}
                          </span>
                          <span className="font-display font-bold text-xs text-[#F4F4F6] block mt-0.5">
                            {order.menu || 'Set box katering'} ({order.quantity} Pax)
                          </span>
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>

                      {/* Info block */}
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-[#8E8E93] border-t border-[#222226] pt-3">
                        <div>
                          <span className="block text-[8px] text-[#8E8E93]/60 uppercase">{t('Event Date', 'Tarikh Acara')}</span>
                          <span className="font-medium text-[#F4F4F6]">{order.date ? format(new Date(order.date), 'dd/MM/yyyy') : '—'}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-[#8E8E93]/60 uppercase">{t('Location', 'Lokasi')}</span>
                          <span className="font-medium text-[#F4F4F6] truncate block max-w-[150px]">{order.location || '—'}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 border-t border-[#222226] pt-3">
                        {/* Download PDF */}
                        <button
                          onClick={() => handleDownloadPDF(order)}
                          className="flex-1 h-9 bg-[#141417] border border-[#222226] text-xs text-[#F4F4F6] hover:text-[#C5A059] hover:border-[#C5A059]/30 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5"
                        >
                          <FileDown className="w-3.5 h-3.5 text-[#C5A059]" />
                          {t('Invoice PDF', 'Invois PDF')}
                        </button>

                        {/* One-click reorder */}
                        <button
                          onClick={() => {
                            onReorder(order);
                            onClose();
                          }}
                          className="flex-1 h-9 bg-[#C5A059]/10 border border-[#C5A059]/20 text-xs text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0B0B0C] rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 font-bold"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          {t('One-Click Reorder', 'Tempah Semula')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
