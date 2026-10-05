import {
  User,
  ClassItem,
  Subject,
  Homework,
  HomeworkSubmission,
  TestItem,
  TestSubmission,
  AttendanceRecord,
  LanguageExercise,
  Achievement,
  PointHistory,
  AuditLog,
  NotificationItem,
  AdminSettings,
  TargetLanguage,
  CEFRLevel
} from '../types';

const STORAGE_KEY_PREFIX = 'eduhub_db_';

const getTodayString = () => new Date().toISOString().split('T')[0];

export const INITIAL_SETTINGS: AdminSettings = {
  appName: 'EduHub',
  allowStudentRegistration: true,
  allowTeacherRegistration: true,
  defaultDailyLimitStudent: 20,
  defaultDailyLimitTeacher: 10,
  pointsPerHomework: 50,
  pointsPerTest100: 100,
  pointsPerLanguageExercise: 15,
  smsProvider: 'mock',
  smsSenderName: 'EduHub-SMS',
  smsApiKey: 'sk_live_demo_9824_mock_gateway',
  maintenanceMode: false,
};

export const INITIAL_USERS: User[] = [
  {
    id: 'user_admin_1',
    phone: '+998900000001',
    fullName: 'Shavkat Azimov',
    role: 'ADMIN',
    avatarUrl: '/src/assets/images/eduhub_avatar_teacher_1791178000273.jpg',
    points: 1250,
    level: 10,
    status: 'ACTIVE',
    dailyUsage: { date: getTodayString(), count: 0, max: 9999 },
    streakDays: 45,
    createdAt: '2026-01-10T08:00:00Z',
    email: 'admin@eduhub.uz',
    bio: 'Bosh tizim ma\'muri va ta\'lim metodisti'
  },
  {
    id: 'user_teacher_1',
    phone: '+998901112233',
    fullName: 'Nodira Karimova',
    role: 'TEACHER',
    avatarUrl: '/src/assets/images/eduhub_avatar_teacher_1791178000273.jpg',
    subject: 'Informatika va Dasturlash',
    className: '10-A sinf',
    points: 850,
    level: 6,
    status: 'ACTIVE',
    dailyUsage: { date: getTodayString(), count: 4, max: 10 },
    streakDays: 24,
    createdAt: '2026-02-01T09:30:00Z',
    email: 'karimova@eduhub.uz',
    bio: 'Oliy toifali informatika fani o‘qituvchisi'
  },
  {
    id: 'user_teacher_2',
    phone: '+998902223344',
    fullName: 'Akmal Rustamov',
    role: 'TEACHER',
    avatarUrl: '/src/assets/images/eduhub_avatar_teacher_1791178000273.jpg',
    subject: 'Matematika va Algoritmika',
    className: '11-B sinf',
    points: 920,
    level: 7,
    status: 'ACTIVE',
    dailyUsage: { date: getTodayString(), count: 2, max: 10 },
    streakDays: 18,
    createdAt: '2026-02-05T11:00:00Z',
    email: 'rustamov@eduhub.uz',
    bio: 'Matematika kafedrasi yetakchi mutaxassisi'
  },
  {
    id: 'user_student_1',
    phone: '+998903334455',
    fullName: 'Javohir Toshmatov',
    role: 'STUDENT',
    avatarUrl: '/src/assets/images/eduhub_avatar_student_1791178013935.jpg',
    classId: 'class_1',
    className: '10-A sinf',
    points: 480,
    level: 3,
    status: 'ACTIVE',
    dailyUsage: { date: getTodayString(), count: 8, max: 20 },
    streakDays: 8,
    createdAt: '2026-02-15T14:20:00Z',
    email: 'javohir@student.eduhub.uz',
    bio: 'Dasturlash va sun\'iy intellektga qiziqaman'
  },
  {
    id: 'user_student_2',
    phone: '+998904445566',
    fullName: 'Madina Ismoilova',
    role: 'STUDENT',
    avatarUrl: '/src/assets/images/eduhub_avatar_student_1791178013935.jpg',
    classId: 'class_1',
    className: '10-A sinf',
    points: 740,
    level: 4,
    status: 'ACTIVE',
    dailyUsage: { date: getTodayString(), count: 14, max: 20 },
    streakDays: 19,
    createdAt: '2026-02-16T10:15:00Z',
    email: 'madina@student.eduhub.uz'
  },
  {
    id: 'user_student_3',
    phone: '+998905556677',
    fullName: 'Bekzod Mirzayev',
    role: 'STUDENT',
    avatarUrl: '/src/assets/images/eduhub_avatar_student_1791178013935.jpg',
    classId: 'class_2',
    className: '11-B sinf',
    points: 310,
    level: 2,
    status: 'ACTIVE',
    dailyUsage: { date: getTodayString(), count: 4, max: 20 },
    streakDays: 5,
    createdAt: '2026-02-20T16:45:00Z',
    email: 'bekzod@student.eduhub.uz'
  }
];

