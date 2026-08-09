// Firebase istemci yapılandırması.
//
// NOT: Buradaki `apiKey` bir sır DEĞİLDİR. Firebase web yapılandırması tasarımı
// gereği herkese açıktır (proje tanımlayıcısıdır, yetki vermez). Gerçek güvenlik
// Firebase Security Rules + backend token doğrulaması ile sağlanır
// (bkz. backend/auth.py). Asıl gizli olan şey service account anahtarıdır ve o
// dosya repoya girmez.
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDFu87LozafDDsmtgn5Gaf367gcF0VUDVE',
  authDomain: 'mechcode-mvp.firebaseapp.com',
  projectId: 'mechcode-mvp',
  storageBucket: 'mechcode-mvp.firebasestorage.app',
  messagingSenderId: '666503638845',
  appId: '1:666503638845:web:bf4613b27a29690ddddf54',
  measurementId: 'G-2XFQ8Q6YYE',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// getAnalytics() localhost/desteklenmeyen ortamlarda exception atar; MVP'yi
// kırmaması için destek kontrolünden geçiriyoruz.
isSupported()
  .then((ok) => {
    if (ok) getAnalytics(app);
  })
  .catch(() => {
    /* analytics zorunlu değil */
  });

/** Admin yetkisi verilen e-posta adresleri (UI tarafı; asıl kontrol backend'de). */
export const ADMIN_EMAILS = ['aslantaner194@gmail.com'];

export const isAdminEmail = (email: string | null | undefined): boolean =>
  !!email && ADMIN_EMAILS.includes(email.toLowerCase());
