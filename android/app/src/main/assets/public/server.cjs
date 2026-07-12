var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_config = require("dotenv/config");
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_nodemailer = __toESM(require("nodemailer"), 1);
var import_cors = __toESM(require("cors"), 1);
var admin = __toESM(require("firebase-admin"), 1);
var import_app = require("firebase-admin/app");
var import_firestore = require("firebase-admin/firestore");
var import_messaging = require("firebase-admin/messaging");
var import_googleapis = require("googleapis");
var firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyCaCFMk6K8go9Wgt-jdNd6QTvD8JbsTkY4",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "restoran-wawasan.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "restoran-wawasan",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "restoran-wawasan.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "1019707766959",
  appId: process.env.FIREBASE_APP_ID || "1:1019707766959:web:78644cddb16b67a69ffc5a",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-ZWC8H62RZN",
  firestoreDatabaseId: void 0
};
var LOCAL_DB_PATH = import_path.default.join(process.cwd(), "orders.json");
var ENABLE_LOCAL_FALLBACK = process.env.ENABLE_LOCAL_FALLBACK === "true";
var STRICT_FIREBASE_ADMIN = process.env.STRICT_FIREBASE_ADMIN !== "false";
var adminApp = null;
function getAdminApp() {
  if (!adminApp) {
    const apps2 = admin.apps || [];
    if (apps2.length === 0) {
      const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
      const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ? process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n") : void 0;
      if (email && privateKey) {
        adminApp = admin.initializeApp({
          credential: (0, import_app.cert)({
            projectId: firebaseConfig.projectId,
            clientEmail: email,
            privateKey
          }),
          projectId: firebaseConfig.projectId
        });
      } else {
        const msg = "Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY. On Render this usually means Firebase Admin cannot authenticate to Firestore, so orders/invoice counters/widgets will fail.";
        if (STRICT_FIREBASE_ADMIN) {
          throw new Error(msg);
        }
        console.warn(msg + " Continuing with Application Default Credentials (not recommended on Render).");
        adminApp = admin.initializeApp({ projectId: firebaseConfig.projectId });
      }
    } else {
      adminApp = apps2[0];
    }
  }
  return adminApp;
}
function getFirestore() {
  const app = getAdminApp();
  const dbId = firebaseConfig.firestoreDatabaseId;
  if (dbId && dbId !== "(default)") {
    try {
      return (0, import_firestore.getFirestore)(app, dbId);
    } catch (err) {
      console.warn(`Failed to initialize Firestore with database ID ${dbId}, falling back to default:`, err);
      return (0, import_firestore.getFirestore)(app);
    }
  }
  return (0, import_firestore.getFirestore)(app);
}
async function sendNotificationToTopic(topic, title, body) {
  try {
    const app = getAdminApp();
    const message = {
      notification: {
        title,
        body
      },
      topic
    };
    const response = await (0, import_messaging.getMessaging)(app).send(message);
    console.log(`Successfully sent message to topic ${topic}:`, response);
  } catch (error) {
    console.error(`Error sending message to topic ${topic}:`, error);
  }
}
var ENABLE_ORDER_STATUS_NOTIFICATIONS = (process.env.ENABLE_ORDER_STATUS_NOTIFICATIONS || "true") !== "false";
function getStatusCopy(status, name, invoiceNo, lang) {
  const s = (status || "").toLowerCase();
  const who = name || (lang === "bm" ? "Pelanggan" : "Customer");
  const invoiceSuffix = invoiceNo ? lang === "bm" ? ` (No. Invois: ${invoiceNo})` : ` (Invoice No: ${invoiceNo})` : "";
  const en = {
    pending: {
      subject: `Your order is being reviewed${invoiceNo ? ` \u2014 ${invoiceNo}` : ""}`,
      heading: "Order Received \u2014 Pending Review",
      message: `Hi ${who}, we've received your catering order${invoiceSuffix} and it is currently pending review. We'll update you as soon as it's confirmed.`,
      pushTitle: "Order pending review",
      pushBody: `Your order${invoiceSuffix} is pending review.`
    },
    approved: {
      subject: `Your order is approved${invoiceNo ? ` \u2014 ${invoiceNo}` : ""}`,
      heading: "Order Approved \u{1F389}",
      message: `Great news ${who}! Your catering order${invoiceSuffix} has been approved. We look forward to serving you.`,
      pushTitle: "Order approved \u{1F389}",
      pushBody: `Your order${invoiceSuffix} has been approved.`
    },
    billed: {
      subject: `Your invoice is ready${invoiceNo ? ` \u2014 ${invoiceNo}` : ""}`,
      heading: "Invoice Issued",
      message: `Hi ${who}, an invoice${invoiceSuffix} has been issued for your catering order. Please check your email for the invoice details.`,
      pushTitle: "Invoice ready",
      pushBody: `Your invoice${invoiceSuffix} is ready.`
    },
    rejected: {
      subject: `Update on your order${invoiceNo ? ` \u2014 ${invoiceNo}` : ""}`,
      heading: "Order Could Not Be Confirmed",
      message: `Hi ${who}, unfortunately we were unable to confirm your catering order${invoiceSuffix} at this time. Please contact us if you'd like to discuss alternatives.`,
      pushTitle: "Order update",
      pushBody: `There's an update on your order${invoiceSuffix}.`
    },
    completed: {
      subject: `Thank you from Restoran Wawasan${invoiceNo ? ` \u2014 ${invoiceNo}` : ""}`,
      heading: "Order Completed \u2014 Thank You!",
      message: `Hi ${who}, your catering order${invoiceSuffix} is now marked as completed. Thank you for choosing Restoran Wawasan \u2014 we hope to serve you again!`,
      pushTitle: "Order completed",
      pushBody: `Your order${invoiceSuffix} is completed. Thank you!`
    }
  };
  const bm = {
    pending: {
      subject: `Pesanan anda sedang disemak${invoiceNo ? ` \u2014 ${invoiceNo}` : ""}`,
      heading: "Pesanan Diterima \u2014 Menunggu Semakan",
      message: `Salam ${who}, kami telah menerima tempahan katering anda${invoiceSuffix} dan ia sedang menunggu semakan. Kami akan maklumkan sebaik sahaja ia disahkan.`,
      pushTitle: "Pesanan menunggu semakan",
      pushBody: `Pesanan anda${invoiceSuffix} sedang disemak.`
    },
    approved: {
      subject: `Pesanan anda telah diluluskan${invoiceNo ? ` \u2014 ${invoiceNo}` : ""}`,
      heading: "Pesanan Diluluskan \u{1F389}",
      message: `Berita baik ${who}! Tempahan katering anda${invoiceSuffix} telah diluluskan. Kami menantikan peluang untuk berkhidmat kepada anda.`,
      pushTitle: "Pesanan diluluskan \u{1F389}",
      pushBody: `Pesanan anda${invoiceSuffix} telah diluluskan.`
    },
    billed: {
      subject: `Invois anda telah sedia${invoiceNo ? ` \u2014 ${invoiceNo}` : ""}`,
      heading: "Invois Dikeluarkan",
      message: `Salam ${who}, satu invois${invoiceSuffix} telah dikeluarkan untuk tempahan katering anda. Sila semak e-mel anda untuk butiran invois.`,
      pushTitle: "Invois sedia",
      pushBody: `Invois anda${invoiceSuffix} telah sedia.`
    },
    rejected: {
      subject: `Kemas kini tempahan anda${invoiceNo ? ` \u2014 ${invoiceNo}` : ""}`,
      heading: "Tempahan Tidak Dapat Disahkan",
      message: `Salam ${who}, malangnya kami tidak dapat mengesahkan tempahan katering anda${invoiceSuffix} pada masa ini. Sila hubungi kami jika anda ingin membincangkan pilihan lain.`,
      pushTitle: "Kemas kini tempahan",
      pushBody: `Terdapat kemas kini pada tempahan anda${invoiceSuffix}.`
    },
    completed: {
      subject: `Terima kasih daripada Restoran Wawasan${invoiceNo ? ` \u2014 ${invoiceNo}` : ""}`,
      heading: "Tempahan Selesai \u2014 Terima Kasih!",
      message: `Salam ${who}, tempahan katering anda${invoiceSuffix} kini ditanda sebagai selesai. Terima kasih kerana memilih Restoran Wawasan \u2014 kami harap dapat berkhidmat lagi!`,
      pushTitle: "Tempahan selesai",
      pushBody: `Tempahan anda${invoiceSuffix} telah selesai. Terima kasih!`
    }
  };
  const table = lang === "bm" ? bm : en;
  if (table[s]) return table[s];
  const prettyStatus = status || (lang === "bm" ? "dikemas kini" : "updated");
  return lang === "bm" ? {
    subject: `Status tempahan anda telah dikemas kini${invoiceNo ? ` \u2014 ${invoiceNo}` : ""}`,
    heading: "Kemas Kini Status Tempahan",
    message: `Salam ${who}, status tempahan katering anda${invoiceSuffix} kini ialah: ${prettyStatus}.`,
    pushTitle: "Kemas kini status tempahan",
    pushBody: `Status pesanan anda${invoiceSuffix}: ${prettyStatus}.`
  } : {
    subject: `Your order status was updated${invoiceNo ? ` \u2014 ${invoiceNo}` : ""}`,
    heading: "Order Status Update",
    message: `Hi ${who}, the status of your catering order${invoiceSuffix} is now: ${prettyStatus}.`,
    pushTitle: "Order status update",
    pushBody: `Your order status${invoiceSuffix}: ${prettyStatus}.`
  };
}
function buildStatusEmailHtml(copy, lang) {
  const footerText = lang === "bm" ? "E-mel ini dijanakan secara automatik apabila status tempahan anda berubah. Sila hubungi kami jika terdapat sebarang pertanyaan." : "This email is generated automatically when your order status changes. Please contact us if you have any questions.";
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#f7fafc;margin:0;padding:20px;color:#2d3748;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);border:1px solid #e2e8f0;">
    <div style="background-color:#1a202c;padding:30px;text-align:center;color:#ffffff;border-bottom:3px solid #D4AF37;">
      <h1 style="margin:0;font-size:24px;font-weight:700;letter-spacing:0.05em;color:#D4AF37;">RESTORAN WAWASAN</h1>
      <p style="margin:5px 0 0 0;color:#a0aec0;font-size:14px;text-transform:uppercase;letter-spacing:0.1em;">${copy.heading}</p>
    </div>
    <div style="padding:30px;">
      <p style="font-size:16px;line-height:1.6;margin:0 0 25px 0;">${copy.message}</p>
    </div>
    <div style="background-color:#f7fafc;padding:20px 30px;text-align:center;color:#718096;font-size:12px;border-top:1px solid #e2e8f0;">
      ${footerText}
    </div>
  </div>
</body>
</html>`;
}
async function sendOrderStatusEmail(transporter, order, newStatus) {
  const to = order.email;
  if (!to) {
    console.warn("[StatusNotify] No customer email on order; skipping status email.");
    return false;
  }
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[StatusNotify] SMTP not configured (SMTP_USER/SMTP_PASS); skipping status email.");
    return false;
  }
  const lang = order.lang === "bm" ? "bm" : "en";
  const copy = getStatusCopy(newStatus, order.name || "", order.invoiceNo || "", lang);
  await transporter.sendMail({
    from: `"Restoran Wawasan" <${process.env.SENDER_EMAIL || process.env.SMTP_USER || "madnor.noisy@gmail.com"}>`,
    to,
    subject: copy.subject,
    text: `${copy.heading}

${copy.message}`,
    html: buildStatusEmailHtml(copy, lang)
  });
  console.log(`[StatusNotify] Status email (${newStatus}) sent to ${to}.`);
  return true;
}
async function resolveCustomerFcmToken(order) {
  try {
    const db = getFirestore();
    const customerUid = order.userId || order.uid;
    if (customerUid) {
      const snap = await db.collection("users").doc(customerUid).get();
      const token = snap.exists ? snap.data()?.fcmToken : void 0;
      if (token) return token;
    }
    if (order.email) {
      const q = await db.collection("users").where("email", "==", order.email).limit(1).get();
      if (!q.empty) {
        const token = q.docs[0].data()?.fcmToken;
        if (token) return token;
      }
    }
  } catch (err) {
    console.warn("[StatusNotify] Could not resolve customer FCM token:", err);
  }
  return null;
}
async function sendOrderStatusPush(order, newStatus) {
  const token = await resolveCustomerFcmToken(order);
  if (!token) {
    console.log("[StatusNotify] No FCM token for customer; skipping push (email still sent).");
    return false;
  }
  const lang = order.lang === "bm" ? "bm" : "en";
  const copy = getStatusCopy(newStatus, order.name || "", order.invoiceNo || "", lang);
  try {
    const app = getAdminApp();
    const response = await (0, import_messaging.getMessaging)(app).send({
      token,
      notification: { title: copy.pushTitle, body: copy.pushBody },
      data: {
        type: "order_status",
        status: String(newStatus || ""),
        orderId: String(order.id || ""),
        invoiceNo: String(order.invoiceNo || "")
      }
    });
    console.log(`[StatusNotify] Status push (${newStatus}) sent to customer:`, response);
    return true;
  } catch (error) {
    console.error("[StatusNotify] Error sending status push to customer:", error);
    return false;
  }
}
async function notifyCustomerOfStatusChange(transporter, order, newStatus) {
  if (!ENABLE_ORDER_STATUS_NOTIFICATIONS) {
    console.log("[StatusNotify] Disabled via ENABLE_ORDER_STATUS_NOTIFICATIONS=false; skipping.");
    return;
  }
  await Promise.allSettled([
    sendOrderStatusEmail(transporter, order, newStatus).catch(
      (err) => console.error("[StatusNotify] Email send failed:", err)
    ),
    sendOrderStatusPush(order, newStatus).catch(
      (err) => console.error("[StatusNotify] Push send failed:", err)
    )
  ]);
}
async function runWithRetry(fn, retries = 3, delayMs = 1e3) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.warn(`[Firestore Retry] Attempt ${attempt} failed. Retrying in ${delayMs}ms... Error:`, error);
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        delayMs *= 2;
      }
    }
  }
  throw lastError;
}
function getLocalOrders() {
  if (!ENABLE_LOCAL_FALLBACK) return [];
  try {
    if (import_fs.default.existsSync(LOCAL_DB_PATH)) {
      console.warn("[WARNING] Reading from local fallback file 'orders.json'. Note: This local file system is ephemeral and transient. All local changes will be lost upon container restart or redeployment.");
      const data = JSON.parse(import_fs.default.readFileSync(LOCAL_DB_PATH, "utf-8"));
      return Array.isArray(data) ? data : [];
    }
  } catch (err) {
    console.error("Error reading local orders database:", err);
  }
  return [];
}
function saveLocalOrders(orders) {
  if (!ENABLE_LOCAL_FALLBACK) return;
  try {
    console.warn("[WARNING] Writing to local fallback file 'orders.json'. Note: This local file system is ephemeral and transient. All local changes will be lost upon container restart or redeployment.");
    import_fs.default.writeFileSync(LOCAL_DB_PATH, JSON.stringify(orders, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to local orders database:", err);
  }
}
function toEventTimestamp(orderData) {
  try {
    const raw = orderData.dateTime ? new Date(orderData.dateTime) : orderData.date ? /* @__PURE__ */ new Date(`${orderData.date}T${orderData.time || "12:00"}:00+08:00`) : null;
    if (!raw || isNaN(raw.getTime())) return null;
    return import_firestore.Timestamp.fromDate(raw);
  } catch {
    return null;
  }
}
async function createOrderWithSequentialInvoice(orderData) {
  const db = getFirestore();
  const counterRef = db.collection("meta").doc("invoiceCounter");
  const orderRef = db.collection("orders").doc();
  return await db.runTransaction(async (tx) => {
    const counterSnap = await tx.get(counterRef);
    let next = 1;
    if (counterSnap.exists) {
      const data = counterSnap.data();
      if (data && typeof data.count === "number") {
        next = data.count + 1;
      }
    }
    const invoiceNo = `RW${String(next).padStart(4, "0")}`;
    const eventTimestamp = toEventTimestamp(orderData);
    tx.set(
      counterRef,
      { count: next, updatedAt: import_firestore.FieldValue.serverTimestamp() },
      { merge: true }
    );
    tx.set(orderRef, {
      ...orderData,
      status: "approved",
      approvedAt: (/* @__PURE__ */ new Date()).toISOString(),
      invoiceNo,
      eventTimestamp,
      // Always set by server (client may send a Firestore sentinel that isn't valid server-side)
      createdAt: import_firestore.FieldValue.serverTimestamp(),
      // Used by the admin endpoints; never trust client
      adminPasscode: process.env.ADMIN_PASSWORD || "wawasan123"
    });
    return { orderId: orderRef.id, invoiceNo };
  });
}
function getGoogleCalendarClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ? process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n") : void 0;
  if (!email || !privateKey) {
    console.warn("GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY not configured. Google Calendar event creation will be skipped.");
    return null;
  }
  try {
    const auth = new import_googleapis.google.auth.JWT({
      email,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/calendar.events"]
    });
    return import_googleapis.google.calendar({ version: "v3", auth });
  } catch (err) {
    console.error("Failed to initialize Google Calendar client:", err);
    return null;
  }
}
async function syncGoogleCalendarEvent(orderId, passedOrderData) {
  try {
    const calendar = getGoogleCalendarClient();
    if (!calendar) {
      return;
    }
    let orderData = passedOrderData;
    if (!orderData) {
      try {
        const adminDb = getFirestore();
        const docSnap = await adminDb.collection("orders").doc(orderId).get();
        if (docSnap.exists) {
          orderData = docSnap.data();
        }
      } catch (dbErr) {
        console.warn(`Firestore sync load failed for order ${orderId}:`, dbErr);
      }
      if (!orderData) {
        const localOrders = getLocalOrders();
        orderData = localOrders.find((o) => o.id === orderId);
      }
    }
    if (!orderData) {
      console.warn(`Sync Google Calendar Event: Order ${orderId} not found.`);
      return;
    }
    let startDateTime;
    if (orderData.dateTime) {
      startDateTime = new Date(orderData.dateTime);
    } else if (orderData.date) {
      startDateTime = /* @__PURE__ */ new Date(`${orderData.date}T${orderData.time || "12:00"}:00+08:00`);
    } else {
      startDateTime = /* @__PURE__ */ new Date();
    }
    if (isNaN(startDateTime.getTime())) {
      startDateTime = /* @__PURE__ */ new Date();
    }
    const endDateTime = new Date(startDateTime.getTime() + 3 * 60 * 60 * 1e3);
    const mealList = Array.isArray(orderData.meals) ? orderData.meals.join(", ") : orderData.meals || "";
    const summary = `${orderData.quantity || ""} Pax | ${mealList || "N/A"} | ${orderData.location || "N/A"}`;
    const description = `Menu: ${orderData.menu || "N/A"}`;
    const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";
    const existingEventId = orderData.calendarEventIds?.[calendarId];
    if (existingEventId) {
      try {
        console.log(`Updating existing Google Calendar event ${existingEventId} for order ${orderId}...`);
        await calendar.events.update({
          calendarId,
          eventId: existingEventId,
          requestBody: {
            summary,
            description,
            location: orderData.location || "",
            start: {
              dateTime: startDateTime.toISOString(),
              timeZone: "Asia/Kuala_Lumpur"
            },
            end: {
              dateTime: endDateTime.toISOString(),
              timeZone: "Asia/Kuala_Lumpur"
            }
          }
        });
        console.log(`Google Calendar event ${existingEventId} updated successfully.`);
        return;
      } catch (updateErr) {
        const errObj = updateErr;
        if (errObj && (errObj.status === 404 || errObj.message && errObj.message.includes("Not Found"))) {
          console.warn(`Existing calendar event ${existingEventId} not found or deleted on calendar, recreating...`);
        } else {
          throw updateErr;
        }
      }
    }
    console.log(`Creating new Google Calendar event for order ${orderId}...`);
    const response = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary,
        description,
        location: orderData.location || "",
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: "Asia/Kuala_Lumpur"
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: "Asia/Kuala_Lumpur"
        }
      }
    });
    const eventId = response.data.id;
    if (eventId) {
      console.log(`Google Calendar event created successfully! Event Link: ${response.data.htmlLink}`);
      const updatedCalendarEventIds = {
        ...orderData.calendarEventIds || {},
        [calendarId]: eventId
      };
      try {
        const adminDb = getFirestore();
        await adminDb.collection("orders").doc(orderId).update({
          calendarEventIds: updatedCalendarEventIds
        });
        console.log(`Firestore updated with calendarEventIds for order ${orderId}`);
      } catch (dbErr) {
        console.warn(`Failed to update calendarEventIds in Firestore for order ${orderId}:`, dbErr);
      }
      try {
        const localOrders = getLocalOrders();
        const localIndex = localOrders.findIndex((o) => o.id === orderId);
        if (localIndex !== -1) {
          localOrders[localIndex] = {
            ...localOrders[localIndex],
            calendarEventIds: updatedCalendarEventIds
          };
          saveLocalOrders(localOrders);
          console.log(`Local JSON updated with calendarEventIds for order ${orderId}`);
        }
      } catch (localErr) {
        console.error("Failed to update local orders with calendarEventIds:", localErr);
      }
    }
  } catch (err) {
    console.error(`Error syncing Google Calendar event for order ${orderId}:`, err);
  }
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = process.env.PORT || 3e3;
  app.use((0, import_cors.default)());
  app.use(import_express.default.json({ limit: "50mb" }));
  const transporter = import_nodemailer.default.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    family: 4
    // Force IPv4 — Render's network doesn't reliably route outbound IPv6 to Gmail SMTP
  });
  transporter.verify((error) => {
    if (error) {
      console.error("SMTP Configuration/Connection Error:", error);
    } else {
      console.log("SMTP connection verified! Server is ready to send emails.");
    }
  });
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  app.get("/api/diagnostics/firebase", async (req, res) => {
    try {
      const db = getFirestore();
      const ref = db.collection("meta").doc("diagnostics");
      await db.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        const prev = snap.data()?.count || 0;
        tx.set(
          ref,
          {
            count: prev + 1,
            lastRunAt: import_firestore.FieldValue.serverTimestamp()
          },
          { merge: true }
        );
      });
      res.json({ ok: true, projectId: firebaseConfig.projectId });
    } catch (err) {
      console.error("Firebase diagnostics failed:", err);
      res.status(500).json({ ok: false, error: err instanceof Error ? err.message : String(err) });
    }
  });
  app.get("/api/diagnostics/calendar", async (req, res) => {
    try {
      const calendar = getGoogleCalendarClient();
      if (!calendar) {
        return res.status(500).json({
          ok: false,
          error: "Google Calendar client not configured (missing GOOGLE_SERVICE_ACCOUNT_EMAIL/PRIVATE_KEY)."
        });
      }
      const r = await calendar.calendarList.list({ maxResults: 1 });
      res.json({ ok: true, calendarsReturned: (r.data.items || []).length });
    } catch (err) {
      const e = err;
      console.error("Calendar diagnostics failed:", err);
      res.status(500).json({
        ok: false,
        status: e?.status ?? e?.code,
        message: e?.message || "Calendar diagnostics failed"
      });
    }
  });
  app.post("/api/diagnostics/email", async (req, res) => {
    try {
      const { password, testEmail } = req.body;
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (!password || password !== adminPassword) {
        return res.status(401).json({ error: "Unauthorized: Invalid password" });
      }
      if (!testEmail) {
        return res.status(400).json({ error: "Missing testEmail" });
      }
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return res.status(500).json({
          ok: false,
          error: "SMTP is not fully configured (missing SMTP_USER or SMTP_PASS environment variables)."
        });
      }
      const info = await transporter.sendMail({
        from: `"Restoran Wawasan (Test)" <${process.env.SMTP_USER}>`,
        to: testEmail,
        subject: "Wawasan Pak Usop Catering App - SMTP Test Email",
        text: `Hello,

This is a diagnostics test email sent from the Restoran Wawasan Pak Usop Admin Panel.
If you received this, your SMTP configuration is 100% WORKING!

Sent at: ${(/* @__PURE__ */ new Date()).toLocaleString()}

Best regards,
Restoran Wawasan Pak Usop Server`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px; margin: 0 auto; background-color: #f9f9f9;">
            <h2 style="color: #0f3d2a; margin-top: 0;">Restoran Wawasan Putrajaya</h2>
            <p style="font-size: 16px; color: #333;">Hello,</p>
            <p style="font-size: 14px; line-height: 1.5; color: #555;">
              This is a diagnostics test email sent from the <strong>Restoran Wawasan Pak Usop Catering App</strong> Admin Panel.
            </p>
            <div style="background-color: #d1e7dd; color: #0f5132; padding: 12px; border-radius: 4px; font-weight: bold; margin: 15px 0;">
              \u2713 SMTP Configuration is 100% OPERATIONAL!
            </div>
            <p style="font-size: 12px; color: #888; margin-top: 25px; border-top: 1px solid #eee; padding-top: 10px;">
              Sent at: ${(/* @__PURE__ */ new Date()).toLocaleString()}<br>
              Server Time: ${(/* @__PURE__ */ new Date()).toISOString()}
            </p>
          </div>
        `
      });
      res.json({ ok: true, messageId: info.messageId });
    } catch (err) {
      console.error("Email diagnostics failed:", err);
      res.status(500).json({ ok: false, error: err instanceof Error ? err.message : String(err) });
    }
  });
  app.get("/api/widget/upcoming-orders", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit || "5", 10), 20);
      const now = /* @__PURE__ */ new Date();
      const results = [];
      try {
        const adminDb = getFirestore();
        const nowTs = import_firestore.Timestamp.fromDate(now);
        const snapshot = await adminDb.collection("orders").where("eventTimestamp", ">=", nowTs).orderBy("eventTimestamp", "asc").limit(limit).get();
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          const eventDate = d.eventTimestamp?.toDate?.() || (d.dateTime ? new Date(d.dateTime) : d.date ? /* @__PURE__ */ new Date(`${d.date}T${d.time || "12:00"}:00+08:00`) : null);
          if (eventDate && !isNaN(eventDate.getTime()) && eventDate.getTime() >= now.getTime()) {
            results.push({
              id: docSnap.id,
              date: eventDate.toISOString(),
              quantity: d.quantity,
              meals: Array.isArray(d.meals) ? d.meals.join(", ") : d.meals,
              location: d.location,
              menu: d.menu
            });
          }
        });
        if (results.length === 0) {
          const legacySnap = await adminDb.collection("orders").get();
          legacySnap.forEach((docSnap) => {
            const d = docSnap.data();
            const eventDate = d.dateTime ? new Date(d.dateTime) : d.date ? /* @__PURE__ */ new Date(`${d.date}T${d.time || "12:00"}:00+08:00`) : null;
            if (eventDate && !isNaN(eventDate.getTime()) && eventDate.getTime() >= now.getTime()) {
              results.push({
                id: docSnap.id,
                date: eventDate.toISOString(),
                quantity: d.quantity,
                meals: Array.isArray(d.meals) ? d.meals.join(", ") : d.meals,
                location: d.location,
                menu: d.menu
              });
            }
          });
        }
      } catch (dbErr) {
        console.warn("Widget endpoint: Firestore fetch failed, falling back to local orders:", dbErr);
        const localOrders = getLocalOrders();
        localOrders.forEach((d) => {
          const eventDate = d.dateTime ? new Date(d.dateTime) : d.date ? /* @__PURE__ */ new Date(`${d.date}T${d.time || "12:00"}:00+08:00`) : null;
          if (eventDate && !isNaN(eventDate.getTime()) && eventDate.getTime() >= now.getTime()) {
            results.push({
              id: d.id,
              date: eventDate.toISOString(),
              quantity: d.quantity,
              meals: Array.isArray(d.meals) ? d.meals.join(", ") : d.meals,
              location: d.location,
              menu: d.menu
            });
          }
        });
      }
      results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      res.json({ success: true, orders: results.slice(0, limit) });
    } catch (err) {
      console.error("Widget endpoint error:", err);
      res.status(500).json({ error: err instanceof Error ? err.message : "Internal server error" });
    }
  });
  app.get("/api/widget/kwgt", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
      const now = /* @__PURE__ */ new Date();
      let nextOrder = null;
      try {
        const adminDb = getFirestore();
        const nowTs = import_firestore.Timestamp.fromDate(now);
        const snapshot = await adminDb.collection("orders").where("eventTimestamp", ">=", nowTs).orderBy("eventTimestamp", "asc").limit(1).get();
        if (!snapshot.empty) {
          const docSnap = snapshot.docs[0];
          nextOrder = { id: docSnap.id, ...docSnap.data() };
        } else {
          const legacySnap = await adminDb.collection("orders").get();
          const legacyOrders = [];
          legacySnap.forEach((docSnap) => {
            const d = docSnap.data();
            const eventDate2 = d.dateTime ? new Date(d.dateTime) : d.date ? /* @__PURE__ */ new Date(`${d.date}T${d.time || "12:00"}:00+08:00`) : null;
            if (eventDate2 && !isNaN(eventDate2.getTime()) && eventDate2.getTime() >= now.getTime()) {
              legacyOrders.push({
                id: docSnap.id,
                ...d,
                computedDate: eventDate2
              });
            }
          });
          if (legacyOrders.length > 0) {
            legacyOrders.sort((a, b) => {
              const aTime = a.computedDate?.getTime() || 0;
              const bTime = b.computedDate?.getTime() || 0;
              return aTime - bTime;
            });
            nextOrder = legacyOrders[0];
          }
        }
      } catch (dbErr) {
        console.warn("KWGT endpoint: Firestore fetch failed, falling back to local orders:", dbErr);
        const localOrders = getLocalOrders();
        const upcomingLocal = [];
        localOrders.forEach((d) => {
          const eventDate2 = d.dateTime ? new Date(d.dateTime) : d.date ? /* @__PURE__ */ new Date(`${d.date}T${d.time || "12:00"}:00+08:00`) : null;
          if (eventDate2 && !isNaN(eventDate2.getTime()) && eventDate2.getTime() >= now.getTime()) {
            upcomingLocal.push({
              ...d,
              id: d.id,
              computedDate: eventDate2
            });
          }
        });
        if (upcomingLocal.length > 0) {
          upcomingLocal.sort((a, b) => {
            const aTime = a.computedDate?.getTime() || 0;
            const bTime = b.computedDate?.getTime() || 0;
            return aTime - bTime;
          });
          nextOrder = upcomingLocal[0];
        }
      }
      if (!nextOrder) {
        return res.json({
          status: "success",
          title: "No Upcoming Events",
          time: "--:--"
        });
      }
      const eventDate = nextOrder.eventTimestamp?.toDate?.() || (nextOrder.dateTime ? new Date(nextOrder.dateTime) : nextOrder.date ? /* @__PURE__ */ new Date(`${nextOrder.date}T${nextOrder.time || "12:00"}:00+08:00`) : null);
      let timeStr = "--:--";
      if (eventDate && !isNaN(eventDate.getTime())) {
        const utc = eventDate.getTime() + eventDate.getTimezoneOffset() * 6e4;
        const myTime = new Date(utc + 36e5 * 8);
        let hours = myTime.getHours();
        const minutes = myTime.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        const minutesStr = String(minutes).padStart(2, "0");
        const hoursStr = String(hours).padStart(2, "0");
        timeStr = `${hoursStr}:${minutesStr} ${ampm}`;
      }
      const orderName = nextOrder.name || "Customer";
      const orderMenu = nextOrder.menu || "Catering";
      const orderQty = nextOrder.quantity || 0;
      const titleStr = `${orderName} - ${orderMenu} (${orderQty} Pax)`;
      res.json({
        status: "success",
        title: titleStr,
        time: timeStr
      });
    } catch (err) {
      console.error("KWGT endpoint error:", err);
      res.status(500).json({
        status: "error",
        message: err instanceof Error ? err.message : "Internal server error"
      });
    }
  });
  if (process.env.ENABLE_DEBUG_ENDPOINTS === "true") {
    app.get("/api/widget/debug-all-orders", async (req, res) => {
      try {
        const results = [];
        try {
          const adminDb = getFirestore();
          const snapshot = await adminDb.collection("orders").get();
          snapshot.forEach((docSnap) => {
            results.push({ id: docSnap.id, ...docSnap.data() });
          });
        } catch (dbErr) {
          console.warn("Debug endpoint: Firestore fetch failed:", dbErr);
        }
        const localOrders = getLocalOrders();
        res.json({ success: true, firestoreCount: results.length, localCount: localOrders.length, firestoreOrders: results, localOrders });
      } catch (err) {
        console.error("Debug endpoint error:", err);
        res.status(500).json({ error: err instanceof Error ? err.message : "Internal server error" });
      }
    });
  }
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = req.body;
      let orderId = "";
      let invoiceNo = "";
      try {
        const created = await runWithRetry(() => createOrderWithSequentialInvoice(orderData));
        orderId = created.orderId;
        invoiceNo = created.invoiceNo;
      } catch (firestoreErr) {
        if (ENABLE_LOCAL_FALLBACK) {
          console.warn("Firestore order submission failed; ENABLE_LOCAL_FALLBACK=true so saving locally:", firestoreErr);
          orderId = "order_" + Math.random().toString(36).substring(2, 10);
          invoiceNo = `RW-FALLBACK-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
          const localOrders = getLocalOrders();
          localOrders.push({
            id: orderId,
            ...orderData,
            status: "approved",
            approvedAt: (/* @__PURE__ */ new Date()).toISOString(),
            invoiceNo,
            createdAt: { seconds: Math.floor(Date.now() / 1e3), nanoseconds: 0 }
          });
          saveLocalOrders(localOrders);
        } else {
          throw firestoreErr;
        }
      }
      syncGoogleCalendarEvent(orderId, { ...orderData, invoiceNo }).catch((err) => {
        console.error("Background Google Calendar event creation error:", err);
      });
      sendNotificationToTopic("new_orders", "New Order Received!", `New order from ${orderData.name || "Customer"} - ${orderData.quantity || "0"} pax.`).catch((err) => {
        console.error("Background push notification error:", err);
      });
      res.json({ success: true, id: orderId, invoiceNo });
    } catch (err) {
      console.error("Order submission endpoint error:", err);
      res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Internal server error" });
    }
  });
  app.post("/api/submissions/bill", async (req, res) => {
    try {
      const { submissionId, totalAmount, pdfBase64, fileName, collectionName = "submissions" } = req.body;
      if (!submissionId) {
        return res.status(400).json({ error: "Missing submissionId" });
      }
      if (totalAmount === void 0 || totalAmount === null || isNaN(Number(totalAmount))) {
        return res.status(400).json({ error: "Invalid or missing totalAmount" });
      }
      const parsedAmount = Number(totalAmount);
      let data = null;
      let isLocal = false;
      try {
        const adminDb = getFirestore();
        const docSnap = await adminDb.collection(collectionName).doc(submissionId).get();
        if (docSnap.exists) {
          data = docSnap.data();
        }
      } catch (dbErr) {
        console.warn("Firestore fetch in bill failed, trying local backup:", dbErr);
      }
      if (!data) {
        const localOrders = getLocalOrders();
        const found = localOrders.find((o) => o.id === submissionId);
        if (found) {
          data = found;
          isLocal = true;
        }
      }
      if (!data) {
        return res.status(404).json({ error: `Document not found in ${collectionName}` });
      }
      const updatedFields = {
        totalAmount: parsedAmount,
        status: "billed",
        billedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (!isLocal) {
        try {
          const adminDb = getFirestore();
          await runWithRetry(() => adminDb.collection(collectionName).doc(submissionId).update(updatedFields));
        } catch (dbErr) {
          console.warn("Firestore update in bill failed after retries, syncing locally:", dbErr);
          isLocal = true;
        }
      }
      if (isLocal) {
        const localOrders = getLocalOrders();
        const localIndex = localOrders.findIndex((o) => o.id === submissionId);
        if (localIndex !== -1) {
          localOrders[localIndex] = {
            ...localOrders[localIndex],
            ...updatedFields
          };
          saveLocalOrders(localOrders);
        }
      }
      if (collectionName === "orders") {
        syncGoogleCalendarEvent(submissionId).catch((err) => {
          console.error("Background Google Calendar event sync error during billing:", err);
        });
      }
      const customerEmail = data.customerEmail || data.email;
      const customerName = data.customerName || data.name || "Valued Customer";
      const invoiceNo = data.invoiceNo || `INV-${submissionId.substring(0, 6).toUpperCase()}`;
      const items = data.items || [];
      const lang = data.lang || "en";
      if (!customerEmail) {
        return res.json({
          success: true,
          message: "Document successfully updated to 'billed', but no customer email was found in the document to send an invoice."
        });
      }
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      if (!smtpUser || !smtpPass) {
        console.warn("SMTP credentials not configured. Please configure SMTP_USER and SMTP_PASS.");
        return res.json({
          success: true,
          message: "Document successfully updated to 'billed', but email could not be sent because SMTP is not configured on the server."
        });
      }
      let itemsHtml = "";
      if (items && Array.isArray(items) && items.length > 0) {
        itemsHtml = `
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px; font-family: sans-serif;">
            <thead>
              <tr style="border-bottom: 2px solid #e2e8f0; text-align: left; color: #4a5568; font-size: 13px;">
                <th style="padding: 10px 0;">Item</th>
                <th style="padding: 10px 0; text-align: center;">Qty</th>
                <th style="padding: 10px 0; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
        `;
        items.forEach((item) => {
          const name = item.name || item.title || "Item";
          const qty = item.qty || item.quantity || 1;
          const price = item.price !== void 0 ? `RM ${Number(item.price).toFixed(2)}` : "-";
          itemsHtml += `
            <tr style="border-bottom: 1px solid #edf2f7; color: #2d3748; font-size: 14px;">
              <td style="padding: 12px 0; font-weight: 500;">${name}</td>
              <td style="padding: 12px 0; text-align: center; color: #718096;">${qty}</td>
              <td style="padding: 12px 0; text-align: right; font-weight: 500;">${price}</td>
            </tr>
          `;
        });
        itemsHtml += `
            </tbody>
          </table>
        `;
      }
      const emailSubject = lang === "bm" ? `Invois Rasmi - ${invoiceNo} (Restoran Wawasan)` : `Official Invoice - ${invoiceNo} (Restoran Wawasan)`;
      const titleText = lang === "bm" ? "INVOIS RASMI" : "OFFICIAL INVOICE";
      const billToText = lang === "bm" ? "Bil Kepada:" : "Bill To:";
      const invoiceNoText = lang === "bm" ? "No. Invois:" : "Invoice No:";
      const dateText = lang === "bm" ? "Tarikh:" : "Date:";
      const totalAmountText = lang === "bm" ? "Jumlah Keseluruhan:" : "Total Amount:";
      const thankYouText = lang === "bm" ? "Terima kasih atas kunjungan/pesanan anda di Restoran Wawasan! Sila dapati butiran bil anda di bawah." : "Thank you for your order/visit at Restoran Wawasan! Please find your billing details below.";
      const footerText = lang === "bm" ? "E-mel ini dijanakan secara automatik. Sila hubungi kami jika terdapat sebarang pertanyaan." : "This is an automatically generated email. Please contact us if you have any questions.";
      const formattedDate = (/* @__PURE__ */ new Date()).toLocaleDateString("en-MY", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
      const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              background-color: #f7fafc;
              margin: 0;
              padding: 20px;
              color: #2d3748;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              border: 1px solid #e2e8f0;
            }
            .header {
              background-color: #1a202c;
              padding: 30px;
              text-align: center;
              color: #ffffff;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 700;
              letter-spacing: 0.05em;
            }
            .header p {
              margin: 5px 0 0 0;
              color: #a0aec0;
              font-size: 14px;
            }
            .content {
              padding: 30px;
            }
            .greeting {
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 20px;
            }
            .meta-box {
              background-color: #f8fafc;
              border: 1px solid #edf2f7;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 25px;
              font-size: 14px;
            }
            .meta-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .meta-row:last-child {
              margin-bottom: 0;
            }
            .meta-label {
              color: #718096;
              font-weight: 500;
            }
            .meta-value {
              color: #2d3748;
              font-weight: 600;
              text-align: right;
            }
            .total-box {
              background-color: #ebf8ff;
              border: 1px solid #bee3f8;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin-top: 20px;
              margin-bottom: 25px;
            }
            .total-label {
              font-size: 14px;
              color: #2b6cb0;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              font-weight: 700;
              margin-bottom: 5px;
            }
            .total-amount {
              font-size: 32px;
              font-weight: 800;
              color: #2b6cb0;
            }
            .footer {
              background-color: #f7fafc;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #a0aec0;
              border-top: 1px solid #edf2f7;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>RESTORAN WAWASAN</h1>
              <p>${titleText}</p>
            </div>
            <div class="content">
              <div class="greeting">
                <p style="margin-top:0; font-weight: 600; font-size: 18px;">${lang === "bm" ? "Salam" : "Hello"} ${customerName},</p>
                <p style="color: #4a5568;">${thankYouText}</p>
              </div>
              
              <div class="meta-box">
                <div class="meta-row">
                  <span class="meta-label">${billToText}</span>
                  <span class="meta-value">${customerName} (${customerEmail})</span>
                </div>
                <div class="meta-row">
                  <span class="meta-label">${invoiceNoText}</span>
                  <span class="meta-value" style="color: #1a202c;">${invoiceNo}</span>
                </div>
                <div class="meta-row">
                  <span class="meta-label">${dateText}</span>
                  <span class="meta-value">${formattedDate}</span>
                </div>
              </div>

              ${itemsHtml}

              <div class="total-box">
                <div class="total-label">${totalAmountText}</div>
                <div class="total-amount">RM ${parsedAmount.toFixed(2)}</div>
              </div>
            </div>
            <div class="footer">
              <p style="margin: 0;">${footerText}</p>
              <p style="margin: 5px 0 0 0;">&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Restoran Wawasan. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;
      const emailAttachments = [];
      if (pdfBase64) {
        emailAttachments.push({
          filename: fileName || `Invoice_${invoiceNo}.pdf`,
          content: pdfBase64,
          encoding: "base64"
        });
      }
      await transporter.sendMail({
        from: `"Restoran Wawasan" <${process.env.SENDER_EMAIL || "madnor.noisy@gmail.com"}>`,
        to: customerEmail,
        subject: emailSubject,
        html: htmlBody,
        attachments: emailAttachments.length > 0 ? emailAttachments : void 0
      });
      console.log(`Invoice email sent successfully to ${customerEmail} for submission ${submissionId}`);
      res.json({
        success: true,
        message: "Submission updated and invoice email sent successfully",
        data: {
          submissionId,
          totalAmount: parsedAmount,
          status: "billed",
          emailSentTo: customerEmail
        }
      });
    } catch (error) {
      console.error("Error billing submission:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to bill submission and send email" });
    }
  });
  app.post("/api/send-invoice", async (req, res) => {
    try {
      const { email, name, invoiceNo, pdfBase64, isFinal, lang, orderDetails } = req.body;
      if (!email || !pdfBase64) {
        return res.status(400).json({ error: "Missing required fields (email, pdfBase64)" });
      }
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("SMTP credentials not configured. Please configure SMTP_USER and SMTP_PASS.");
        return res.status(500).json({ error: "Email service not configured." });
      }
      const emailSubject = lang === "bm" ? isFinal ? `Invois Muktamad - ${invoiceNo}` : `Invois Awal - ${invoiceNo}` : isFinal ? `Final Invoice - ${invoiceNo}` : `Preliminary Invoice - ${invoiceNo}`;
      let emailBody = "";
      let htmlBody = void 0;
      if (orderDetails) {
        const titleText = lang === "bm" ? "TEMPAHAN KATERING REKODED" : "CATERING BOOKING RECORDED";
        const subtitleText = lang === "bm" ? "Butiran Tempahan & Invois Awal" : "Booking Details & Preliminary Invoice";
        const thankYouText = lang === "bm" ? `Terima kasih kerana memilih <strong>Restoran Wawasan</strong>! Butiran tempahan katering anda telah berjaya direkodkan. Sila dapati salinan butiran lengkap pesanan anda di bawah.` : `Thank you for choosing <strong>Restoran Wawasan</strong>! Your catering booking details have been successfully recorded. Please find a copy of your complete order details below.`;
        const footerText = lang === "bm" ? "E-mel ini dijanakan secara automatik. Sila hubungi kami jika terdapat sebarang pertanyaan." : "This is an automatically generated email. Please contact us if you have any questions.";
        const mealLabels = {
          "breakfast": lang === "bm" ? "Sarapan (Breakfast)" : "Breakfast (Sarapan)",
          "lunch": lang === "bm" ? "Makan Tengahari (Lunch)" : "Lunch (Makan Tengahari)",
          "tea_break": lang === "bm" ? "Minum Petang (High Tea)" : "High Tea (Minum Petang)",
          "dinner": lang === "bm" ? "Makan Malam (Dinner)" : "Dinner (Makan Malam)"
        };
        const formattedMeals = Array.isArray(orderDetails.meals) ? orderDetails.meals.map((m) => mealLabels[m] || m).join(", ") : orderDetails.meals || "N/A";
        htmlBody = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                background-color: #f7fafc;
                margin: 0;
                padding: 20px;
                color: #2d3748;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                border: 1px solid #e2e8f0;
              }
              .header {
                background-color: #1a202c;
                padding: 30px;
                text-align: center;
                color: #ffffff;
                border-bottom: 3px solid #D4AF37;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 700;
                letter-spacing: 0.05em;
                color: #D4AF37;
              }
              .header p {
                margin: 5px 0 0 0;
                color: #a0aec0;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.1em;
              }
              .content {
                padding: 30px;
              }
              .greeting {
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 25px;
              }
              .section-title {
                font-size: 16px;
                font-weight: 700;
                color: #1a202c;
                border-bottom: 2px solid #edf2f7;
                padding-bottom: 8px;
                margin-top: 25px;
                margin-bottom: 15px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
              }
              .detail-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 25px;
                font-size: 14px;
              }
              .detail-table td {
                padding: 10px 12px;
                vertical-align: top;
                border-bottom: 1px solid #f7fafc;
              }
              .detail-table td.label {
                width: 35%;
                color: #718096;
                font-weight: 600;
                background-color: #fcfcfc;
              }
              .detail-table td.value {
                width: 65%;
                color: #2d3748;
                font-weight: 500;
              }
              .notes-box {
                background-color: #fffaf0;
                border: 1px solid #feebc8;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 25px;
                font-size: 14px;
              }
              .notes-title {
                color: #dd6b20;
                font-weight: 700;
                margin-bottom: 5px;
                text-transform: uppercase;
                font-size: 12px;
                letter-spacing: 0.05em;
              }
              .notes-content {
                color: #7b341e;
                line-height: 1.5;
              }
              .footer {
                background-color: #f7fafc;
                padding: 25px;
                text-align: center;
                font-size: 12px;
                color: #a0aec0;
                border-top: 1px solid #edf2f7;
                line-height: 1.5;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>RESTORAN WAWASAN</h1>
                <p>${titleText}</p>
                <div style="font-size: 12px; color: #cbd5e0; margin-top: 4px;">${subtitleText}</div>
              </div>
              <div class="content">
                <div class="greeting">
                  <p style="margin-top: 0; font-weight: 700; font-size: 18px; color: #1a202c;">
                    ${lang === "bm" ? "Salam" : "Hello"} ${name || "Customer"},
                  </p>
                  <p style="color: #4a5568; margin-bottom: 0;">${thankYouText}</p>
                </div>

                <div class="section-title">${lang === "bm" ? "BUTIRAN MAJLIS" : "EVENT DETAILS"}</div>
                <table class="detail-table">
                  <tr>
                    <td class="label">${lang === "bm" ? "Syarikat / Organisasi" : "Company / Organization"}</td>
                    <td class="value">${orderDetails.to || "N/A"}</td>
                  </tr>
                  <tr>
                    <td class="label">${lang === "bm" ? "Untuk Perhatian (Attn)" : "Attention (Attn)"}</td>
                    <td class="value">${orderDetails.attn || "N/A"}</td>
                  </tr>
                  <tr>
                    <td class="label">${lang === "bm" ? "Nama PIC" : "PIC Name"}</td>
                    <td class="value">${orderDetails.name || "N/A"}</td>
                  </tr>
                  <tr>
                    <td class="label">${lang === "bm" ? "Siri Hubungan" : "Contact Number"}</td>
                    <td class="value">${orderDetails.contact || "N/A"}</td>
                  </tr>
                  <tr>
                    <td class="label">${lang === "bm" ? "Alamat E-mel" : "Email Address"}</td>
                    <td class="value">${orderDetails.email || "N/A"}</td>
                  </tr>
                  <tr>
                    <td class="label">${lang === "bm" ? "Tarikh Majlis" : "Event Date"}</td>
                    <td class="value" style="color: #2b6cb0; font-weight: 700;">${orderDetails.date || "N/A"}</td>
                  </tr>
                  <tr>
                    <td class="label">${lang === "bm" ? "Masa Penghantaran" : "Delivery Time"}</td>
                    <td class="value">${orderDetails.time || "N/A"}</td>
                  </tr>
                  <tr>
                    <td class="label">${lang === "bm" ? "Lokasi / Alamat Majlis" : "Event Venue"}</td>
                    <td class="value">${orderDetails.location || "N/A"}</td>
                  </tr>
                </table>

                <div class="section-title">${lang === "bm" ? "PILIHAN MENU & HIDANGAN" : "MENU & MEAL SELECTION"}</div>
                <table class="detail-table">
                  <tr>
                    <td class="label">${lang === "bm" ? "Pakej Pilihan" : "Selected Package"}</td>
                    <td class="value" style="font-weight: 700; color: #1a202c;">${orderDetails.menu || "N/A"}</td>
                  </tr>
                  <tr>
                    <td class="label">${lang === "bm" ? "Bilangan Pax" : "Quantity (Pax)"}</td>
                    <td class="value" style="font-weight: 700; color: #2b6cb0;">${orderDetails.quantity || "N/A"} Pax</td>
                  </tr>
                  <tr>
                    <td class="label">${lang === "bm" ? "Jenis Hidangan" : "Meal Types"}</td>
                    <td class="value">${formattedMeals}</td>
                  </tr>
                </table>

                ${orderDetails.notes ? `
                  <div class="notes-box">
                    <div class="notes-title">${lang === "bm" ? "PERMINTAAN KHAS / NOTA" : "SPECIAL REQUESTS / NOTES"}</div>
                    <div class="notes-content">${orderDetails.notes.replace(/\n/g, "<br>")}</div>
                  </div>
                ` : ""}

                <div style="background-color: #ebf8ff; border: 1px solid #bee3f8; border-radius: 8px; padding: 15px; text-align: center; font-size: 14px; color: #2b6cb0; font-weight: 600;">
                  ${lang === "bm" ? `Salinan invois awal (${invoiceNo}) telah dilampirkan bersama e-mel ini.` : `A copy of your preliminary invoice (${invoiceNo}) has been attached to this email.`}
                </div>
              </div>
              <div class="footer">
                <p style="margin: 0;">${footerText}</p>
                <p style="margin: 5px 0 0 0; font-weight: 600; color: #718096;">Restoran Wawasan Putrajaya</p>
                <p style="margin: 5px 0 0 0;">&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Restoran Wawasan. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `;
      } else {
        emailBody = lang === "bm" ? `Salam ${name || "Pelanggan"},

Sila dapati lampiran invois untuk rujukan anda.

Terima kasih.
Restoran Wawasan` : `Dear ${name || "Customer"},

Please find attached the invoice for your reference.

Thank you.
Restoran Wawasan`;
      }
      const pdfBuffer = Buffer.from(pdfBase64.split(",")[1] || pdfBase64, "base64");
      await transporter.sendMail({
        from: `"Restoran Wawasan" <${process.env.SENDER_EMAIL || "madnor.noisy@gmail.com"}>`,
        to: email,
        subject: emailSubject,
        text: htmlBody ? void 0 : emailBody,
        html: htmlBody,
        attachments: [
          {
            filename: `Invoice_${invoiceNo}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf"
          }
        ]
      });
      console.log(`Invoice email sent successfully to ${email}`);
      res.json({ success: true, message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending invoice email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });
  app.post("/api/admin/login", (req, res) => {
    try {
      const { password } = req.body;
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (!password || password !== adminPassword) {
        return res.status(401).json({ success: false, error: "Unauthorized: Invalid password" });
      }
      return res.json({ success: true });
    } catch (err) {
      console.error("Admin login API error:", err);
      res.status(500).json({ error: err instanceof Error ? err.message : "Internal server error" });
    }
  });
  app.post("/api/admin/subscribe-to-topic", async (req, res) => {
    try {
      const { token, topic } = req.body;
      if (!token || !topic) {
        return res.status(400).json({ error: "Missing token or topic" });
      }
      const app2 = getAdminApp();
      await (0, import_messaging.getMessaging)(app2).subscribeToTopic(token, topic);
      console.log(`Successfully subscribed token to topic ${topic}`);
      res.json({ success: true });
    } catch (err) {
      console.error("Error subscribing to topic:", err);
      res.status(500).json({ error: "Failed to subscribe" });
    }
  });
  app.post("/api/admin/orders", async (req, res) => {
    try {
      const { password, action, orderId, data } = req.body;
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (!password || password !== adminPassword) {
        return res.status(401).json({ error: "Unauthorized: Invalid password" });
      }
      if (action === "fetch") {
        const orders = [];
        try {
          const adminDb = getFirestore();
          const snapshot = await adminDb.collection("orders").orderBy("createdAt", "desc").get();
          snapshot.forEach((docSnap) => {
            const docData = docSnap.data();
            const createdAt = docData.createdAt;
            orders.push({
              id: docSnap.id,
              ...docData,
              createdAt: createdAt ? {
                seconds: createdAt.seconds,
                nanoseconds: createdAt.nanoseconds
              } : null
            });
          });
        } catch (dbErr) {
          console.warn("Firestore fetch failed, relying on local backup:", dbErr);
        }
        const localOrders = getLocalOrders();
        localOrders.forEach((localOrder) => {
          if (!orders.some((o) => o.id === localOrder.id)) {
            orders.push(localOrder);
          }
        });
        orders.sort((a, b) => {
          const secA = a.createdAt?.seconds || 0;
          const secB = b.createdAt?.seconds || 0;
          return secB - secA;
        });
        return res.json({ success: true, orders });
      }
      if (action === "update") {
        if (!orderId || !data) {
          return res.status(400).json({ error: "Missing orderId or data for update" });
        }
        let previousOrder;
        try {
          const adminDb = getFirestore();
          const beforeSnap = await adminDb.collection("orders").doc(orderId).get();
          if (beforeSnap.exists) {
            previousOrder = beforeSnap.data();
          }
        } catch (readErr) {
          console.warn("[StatusNotify] Could not read order before update (Firestore):", readErr);
        }
        if (!previousOrder) {
          const localOrdersBefore = getLocalOrders();
          previousOrder = localOrdersBefore.find((o) => o.id === orderId);
        }
        const previousStatus = previousOrder?.status || "";
        let updatedInFirestore = false;
        try {
          const adminDb = getFirestore();
          await runWithRetry(() => adminDb.collection("orders").doc(orderId).update(data));
          updatedInFirestore = true;
        } catch (dbErr) {
          console.warn("Firestore update failed after retries, relying on local backup:", dbErr);
        }
        const localOrders = getLocalOrders();
        const localIndex = localOrders.findIndex((o) => o.id === orderId);
        if (localIndex !== -1) {
          localOrders[localIndex] = {
            ...localOrders[localIndex],
            ...data
          };
          saveLocalOrders(localOrders);
        } else if (!updatedInFirestore) {
          const newLocalOrder = {
            id: orderId,
            ...data,
            createdAt: { seconds: Math.floor(Date.now() / 1e3), nanoseconds: 0 }
          };
          localOrders.push(newLocalOrder);
          saveLocalOrders(localOrders);
        }
        syncGoogleCalendarEvent(orderId).catch((err) => {
          console.error("Background Google Calendar event sync error during admin update:", err);
        });
        const newStatus = data?.status;
        if (newStatus && newStatus !== previousStatus) {
          const mergedOrder = {
            ...previousOrder || {},
            ...data,
            id: orderId
          };
          console.log(`[StatusNotify] Order ${orderId} status changed: "${previousStatus}" -> "${newStatus}". Notifying customer.`);
          notifyCustomerOfStatusChange(transporter, mergedOrder, newStatus).catch((err) => {
            console.error("[StatusNotify] Background status notification error:", err);
          });
        }
        return res.json({ success: true });
      }
      if (action === "delete") {
        if (!orderId) {
          return res.status(400).json({ error: "Missing orderId for delete" });
        }
        try {
          const adminDb = getFirestore();
          await runWithRetry(() => adminDb.collection("orders").doc(orderId).delete());
        } catch (dbErr) {
          console.warn("Firestore delete failed after retries, relying on local backup:", dbErr);
        }
        const localOrders = getLocalOrders();
        const filtered = localOrders.filter((o) => o.id !== orderId);
        if (filtered.length !== localOrders.length) {
          saveLocalOrders(filtered);
        }
        return res.json({ success: true });
      }
      return res.status(400).json({ error: "Invalid action" });
    } catch (err) {
      console.error("Admin orders API error:", err);
      res.status(500).json({ error: err instanceof Error ? err.message : "Internal server error" });
    }
  });
  const isProduction = process.env.NODE_ENV === "production" && import_fs.default.existsSync(import_path.default.join(process.cwd(), "dist/index.html"));
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