export const INITIAL_CLASSES: ClassItem[] = [
  { id: 'class_1', name: '10-A sinf', grade: 10, studentCount: 28, teacherId: 'user_teacher_1', teacherName: 'Nodira Karimova', room: '302-xona' },
  { id: 'class_2', name: '11-B sinf', grade: 11, studentCount: 26, teacherId: 'user_teacher_2', teacherName: 'Akmal Rustamov', room: '205-xona' },
  { id: 'class_3', name: '9-V sinf', grade: 9, studentCount: 24, teacherId: 'user_teacher_1', teacherName: 'Nodira Karimova', room: '108-xona' }
];

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'sub_1', name: 'Informatika', code: 'INF', color: '#0284c7' },
  { id: 'sub_2', name: 'Matematika', code: 'MAT', color: '#0d9488' },
  { id: 'sub_3', name: 'Ingliz tili', code: 'ENG', color: '#6366f1' },
  { id: 'sub_4', name: 'Fizika', code: 'PHY', color: '#e11d48' },
  { id: 'sub_5', name: 'Ona tili', code: 'UZB', color: '#f59e0b' }
];

export const INITIAL_HOMEWORKS: Homework[] = [
  {
    id: 'hw_1',
    title: 'Python ma\'lumotlar turlari va shart operatorlari',
    subject: 'Informatika',
    classId: 'class_1',
    className: '10-A sinf',
    teacherId: 'user_teacher_1',
    teacherName: 'Nodira Karimova',
    description: 'Python tilida if-elif-else shartlaridan foydalanib kvadrat tenglama ildizlarini aniqlovchi dastur tuzing va kod skrinshotini izoh bilan yuboring.',
    dueDate: '2026-10-10',
    points: 50,
    submissionsCount: 18,
    status: 'ACTIVE',
    createdAt: '2026-10-02T10:00:00Z'
  },
  {
    id: 'hw_2',
    title: 'Hosilaning geometrik ma\'nosi va urinma tenglamasi',
    subject: 'Matematika',
    classId: 'class_1',
    className: '10-A sinf',
    teacherId: 'user_teacher_2',
    teacherName: 'Akmal Rustamov',
    description: 'Darslikdagi 14-bob 3, 5, 8-misollarni to‘liq ishlash va urinma burchak koeffitsiyentini topish qoidasini yozma bayon etish.',
    dueDate: '2026-10-08',
    points: 40,
    submissionsCount: 22,
    status: 'ACTIVE',
    createdAt: '2026-10-01T11:30:00Z'
  },
  {
    id: 'hw_3',
    title: 'Academic Writing: Essay on Artificial Intelligence Ethics',
    subject: 'Ingliz tili',
    classId: 'class_1',
    className: '10-A sinf',
    teacherId: 'user_teacher_1',
    teacherName: 'Nodira Karimova',
    description: 'Write a well-structured opinion essay of 180-220 words discussing the ethical considerations of modern AI assistants in schools.',
    dueDate: '2026-10-12',
    points: 60,
    submissionsCount: 12,
    status: 'ACTIVE',
    createdAt: '2026-10-03T09:00:00Z'
  }
];

