import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'ar';

interface LanguageState {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  translate: (key: string) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: 'en',
      setLanguage: (language) => set({ currentLanguage: language }),
      translate: (key) => {
        const translations = get().currentLanguage === 'ar' ? arabicTranslations : englishTranslations;
        return translations[key] || key;
      },
    }),
    {
      name: 'language-storage',
    }
  )
);

const englishTranslations: Record<string, string> = {
  // Navigation & Common
  'nav.home': 'Home',
  'nav.streams': 'Videos',
  'nav.about': 'About',
  'nav.dashboard': 'Dashboard',
  'nav.profile': 'Profile',
  'nav.settings': 'Settings',
  'nav.signOut': 'Sign Out',
  'nav.signIn': 'Sign In',
  'common.loading': 'Loading...',
  'common.error': 'An error occurred',
  'common.retry': 'Retry',
  'common.search': 'Search',
  'common.watchNow': 'Watch Now',
  'common.viewAll': 'View All',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.submit': 'Submit',

  // Homepage
  'home.hero.title': 'KnightyTV',
  'home.hero.subtitle': 'Watch, Discover, and Share Videos',
  'home.features.title': 'Why Choose KnightyTV',
  'home.features.subtitle': 'Authentic knowledge, engaging content, and spiritual growth all in one place',
  'home.features.authenticity': 'Authentic Knowledge',
  'home.features.authenticity.desc': 'Content based on authentic sources from the Quran and Sunnah, verified by scholars',
  'home.features.quality': 'High-Quality Content',
  'home.features.quality.desc': 'Professional video and audio production with clear explanations and engaging presentations',
  'home.features.community': 'Community Learning',
  'home.features.community.desc': 'Join thousands of viewers worldwide seeking knowledge and spiritual growth',
  'home.recentStreams': 'Recent Videos',
  'home.cta.title': 'Ready to Explore Amazing Content?',
  'home.cta.subtitle': 'Discover our collection of videos to deepen your understanding and enrich your knowledge',
  'home.cta.button': 'Browse All Videos',

  // Videos Page
  'streams.title': 'Videos',
  'streams.subtitle': 'Explore our collection of videos',
  'streams.filter.category': 'Category',
  'streams.filter.all': 'All Categories',
  'streams.notFound': 'No videos found',
  'streams.tryAgain': 'Try adjusting your search or filter criteria',

  // Auth Page
  'auth.signIn': 'Sign In',
  'auth.createAccount': 'Create Account',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.username': 'Username',
  'auth.forgotPassword': 'Forgot Password?',
  'auth.noAccount': "Don't have an account? Sign Up",
  'auth.haveAccount': 'Already have an account? Sign In',
  'auth.error.required': 'This field is required',
  'auth.error.email': 'Please enter a valid email address',
  'auth.error.password': 'Password must be at least 6 characters',
  'auth.error.username': 'Username must be 3-20 characters and can only contain letters, numbers, and underscores',

  // Admin Dashboard
  'admin.dashboard': 'Dashboard',
  'admin.addNew': 'Add New Video',
  'admin.totalStreams': 'Total Videos',
  'admin.manageStreams': 'Manage Videos',
  'admin.noStreams': 'No videos found',
  'admin.startAdding': 'Get started by adding your first video',

  // Profile Page
  'profile.edit': 'Edit Profile',
  'profile.streams': 'Videos',
  'profile.noStreams': 'No videos uploaded yet',
  'profile.joinedDate': 'Joined',

  // About Page
  'about.title': 'About KnightyTV',
  'about.mission': 'Our mission is to spread authentic knowledge through engaging videos and content, making it accessible to everyone worldwide.',
  'about.story.title': 'Our Story',
  'about.story.text1': 'KnightyTV was founded in 2025 with a simple goal: to make authentic knowledge accessible to everyone.',
  'about.story.text2': 'What started as a small project has grown into a platform that reaches thousands of viewers worldwide.',
  'about.values.title': 'Our Values',
  'about.team.title': 'Our Team',
  'about.contact.title': 'Get in Touch',
  'about.contact.subtitle': "Have questions or suggestions? We'd love to hear from you!",
  'about.contact.name': 'Name',
  'about.contact.email': 'Email',
  'about.contact.subject': 'Subject',
  'about.contact.message': 'Message',
  'about.contact.send': 'Send Message',

  // Footer
  'footer.description': 'Video platform for discovering and sharing meaningful content.',
  'footer.quickLinks': 'Quick Links',
  'footer.copyright': '© 2026 KnightyTV. All rights reserved.'
};

