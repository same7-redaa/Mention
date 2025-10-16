import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
  Lock,
  Settings,
  Layout,
  Video,
  HelpCircle
} from 'lucide-react';

interface MediaItem {
  url: string;
  type: 'image' | 'video';
  coverImage?: string; // صورة الغلاف للفيديوهات
}

interface SiteData {
  logo: string;
  aboutImage: string;
  clientLogos: string[];
  portfolioCategories: {
    [category: string]: MediaItem[];
  };
  featuredWork: string[];
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
  const [newCategoryImage, setNewCategoryImage] = useState('');
  const [videoCoverImage, setVideoCoverImage] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'clients' | 'portfolio' | 'featured'>('general');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

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
        const data = docSnap.data() as SiteData;
        // Convert old format to new format
        if (data.portfolioCategories) {
          Object.keys(data.portfolioCategories).forEach(key => {
            const items = data.portfolioCategories[key];
            if (items.length > 0 && typeof items[0] === 'string') {
              data.portfolioCategories[key] = (items as any).map((url: string) => ({ url, type: 'image' as const }));
            }
          });
        }
        setSiteData(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveSiteData = async () => {
    try {
      // Convert all Google Drive links before saving
      const processedData = {
        ...siteData,
        logo: convertGoogleDriveLink(siteData.logo),
        aboutImage: convertGoogleDriveLink(siteData.aboutImage),
        clientLogos: siteData.clientLogos.map(url => convertGoogleDriveLink(url)),
        // Portfolio categories are already converted in addImageToCategory
      };
      
      console.log('Saving data to Firestore:', processedData);
      await setDoc(doc(db, 'siteSettings', 'main'), processedData);
      console.log('Data saved successfully!');
      alert('✅ تم حفظ البيانات بنجاح! تم تحويل روابط Google Drive تلقائياً.');
    } catch (error: any) {
      console.error('Error saving data:', error);
      alert('❌ حدث خطأ أثناء الحفظ: ' + (error.message || 'Unknown error'));
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

    const { [editingCategory]: items, ...rest } = siteData.portfolioCategories;
    setSiteData({
      ...siteData,
      portfolioCategories: {
        ...rest,
        [editCategoryName]: items
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

  // Convert Google Drive links to direct view links
  const convertGoogleDriveLink = (url: string): string => {
    if (!url) return url;
    
    // Extract FILE_ID from various Google Drive URL formats
    // Pattern: https://drive.google.com/file/d/FILE_ID/...
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    
    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      // Use thumbnail format for better image display
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;
    }
    
    // Pattern: https://drive.google.com/open?id=FILE_ID
    const openIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (openIdMatch && openIdMatch[1]) {
      return `https://drive.google.com/thumbnail?id=${openIdMatch[1]}&sz=w2000`;
    }
    
    // Already in direct format (uc or thumbnail)
    if (url.includes('drive.google.com/uc?') || url.includes('drive.google.com/thumbnail?')) {
      return url;
    }
    
    // Return original URL if not a Google Drive link
    return url;
  };

  const addImageToCategory = () => {
    if (selectedCategory && newCategoryImage.trim()) {
      // Convert Google Drive links automatically
      const convertedUrl = convertGoogleDriveLink(newCategoryImage.trim());
      const convertedCover = videoCoverImage.trim() ? convertGoogleDriveLink(videoCoverImage.trim()) : '';
      
      const newItem: MediaItem = {
        url: convertedUrl,
        type: mediaType
      };
      
      // إضافة صورة الغلاف للفيديوهات إذا تم إدخالها
      if (mediaType === 'video' && convertedCover) {
        newItem.coverImage = convertedCover;
      }
      
      setSiteData({
        ...siteData,
        portfolioCategories: {
          ...siteData.portfolioCategories,
          [selectedCategory]: [
            ...siteData.portfolioCategories[selectedCategory],
            newItem
          ]
        }
      });
      setNewCategoryImage('');
      setVideoCoverImage('');
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

  const toggleFeaturedWork = (item: MediaItem) => {
    // For videos with custom cover, store the cover image URL
    // For videos without custom cover or images, store the main URL
    const itemIdentifier = (item.type === 'video' && item.coverImage) ? item.coverImage : item.url;
    
    console.log('Toggle Featured Work:', {
      item,
      itemIdentifier,
      currentFeaturedWork: siteData.featuredWork,
      isAlreadyFeatured: siteData.featuredWork.includes(itemIdentifier),
      featuredCount: siteData.featuredWork.length
    });
    
    if (siteData.featuredWork.includes(itemIdentifier)) {
      setSiteData({
        ...siteData,
        featuredWork: siteData.featuredWork.filter(id => id !== itemIdentifier)
      });
    } else {
      if (siteData.featuredWork.length < 4) {
        setSiteData({
          ...siteData,
          featuredWork: [...siteData.featuredWork, itemIdentifier]
        });
      } else {
        alert('يمكنك اختيار 4 صور فقط للعرض في القسم الخارجي');
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white" style={{ fontFamily: 'Cairo, sans-serif' }}>جاري التحميل...</div>;
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

  const tabs = [
    { id: 'general' as const, label: 'الإعدادات العامة', icon: <Layout size={20} /> },
    { id: 'clients' as const, label: 'العملاء', icon: <Users size={20} /> },
    { id: 'portfolio' as const, label: 'معرض الأعمال', icon: <Folder size={20} /> },
    { id: 'featured' as const, label: 'القسم الخارجي', icon: <Star size={20} /> },
  ];

  const renderMediaPreview = (item: MediaItem, className: string = '') => {
    if (item.type === 'video') {
      // Extract video ID from YouTube URL (supports regular videos, Shorts, and youtu.be links)
      const youtubeMatch = item.url.match(/(?:youtube\.com\/(?:shorts\/|(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))|youtu\.be\/)([^"&?\/\s]{11})/);
      if (youtubeMatch) {
        return (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
            className={`w-full h-full object-cover ${className}`}
            allowFullScreen
          />
        );
      }
      return (
        <video
          src={item.url}
          className={`w-full h-full object-cover ${className}`}
          controls
          muted
        />
      );
    }
    return <img src={item.url} className={`w-full h-full object-cover ${className}`} alt="Preview" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 md:p-8" style={{ fontFamily: 'Cairo, sans-serif' }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
                  alert('❌ فشل الاتصال بـ Firestore:\n' + error.message);
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

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <>
              {/* Logo Section */}
              <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <ImageIcon size={24} />
                  شعار الموقع في الصفحة الرئيسية
                </h2>
                <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
                  <HelpCircle size={16} />
                  الشعار الذي يظهر في أعلى الموقع (Header)
                </p>
                <div className="bg-green-600/20 border border-green-500 p-3 rounded-lg mb-4">
                  <p className="text-green-200 text-xs flex items-center gap-2">
                    <Check size={14} />
                    يمكنك استخدام روابط Google Drive مباشرة! سيتم تحويلها تلقائياً عند الحفظ
                  </p>
                </div>
                <div className="bg-yellow-600/20 border border-yellow-500 p-3 rounded-lg mb-4">
                  <p className="text-yellow-200 text-xs font-semibold mb-1">⚠️ مهم لاستخدام Google Drive:</p>
                  <ol className="text-yellow-200 text-xs list-decimal list-inside space-y-1">
                    <li>انقر بزر الماوس الأيمن على الملف في Drive</li>
                    <li>اختر "Share" أو "مشاركة"</li>
                    <li>اختر "Anyone with the link" أو "أي شخص لديه الرابط"</li>
                    <li>انسخ الرابط والصقه هنا</li>
                  </ol>
                </div>
                <input
                  type="text"
                  value={siteData.logo}
                  onChange={(e) => setSiteData({ ...siteData, logo: e.target.value })}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500 mb-4"
                  placeholder="رابط الشعار (يدعم Google Drive)"
                />
                {siteData.logo && (
                  <div className="flex justify-center">
                    <div className="w-48 h-48 bg-gray-700 rounded-xl flex items-center justify-center p-4">
                      <img src={siteData.logo} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                    </div>
                  </div>
                )}
              </div>

              {/* About Image Section */}
              <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <ImageIcon size={24} />
                  صورة قسم About Mention Studio
                </h2>
                <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
                  <HelpCircle size={16} />
                  الصورة التي تظهر في قسم "About Mention Studio" في الصفحة الرئيسية
                </p>
                <input
                  type="text"
                  value={siteData.aboutImage}
                  onChange={(e) => setSiteData({ ...siteData, aboutImage: e.target.value })}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500 mb-4"
                  placeholder="رابط الصورة"
                />
                {siteData.aboutImage && (
                  <div className="flex justify-center">
                    <div className="w-64 h-64 bg-gray-700 rounded-xl overflow-hidden">
                      <img src={siteData.aboutImage} alt="About Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Clients Tab */}
          {activeTab === 'clients' && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Users size={24} />
                شعارات العملاء
              </h2>
              <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
                <HelpCircle size={16} />
                الشعارات التي تظهر في قسم "Our Clients" مع التمرير اللانهائي
              </p>
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
                  <div key={index} className="relative bg-gray-700 rounded-xl overflow-hidden aspect-square">
                    <img src={logo} alt={`Client ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeClientLogo(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full hover:bg-red-700 flex items-center justify-center shadow-lg"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Folder size={24} />
                فئات معرض الأعمال (Portfolio)
              </h2>
              <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
                <HelpCircle size={16} />
                الفئات والصور/فيديوهات التي تظهر في صفحة Portfolio - يمكنك إضافة روابط يوتيوب أو فيديوهات مباشرة
              </p>
              
              {/* Add Category */}
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
                  placeholder="اسم الفئة الجديدة (مثل: Branding, Social Media)"
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
                  {/* Select Category to Add Media */}
                  <div className="mb-4">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
                    >
                      <option value="">اختر فئة لإضافة صور/فيديوهات</option>
                      {Object.keys(siteData.portfolioCategories).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {selectedCategory && (
                    <div className="mb-6 space-y-3">
                      {/* Media Type Selection */}
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-white cursor-pointer">
                          <input
                            type="radio"
                            value="image"
                            checked={mediaType === 'image'}
                            onChange={(e) => setMediaType(e.target.value as 'image')}
                            className="w-4 h-4"
                          />
                          <ImageIcon size={18} />
                          صورة
                        </label>
                        <label className="flex items-center gap-2 text-white cursor-pointer">
                          <input
                            type="radio"
                            value="video"
                            checked={mediaType === 'video'}
                            onChange={(e) => setMediaType(e.target.value as 'video')}
                            className="w-4 h-4"
                          />
                          <Video size={18} />
                          فيديو (YouTube أو رابط مباشر)
                        </label>
                      </div>

                      {/* Video Cover Image Input */}
                      {mediaType === 'video' && (
                        <div>
                          <label className="block text-white mb-2 text-sm flex items-center gap-2">
                            <ImageIcon size={16} />
                            صورة الغلاف للفيديو (اختياري)
                          </label>
                          <input
                            type="text"
                            value={videoCoverImage}
                            onChange={(e) => setVideoCoverImage(e.target.value)}
                            className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
                            placeholder="رابط صورة الغلاف (اختياري - سيتم استخدام صورة YouTube التلقائية إذا تركته فارغاً)"
                          />
                        </div>
                      )}

                      {/* Add Media */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCategoryImage}
                          onChange={(e) => setNewCategoryImage(e.target.value)}
                          className="flex-1 px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
                          placeholder={mediaType === 'image' ? "رابط الصورة" : "رابط الفيديو (YouTube أو مباشر)"}
                        />
                        <button
                          onClick={addImageToCategory}
                          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <Plus size={18} />
                          إضافة {mediaType === 'image' ? 'صورة' : 'فيديو'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Display Categories */}
                  <div className="space-y-4">
                    {Object.entries(siteData.portfolioCategories).map(([category, items]) => (
                      <div key={category} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
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
                            <h3 className="text-xl font-bold text-white">{category} ({items.length})</h3>
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
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {items.map((item, index) => {
                            const itemIdentifier = (item.type === 'video' && item.coverImage) ? item.coverImage : item.url;
                            return (
                            <div key={index} className="relative bg-gray-600 rounded-xl overflow-hidden aspect-square">
                              {renderMediaPreview(item, 'rounded-xl')}
                              <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                {item.type === 'video' ? <Video size={12} /> : <ImageIcon size={12} />}
                                {item.type === 'video' ? 'فيديو' : 'صورة'}
                              </div>
                              <button
                                onClick={() => removeImageFromCategory(category, index)}
                                className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full hover:bg-red-700 flex items-center justify-center shadow-lg"
                              >
                                <X size={16} />
                              </button>
                              <button
                                onClick={() => toggleFeaturedWork(item)}
                                className={`absolute bottom-2 left-2 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                                  siteData.featuredWork.includes(itemIdentifier) ? 'bg-yellow-500' : 'bg-gray-500'
                                }`}
                              >
                                <Star size={16} fill={siteData.featuredWork.includes(itemIdentifier) ? 'white' : 'none'} />
                              </button>
                            </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Featured Work Tab */}
          {activeTab === 'featured' && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Star size={24} />
                  صور القسم الخارجي ({siteData.featuredWork.length}/4)
                </h2>
                {siteData.featuredWork.length > 0 && (
                  <button
                    onClick={() => setSiteData({ ...siteData, featuredWork: [] })}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <X size={18} />
                    مسح الكل
                  </button>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
                <HelpCircle size={16} />
                الصور التي تظهر في قسم "A Glimpse of Our Work" في الصفحة الرئيسية - يمكنك اختيار 4 صور فقط
              </p>
              <div className="bg-blue-600/20 border border-blue-500 p-4 rounded-lg mb-4">
                <p className="text-blue-200 text-sm flex items-center gap-2">
                  <Star size={16} className="text-yellow-400" />
                  لاختيار الصور: اذهب لتبويب "معرض الأعمال" وانقر على النجمة ⭐ أسفل أي صورة
                </p>
              </div>
              
              {/* Debug Info */}
              {siteData.featuredWork.length > 0 && (
                <div className="bg-gray-700/50 border border-gray-600 p-3 rounded-lg mb-4 text-xs">
                  <p className="text-gray-400 mb-2">📋 معلومات تشخيصية (يمكنك حذف هذا القسم لاحقاً):</p>
                  <div className="space-y-1 text-gray-300 font-mono">
                    {siteData.featuredWork.map((item, i) => (
                      <div key={i} className="truncate">
                        {i + 1}. {item.substring(0, 60)}...
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {siteData.featuredWork.map((imageUrl, index) => (
                  <div key={index} className="relative bg-gray-700 rounded-xl overflow-hidden aspect-square">
                    <img src={imageUrl} alt={`Featured ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <Star size={12} fill="white" />
                      مميز {index + 1}
                    </div>
                  </div>
                ))}
                {[...Array(4 - siteData.featuredWork.length)].map((_, index) => (
                  <div key={`empty-${index}`} className="bg-gray-700 rounded-xl aspect-square flex items-center justify-center border-2 border-dashed border-gray-600">
                    <Star size={32} className="text-gray-600" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Save Button - Always Visible */}
        <div className="flex justify-center mt-8 sticky bottom-4">
          <button
            onClick={saveSiteData}
            className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-bold text-lg flex items-center gap-2 shadow-2xl hover:shadow-3xl transform hover:scale-105"
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