export const INITIAL_SUBMISSIONS: HomeworkSubmission[] = [
  {
    id: 'subm_1',
    homeworkId: 'hw_1',
    homeworkTitle: 'Python ma\'lumotlar turlari va shart operatorlari',
    studentId: 'user_student_1',
    studentName: 'Javohir Toshmatov',
    submissionText: 'Python kodini tayyorladim:\nimport math\na, b, c = 1, -5, 6\nd = b**2 - 4*a*c\nif d > 0: ... Ildizlar: x1=3.0, x2=2.0. Kod to‘liq ishlamoqda.',
    submittedAt: '2026-10-03T18:20:00Z',
    status: 'GRADED',
    grade: 48,
    feedback: 'Juda puxta yondashilgan, diskriminant manfiy bo\'lgan holat ham to\'g\'ri hisobga olingan. Barakalla!',
    gradedAt: '2026-10-04T09:15:00Z',
    gradedByName: 'Nodira Karimova'
  },
  {
    id: 'subm_2',
    homeworkId: 'hw_2',
    homeworkTitle: 'Hosilaning geometrik ma\'nosi va urinma tenglamasi',
    studentId: 'user_student_1',
    studentName: 'Javohir Toshmatov',
    submissionText: 'Misollar yechimi:\n3-misol: y = 2x - 1 nuqtada k = f\'(x0) = 4.\n5-misol: urinma tenglamasi y - y0 = k(x - x0) orqali hisoblandi.',
    submittedAt: '2026-10-04T15:10:00Z',
    status: 'PENDING'
  }
];

export const INITIAL_TESTS: TestItem[] = [
  {
    id: 'test_1',
    title: 'Algoritmlar va Ma\'lumotlar Tuzilmalari',
    subject: 'Informatika',
    classId: 'class_1',
    className: '10-A sinf',
    teacherId: 'user_teacher_1',
    teacherName: 'Nodira Karimova',
    durationMinutes: 15,
    totalPoints: 100,
    active: true,
    createdAt: '2026-10-01T12:00:00Z',
    questions: [
      {
        id: 'q1',
        text: 'Ikkilik qidiruv (Binary Search) algoritmining o‘rtacha vaqt murakkabligi (Time Complexity) qanday?',
        type: 'single',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
        correctOptionIndex: 2,
        explanation: 'Ikkilik qidiruv har bir qadamda qidiruv maydonini yarmiga qisqartiradi, shuning uchun murakkablik O(log n).',
        points: 25
      },
      {
        id: 'q2',
        text: 'Python tilida qaysi ma\'lumotlar turi o‘zgarmas (immutable) hisoblanadi?',
        type: 'single',
        options: ['List (ro‘yxat)', 'Tuple (kortej)', 'Set (to‘plam)', 'Dict (lug‘at)'],
        correctOptionIndex: 1,
        explanation: 'Tuple yaratilgandan so‘ng uning elementlari qiymatini o‘zgartirib bo‘lmaydi.',
        points: 25
      },
      {
        id: 'q3',
        text: 'Stek (Stack) ma\'lumotlar tuzilmasi qaysi tamoyil bo‘yicha ishlaydi?',
        type: 'single',
        options: ['FIFO (First In First Out)', 'LIFO (Last In First Out)', 'Random Access', 'Priority Ordering'],
        correctOptionIndex: 1,
        explanation: 'Stek oxirgi kirgan birinchi chiqadi tamoyili (Last In First Out) asosida ishlaydi.',
        points: 25
      },
      {
        id: 'q4',
        text: 'Relyatsion ma\'lumotlar bazalarida jadvallar o‘rtasidagi bog‘lanishni ta\'minlovchi kalit nima deyiladi?',
        type: 'single',
        options: ['Foreign Key (Tashqi kalit)', 'Primary Key', 'Index Key', 'Composite Hash'],
        correctOptionIndex: 0,
        explanation: 'Foreign Key (tashqi kalit) boshqa jadvalning birlamchi kalitiga murojaat qilib relyatsiya hosil qiladi.',
        points: 25
      }
    ]
  },
  {
    id: 'test_2',
    title: 'Funksiyalar va Matematik Analiz Asoslari',
    subject: 'Matematika',
    classId: 'class_1',
    className: '10-A sinf',
    teacherId: 'user_teacher_2',
    teacherName: 'Akmal Rustamov',
    durationMinutes: 20,
    totalPoints: 100,
    active: true,
    createdAt: '2026-10-02T14:00:00Z',
    questions: [
      {
        id: 'qm1',
        text: 'f(x) = x^3 - 3x + 5 funksiyaning x = 2 nuqtadagi hosilasi nimaga teng?',
        type: 'single',
        options: ['9', '12', '7', '15'],
        correctOptionIndex: 0,
        explanation: 'f\'(x) = 3x^2 - 3. x = 2 bo\'lganda: 3*(4) - 3 = 12 - 3 = 9.',
        points: 50
      },
      {
        id: 'qm2',
        text: 'Agar funksiyaning ikkinchi tartibli hosilasi f\'\'(x) > 0 bo‘lsa, oraliqda egri chiziq qanday bo‘ladi?',
        type: 'single',
        options: ['Qavariq (botiq yuqoriga)', 'Botiq (yuqoriga qavariq)', 'To‘g‘ri chiziq', 'Davriy'],
        correctOptionIndex: 0,
        explanation: 'f\'\'(x) > 0 bo\'lganda funksiya grafigi botiq yuqoriga (convex upwards) yo\'nalgan bo\'ladi.',
        points: 50
      }
    ]
  }
];