const arabicTranslations: Record<string, string> = {
  // Navigation & Common
  'nav.home': 'الرئيسية',
  'nav.streams': 'فيديوهات',
  'nav.about': 'حول',
  'nav.dashboard': 'لوحة التحكم',
  'nav.profile': 'الملف الشخصي',
  'nav.settings': 'الإعدادات',
  'nav.signOut': 'تسجيل الخروج',
  'nav.signIn': 'تسجيل الدخول',
  'common.loading': 'جاري التحميل...',
  'common.error': 'حدث خطأ',
  'common.retry': 'إعادة المحاولة',
  'common.search': 'بحث',
  'common.watchNow': 'شاهد الآن',
  'common.viewAll': 'عرض الكل',
  'common.save': 'حفظ',
  'common.cancel': 'إلغاء',
  'common.delete': 'حذف',
  'common.edit': 'تعديل',
  'common.submit': 'إرسال',

  // Homepage
  'home.hero.title': 'KnightyTV',
  'home.hero.subtitle': 'شاهد، اكتشف، وشارك الفيديوهات',
  'home.features.title': 'لماذا تختار KnightyTV',
  'home.features.subtitle': 'معرفة أصيلة، محتوى جذاب، ونمو روحي في مكان واحد',
  'home.features.authenticity': 'معرفة أصيلة',
  'home.features.authenticity.desc': 'محتوى مبني على مصادر أصيلة من القرآن والسنة، موثق من العلماء',
  'home.features.quality': 'محتوى عالي الجودة',
  'home.features.quality.desc': 'إنتاج فيديو وصوت احترافي مع شرح واضح وعرض جذاب',
  'home.features.community': 'تعلم جماعي',
  'home.features.community.desc': 'انضم إلى آلاف المشاهدين حول العالم في طلب العلم والنمو الروحي',
  'home.recentStreams': 'أحدث الفيديوهات',
  'home.cta.title': 'هل أنت مستعد لاستكشاف محتوى مذهل؟',
  'home.cta.subtitle': 'اكتشف مجموعتنا من الفيديوهات لتعميق فهمك وإثراء معرفتك',
  'home.cta.button': 'تصفح جميع الفيديوهات',

  // Videos Page
  'streams.title': 'فيديوهات',
  'streams.subtitle': 'استكشف مجموعتنا من الفيديوهات',
  'streams.filter.category': 'الفئة',
  'streams.filter.all': 'كل الفئات',
  'streams.notFound': 'لم يتم العثور على فيديوهات',
  'streams.tryAgain': 'حاول تعديل البحث أو معايير التصفية',

  // Auth Page
  'auth.signIn': 'تسجيل الدخول',
  'auth.createAccount': 'إنشاء حساب',
  'auth.email': 'البريد الإلكتروني',
  'auth.password': 'كلمة المرور',
  'auth.username': 'اسم المستخدم',
  'auth.forgotPassword': 'نسيت كلمة المرور؟',
  'auth.noAccount': 'ليس لديك حساب؟ سجل الآن',
  'auth.haveAccount': 'لديك حساب بالفعل؟ سجل دخول',
  'auth.error.required': 'هذا الحقل مطلوب',
  'auth.error.email': 'يرجى إدخال بريد إلكتروني صحيح',
  'auth.error.password': 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
  'auth.error.username': 'يجب أن يكون اسم المستخدم من 3-20 حرفًا ويمكن أن يحتوي فقط على أحرف وأرقام وشرطات سفلية',

  // Admin Dashboard
  'admin.dashboard': 'لوحة التحكم',
  'admin.addNew': 'إضافة فيديو جديد',
  'admin.totalStreams': 'إجمالي الفيديوهات',
  'admin.manageStreams': 'إدارة الفيديوهات',
  'admin.noStreams': 'لم يتم العثور على فيديوهات',
  'admin.startAdding': 'ابدأ بإضافة أول فيديو لك',

  // Profile Page
  'profile.edit': 'تعديل الملف الشخصي',
  'profile.streams': 'فيديوهات',
  'profile.noStreams': 'لم يتم تحميل أي فيديوهات بعد',
  'profile.joinedDate': 'انضم في',

  // About Page
  'about.title': 'حول KnightyTV',
  'about.mission': 'مهمتنا هي نشر المعرفة الأصيلة من خلال الفيديوهات والمحتوى الجذاب، وجعلها متاحة للجميع في جميع أنحاء العالم.',
  'about.story.title': 'قصتنا',
  'about.story.text1': 'تم تأسيس KnightyTV في عام 2025 بهدف بسيط: جعل المعرفة الأصيلة متاحة للجميع.',
  'about.story.text2': 'ما بدأ كمشروع صغير نما ليصبح منصة تصل إلى آلاف المشاهدين في جميع أنحاء العالم.',
  'about.values.title': 'قيمنا',
  'about.team.title': 'فريقنا',
  'about.contact.title': 'تواصل معنا',
  'about.contact.subtitle': 'هل لديك أسئلة أو اقتراحات؟ نحن نحب أن نسمع منك!',
  'about.contact.name': 'الاسم',
  'about.contact.email': 'البريد الإلكتروني',
  'about.contact.subject': 'الموضوع',
  'about.contact.message': 'الرسالة',
  'about.contact.send': 'إرسال الرسالة',

  // Footer
  'footer.description': 'منصة فيديو لاكتشاف ومشاركة المحتوى الهادف.',
  'footer.quickLinks': 'روابط سريعة',
  'footer.copyright': '© 2026 KnightyTV. جميع الحقوق محفوظة.'
};
