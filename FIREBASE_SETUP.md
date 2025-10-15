# Firebase Setup Guide - دليل إعداد Firebase

## ✅ ما تم إنجازه

تم ربط الموقع بالكامل مع Firebase! الآن يمكنك إدارة المحتوى من لوحة التحكم.

### المكونات المرتبطة بـ Firebase:

1. **Header** - شعار الموقع (Logo)
2. **About Section** - صورة About Mention Studio
3. **Portfolio Section** - الأعمال المميزة (4 صور)
4. **Clients Section** - شعارات العملاء (infinite scroll)
5. **Portfolio Page** - جميع الفئات والصور

---

## 🚀 خطوات التشغيل

### 1. إعداد Firebase Console

1. افتح [Firebase Console](https://console.firebase.google.com/)
2. المشروع موجود بالفعل: **mention-studio-50b58**

### 2. تفعيل Firestore Database

1. من القائمة الجانبية، اختر **Firestore Database**
2. اضغط **Create database**
3. اختر **Production mode** أو **Test mode** (للتجربة)
4. اختر المنطقة الأقرب لك

### 3. تفعيل Authentication

1. من القائمة الجانبية، اختر **Authentication**
2. اذهب إلى تبويب **Sign-in method**
3. فعّل **Email/Password**
4. اذهب إلى تبويب **Users**
5. اضغط **Add user**
6. أدخل البريد الإلكتروني وكلمة المرور للمسؤول

---

## 🎮 كيفية استخدام لوحة التحكم

### الوصول إلى لوحة التحكم:

```
http://localhost:5173/#admin
```

أو في الإنتاج:
```
https://your-domain.com/#admin
```

### تسجيل الدخول:

استخدم البريد الإلكتروني وكلمة المرور التي أنشأتها في Firebase Authentication.

---

## 📝 إدارة المحتوى

### 1. شعار الموقع (Header Logo)
- أدخل رابط الصورة في حقل "شعار الموقع"
- سيظهر الشعار فورًا في الـ Header

### 2. صورة About Mention Studio
- أدخل رابط الصورة في حقل "صورة About Mention Studio"
- ستظهر الصورة في قسم About

### 3. شعارات العملاء
- أدخل رابط شعار العميل
- اضغط "إضافة"
- سيظهر الشعار في قسم Our Clients مع التمرير اللانهائي
- لحذف شعار، اضغط على ✕

### 4. فئات Portfolio
- أدخل اسم الفئة الجديدة (مثل: Branding, Social Media, Motion Graphics)
- اضغط "إضافة فئة"
- اختر الفئة من القائمة المنسدلة
- أدخل رابط الصورة
- اضغط "إضافة صورة"
- لحذف فئة كاملة، اضغط "حذف الفئة"

### 5. الأعمال المميزة (Featured Work)
- انقر على النجمة ⭐ في أي صورة من فئات Portfolio
- يمكنك اختيار **4 صور فقط**
- هذه الصور ستظهر في قسم "A Glimpse of Our Work" في الصفحة الرئيسية

### 6. حفظ التغييرات
- بعد إجراء جميع التعديلات، اضغط **"حفظ جميع التغييرات"**
- سيتم حفظ جميع البيانات في Firestore

---

## 🗂️ هيكل البيانات في Firestore

```javascript
// Collection: siteSettings
// Document: main
{
  logo: "https://example.com/logo.png",
  aboutImage: "https://example.com/about.jpg",
  clientLogos: [
    "https://example.com/client1.png",
    "https://example.com/client2.png"
  ],
  portfolioCategories: {
    "Branding": [
      "https://example.com/brand1.jpg",
      "https://example.com/brand2.jpg"
    ],
    "Social Media": [
      "https://example.com/social1.jpg"
    ]
  },
  featuredWork: [
    "https://example.com/featured1.jpg",
    "https://example.com/featured2.jpg",
    "https://example.com/featured3.jpg",
    "https://example.com/featured4.jpg"
  ]
}
```

---

## 🔒 الأمان

### قواعد Firestore (Security Rules)

للسماح بالقراءة لجميع المستخدمين والكتابة للمسؤولين فقط:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // السماح بالقراءة للجميع
    match /siteSettings/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🔧 استكشاف الأخطاء

### المشكلة: لا تظهر البيانات في الموقع
- **الحل**: تأكد من إنشاء document باسم `main` في collection `siteSettings`
- اذهب إلى Firestore Console
- أنشئ Collection جديدة: `siteSettings`
- أنشئ Document بـ ID: `main`

### المشكلة: لا أستطيع تسجيل الدخول
- **الحل**: تأكد من إنشاء مستخدم في Firebase Authentication
- تأكد من تفعيل Email/Password sign-in method

### المشكلة: الصور لا تظهر
- **الحل**: تأكد من أن روابط الصور صحيحة وتدعم HTTPS
- يمكنك استخدام خدمات مثل:
  - [Imgur](https://imgur.com/)
  - [PostImage](https://postimages.org/)
  - [Unsplash](https://unsplash.com/)
  - Firebase Storage

---

## 📱 نصائح لاستخدام الصور

### أحجام الصور الموصى بها:

- **Logo**: 200x80 px (PNG مع خلفية شفافة)
- **About Image**: 600x400 px
- **Client Logos**: 200x100 px
- **Portfolio Images**: 800x800 px (مربعة)
- **Featured Work**: 800x800 px (مربعة)

### رفع الصور:

يمكنك استخدام Firebase Storage:
1. من Firebase Console، اختر **Storage**
2. اضغط **Get Started**
3. ارفع الصور
4. انسخ رابط الصورة
5. استخدم الرابط في لوحة التحكم

---

## 🎉 ملاحظات

- جميع التغييرات تحدث فورًا بعد الحفظ
- لا حاجة لإعادة تشغيل الموقع
- يمكنك تحديث المحتوى في أي وقت من لوحة التحكم
- البيانات محفوظة في السحابة ولن تفقدها

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. تحقق من Console في المتصفح (F12)
2. تأكد من إعدادات Firebase
3. تحقق من قواعد الأمان في Firestore

---

**تم الإنجاز بنجاح ✅**

الموقع الآن مرتبط بالكامل مع Firebase ويمكن إدارة جميع المحتوى من لوحة التحكم!