export const INITIAL_TEST_SUBMISSIONS: TestSubmission[] = [
  {
    id: 'tsub_1',
    testId: 'test_1',
    testTitle: 'Algoritmlar va Ma\'lumotlar Tuzilmalari',
    studentId: 'user_student_1',
    studentName: 'Javohir Toshmatov',
    score: 100,
    maxScore: 100,
    percentage: 100,
    passed: true,
    completedAt: '2026-10-02T16:30:00Z',
    answers: [
      { questionId: 'q1', selectedOption: 2, isCorrect: true },
      { questionId: 'q2', selectedOption: 1, isCorrect: true },
      { questionId: 'q3', selectedOption: 1, isCorrect: true },
      { questionId: 'q4', selectedOption: 0, isCorrect: true }
    ]
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att_1',
    date: '2026-10-04',
    classId: 'class_1',
    className: '10-A sinf',
    teacherId: 'user_teacher_1',
    teacherName: 'Nodira Karimova',
    records: [
      { studentId: 'user_student_1', studentName: 'Javohir Toshmatov', status: 'PRESENT' },
      { studentId: 'user_student_2', studentName: 'Madina Ismoilova', status: 'PRESENT' },
      { studentId: 'user_student_3', studentName: 'Bekzod Mirzayev', status: 'LATE', note: '10 daqiqa kechikdi' }
    ]
  },
  {
    id: 'att_2',
    date: '2026-10-03',
    classId: 'class_1',
    className: '10-A sinf',
    teacherId: 'user_teacher_1',
    teacherName: 'Nodira Karimova',
    records: [
      { studentId: 'user_student_1', studentName: 'Javohir Toshmatov', status: 'PRESENT' },
      { studentId: 'user_student_2', studentName: 'Madina Ismoilova', status: 'PRESENT' },
      { studentId: 'user_student_3', studentName: 'Bekzod Mirzayev', status: 'EXCUSED', note: 'Shifokor ma\'lumotnomasi' }
    ]
  }
];

