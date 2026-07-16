import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Timestamp } from 'firebase/firestore';
import { 
  LogOut, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  XCircle,
  Trash2, 
  Eye,
  Loader2,
  FileDown,
  Search,
  ArrowLeft,
  Send,
  Mail,
  MessageSquare,
  Activity,
  Wifi,
  Database,
  Cpu,
  RefreshCw,
  Terminal,
  Palette,
  Sun,
  Moon
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { generateInvoicePDF } from '@/services/pdfService';
import { numberToWords } from '@/services/numberToWordsBM';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Device } from '@capacitor/device';
import { removeSecureItem } from '@/lib/preferences';
import { getApiUrl } from '@/lib/api';
import { getAssetUrl } from '@/lib/utils';
import type { Order } from '@/types';

interface SerializedOrder extends Omit<Order, 'createdAt'> {
  createdAt: { seconds: number; nanoseconds: number } | null;
}

const MEAL_LABELS: Record<string, { en: string; bm: string }> = {
  breakfast: { en: 'Breakfast', bm: 'Sarapan' },
  lunch: { en: 'Lunch', bm: 'Makan Tengahari' },
  dinner: { en: 'Dinner', bm: 'Makan Malam' },
  tea_break: { en: 'Tea Break', bm: 'Minum Petang' },
  hi_tea: { en: 'Hi-Tea', bm: 'Minum Petang (Hi-Tea)' },
};

