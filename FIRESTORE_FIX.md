# خطوات إعداد Firestore Database

## المشكلة
البيانات لا تُحفظ في Firestore لأن قاعدة البيانات غير مفعّلة أو قواعد الأمان غير صحيحة.

---

## الحل - خطوة بخطوة ⚡

### 1️⃣ تفعيل Firestore Database

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروع **mention-ad8dd**
3. من القائمة الجانبية، اضغط على **Firestore Database**
4. اضغط **Create database** (إنشاء قاعدة بيانات)
5. اختر **Test mode** للتجربة (أو Production mode إذا أردت)
6. اختر المنطقة: **us-central** أو الأقرب لك
7. اضغط **Enable** (تفعيل)

⏱️ انتظر دقيقة حتى يتم إنشاء قاعدة البيانات...

---

### 2️⃣ إعداد قواعد الأمان (Security Rules)

بعد إنشاء Firestore:

1. اذهب إلى تبويب **Rules** (القواعد)
2. احذف القواعد الموجودة واستبدلها بهذه:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /siteSettings/{document=**} {
      // السماح بالقراءة للجميع
      allow read: if true;
      // السماح بالكتابة للمستخدمين المسجلين فقط
      allow write: if request.auth != null;
    }
  }
}
```

3. اضغط **Publish** (نشر)

---

### 3️⃣ إنشاء المستند الأولي

**طريقة 1: من Firestore Console (الأسهل)**

1. في Firestore Database، اضغط **Start collection**
2. أدخل Collection ID: `siteSettings`
3. اضغط **Next**
4. أدخل Document ID: `main`
5. أضف الحقول التالية:

| Field | Type | Value |
|-------|------|-------|
| logo | string | https://i.postimg.cc/0yvTRQ22/mention-logo-wihte.png |
| aboutImage | string | https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop |
| clientLogos | array | [] (اتركه فارغاً) |
| portfolioCategories | map | {} (اتركه فارغاً) |
| featuredWork | array | [] (اتركه فارغاً) |

6. اضغط **Save**

---

**طريقة 2: من لوحة التحكم (بعد التفعيل)**

1. افتح الموقع على `http://localhost:5173/#admin`
2. سجل الدخول
3. اضغط زر **"اختبار الاتصال"**
4. إذا ظهرت رسالة "✅ الاتصال بـ Firestore ناجح!"
5. أضف البيانات واضغط **"حفظ جميع التغييرات"**

---

### 4️⃣ إنشاء مستخدم Admin

1. من Firebase Console، اختر **Authentication**
2. إذا لم يكن مفعّلاً:
   - اضغط **Get Started**
   - اختر **Email/Password**
   - فعّله
3. اذهب إلى تبويب **Users**
4. اضغط **Add user**
5. أدخل:
   - Email: `admin@mention-studio.com` (أو أي بريد)
   - Password: `your-secure-password`
6. اضغط **Add user**

---

### 5️⃣ اختبار النظام

1. افتح `http://localhost:5173/#admin`
2. سجل الدخول بالبريد وكلمة المرور
3. اضغط **"اختبار الاتصال"**
4. إذا ظهرت ✅، أضف البيانات
5. اضغط **"حفظ جميع التغييرات"**
6. افتح Console المتصفح (F12)
7. تحقق من وجود رسالة: `Data saved successfully!`
8. ارجع للصفحة الرئيسية `#home`
9. يجب أن ترى التغييرات!

---

## 🔍 استكشاف الأخطاء

### الخطأ: "Missing or insufficient permissions"
**الحل:**
- تأكد من قواعد الأمان في Firestore (الخطوة 2)
- تأكد من تسجيل الدخول في Authentication

### الخطأ: "Firebase: Error (auth/...)"
**الحل:**
- تأكد من تفعيل Authentication
- تأكد من تفعيل Email/Password sign-in method

### الخطأ: "Document doesn't exist"
**الحل:**
- أنشئ المستند الأولي (الخطوة 3)
- أو اضغط "حفظ جميع التغييرات" من لوحة التحكم

### البيانات لا تظهر في الموقع
**الحل:**
1. افتح Console المتصفح (F12)
2. ابحث عن أخطاء حمراء
3. تحقق من Firestore Console - هل المستند موجود؟
4. حاول إعادة تحميل الصفحة (Ctrl+Shift+R)

---

## ✅ التحقق من النجاح

افتح Firestore Console وتأكد من:
- ✅ Collection `siteSettings` موجودة
- ✅ Document `main` موجود بداخلها
- ✅ الحقول `logo`, `aboutImage`, `clientLogos`, `portfolioCategories`, `featuredWork` موجودة

---

## 📝 ملاحظات هامة

1. **Test Mode**: يسمح بالقراءة والكتابة لمدة 30 يوماً فقط
2. **Production Mode**: تحتاج لقواعد أمان صحيحة (موجودة في الخطوة 2)
3. **البيانات الافتراضية**: إذا لم تكن هناك بيانات في Firestore، الموقع يستخدم `constants.tsx`
4. **التحديث الفوري**: التغييرات تظهر فوراً بعد الحفظ وإعادة التحميل

---

## 🎯 الخطوات بترتيب سريع

```
1. Firebase Console → Firestore Database → Create database
2. Rules → نسخ القواعد → Publish
3. Authentication → Email/Password → Enable → Add user
4. Start collection: siteSettings → Document: main → Add fields
5. الموقع → #admin → تسجيل دخول → اختبار الاتصال
6. إضافة البيانات → حفظ
7. الصفحة الرئيسية → التحقق من التغييرات ✅
```

---

**بعد إتمام هذه الخطوات، يجب أن يعمل كل شيء! 🚀**