export const INITIAL_LANGUAGE_EXERCISES: LanguageExercise[] = [
  // English A1-C2
  {
    id: 'lang_en_1',
    language: 'en',
    level: 'A1',
    type: 'vocabulary',
    title: 'Everyday Technology Objects',
    prompt: 'Choose the correct word for the image concept: "A portable device used to compute and surf the web".',
    options: ['Laptop', 'Refrigerator', 'Pillow', 'Ladder'],
    correctAnswer: 0,
    explanation: 'A laptop is a compact portable personal computer.',
    points: 15
  },
  {
    id: 'lang_en_2',
    language: 'en',
    level: 'B1',
    type: 'grammar',
    title: 'Conditional Sentence Type 2',
    prompt: 'If I ______ enough points, I would unlock the Senior Scholar badge.',
    options: ['have', 'had', 'will have', 'having'],
    correctAnswer: 1,
    explanation: 'Second conditional uses past simple in the "if" clause for hypothetical situations.',
    points: 20
  },
  {
    id: 'lang_en_3',
    language: 'en',
    level: 'B2',
    type: 'translation',
    title: 'Idiomatic Translation',
    prompt: '"Ilm o‘rganish igna bilan quduq qazish kabidir." tarjimasi:',
    options: [
      'Learning is like digging a well with a needle.',
      'Studying is making holes with iron.',
      'Science requires digging deep soils.',
      'Knowledge is like climbing high mountains.'
    ],
    correctAnswer: 0,
    explanation: 'Traditional proverb rendered into classic educational idiomatic English.',
    points: 25
  },
  {
    id: 'lang_en_4',
    language: 'en',
    level: 'C1',
    type: 'fill_blanks',
    title: 'Advanced Vocabulary',
    prompt: 'The professor gave an ______ explanation that left no doubt regarding the theorem.',
    options: ['ambiguous', 'unequivocal', 'arbitrary', 'superficial'],
    correctAnswer: 1,
    explanation: 'Unequivocal means leaving no doubt, unambiguous and perfectly clear.',
    points: 30
  },
  // Russian Exercises
  {
    id: 'lang_ru_1',
    language: 'ru',
    level: 'A1',
    type: 'vocabulary',
    title: 'Базовые школьные термины',
    prompt: 'Какое слово обозначает человека, который учится в школе?',
    options: ['Ученик', 'Строитель', 'Повар', 'Водитель'],
    correctAnswer: 0,
    explanation: 'Ученик — лицо, обучающееся в образовательном учреждении.',
    points: 15
  },
  {
    id: 'lang_ru_2',
    language: 'ru',
    level: 'B1',
    type: 'grammar',
    title: 'Падежи и предлоги',
    prompt: 'Вставьте правильную форму: "Мы долго готовились к ______ (экзамен)".',
    options: ['экзамене', 'экзамену', 'экзамена', 'экзаменом'],
    correctAnswer: 1,
    explanation: 'Предлог "к" требует дательного падежа (к чему? к экзамену).',
    points: 20
  },
  // Uzbek Exercises
  {
    id: 'lang_uz_1',
    language: 'uz',
    level: 'A2',
    type: 'grammar',
    title: 'Kelishik qo‘shimchalari',
    prompt: 'Kitob ______ javonga qo‘ydim. Qaysi kelishik qo‘shimchasi tushib qolgan?',
    options: ['-ni (tushum)', '-ga (jo‘nalish)', '-da (o‘rin-payt)', '-dan (chiqish)'],
    correctAnswer: 0,
    explanation: 'Vositasiz to\'ldiruvchi vazifasidagi so\'zga tushum kelishigi (-ni) qo\'shiladi.',
    points: 15
  },
  {
    id: 'lang_uz_2',
    language: 'uz',
    level: 'B2',
    type: 'vocabulary',
    title: 'Sinonimlar va iboralar',
    prompt: '"Ko‘kka ko‘tarmoq" iborasining ma\'nosi nima?',
    options: ['Haddan ziyod maqtamoq', 'Samolyotda uchmoq', 'Jazolamoq', 'Qo‘rqitmoq'],
    correctAnswer: 0,
    explanation: 'Ko\'kka ko\'tarmoq — kimgadir yuqori baho berish, maqtash ma\'nosida qo\'llanadi.',
    points: 20
  },
  // German, Spanish, French
  {
    id: 'lang_de_1',
    language: 'de',
    level: 'A1',
    type: 'vocabulary',
    title: 'Deutsche Begrüßungen',
    prompt: 'Wie sagt man "Xayrli tong" auf Deutsch?',
    options: ['Guten Morgen', 'Gute Nacht', 'Auf Wiedersehen', 'Danke schön'],
    correctAnswer: 0,
    explanation: '"Guten Morgen" bedeutet Good morning / Xayrli tong.',
    points: 15
  },
  {
    id: 'lang_es_1',
    language: 'es',
    level: 'A1',
    type: 'vocabulary',
    title: 'Saludos en Español',
    prompt: '¿Cómo se dice "Rahmat" en español?',
    options: ['Gracias', 'Por favor', 'Hola', 'Adiós'],
    correctAnswer: 0,
    explanation: '"Gracias" significa Thank you / Rahmat.',
    points: 15
  },
  {
    id: 'lang_fr_1',
    language: 'fr',
    level: 'A1',
    type: 'vocabulary',
    title: 'Salutations en Français',
    prompt: 'Comment dit-on "Xayrli kun / Salom" en français?',
    options: ['Bonjour', 'Bonsoir', 'Au revoir', 'S\'il vous plaît'],
    correctAnswer: 0,
    explanation: '"Bonjour" est la formule de salutation standard pendant la journée.',
    points: 15
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_1',
    title: { uz: 'Birinchi Qadam', ru: 'Первый шаг', en: 'First Homework' },
    description: {
      uz: 'Birinchi uy vazifasini muvaffaqiyatli topshirganingiz uchun',
      ru: 'За успешную сдачу первого домашнего задания',
      en: 'Awarded for completing your first assignment'
    },
    badgeIcon: 'Award',
    badgeColor: 'emerald',
    criteriaPoints: 50,
    category: 'homework',
    unlockedAt: '2026-10-02T10:00:00Z'
  },
  {
    id: 'ach_2',
    title: { uz: '100 Ball Cho‘qqisi', ru: 'Вершина 100 баллов', en: '100 Points' },
    description: {
      uz: 'Umumiy hisobda 100 ball to‘plaganingiz uchun',
      ru: 'За накопление первых 100 академических баллов',
      en: 'Accumulated your first 100 merit points'
    },
    badgeIcon: 'Sparkles',
    badgeColor: 'amber',
    criteriaPoints: 100,
    category: 'points',
    unlockedAt: '2026-10-02T14:30:00Z'
  },
  {
    id: 'ach_3',
    title: { uz: '500 Ball Lideri', ru: 'Лидер 500 баллов', en: '500 Points' },
    description: {
      uz: '500 dan ortiq akademik ball to‘plash',
      ru: 'Преодоление планки в 500 баллов',
      en: 'Surpassed 500 total academic merit points'
    },
    badgeIcon: 'Zap',
    badgeColor: 'sky',
    criteriaPoints: 500,
    category: 'points'
  },
  {
    id: 'ach_4',
    title: { uz: 'A\'lochi Sinovchi', ru: 'Безупречный тест', en: 'Perfect Test' },
    description: {
      uz: 'Testdan 100% natija qayd etganingiz uchun',
      ru: 'Сдача теста со 100% результатом',
      en: 'Achieved a perfect 100% score on an academic assessment'
    },
    badgeIcon: 'Target',
    badgeColor: 'rose',
    criteriaPoints: 100,
    category: 'tests',
    unlockedAt: '2026-10-02T16:30:00Z'
  },
  {
    id: 'ach_5',
    title: { uz: '7 Kunlik Ketma-ketlik', ru: '7 дней серии', en: '7 Day Streak' },
    description: {
      uz: '7 kun uzluksiz ta\'lim tizimidan faol foydalanish',
      ru: 'Ежедневная непрерывная активность в течение недели',
      en: 'Maintained a consecutive 7-day study streak'
    },
    badgeIcon: 'Flame',
    badgeColor: 'orange',
    criteriaPoints: 70,
    category: 'streak',
    unlockedAt: '2026-10-03T20:00:00Z'
  },
  {
    id: 'ach_6',
    title: { uz: 'Poliglot Mahorati', ru: 'Мастер языков', en: 'Language Master' },
    description: {
      uz: '3 xil xorijiy tilda mashqlarni bajarganingiz uchun',
      ru: 'Выполнение упражнений по 3 иностранным языкам',
      en: 'Successfully practiced exercises across 3 different languages'
    },
    badgeIcon: 'Globe',
    badgeColor: 'indigo',
    criteriaPoints: 150,
    category: 'languages'
  },
  {
    id: 'ach_7',
    title: { uz: 'Eng Faol O‘quvchi', ru: 'Лучший ученик', en: 'Top Student' },
    description: {
      uz: 'Sinf reytingida eng yuqori 3 talikka kirganingiz uchun',
      ru: 'Вхождение в топ-3 рейтинга класса',
      en: 'Ranked in the top 3 scholars of the cohort'
    },
    badgeIcon: 'Crown',
    badgeColor: 'amber',
    criteriaPoints: 300,
    category: 'points'
  },
  {
    id: 'ach_8',
    title: { uz: 'Namunali Davomat', ru: 'Идеальная посещаемость', en: 'Perfect Attendance' },
    description: {
      uz: 'Bir oy davomida hech qanday darsni qoldirmaslik',
      ru: '100% посещаемость всех занятий за месяц',
      en: 'Flawless 100% attendance recorded throughout the term'
    },
    badgeIcon: 'CheckCircle2',
    badgeColor: 'emerald',
    criteriaPoints: 80,
    category: 'homework'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    targetRole: 'ALL',
    title: 'EduHub tizimiga xush kelibsiz!',
    message: 'Yangi o‘quv semestri boshlandi. Shaxsiy profilingizni to‘ldiring va reytingda yetakchilik qiling.',
    type: 'info',
    read: false,
    createdAt: '2026-10-01T08:00:00Z'
  },
  {
    id: 'notif_2',
    targetRole: 'STUDENTS',
    targetUserId: 'user_student_1',
    title: 'Yangi uy vazifasi berildi',
    message: 'Nodira Karimova "Python ma\'lumotlar turlari" bo‘yicha topshiriq yukladi.',
    type: 'homework',
    read: true,
    createdAt: '2026-10-02T10:05:00Z'
  },
  {
    id: 'notif_3',
    targetRole: 'STUDENTS',
    targetUserId: 'user_student_1',
    title: 'Vazifangiz baholandi (+48 ball)',
    message: 'Python topshirig\'ingiz muvaffaqiyatli tekshirildi. O\'qituvchi xulosasi bilan tanishing.',
    type: 'point',
    read: false,
    createdAt: '2026-10-04T09:20:00Z'
  },
  {
    id: 'notif_4',
    targetRole: 'ALL',
    title: 'Akademik test e\'loni',
    message: 'Informatika fanidan choraklik sinov testlari faollashtirildi.',
    type: 'test',
    read: false,
    createdAt: '2026-10-04T12:00:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit_1',
    adminId: 'user_admin_1',
    adminName: 'Shavkat Azimov',
    action: 'USER_REGISTERED',
    targetUserId: 'user_student_3',
    targetUserName: 'Bekzod Mirzayev',
    details: 'Yangi o‘quvchi ro‘yxatga olindi va 11-B sinfiga biriktirildi',
    ipAddress: '195.158.24.12',
    userAgent: 'EduHub Secure Client / Mozilla Chrome 134',
    timestamp: '2026-10-02T14:15:30Z'
  },
  {
    id: 'audit_2',
    adminId: 'user_admin_1',
    adminName: 'Shavkat Azimov',
    action: 'SETTINGS_UPDATED',
    details: 'Kunlik bepul mashq limiti 20 taga oshirildi',
    ipAddress: '195.158.24.12',
    userAgent: 'EduHub Secure Client / Mozilla Chrome 134',
    timestamp: '2026-10-03T11:00:00Z'
  },
  {
    id: 'audit_3',
    adminId: 'user_admin_1',
    adminName: 'Shavkat Azimov',
    action: 'POINTS_RULES_MODIFIED',
    details: 'Har bir til mashqi uchun ball qiymati 15 ga o‘rnatildi',
    ipAddress: '195.158.24.12',
    userAgent: 'EduHub Secure Client / Mozilla Chrome 134',
    timestamp: '2026-10-04T08:30:00Z'
  }
];

