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
  'nav.videos': 'Videos',
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
  'home.recentPodcasts': 'Recent Videos',
  'home.cta.title': 'Ready to Explore Amazing Content?',
  'home.cta.subtitle': 'Discover our collection of videos to deepen your understanding and enrich your knowledge',
  'home.cta.button': 'Browse All Videos',

  // Videos Page
  'podcasts.title': 'Videos',
  'podcasts.subtitle': 'Explore our collection of videos',
  'podcasts.filter.category': 'Category',
  'podcasts.filter.all': 'All Categories',
  'podcasts.notFound': 'No videos found',
  'podcasts.tryAgain': 'Try adjusting your search or filter criteria',

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
  'admin.totalPodcasts': 'Total Videos',
  'admin.managePodcasts': 'Manage Videos',
  'admin.noPodcasts': 'No videos found',
  'admin.startAdding': 'Get started by adding your first video',

  // Profile Page
  'profile.edit': 'Edit Profile',
  'profile.podcasts': 'Videos',
  'profile.noPodcasts': 'No videos uploaded yet',
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
  'about.contact.send': 'Send Message'
};

const arabicTranslations: Record<string, string> = {
  // Navigation & Common
  'nav.home': 'الرئيسية',
  'nav.videos': 'فيديوهات',
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
  'home.recentPodcasts': 'أحدث الفيديوهات',
  'home.cta.title': 'هل أنت مستعد لاستكشاف محتوى مذهل؟',
  'home.cta.subtitle': 'اكتشف مجموعتنا من الفيديوهات لتعميق فهمك وإثراء معرفتك',
  'home.cta.button': 'تصفح جميع الفيديوهات',

  // ... Continue adding Arabic translations for all other sections ...
  // (The pattern continues for all other sections matching the English translations above)
};