export default function AdminPanel({ adminToken, onLogout }: { adminToken?: string; onLogout?: () => void }) {
  const { t } = useLanguage();
  const { accent, updateAccentInDb } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Helper: builds the Authorization header sent with every admin API call.
  // Replaces the old pattern of resending the raw admin password in the
  // request body — the server now validates this short-lived JWT instead.
  const authHeaders = (): HeadersInit => ({
    'Content-Type': 'application/json',
    ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [generatingInvoice, setGeneratingInvoice] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  // PDF Preview States
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState('');
  const [previewFileName, setPreviewFileName] = useState('');

  // Send Invoice Dialog States
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [sendOrder, setSendOrder] = useState<Order | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  const [calendarState, setCalendarState] = useState<{
    ok: boolean;
    error?: string;
    loading: boolean;
  }>({ ok: false, loading: true });

  const [activeTab, setActiveTab] = useState<'orders' | 'diagnostics' | 'branding'>('orders');

  // Diagnostics states
  const [diagFirebase, setDiagFirebase] = useState<{ status: 'idle' | 'running' | 'pass' | 'fail'; message?: string; projectId?: string }>({ status: 'idle' });
  const [diagCalendar, setDiagCalendar] = useState<{ status: 'idle' | 'running' | 'pass' | 'fail'; message?: string; calendarsReturned?: number }>({ status: 'idle' });
  const [diagEmail, setDiagEmail] = useState<{ status: 'idle' | 'running' | 'pass' | 'fail'; message?: string }>({ status: 'idle' });
  const [diagPdf, setDiagPdf] = useState<{ status: 'idle' | 'running' | 'pass' | 'fail'; message?: string }>({ status: 'idle' });
  const [diagNative, setDiagNative] = useState<{
    status: 'idle' | 'running' | 'pass' | 'fail';
    details?: {
      isNative: boolean;
      platform: string;
      hasFilesystem: boolean;
      hasShare: boolean;
      userAgent?: string;
      deviceInfo?: Record<string, unknown>;
      deviceId?: Record<string, unknown>;
      batteryInfo?: Record<string, unknown>;
      error?: string;
    };
  }>({ status: 'idle' });
  
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);

  const [erudaEnabled, setErudaEnabled] = useState(
    () => localStorage.getItem('wawasan_eruda_enabled') === 'true'
  );

  const toggleEruda = async () => {
    const nextState = !erudaEnabled;
    setErudaEnabled(nextState);
    localStorage.setItem('wawasan_eruda_enabled', nextState ? 'true' : 'false');
    
    const erudaWin = window as unknown as { eruda?: { destroy: () => void } };
    
    if (nextState) {
      toast({
        title: "Developer Toolkit Enabled",
        description: "Loading inspector console... Look for the gear icon in the bottom-right corner of your screen.",
      });
      try {
        const erudaModule = await import('eruda');
        if (!document.getElementById('eruda') && !erudaWin.eruda) {
          erudaModule.default.init();
        }
      } catch (err) {
        console.error('Failed to load Eruda dynamically:', err);
        toast({
          title: "Toolkit Load Failed",
          description: "Could not load eruda module.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Developer Toolkit Disabled",
        description: "The inspector console has been deactivated. Refresh to fully unload.",
      });
      if (erudaWin.eruda) {
        try {
          erudaWin.eruda.destroy();
          erudaWin.eruda = undefined;
        } catch (e) {
          console.warn('Eruda destroy error:', e);
        }
      }
    }
  };

  const handleAccentChange = async (newAccent: 'sunshine' | 'kiwi') => {
    try {
      await updateAccentInDb(newAccent);
      toast({
        title: 'Branding Updated',
        description: `Theme accent color switched to ${newAccent === 'sunshine' ? 'Sunshine Orange' : 'Kiwi Green'} successfully.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Could not update global branding setting.';
      toast({
        title: 'Branding Update Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const runFirebaseDiag = async () => {
    setDiagFirebase({ status: 'running' });
    try {
      const response = await fetch(getApiUrl('/api/diagnostics/firebase'));
      if (response.ok) {
        const data = await response.json();
        setDiagFirebase({ status: 'pass', projectId: data.projectId });
      } else {
        const data = await response.json();
        setDiagFirebase({ status: 'fail', message: data.error || 'Failed to authenticate/write to Firestore' });
      }
    } catch (err: unknown) {
      setDiagFirebase({ status: 'fail', message: err instanceof Error ? err.message : 'Network connection failed' });
    }
  };

  const runCalendarDiag = async () => {
    setDiagCalendar({ status: 'running' });
    try {
      const response = await fetch(getApiUrl('/api/diagnostics/calendar'));
      if (response.ok) {
        const data = await response.json();
        setDiagCalendar({ status: 'pass', calendarsReturned: data.calendarsReturned });
      } else {
        const data = await response.json();
        setDiagCalendar({ status: 'fail', message: data.message || data.error || 'Google Calendar API connection failed' });
      }
    } catch (err: unknown) {
      setDiagCalendar({ status: 'fail', message: err instanceof Error ? err.message : 'Network connection failed' });
    }
  };

  const runNativeDiag = async () => {
    setDiagNative({ status: 'running' });
    try {
      const isNative = Capacitor.isNativePlatform();
      const platform = Capacitor.getPlatform();
      const hasFilesystem = typeof Filesystem !== 'undefined';
      const hasShare = typeof Share !== 'undefined';

      let deviceInfo: Record<string, unknown> | undefined;
      let deviceId: Record<string, unknown> | undefined;
      let batteryInfo: Record<string, unknown> | undefined;

      try {
        deviceInfo = (await Device.getInfo()) as unknown as Record<string, unknown>;
        deviceId = (await Device.getId()) as unknown as Record<string, unknown>;
      } catch (e) {
        console.warn('Device info or ID not available:', e);
      }

      try {
        batteryInfo = (await Device.getBatteryInfo()) as unknown as Record<string, unknown>;
      } catch (e) {
        console.warn('Battery info not available:', e);
      }
      
      setDiagNative({
        status: 'pass',
        details: {
          isNative,
          platform,
          hasFilesystem,
          hasShare,
          userAgent: navigator.userAgent,
          deviceInfo,
          deviceId,
          batteryInfo,
        }
      });
    } catch (err: unknown) {
      setDiagNative({ status: 'fail', details: { error: err instanceof Error ? err.message : String(err) } });
    }
  };

  const runPdfDiag = async () => {
    setDiagPdf({ status: 'running' });
    try {
      const pdfData = {
        id: 'diag_' + Math.random().toString(36).substring(2, 8),
        to: 'Pejabat Pentadbiran Diagnostik',
        attn: 'Bahagian Teknologi Maklumat',
        name: 'Sistem Diagnostik Wawasan',
        contact: '03-88880000',
        email: 'diagnostic-test@wawasan.com',
        dateTime: new Date().toISOString(),
        location: 'Blok B, Kompleks Kerajaan, Putrajaya',
        quantity: 50,
        meals: ['breakfast', 'lunch'],
        menu: 'Nasi Lemak Ayam Goreng, Teh Tarik, Buah-buahan',
        notes: 'Ujian diagnostik in-memory PDF generator.',
        status: 'approved' as const,
        prices: { breakfast: 7.50, lunch: 12.50 },
        totalAmount: 1000.00,
        lang: 'bm' as const,
        invoiceNo: 'DIAG-2026-0001'
      };

      const pdfDoc = generateInvoicePDF(pdfData as unknown as Parameters<typeof generateInvoicePDF>[0], true, 'bm');
      const dataUri = pdfDoc.output('datauristring');
      if (dataUri && dataUri.startsWith('data:application/pdf')) {
        setDiagPdf({ status: 'pass', message: 'PDF generated successfully (Size: ' + Math.round(dataUri.length / 1024) + ' KB)' });
      } else {
        setDiagPdf({ status: 'fail', message: 'PDF output is invalid' });
      }
    } catch (err: unknown) {
      setDiagPdf({ status: 'fail', message: err instanceof Error ? err.message : 'PDF Generation threw an unexpected exception' });
    }
  };

  const runSendTestEmail = async () => {
    if (!testEmailAddress) {
      toast({
        title: 'Error',
        description: 'Please enter a test recipient email address',
        variant: 'destructive'
      });
      return;
    }

    setIsSendingTestEmail(true);
    setDiagEmail({ status: 'running' });
    try {
      const response = await fetch(getApiUrl('/api/diagnostics/email'), {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          testEmail: testEmailAddress
        })
      });

      if (response.ok) {
        const data = await response.json();
        setDiagEmail({ status: 'pass', message: `Test email sent! Message ID: ${data.messageId}` });
        toast({
          title: 'Email Sent',
          description: 'Diagnostics test email dispatched successfully',
          variant: 'success'
        });
      } else {
        const data = await response.json();
        setDiagEmail({ status: 'fail', message: data.error || 'SMTP failed' });
        toast({
          title: 'Email Failed',
          description: data.error || 'Failed to send test email',
          variant: 'destructive'
        });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Network error';
      setDiagEmail({ status: 'fail', message: errorMsg });
      toast({
        title: 'Network Error',
        description: errorMsg,
        variant: 'destructive'
      });
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  const runAllDiagnostics = () => {
    runFirebaseDiag();
    runCalendarDiag();
    runNativeDiag();
    runPdfDiag();
  };

  const fetchCalendarState = async () => {
    try {
      const response = await fetch(getApiUrl('/api/diagnostics/calendar'));
      if (response.ok) {
        const data = await response.json();
        setCalendarState({
          ok: data.ok,
          error: data.message,
          loading: false
        });
      } else {
        const data = await response.json();
        setCalendarState({
          ok: false,
          error: data.message || data.error || 'Failed to authenticate',
          loading: false
        });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to connect to server';
      setCalendarState({
        ok: false,
        error: errorMsg,
        loading: false
      });
    }
  };

  const getCalendarEnableUrl = () => {
    if (!calendarState.error) return 'https://console.developers.google.com/apis/api/calendar-json.googleapis.com/overview?project=restoran-wawasan';
    const match = calendarState.error.match(/(https:\/\/console\S+)/);
    return match ? match[1] : 'https://console.developers.google.com/apis/api/calendar-json.googleapis.com/overview?project=restoran-wawasan';
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(getApiUrl('/api/admin/orders'), {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          action: 'fetch'
        })
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const formattedOrders = result.orders.map((order: SerializedOrder) => ({
            ...order,
            createdAt: order.createdAt ? new Timestamp(order.createdAt.seconds, order.createdAt.nanoseconds) : null
          }));
          setOrders(formattedOrders);
        }
      } else if (response.status === 401) {
        // Session token expired or invalid — force re-login rather than
        // leaving the admin looking at a panel where every action silently fails.
        console.warn('Admin session expired or invalid, logging out.');
        onLogout?.();
      } else {
        console.error('Failed to fetch orders from admin endpoint');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on load
  useEffect(() => {
    fetchOrders();
    fetchCalendarState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken]);

  const handleApprove = async (orderId: string) => {
    setIsApproving(true);
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      // Calculate total from prices
      const mealPrices: Record<string, number> = {};
      let total = 0;
      
      order.meals.forEach(meal => {
        const price = parseFloat(prices[meal] || '0');
        const roundedPrice = Math.round(price * 100) / 100;
        mealPrices[meal] = roundedPrice;
        total += roundedPrice * order.quantity;
      });

      total = Math.round(total * 100) / 100;

      const invoiceNo = order.invoiceNo || `RW${orderId.substring(0, 6).toUpperCase()}`;

      // Update meal prices and invoiceNo on the order document via secure admin endpoint
      const updateResponse = await fetch(getApiUrl('/api/admin/orders'), {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          action: 'update',
          orderId,
          data: {
            prices: mealPrices,
            invoiceNo,
            approvedAt: new Date().toISOString(),
          }
        })
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update order details on server');
      }

      // Generate and download PDF
      const pdfData = {
        ...order,
        prices: mealPrices,
        totalAmount: total,
        invoiceNo,
      };
      
      const pdfDoc = generateInvoicePDF(pdfData, true, order.lang);
      const fileName = `Invoice_${invoiceNo}.pdf`;
      
      if (Capacitor.isNativePlatform()) {
        try {
          const base64Data = pdfDoc.output('datauristring').split(',')[1];
          const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Cache
          });
          await Share.share({
            title: fileName,
            url: savedFile.uri,
          });
        } catch (shareErr) {
          console.error('Error sharing PDF on mobile:', shareErr);
        }
      } else {
        pdfDoc.save(fileName);
      }
      
      // Extract as a Base64 string and POST it to backend endpoint (/api/submissions/bill)
      try {
        const pdfBase64 = pdfDoc.output('datauristring').split(',')[1];
        
        const response = await fetch(getApiUrl('/api/submissions/bill'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            submissionId: orderId,
            totalAmount: total,
            pdfBase64: pdfBase64,
            fileName: fileName,
            collectionName: 'orders'
          })
        });
        
        if (!response.ok) {
          console.warn('Could not send email or update status via server. Have you configured SMTP in .env?');
        } else {
          console.log('Invoice email sent and document billed successfully via backend!');
        }
      } catch (err) {
        console.error('Error triggering billing and email API:', err);
      }

      setPrices({});
      setSelectedOrder(null);
      setIsDetailOpen(false);
      // Refresh the orders list to show updated status/invoice immediately
      fetchOrders();
      
      toast({
        title: t('success'),
        description: t('order_approved'),
        variant: 'success',
        duration: 5000
      });
    } catch (error) {
      console.error('Error approving order:', error);
      toast({
        title: t('error'),
        description: t('error_approving'),
        variant: 'error'
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm(t('delete_order_confirm'))) return;
    
    try {
      const response = await fetch(getApiUrl('/api/admin/orders'), {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          action: 'delete',
          orderId
        })
      });
      if (response.ok) {
        toast({
          title: t('success'),
          description: t('order_deleted'),
          variant: 'success'
        });
        fetchOrders();
      } else {
        throw new Error('Failed to delete order via Admin API');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: t('error'),
        description: 'Failed to delete order.',
        variant: 'error'
      });
    }
  };

  const handleRejectCancellation = async (orderId: string) => {
    const confirmReject = confirm("Are you sure you want to REJECT this cancellation request? This will restore the order status to Approved.");
    if (!confirmReject) return;

    setIsApproving(true);
    try {
      const response = await fetch(getApiUrl('/api/admin/orders'), {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          action: 'update',
          orderId,
          data: {
            status: 'approved',
            rejectedCancellationAt: new Date().toISOString()
          }
        })
      });

      if (response.ok) {
        toast({
          title: t('success') || 'Success',
          description: 'Cancellation request rejected. Order status restored to Approved.',
          variant: 'success'
        });
        setIsDetailOpen(false);
        fetchOrders();
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error rejecting cancellation:', error);
      toast({
        title: t('error') || 'Error',
        description: 'Failed to reject cancellation request.',
        variant: 'error'
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handlePreviewPDF = async (order: Order, isFinal: boolean) => {
    try {
      let pdfData = order;
      let invoiceNo = order.invoiceNo;
      
      if (!isFinal) {
        invoiceNo = `RW${order.id.substring(0, 6).toUpperCase()}-PRE`;
        pdfData = { ...order, invoiceNo };
      }

      const pdfDoc = generateInvoicePDF(pdfData, isFinal, order.lang);
      const fileName = `${isFinal ? 'Invoice' : 'Preliminary'}_${invoiceNo}.pdf`;

      if (Capacitor.isNativePlatform()) {
        const base64Data = pdfDoc.output('datauristring').split(',')[1];
        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Cache
        });
        await Share.share({
          title: fileName,
          url: savedFile.uri,
        });
      } else {
        const pdfDataUri = pdfDoc.output('datauristring');
        setPreviewPdfUrl(pdfDataUri);
        setPreviewFileName(fileName);
        setIsPreviewOpen(true);
      }
    } catch (error: unknown) {
      console.error('Error in preview:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast({
        title: t('error'),
        description: 'Preview Error: ' + errorMessage,
        variant: 'error'
      });
    }
  };

  const handleDownloadPDF = (order: Order, isFinal: boolean) => {
    setGeneratingInvoice(order.id);
    
    setTimeout(async () => {
      try {
        let pdfData = order;
        let invoiceNo = order.invoiceNo;
        
        if (!isFinal) {
          invoiceNo = `RW${order.id.substring(0, 6).toUpperCase()}-PRE`;
          pdfData = { ...order, invoiceNo };
        }

        const pdfDoc = generateInvoicePDF(pdfData, isFinal, order.lang);
        const fileName = `${isFinal ? 'Invoice' : 'Preliminary'}_${invoiceNo}.pdf`;

        if (Capacitor.isNativePlatform()) {
          const base64Data = pdfDoc.output('datauristring').split(',')[1];
          const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Cache
          });
          await Share.share({
            title: fileName,
            url: savedFile.uri,
          });
        } else {
          pdfDoc.save(fileName);
        }
      } catch (error: unknown) {
        console.error('Error in download:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        toast({
          title: t('error'),
          description: 'Download Error: ' + errorMessage,
          variant: 'error'
        });
      } finally {
        setGeneratingInvoice(null);
      }
    }, 500);
  };

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    if (order.status === 'approved' && order.prices) {
      const priceStrings = Object.keys(order.prices).reduce((acc, key) => {
        acc[key] = order.prices[key].toString();
        return acc;
      }, {} as Record<string, string>);
      setPrices(priceStrings);
    } else {
      setPrices({});
    }
    setIsDetailOpen(true);
  };

  const openSendDialog = (order: Order) => {
    setSendOrder(order);
    setRecipientEmail(order.email || '');
    setRecipientPhone(order.contact || '');
    setIsSendDialogOpen(true);
  };

  const handleSendEmail = async () => {
    if (!sendOrder) return;
    setSendingEmail(true);

    try {
      const invoiceNo = sendOrder.invoiceNo || `RW${sendOrder.id.substring(0, 6).toUpperCase()}`;
      
      // Generate the PDF
      const pdfDoc = generateInvoicePDF(sendOrder, sendOrder.status === 'approved', sendOrder.lang);
      const pdfBase64 = pdfDoc.output('datauristring');

      const response = await fetch(getApiUrl('/api/send-invoice'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: recipientEmail,
          name: sendOrder.name,
          invoiceNo,
          pdfBase64,
          isFinal: sendOrder.status === 'approved',
          lang: sendOrder.lang
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send email. Please verify SMTP is configured.');
      }

      toast({
        title: t('invoice_emailed'),
        description: t('invoice_emailed_desc').replace('{email}', recipientEmail),
        variant: 'success',
        duration: 4000
      });
      setIsSendDialogOpen(false);
    } catch (err: unknown) {
      console.error('Error sending invoice email:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast({
        title: t('sending_failed'),
        description: errorMessage || t('sending_failed_desc'),
        variant: 'error'
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const formatPhoneForWhatsApp = (phone: string) => {
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0')) {
      clean = '60' + clean.slice(1);
    } else if (!clean.startsWith('6')) {
      clean = '60' + clean;
    }
    return clean;
  };

  const handleSendWhatsApp = () => {
    if (!sendOrder) return;

    const invoiceNo = sendOrder.invoiceNo || `RW${sendOrder.id.substring(0, 6).toUpperCase()}`;
    const total = sendOrder.totalAmount || sendOrder.meals.reduce((sum, meal) => {
      const price = sendOrder.prices?.[meal] || 0;
      return sum + (price * sendOrder.quantity);
    }, 0);
    
    const eventDate = sendOrder.dateTime ? format(new Date(sendOrder.dateTime), 'PP') : '-';
    const formattedPhone = formatPhoneForWhatsApp(recipientPhone);

    const msgEn = `Hello *${sendOrder.name}*,\n\nThis is Restoran Wawasan. 🍽️\n\nHere is the invoice for your catering booking:\n- No. Invoice: *${invoiceNo}*\n- Event Date: *${eventDate}*\n- Quantity: *${sendOrder.quantity} pax*\n- Preferred Menu: *${sendOrder.menu || '-'}*\n- Total Amount: *RM ${total.toFixed(2)}*\n\nPlease check your email (${recipientEmail}) for the official PDF invoice attachment. If you have any questions, feel free to contact us.\n\nThank you for choosing Restoran Wawasan!`;
    
    const msgBm = `Salam *${sendOrder.name}*,\n\nIni daripada Restoran Wawasan. 🍽️\n\nBerikut adalah invois untuk tempahan katering anda:\n- No. Invois: *${invoiceNo}*\n- Tarikh Majlis: *${eventDate}*\n- Kuantiti: *${sendOrder.quantity} pax*\n- Menu Pilihan: *${sendOrder.menu || '-'}*\n- Jumlah Keseluruhan: *RM ${total.toFixed(2)}*\n\nSila semak emel anda (${recipientEmail}) untuk lampiran rasmi PDF invois. Jika ada sebarang pertanyaan, sila hubungi kami.\n\nTerima kasih kerana memilih Restoran Wawasan!`;

    const messageText = sendOrder.lang === 'bm' ? msgBm : msgEn;
    const encodedText = encodeURIComponent(messageText);
    
    window.open(`https://wa.me/${formattedPhone}?text=${encodedText}`, '_blank');

    toast({
      title: t('whatsapp_opened'),
      description: t('whatsapp_opened_desc'),
      variant: 'success',
      duration: 5000
    });
    setIsSendDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'cancel_requested':
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-bold animate-pulse">{t('cancel_requested') || 'Cancel Requested'}</Badge>;
      case 'billed':
        return <Badge className="bg-kiwi/10 text-kiwi border-kiwi/20">{t('billed')}</Badge>;
      case 'approved':
        return <Badge className="bg-kiwi/10 text-kiwi border-kiwi/20">{t('approved')}</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{t('cancelled')}</Badge>;
      case 'rejected':
        return <Badge className="bg-tomato-burst/10 text-tomato-burst border-tomato-burst/20">{t('rejected')}</Badge>;
      default:
        return <Badge className="bg-sunshine/10 text-sunshine border-sunshine/20">{t('pending')}</Badge>;
    }
  };

  const filteredOrders = orders.filter(order => 
    order.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-cream dark:bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-deep-forest/60">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>{t('loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cream/90 dark:bg-background/90 backdrop-blur-xl border-b border-sunshine/10 pt-[var(--sat)]">
        <div className="flex items-center justify-between px-6 md:px-12 h-[72px]">
          <div className="flex items-center gap-4">
            <div onClick={() => navigate('/home', { replace: true })} className="flex items-center gap-3 group cursor-pointer">
              <img
                src={getAssetUrl("/assets/wawasan_logo.jpg")}
                alt="Restoran Wawasan Logo"
                className="w-10 h-10 object-contain shrink-0 mix-blend-multiply"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="font-display font-semibold text-xl text-deep-forest leading-none">
                  Wawasan
                </span>
                <span className="block font-body text-xs text-deep-forest/60 leading-tight mt-0.5">
                  Admin
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 md:p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-deep-forest" />
              ) : (
                <Sun className="w-5 h-5 text-sunshine" />
              )}
            </button>
            <Button variant="ghost" onClick={() => navigate('/home', { replace: true })} className="text-deep-forest hover:text-sunshine hover:bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('back')}
            </Button>
            <Button 
              variant="ghost" 
              className="text-deep-forest/60 hover:text-red-400 hover:bg-red-500/10"
              onClick={async () => {
                if (onLogout) {
                  onLogout();
                } else {
                  // Fallback in case this component is ever rendered without
                  // the onLogout prop wired — still clears auth state.
                  await removeSecureItem('wawasan_admin_authenticated');
                  window.location.reload();
                }
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('logout')}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-[calc(72px+var(--sat)+2rem)]">
        <div className="p-6 md:p-8">
          {/* Page Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-deep-forest mb-2">
                {t('orders')}
              </h1>
              <p className="text-deep-forest/50">
                {t('orders_subtitle')}
              </p>
            </div>
            
            {calendarState.loading ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-cream dark:bg-background/5 text-deep-forest/50 border border-deep-forest/10 rounded-md">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Checking Calendar Sync...</span>
              </div>
            ) : calendarState.ok ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-md" title="Google Calendar Sync is fully operational.">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Calendar Auto-Synced</span>
              </div>
            ) : calendarState.error && (calendarState.error.includes('disabled') || calendarState.error.includes('not been used')) ? (
              <div className="flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md" title="Google Calendar API must be enabled.">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">Calendar API Disabled</span>
                </div>
                <a 
                  href={getCalendarEnableUrl()} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-amber-400 hover:text-amber-300 underline transition-colors"
                >
                  Click here to enable Google Calendar API
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md" title={calendarState.error || "Calendar is not fully synced."}>
                <XCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Calendar Sync Offline</span>
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-sunshine/10 mb-8">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-all duration-200 ${
                activeTab === 'orders'
                  ? 'border-sunshine text-sunshine bg-sunshine/5'
                  : 'border-transparent text-deep-forest/50 hover:text-deep-forest/80 hover:bg-deep-forest/5'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{t('orders') || 'Orders'}</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('diagnostics');
                runAllDiagnostics();
              }}
              className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-all duration-200 ${
                activeTab === 'diagnostics'
                  ? 'border-sunshine text-sunshine bg-sunshine/5'
                  : 'border-transparent text-deep-forest/50 hover:text-deep-forest/80 hover:bg-deep-forest/5'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Diagnostics</span>
            </button>
            <button
              onClick={() => setActiveTab('branding')}
              className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-all duration-200 ${
                activeTab === 'branding'
                  ? 'border-sunshine text-sunshine bg-sunshine/5'
                  : 'border-transparent text-deep-forest/50 hover:text-deep-forest/80 hover:bg-deep-forest/5'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Branding</span>
            </button>
          </div>

          {activeTab === 'orders' ? (
            <>
              {/* Search */}
              <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-forest/40" />
                <Input
                  placeholder={t('search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-deep-brown border-sunshine/20 text-deep-forest placeholder:text-deep-forest/30 focus:border-sunshine/50"
                />
              </div>

              {/* Orders Table */}
              <div className="bg-deep-brown rounded-xl border border-sunshine/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-sunshine/10 hover:bg-transparent">
                        <TableHead className="text-deep-forest/60">{t('date')}</TableHead>
                        <TableHead className="text-deep-forest/60">{t('quantity')}</TableHead>
                        <TableHead className="text-deep-forest/60">{t('status')}</TableHead>
                        <TableHead className="text-deep-forest/60 text-right">{t('actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-deep-forest/40 py-12">
                            {t('no_orders')}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredOrders.map((order) => (
                          <TableRow key={order.id} className={`border-sunshine/10 hover:bg-sunshine/5 ${order.status === 'cancel_requested' ? 'bg-amber-500/5 border-l-4 border-l-amber-500' : ''}`}>
                            <TableCell className="text-deep-forest/70">
                              {order.dateTime ? format(new Date(order.dateTime), 'PP') : '-'}
                            </TableCell>
                            <TableCell className="text-deep-forest/70">
                              {order.quantity} pax
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(order.status)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title={t('view_edit_details')}
                                  className="text-deep-forest/60 hover:text-sunshine hover:bg-sunshine/10"
                                  onClick={() => openOrderDetail(order)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title={t('preview_pdf')}
                                  className="text-deep-forest/60 hover:text-blue-400 hover:bg-blue-500/10"
                                  onClick={() => handlePreviewPDF(order, order.status === 'approved')}
                                >
                                  <FileText className="w-4 h-4" />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title={t('download_pdf')}
                                  className="text-deep-forest/60 hover:text-green-400 hover:bg-green-500/10"
                                  onClick={() => handleDownloadPDF(order, order.status === 'approved')}
                                  disabled={generatingInvoice === order.id}
                                >
                                  {generatingInvoice === order.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <FileDown className="w-4 h-4" />
                                  )}
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title={t('send_pdf')}
                                  className="text-deep-forest/60 hover:text-sunshine hover:bg-sunshine/10"
                                  onClick={() => openSendDialog(order)}
                                >
                                  <Send className="w-4 h-4" />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title={t('delete_order')}
                                  className="text-deep-forest/60 hover:text-red-400 hover:bg-red-500/10"
                                  onClick={() => handleDelete(order.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          ) : activeTab === 'diagnostics' ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-cream dark:bg-background/50 border border-sunshine/10 rounded-xl gap-4">
                <div>
                  <h3 className="font-display font-bold text-deep-forest text-lg">System Diagnostics</h3>
                  <p className="text-xs text-deep-forest/50 mt-1">Verify health and credentials of automated backend services and PDF capabilities.</p>
                </div>
                <Button 
                  onClick={runAllDiagnostics}
                  className="bg-sunshine hover:bg-[#E0BC74] text-charcoal font-semibold flex items-center gap-2 text-xs"
                >
                  <RefreshCw className="w-4 h-4" />
                  Run All Diagnostics
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Firebase Connectivity */}
                <div className="p-5 bg-deep-brown border border-sunshine/10 rounded-xl space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-yellow-500/10 text-yellow-500 rounded-lg">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-deep-forest">Firestore Database</h4>
                        <p className="text-xs text-deep-forest/40">Writes/reads of orders & invoice counters</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={runFirebaseDiag}
                      disabled={diagFirebase.status === 'running'}
                      className="border-sunshine/20 text-deep-forest text-xs hover:bg-sunshine/5"
                    >
                      Test
                    </Button>
                  </div>

                  <div className="pt-2 border-t border-deep-forest/5 flex items-center justify-between text-xs">
                    <span className="text-deep-forest/50">Status:</span>
                    {diagFirebase.status === 'idle' && <span className="text-deep-forest/40 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cream dark:bg-background/30"></span>Idle</span>}
                    {diagFirebase.status === 'running' && <span className="text-sunshine flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" />Running</span>}
                    {diagFirebase.status === 'pass' && <span className="text-green-400 flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" />Connected</span>}
                    {diagFirebase.status === 'fail' && <span className="text-red-400 flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" />Failed</span>}
                  </div>

                  {diagFirebase.status === 'pass' && (
                    <div className="p-3 bg-green-500/5 border border-green-500/10 rounded-lg text-xs font-mono text-green-300">
                      <div>✓ Production Firebase Access</div>
                      <div className="mt-1 text-[10px] opacity-70">Project ID: {diagFirebase.projectId}</div>
                    </div>
                  )}

                  {diagFirebase.status === 'fail' && (
                    <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg text-xs font-mono text-red-300 break-all">
                      <div>✕ Connection Error</div>
                      <div className="mt-1 text-[10px] opacity-70">{diagFirebase.message}</div>
                    </div>
                  )}
                </div>

                {/* Google Calendar Sync */}
                <div className="p-5 bg-deep-brown border border-sunshine/10 rounded-xl space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-lg">
                        <Wifi className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-deep-forest">Google Calendar API</h4>
                        <p className="text-xs text-deep-forest/40">Automated event publishing</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={runCalendarDiag}
                      disabled={diagCalendar.status === 'running'}
                      className="border-sunshine/20 text-deep-forest text-xs hover:bg-sunshine/5"
                    >
                      Test
                    </Button>
                  </div>

                  <div className="pt-2 border-t border-deep-forest/5 flex items-center justify-between text-xs">
                    <span className="text-deep-forest/50">Status:</span>
                    {diagCalendar.status === 'idle' && <span className="text-deep-forest/40 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cream dark:bg-background/30"></span>Idle</span>}
                    {diagCalendar.status === 'running' && <span className="text-sunshine flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" />Running</span>}
                    {diagCalendar.status === 'pass' && <span className="text-green-400 flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" />Online</span>}
                    {diagCalendar.status === 'fail' && <span className="text-red-400 flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" />Failed</span>}
                  </div>

                  {diagCalendar.status === 'pass' && (
                    <div className="p-3 bg-green-500/5 border border-green-500/10 rounded-lg text-xs font-mono text-green-300">
                      <div>✓ Service Account authenticated</div>
                      <div className="mt-1 text-[10px] opacity-70">Calendars found: {diagCalendar.calendarsReturned}</div>
                    </div>
                  )}

                  {diagCalendar.status === 'fail' && (
                    <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg text-xs font-mono text-red-300 break-all">
                      <div>✕ Authentication / Scope Issue</div>
                      <div className="mt-1 text-[10px] opacity-70">{diagCalendar.message}</div>
                    </div>
                  )}
                </div>

                {/* PDF Generation Integrity */}
                <div className="p-5 bg-deep-brown border border-sunshine/10 rounded-xl space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-lg">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-deep-forest">Client PDF Engine</h4>
                        <p className="text-xs text-deep-forest/40">In-memory jsPDF & formatting engine</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={runPdfDiag}
                      disabled={diagPdf.status === 'running'}
                      className="border-sunshine/20 text-deep-forest text-xs hover:bg-sunshine/5"
                    >
                      Test
                    </Button>
                  </div>

                  <div className="pt-2 border-t border-deep-forest/5 flex items-center justify-between text-xs">
                    <span className="text-deep-forest/50">Status:</span>
                    {diagPdf.status === 'idle' && <span className="text-deep-forest/40 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cream dark:bg-background/30"></span>Idle</span>}
                    {diagPdf.status === 'running' && <span className="text-sunshine flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" />Running</span>}
                    {diagPdf.status === 'pass' && <span className="text-green-400 flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" />Pass</span>}
                    {diagPdf.status === 'fail' && <span className="text-red-400 flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" />Failed</span>}
                  </div>

                  {diagPdf.status === 'pass' && (
                    <div className="p-3 bg-green-500/5 border border-green-500/10 rounded-lg text-xs font-mono text-green-300">
                      <div>✓ PDF logic generated layout cleanly</div>
                      <div className="mt-1 text-[10px] opacity-70">{diagPdf.message}</div>
                    </div>
                  )}

                  {diagPdf.status === 'fail' && (
                    <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg text-xs font-mono text-red-300 break-all">
                      <div>✕ PDF Service Error</div>
                      <div className="mt-1 text-[10px] opacity-70">{diagPdf.message}</div>
                    </div>
                  )}
                </div>

                {/* Native / APK Integration Info */}
                <div className="p-5 bg-deep-brown border border-sunshine/10 rounded-xl space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-lg">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-deep-forest">App Environment</h4>
                        <p className="text-xs text-deep-forest/40">WebView context & Native APIs</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={runNativeDiag}
                      disabled={diagNative.status === 'running'}
                      className="border-sunshine/20 text-deep-forest text-xs hover:bg-sunshine/5"
                    >
                      Test
                    </Button>
                  </div>

                  <div className="pt-2 border-t border-deep-forest/5 flex items-center justify-between text-xs">
                    <span className="text-deep-forest/50">Status:</span>
                    {diagNative.status === 'idle' && <span className="text-deep-forest/40 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cream dark:bg-background/30"></span>Idle</span>}
                    {diagNative.status === 'running' && <span className="text-sunshine flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" />Running</span>}
                    {diagNative.status === 'pass' && <span className="text-green-400 flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" />Pass</span>}
                    {diagNative.status === 'fail' && <span className="text-red-400 flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" />Failed</span>}
                  </div>

                  {diagNative.status === 'pass' && diagNative.details && (
                    <div className="p-3 bg-green-500/5 border border-green-500/10 rounded-lg text-xs font-mono text-green-300 space-y-1">
                      <div className="flex justify-between">
                        <span className="opacity-60">Context:</span>
                        <span>{diagNative.details.isNative ? 'Native (APK)' : 'Web Browser'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-60">Platform:</span>
                        <span>{diagNative.details.platform}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-60">Filesystem:</span>
                        <span>{diagNative.details.hasFilesystem ? 'Available' : 'Unavailable'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-60">Share API:</span>
                        <span>{diagNative.details.hasShare ? 'Available' : 'Unavailable'}</span>
                      </div>
                      
                      {diagNative.details.deviceInfo && (
                        <>
                          <div className="flex justify-between border-t border-green-500/10 pt-1 mt-1">
                            <span className="opacity-60">Device Model:</span>
                            <span>{String(diagNative.details.deviceInfo['model'] || 'Unknown')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="opacity-60">OS Version:</span>
                            <span>{String(diagNative.details.deviceInfo['osVersion'] || 'Unknown')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="opacity-60">Manufacturer:</span>
                            <span>{String(diagNative.details.deviceInfo['manufacturer'] || 'Unknown')}</span>
                          </div>
                        </>
                      )}
                      {diagNative.details.deviceId && (
                        <div className="flex justify-between">
                          <span className="opacity-60">Device UUID:</span>
                          <span className="truncate max-w-[120px]" title={String(diagNative.details.deviceId['uuid'] || '')}>
                            {String(diagNative.details.deviceId['uuid'] || 'Unknown')}
                          </span>
                        </div>
                      )}
                      {diagNative.details.batteryInfo && typeof diagNative.details.batteryInfo['batteryLevel'] !== 'undefined' && (
                        <div className="flex justify-between border-t border-green-500/10 pt-1 mt-1">
                          <span className="opacity-60">Battery Level:</span>
                          <span>
                            {Math.round(Number(diagNative.details.batteryInfo['batteryLevel']) * 100)}% 
                            {diagNative.details.batteryInfo['isCharging'] ? ' ⚡ (Charging)' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Brevo SMTP Diagnostic Mailer */}
              <div className="p-5 bg-deep-brown border border-sunshine/10 rounded-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-500/10 text-purple-500 rounded-lg">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-deep-forest">SMTP Relay (Brevo SMTP via Render)</h4>
                    <p className="text-xs text-deep-forest/40">Sends actual HTML emails to customers on approval</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-deep-forest/5 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <Input
                        type="email"
                        placeholder="Enter test recipient email address"
                        value={testEmailAddress}
                        onChange={(e) => setTestEmailAddress(e.target.value)}
                        className="bg-cream dark:bg-background/30 border-sunshine/20 text-deep-forest text-xs placeholder:text-deep-forest/30 h-10"
                      />
                    </div>
                    <Button
                      onClick={runSendTestEmail}
                      disabled={isSendingTestEmail || !testEmailAddress}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-10 px-6 shrink-0 flex items-center gap-2"
                    >
                      {isSendingTestEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Send Test Email
                    </Button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-deep-forest/50">SMTP Test Status:</span>
                    {diagEmail.status === 'idle' && <span className="text-deep-forest/40 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cream dark:bg-background/30"></span>Not Tested</span>}
                    {diagEmail.status === 'running' && <span className="text-sunshine flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" />Sending...</span>}
                    {diagEmail.status === 'pass' && <span className="text-green-400 flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" />Email Dispatched Successfully</span>}
                    {diagEmail.status === 'fail' && <span className="text-red-400 flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" />Failed</span>}
                  </div>

                  {diagEmail.status === 'pass' && (
                    <div className="p-3 bg-green-500/5 border border-green-500/10 rounded-lg text-xs font-mono text-green-300">
                      <div>✓ SMTP Handshake & Dispatch complete. Message ID received.</div>
                      <div className="mt-1 text-[10px] opacity-70">{diagEmail.message}</div>
                    </div>
                  )}

                  {diagEmail.status === 'fail' && (
                    <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg text-xs font-mono text-red-300 break-all">
                      <div>✕ SMTP Transport Error</div>
                      <p className="mt-1 text-[10px] opacity-70 leading-relaxed">
                        Render blocks outbound port 587. Ensure SMTP_PORT is set to 2525 for Brevo. Details: {diagEmail.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Developer Toolkit */}
              <div className="p-5 bg-deep-brown border border-sunshine/10 rounded-xl space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg animate-pulse">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-deep-forest">Mobile Developer Toolkit</h4>
                      <p className="text-xs text-deep-forest/40">In-app console, inspector & network traffic logger</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={toggleEruda}
                      aria-label="Toggle Mobile Developer Toolkit"
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        erudaEnabled ? 'bg-emerald-500' : 'bg-cream dark:bg-background/80'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full  shadow-lg ring-0 transition duration-200 ease-in-out ${
                          erudaEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-deep-forest/5 flex items-center justify-between text-xs">
                  <span className="text-deep-forest/50">Status:</span>
                  {erudaEnabled ? (
                    <span className="text-emerald-400 flex items-center gap-1.5 font-medium animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      Active (Tap the floating gear)
                    </span>
                  ) : (
                    <span className="text-deep-forest/40 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cream dark:bg-background/30"></span>
                      Disabled
                    </span>
                  )}
                </div>

                <div className="p-4 bg-cream dark:bg-background/30 border border-sunshine/5 rounded-lg text-xs text-deep-forest/60 space-y-2 leading-relaxed">
                  <p>
                    Designed specifically for mobile-only developers. When activated, a <strong>floating gear/cog icon</strong> will appear in the bottom-right corner of your screen.
                  </p>
                  <p>
                    Tapping it launches a full developer dashboard directly in your mobile browser, allowing you to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-deep-forest/50 text-[11px] pl-1">
                    <li><strong>Inspect DOM</strong>: View and modify HTML elements/CSS styles live.</li>
                    <li><strong>Console Logs</strong>: Check printouts, warnings, and uncaught exceptions.</li>
                    <li><strong>Network Traffic</strong>: Monitor live fetch/XHR requests and server API payloads.</li>
                    <li><strong>Local Storage</strong>: View, add, and clear cookies, session state, and local storage.</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 bg-cream dark:bg-background/50 border border-sunshine/10 rounded-xl space-y-4">
                <div>
                  <h3 className="font-display font-bold text-deep-forest text-lg flex items-center gap-2">
                    <Palette className="w-5 h-5 text-sunshine" />
                    Application Accent Color
                  </h3>
                  <p className="text-xs text-deep-forest/50 mt-1">
                    Toggle the primary accent color of the application globally. Changing this updates the primary buttons, highlights, selections, and interactive states for all users in real-time.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {/* Option 1: Sunshine Orange */}
                  <div 
                    onClick={() => handleAccentChange('sunshine')}
                    className={`p-5 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col justify-between h-40 ${
                      accent === 'sunshine'
                        ? 'bg-sunshine/10 border-sunshine shadow-lg shadow-sunshine/5'
                        : 'bg-cream dark:bg-background/20 border-sunshine/15 hover:border-sunshine/30 hover:bg-cream dark:bg-background/30'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-deep-forest text-base flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full bg-[#E89025] inline-block border border-white/10" />
                          Sunshine Orange
                        </h4>
                        <p className="text-xs text-deep-forest/50 mt-1.5 leading-relaxed">
                          Radiant Golden Orange. Warm, high-energy, and traditional. The default aesthetic.
                        </p>
                      </div>
                      {accent === 'sunshine' && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sunshine text-charcoal">
                          Active
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-1.5 mt-4">
                      <div className="w-8 h-8 rounded-lg bg-[#E89025] shadow" />
                      <div className="w-8 h-8 rounded-lg bg-[#F2A43F] shadow" />
                      <div className="w-8 h-8 rounded-lg bg-[#E55928] shadow" />
                    </div>
                  </div>

                  {/* Option 2: Kiwi Green */}
                  <div 
                    onClick={() => handleAccentChange('kiwi')}
                    className={`p-5 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col justify-between h-40 ${
                      accent === 'kiwi'
                        ? 'bg-kiwi/10 border-kiwi shadow-lg shadow-kiwi/5'
                        : 'bg-cream dark:bg-background/20 border-sunshine/15 hover:border-sunshine/30 hover:bg-cream dark:bg-background/30'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-deep-forest text-base flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full bg-[#729B48] inline-block border border-white/10" />
                          Kiwi Green
                        </h4>
                        <p className="text-xs text-deep-forest/50 mt-1.5 leading-relaxed">
                          Fresh Leaf Green. Vibrant, organic, modern, and refreshing.
                        </p>
                      </div>
                      {accent === 'kiwi' && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-kiwi text-charcoal">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="flex gap-1.5 mt-4">
                      <div className="w-8 h-8 rounded-lg bg-[#729B48] shadow" />
                      <div className="w-8 h-8 rounded-lg bg-[#82AF52] shadow" />
                      <div className="w-8 h-8 rounded-lg bg-[#5E8239] shadow" />
                    </div>
                  </div>
                </div>

                <div className="text-xs text-deep-forest/40 italic pt-2 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Your preference is saved locally and synced to all other connected clients in real-time.
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl bg-deep-brown border-sunshine/20 text-deep-forest max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">
              {t('order_details')}
            </DialogTitle>
            <DialogDescription>
              {t('order_details_desc')}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 py-4">
              {/* Status Banner */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-cream dark:bg-background/50">
                <span className="text-deep-forest/60">Status</span>
                {getStatusBadge(selectedOrder.status)}
              </div>

              {/* Customer Info */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sunshine">{t('customer_info')}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-deep-forest/50">{t('to')}:</span>
                    <p className="text-deep-forest">{selectedOrder.to}</p>
                  </div>
                  <div>
                    <span className="text-deep-forest/50">{t('attn')}:</span>
                    <p className="text-deep-forest">{selectedOrder.attn || '-'}</p>
                  </div>
                  <div>
                    <span className="text-deep-forest/50">{t('name')}:</span>
                    <p className="text-deep-forest">{selectedOrder.name}</p>
                  </div>
                  <div>
                    <span className="text-deep-forest/50">{t('contact')}:</span>
                    <p className="text-deep-forest">{selectedOrder.contact}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-deep-forest/50">{t('email')}:</span>
                    <p className="text-deep-forest">{selectedOrder.email}</p>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sunshine">{t('event_details')}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-deep-forest/50">{t('datetime')}:</span>
                    <p className="text-deep-forest">
                      {selectedOrder.dateTime 
                        ? format(new Date(selectedOrder.dateTime), 'PPp')
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-deep-forest/50">{t('quantity')}:</span>
                    <p className="text-deep-forest">{selectedOrder.quantity} pax</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-deep-forest/50">{t('location')}:</span>
                    <p className="text-deep-forest">{selectedOrder.location}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-deep-forest/50">{t('meals')}:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedOrder.meals.map((meal) => (
                        <Badge 
                          key={meal} 
                          variant="outline" 
                          className="border-sunshine/30 text-deep-forest"
                        >
                          {MEAL_LABELS[meal]?.[selectedOrder.lang] || meal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {selectedOrder.menu && (
                    <div className="col-span-2">
                      <span className="text-deep-forest/50">{t('menu')}:</span>
                      <p className="text-deep-forest mt-1">{selectedOrder.menu}</p>
                    </div>
                  )}
                  {selectedOrder.notes && (
                    <div className="col-span-2">
                      <span className="text-deep-forest/50">{t('notes')}:</span>
                      <p className="text-deep-forest mt-1">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Section */}
              <div className="space-y-4 pt-4 border-t border-sunshine/10">
                <h4 className="font-semibold text-sunshine">{t('price_pax')}</h4>
                <div className="space-y-3">
                  {selectedOrder.meals.map((meal) => (
                    <div key={meal} className="flex items-center gap-4">
                      <Label className="w-32 text-deep-forest/70">
                        {MEAL_LABELS[meal]?.[selectedOrder.lang] || meal}
                      </Label>
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-deep-forest/50">RM</span>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={prices[meal] || ''}
                          onChange={(e) => setPrices(prev => ({ 
                            ...prev, 
                            [meal]: e.target.value 
                          }))}
                          className="pl-10 bg-cream dark:bg-background/50 border-sunshine/20 text-deep-forest"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Preview */}
                <div className="p-4 bg-cream dark:bg-background/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-deep-forest/60">{t('grand_total')}:</span>
                    <span className="text-2xl font-bold text-sunshine">
                      RM {selectedOrder.meals.reduce((total, meal) => {
                        const price = parseFloat(prices[meal] || '0');
                        return total + (price * selectedOrder.quantity);
                      }, 0).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-deep-forest/50 italic">
                    {numberToWords(selectedOrder.meals.reduce((total, meal) => {
                      const price = parseFloat(prices[meal] || '0');
                      return total + (price * selectedOrder.quantity);
                    }, 0), selectedOrder.lang)}
                  </p>
                </div>
              </div>

            </div>
          )}

          <DialogFooter className="gap-2 mt-6 flex-wrap md:flex-nowrap">
            {selectedOrder?.status === 'cancel_requested' ? (
              <>
                <Button
                  onClick={async () => {
                    const confirmCancelApprove = confirm("Are you sure you want to APPROVE this cancellation? This will permanently delete the order and notify the customer.");
                    if (!confirmCancelApprove) return;
                    setIsApproving(true);
                    try {
                      const response = await fetch(getApiUrl('/api/admin/orders'), {
                        method: 'POST',
                        headers: authHeaders(),
                        body: JSON.stringify({
                          action: 'delete',
                          orderId: selectedOrder.id
                        })
                      });
                      if (response.ok) {
                        toast({
                          title: t('success') || 'Success',
                          description: 'Order cancelled and deleted successfully.',
                          variant: 'success'
                        });
                        setIsDetailOpen(false);
                        fetchOrders();
                      } else {
                        throw new Error('Failed to delete order');
                      }
                    } catch (error) {
                      console.error('Error deleting cancelled order:', error);
                      toast({
                        title: t('error') || 'Error',
                        description: 'Failed to delete order.',
                        variant: 'error'
                      });
                    } finally {
                      setIsApproving(false);
                    }
                  }}
                  disabled={isApproving}
                  className="bg-tomato-burst hover:bg-tomato-burst/85 text-white"
                >
                  {isApproving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                  {t('approve_cancellation') || 'Approve Cancellation'}
                </Button>
                <Button
                  onClick={() => handleRejectCancellation(selectedOrder.id)}
                  disabled={isApproving}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  {t('reject_cancellation') || 'Reject Cancellation'}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => handleApprove(selectedOrder?.id || '')}
                disabled={isApproving || !selectedOrder || selectedOrder.meals.some(m => !prices[m] || parseFloat(prices[m]) <= 0)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isApproving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                {selectedOrder?.status === 'approved' || selectedOrder?.status === 'billed' ? t('update_invoice') || 'Update Invoice' : t('approve')}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setIsDetailOpen(false)}
              className="border-sunshine/30 text-deep-forest hover:bg-sunshine/10"
            >
              {t('close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Invoice Dialog */}
      <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <DialogContent className="max-w-md bg-deep-brown border-sunshine/20 text-deep-forest">
          <DialogHeader>
            <DialogTitle className="text-xl font-display font-bold text-sunshine flex items-center gap-2">
              <Send className="w-5 h-5 text-sunshine" />
              {t('send_invoice_pdf')}
            </DialogTitle>
            <DialogDescription>
              {t('send_invoice_desc')}
            </DialogDescription>
          </DialogHeader>

          {sendOrder && (
            <div className="space-y-6 py-4">
              {/* Summary Box */}
              <div className="p-4 bg-cream dark:bg-background/50 rounded-xl border border-sunshine/10 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-deep-forest/50">{t('invoice_no_label')}</span>
                  <span className="font-mono font-medium text-deep-forest">
                    {sendOrder.invoiceNo || `RW${sendOrder.id.substring(0, 6).toUpperCase()}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-deep-forest/50">{t('customer_label')}</span>
                  <span className="font-medium text-deep-forest">{sendOrder.to}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-deep-forest/50">{t('grand_total_label')}</span>
                  <span className="font-bold text-sunshine">
                    RM {(sendOrder.totalAmount || sendOrder.meals.reduce((sum, meal) => {
                      const price = sendOrder.prices?.[meal] || 0;
                      return sum + (price * sendOrder.quantity);
                    }, 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-5">
                {/* Email Option */}
                <div className="p-4 rounded-xl border border-sunshine/10 bg-cream dark:bg-background/20 space-y-4">
                  <div className="flex items-center gap-2 font-semibold text-deep-forest">
                    <Mail className="w-4 h-4 text-sunshine" />
                    <span>{t('option_email')}</span>
                  </div>
                  <p className="text-xs text-deep-forest/60">
                    {t('email_desc')}
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="send-email-input" className="text-xs text-deep-forest/50">
                      {t('recipient_email')}
                    </Label>
                    <Input
                      id="send-email-input"
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="bg-cream dark:bg-background/50 border-sunshine/20 text-deep-forest focus:border-sunshine/50 h-10 text-sm"
                      placeholder="customer@email.com"
                    />
                  </div>
                  <Button
                    onClick={handleSendEmail}
                    disabled={sendingEmail || !recipientEmail}
                    className="w-full bg-sunshine text-charcoal font-semibold hover:bg-[#E0BC74] transition-all duration-200 h-10 text-sm"
                  >
                    {sendingEmail ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t('sending')}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 justify-center">
                        <Mail className="w-4 h-4" />
                        {t('send_invoice_email')}
                      </span>
                    )}
                  </Button>
                </div>

                {/* WhatsApp Option */}
                <div className="p-4 rounded-xl border border-sunshine/10 bg-cream dark:bg-background/20 space-y-4">
                  <div className="flex items-center gap-2 font-semibold text-deep-forest">
                    <MessageSquare className="w-4 h-4 text-emerald-500" />
                    <span>{t('option_whatsapp')}</span>
                  </div>
                  <p className="text-xs text-deep-forest/60">
                    {t('whatsapp_desc')}
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="send-phone-input" className="text-xs text-deep-forest/50">
                      {t('recipient_phone')}
                    </Label>
                    <Input
                      id="send-phone-input"
                      type="text"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      className="bg-cream dark:bg-background/50 border-sunshine/20 text-deep-forest focus:border-sunshine/50 h-10 text-sm"
                      placeholder="e.g. 0123456789"
                    />
                  </div>
                  <Button
                    onClick={handleSendWhatsApp}
                    disabled={!recipientPhone}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all duration-200 h-10 text-sm"
                  >
                    <span className="flex items-center gap-2 justify-center">
                      <MessageSquare className="w-4 h-4" />
                      {t('open_whatsapp')}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsSendDialogOpen(false)}
              className="border-sunshine/30 text-deep-forest hover:bg-sunshine/10 w-full md:w-auto text-sm"
            >
              {t('cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl w-[90vw] h-[85vh] bg-deep-brown border-sunshine/20 text-deep-forest flex flex-col p-6">
          <DialogHeader className="pb-2 border-b border-sunshine/10 flex-shrink-0">
            <DialogTitle className="text-xl font-display font-bold text-sunshine">
              {previewFileName || 'PDF Preview'}
            </DialogTitle>
            <DialogDescription>
              {t('pdf_preview_desc')}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 bg-cream dark:bg-background/50 rounded-lg overflow-hidden relative my-4 border border-sunshine/10">
            {previewPdfUrl ? (
              <iframe
                src={previewPdfUrl}
                title="PDF Preview Frame"
                className="w-full h-full border-0"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-deep-forest/40">
                {t('loading') || 'Loading preview...'}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2 border-t border-sunshine/10 justify-end flex-shrink-0">
            <Button
              onClick={() => {
                const link = document.createElement('a');
                link.href = previewPdfUrl;
                link.download = previewFileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="bg-sunshine text-charcoal font-semibold hover:bg-[#E0BC74]"
            >
              <FileDown className="w-4 h-4 mr-2" />
              {t('download')}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsPreviewOpen(false);
                setPreviewPdfUrl('');
              }}
              className="border-sunshine/30 text-deep-forest hover:bg-sunshine/10"
            >
              {t('close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