export const INITIAL_POINT_HISTORIES: PointHistory[] = [
  {
    id: 'ph_1',
    userId: 'user_student_1',
    points: 48,
    reason: 'Python ma\'lumotlar turlari vazifasi baholandi',
    awardedBy: 'user_teacher_1',
    awardedByName: 'Nodira Karimova',
    timestamp: '2026-10-04T09:20:00Z'
  },
  {
    id: 'ph_2',
    userId: 'user_student_1',
    points: 100,
    reason: 'Algoritmlar testi 100% muvaffaqiyatli topshirildi',
    awardedBy: 'system',
    awardedByName: 'EduHub Test Engine',
    timestamp: '2026-10-02T16:30:00Z'
  },
  {
    id: 'ph_3',
    userId: 'user_student_1',
    points: 15,
    reason: 'Ingliz tili A1 lug‘at mashqi to‘g‘ri yechildi',
    awardedBy: 'system',
    awardedByName: 'EduHub Languages Engine',
    timestamp: '2026-10-03T14:10:00Z'
  }
];

// Scalable Local Store Wrapper
export class EduHubStore {
  private static getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage quota exceeded or unavailable', e);
    }
  }

  static getUsers(): User[] {
    return this.getItem('users', INITIAL_USERS);
  }

  static saveUsers(users: User[]): void {
    this.setItem('users', users);
  }

  static getClasses(): ClassItem[] {
    return this.getItem('classes', INITIAL_CLASSES);
  }

  static saveClasses(classes: ClassItem[]): void {
    this.setItem('classes', classes);
  }

  static getHomeworks(): Homework[] {
    return this.getItem('homeworks', INITIAL_HOMEWORKS);
  }

  static saveHomeworks(homeworks: Homework[]): void {
    this.setItem('homeworks', homeworks);
  }

  static getSubmissions(): HomeworkSubmission[] {
    return this.getItem('submissions', INITIAL_SUBMISSIONS);
  }

  static saveSubmissions(subs: HomeworkSubmission[]): void {
    this.setItem('submissions', subs);
  }

  static getTests(): TestItem[] {
    return this.getItem('tests', INITIAL_TESTS);
  }

  static saveTests(tests: TestItem[]): void {
    this.setItem('tests', tests);
  }

  static getTestSubmissions(): TestSubmission[] {
    return this.getItem('test_submissions', INITIAL_TEST_SUBMISSIONS);
  }

  static saveTestSubmissions(subs: TestSubmission[]): void {
    this.setItem('test_submissions', subs);
  }

  static getAttendance(): AttendanceRecord[] {
    return this.getItem('attendance', INITIAL_ATTENDANCE);
  }

  static saveAttendance(att: AttendanceRecord[]): void {
    this.setItem('attendance', att);
  }

  static getLanguageExercises(): LanguageExercise[] {
    return this.getItem('lang_exercises', INITIAL_LANGUAGE_EXERCISES);
  }

  static saveLanguageExercises(exs: LanguageExercise[]): void {
    this.setItem('lang_exercises', exs);
  }

  static getAchievements(): Achievement[] {
    return this.getItem('achievements', INITIAL_ACHIEVEMENTS);
  }

  static saveAchievements(ach: Achievement[]): void {
    this.setItem('achievements', ach);
  }

  static getAuditLogs(): AuditLog[] {
    return this.getItem('audit_logs', INITIAL_AUDIT_LOGS);
  }

  static addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const logs = this.getAuditLogs();
    const newEntry: AuditLog = {
      ...log,
      id: 'audit_' + Date.now(),
      timestamp: new Date().toISOString()
    };
    logs.unshift(newEntry);
    this.setItem('audit_logs', logs.slice(0, 100)); // retain last 100 audit entries
  }

  static getNotifications(): NotificationItem[] {
    return this.getItem('notifications', INITIAL_NOTIFICATIONS);
  }

  static addNotification(notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>): void {
    const notifs = this.getNotifications();
    const newEntry: NotificationItem = {
      ...notif,
      id: 'notif_' + Date.now(),
      read: false,
      createdAt: new Date().toISOString()
    };
    notifs.unshift(newEntry);
    this.setItem('notifications', notifs);
  }

  static getPointHistories(): PointHistory[] {
    return this.getItem('point_histories', INITIAL_POINT_HISTORIES);
  }

  static addPointHistory(ph: Omit<PointHistory, 'id' | 'timestamp'>): void {
    const histories = this.getPointHistories();
    const newEntry: PointHistory = {
      ...ph,
      id: 'ph_' + Date.now(),
      timestamp: new Date().toISOString()
    };
    histories.unshift(newEntry);
    this.setItem('point_histories', histories);
  }

  static getSettings(): AdminSettings {
    return this.getItem('settings', INITIAL_SETTINGS);
  }

  static saveSettings(settings: AdminSettings): void {
    this.setItem('settings', settings);
  }
}
