import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  LogOut, 
  Wifi, 
  Save, 
  Plus, 
  X, 
  Trash2, 
  Edit2, 
  Check, 
  Image as ImageIcon, 
  Users, 
  Folder, 
  Star,
  AlertTriangle,
  Mail,
  Lock
} from 'lucide-react';

interface SiteData {
  logo: string;
  aboutImage: string;
  clientLogos: string[];
  portfolioCategories: {
    [category: string]: Array<{url: string; type: 'image' | 'video'}>;
  };
  featuredWork: string[];
}

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [siteData, setSiteData] = useState<SiteData>({
    logo: 'https://i.postimg.cc/0yvTRQ22/mention-logo-wihte.png',
    aboutImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    clientLogos: [],
    portfolioCategories: {},
    featuredWork: []
  });
  const [newClientLogo, setNewClientLogo] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'clients' | 'portfolio' | 'featured' | 'firebase'>('general');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [newCategoryImage, setNewCategoryImage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        loadSiteData();
      }
    });
    return () => unsubscribe();
  }, []);

  const loadSiteData = async () => {
    try {
      const docRef = doc(db, 'siteSettings', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSiteData(docSnap.data() as SiteData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveSiteData = async () => {
    try {
      console.log('Saving data to Firestore:', siteData);
      await setDoc(doc(db, 'siteSettings', 'main'), siteData);
      console.log('Data saved successfully!');
      alert('✅ تم حفظ البيانات بنجاح! يمكنك الآن العودة للصفحة الرئيسية لرؤية التغييرات.');
    } catch (error: any) {
      console.error('Error saving data:', error);
      alert('❌ حدث خطأ أثناء الحفظ: ' + (error.message || 'Unknown error') + '\n\nتأكد من:\n1. تفعيل Firestore في Firebase Console\n2. إعداد قواعد الأمان\n3. الاتصال بالإنترنت');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert('خطأ في تسجيل الدخول');
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const addClientLogo = () => {
    if (newClientLogo.trim()) {
      setSiteData({
        ...siteData,
        clientLogos: [...siteData.clientLogos, newClientLogo.trim()]
      });
      setNewClientLogo('');
    }
  };

  const removeClientLogo = (index: number) => {
    setSiteData({
      ...siteData,
      clientLogos: siteData.clientLogos.filter((_, i) => i !== index)
    });
  };

  const addCategory = () => {
    if (newCategory.trim() && !siteData.portfolioCategories[newCategory]) {
      setSiteData({
        ...siteData,
        portfolioCategories: {
          ...siteData.portfolioCategories,
          [newCategory]: []
        }
      });
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    const { [category]: removed, ...rest } = siteData.portfolioCategories;
    setSiteData({
      ...siteData,
      portfolioCategories: rest
    });
  };

  const startEditCategory = (category: string) => {
    setEditingCategory(category);
    setEditCategoryName(category);
  };

  const saveEditCategory = () => {
    if (!editingCategory || !editCategoryName.trim()) return;
    
    if (editCategoryName === editingCategory) {
      setEditingCategory(null);
      return;
    }
    
    if (siteData.portfolioCategories[editCategoryName]) {
      alert('⚠️ هذا الاسم موجود بالفعل!');
      return;
    }

    const { [editingCategory]: images, ...rest } = siteData.portfolioCategories;
    setSiteData({
      ...siteData,
      portfolioCategories: {
        ...rest,
        [editCategoryName]: images
      }
    });
    
    if (selectedCategory === editingCategory) {
      setSelectedCategory(editCategoryName);
    }
    
    setEditingCategory(null);
    setEditCategoryName('');
  };

  const cancelEditCategory = () => {
    setEditingCategory(null);
    setEditCategoryName('');
  };

  const addImageToCategory = () => {
    if (selectedCategory && newCategoryImage.trim()) {
      const currentCategory = siteData.portfolioCategories[selectedCategory];
      const isNewFormat = currentCategory.length > 0 && typeof currentCategory[0] === 'object';
      
      setSiteData({
        ...siteData,
        portfolioCategories: {
          ...siteData.portfolioCategories,
          [selectedCategory]: [
            ...(isNewFormat ? currentCategory : currentCategory.map((url: any) => ({url, type: 'image'}))),
            { url: newCategoryImage.trim(), type: mediaType }
          ] as any
        }
      });
      setNewCategoryImage('');
    }
  };

  const removeImageFromCategory = (category: string, index: number) => {
    setSiteData({
      ...siteData,
      portfolioCategories: {
        ...siteData.portfolioCategories,
        [category]: siteData.portfolioCategories[category].filter((_, i) => i !== index)
      }
    });
  };

  const toggleFeaturedWork = (item: any) => {
    const url = typeof item === 'string' ? item : item.url;
    
    if (siteData.featuredWork.includes(url)) {
      setSiteData({
        ...siteData,
        featuredWork: siteData.featuredWork.filter(u => u !== url)
      });
    } else {
      if (siteData.featuredWork.length < 4) {
        setSiteData({
          ...siteData,
          featuredWork: [...siteData.featuredWork, url]
        });
      } else {
        alert('يمكنك اختيار 4 صور فقط للعرض في القسم الخارجي');
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">جاري التحميل...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet" />
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">لوحة التحكم</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white mb-2 flex items-center gap-2">
                <Mail size={18} />
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2 flex items-center gap-2">
                <Lock size={18} />
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors font-bold"
            >
              تسجيل الدخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 md:p-8" style={{ fontFamily: 'Cairo, sans-serif' }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet" />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">لوحة التحكم</h1>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  const docRef = doc(db, 'siteSettings', 'main');
                  await getDoc(docRef);
                  alert('✅ الاتصال بـ Firestore ناجح!');
                } catch (error: any) {
                  alert('❌ فشل الاتصال بـ Firestore:\n' + error.message + '\n\n⚠️ تحتاج إلى:\n1. تفعيل Firestore في Firebase Console\n2. إعداد قواعد الأمان\n3. راجع ملف FIRESTORE_FIX.md');
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
            >
              <Wifi size={18} />
              اختبار الاتصال
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <LogOut size={18} />
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* تنبيه إذا لم يكن هناك بيانات */}
        {!siteData.clientLogos.length && !Object.keys(siteData.portfolioCategories).length && (
          <div className="bg-yellow-600/20 border-2 border-yellow-500 p-6 rounded-lg mb-6">
            <h3 className="text-yellow-300 font-bold text-xl mb-2 flex items-center gap-2">
              <AlertTriangle size={24} />
              تنبيه: لم يتم تحميل بيانات من Firestore
            </h3>
            <p className="text-yellow-100 mb-3">
              يبدو أن Firestore غير مفعّل أو لا توجد بيانات محفوظة. اتبع هذه الخطوات:
            </p>
            <ol className="text-yellow-100 list-decimal list-inside space-y-2">
              <li>اضغط على زر <strong>"اختبار الاتصال"</strong> أعلاه</li>
              <li>إذا فشل الاتصال، اذهب إلى <a href="https://console.firebase.google.com/" target="_blank" className="underline font-bold">Firebase Console</a></li>
              <li>فعّل <strong>Firestore Database</strong> في وضع Test Mode</li>
              <li>أضف البيانات هنا واضغط <strong>"حفظ جميع التغييرات"</strong></li>
              <li>راجع ملف <strong>FIRESTORE_FIX.md</strong> للتعليمات الكاملة</li>
            </ol>
          </div>
        )}

        {/* Logo Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <ImageIcon size={24} />
            شعار الموقع
          </h2>
          <input
            type="text"
            value={siteData.logo}
            onChange={(e) => setSiteData({ ...siteData, logo: e.target.value })}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500 mb-2"
            placeholder="رابط الشعار"
          />
          {siteData.logo && (
            <img src={siteData.logo} alt="Logo Preview" className="h-12 mt-2" />
          )}
        </div>

        {/* About Image Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <ImageIcon size={24} />
            صورة About Mention Studio
          </h2>
          <input
            type="text"
            value={siteData.aboutImage}
            onChange={(e) => setSiteData({ ...siteData, aboutImage: e.target.value })}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500 mb-2"
            placeholder="رابط الصورة"
          />
          {siteData.aboutImage && (
            <img src={siteData.aboutImage} alt="About Preview" className="w-full max-w-md rounded mt-2" />
          )}
        </div>

        {/* Client Logos Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Users size={24} />
            شعارات العملاء
          </h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newClientLogo}
              onChange={(e) => setNewClientLogo(e.target.value)}
              className="flex-1 px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
              placeholder="رابط شعار العميل"
            />
            <button
              onClick={addClientLogo}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              إضافة
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {siteData.clientLogos.map((logo, index) => (
              <div key={index} className="relative bg-gray-700 p-4 rounded">
                <img src={logo} alt={`Client ${index + 1}`} className="w-full h-24 object-contain" />
                <button
                  onClick={() => removeClientLogo(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white w-6 h-6 rounded-full hover:bg-red-700 flex items-center justify-center"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Categories Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Folder size={24} />
            فئات Portfolio
          </h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
              placeholder="اسم الفئة الجديدة"
            />
            <button
              onClick={addCategory}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              إضافة فئة
            </button>
          </div>

          {Object.keys(siteData.portfolioCategories).length > 0 && (
            <>
              <div className="mb-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
                >
                  <option value="">اختر فئة لإضافة صور</option>
                  {Object.keys(siteData.portfolioCategories).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {selectedCategory && (
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newCategoryImage}
                    onChange={(e) => setNewCategoryImage(e.target.value)}
                    className="flex-1 px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
                    placeholder="رابط الصورة"
                  />
                  <button
                    onClick={addImageToCategory}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plus size={18} />
                    إضافة صورة
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {Object.entries(siteData.portfolioCategories).map(([category, images]: [string, string[]]) => (
                  <div key={category} className="bg-gray-700 p-4 rounded">
                    <div className="flex justify-between items-center mb-2">
                      {editingCategory === category ? (
                        <div className="flex-1 flex gap-2 items-center">
                          <input
                            type="text"
                            value={editCategoryName}
                            onChange={(e) => setEditCategoryName(e.target.value)}
                            className="flex-1 px-3 py-1 rounded bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-blue-500"
                            placeholder="اسم الفئة الجديد"
                          />
                          <button
                            onClick={saveEditCategory}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm flex items-center gap-1"
                          >
                            <Check size={16} />
                            حفظ
                          </button>
                          <button
                            onClick={cancelEditCategory}
                            className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 text-sm flex items-center gap-1"
                          >
                            <X size={16} />
                            إلغاء
                          </button>
                        </div>
                      ) : (
                        <h3 className="text-xl font-bold text-white">{category}</h3>
                      )}
                      <div className="flex gap-2">
                        {editingCategory !== category && (
                          <button
                            onClick={() => startEditCategory(category)}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm flex items-center gap-1"
                          >
                            <Edit2 size={14} />
                            تعديل
                          </button>
                        )}
                        <button
                          onClick={() => removeCategory(category)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          حذف
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {images.map((image, index) => (
                        <div key={index} className="relative bg-gray-600 p-2 rounded">
                          <img src={image} alt={`${category} ${index + 1}`} className="w-full h-24 object-cover rounded" />
                          <button
                            onClick={() => removeImageFromCategory(category, index)}
                            className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full hover:bg-red-700 text-xs flex items-center justify-center"
                          >
                            <X size={14} />
                          </button>
                          <button
                            onClick={() => toggleFeaturedWork(image)}
                            className={`absolute bottom-1 left-1 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center ${
                              siteData.featuredWork.includes(image) ? 'bg-yellow-500' : 'bg-gray-500'
                            }`}
                          >
                            <Star size={14} fill={siteData.featuredWork.includes(image) ? 'white' : 'none'} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Featured Work Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Star size={24} />
            الأعمال المميزة (A Glimpse of Our Work) - {siteData.featuredWork.length}/4
          </h2>
          <p className="text-gray-300 mb-4 flex items-center gap-2">
            <Star size={16} className="text-yellow-400" />
            انقر على النجمة في الصور أعلاه لاختيار الأعمال المميزة
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {siteData.featuredWork.map((image, index) => (
              <div key={index} className="relative">
                <img src={image} alt={`Featured ${index + 1}`} className="w-full h-32 object-cover rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            onClick={saveSiteData}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-bold text-lg flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Save size={24} />
            حفظ جميع التغييرات
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
