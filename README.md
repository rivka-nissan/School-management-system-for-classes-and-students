#  — מערכת לניהול מוסדות חינוך

## הוראות הרצה

### Backend
```bash
cd backend
npm install
npm run start:dev
```
השרת יעלה על `http://localhost:3000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
האפליקציה תעלה על `http://localhost:5173`

### בדיקות Backend
```bash
cd backend
npm run test
```

### בדיקות Frontend
```bash
cd frontend
npm run test
```

---

## מבנה הפרויקט

```
GoodAsik/
├── ARCHITECTURE.md         ← תיעוד מפורט של כל השכבות והזרימות
├── backend/
│   └── src/
│       ├── data/               ← classes.json, students.json
│       ├── classes/            ← Module, Controller, Service, Tests
│       ├── students/           ← Module, Controller, Service, Tests
│       ├── data.service.ts     ← טעינת JSON לזיכרון (singleton)
│       ├── types.ts            ← interfaces משותפים
│       └── main.ts             ← bootstrap + CORS
└── frontend/
    └── src/
        ├── api/                ← כל RTK Query endpoints במקום אחד
        ├── components/
        │   ├── AppLayout.tsx   ← Layout גנרי עם Header + Sidebar
        │   ├── QueryWrapper.tsx ← טיפול גנרי ב-Loading/Error
        │   ├── StudentForm/    ← Modal הוספה/עריכת תלמיד
        │   └── ClassForm/      ← Modal הוספה/עריכת כיתה
        ├── hooks/
        │   └── useDebounce.ts  ← debounce גנרי
        ├── pages/
        │   ├── Classes/        ← מסך כיתות + CRUD מלא
        │   ├── Students/       ← מסך תלמידים + חיפוש + CRUD
        │   └── About/          ← עמוד סטטי
        ├── store/              ← Redux store
        ├── types/              ← TypeScript interfaces
        └── __tests__/          ← unit tests
```

---

## החלטות מרכזיות

**DataService יחיד ב-Backend**
שירות אחד טוען את ה-JSON לזיכרון ב-`OnModuleInit` ומוזרק לכל ה-services דרך DI. כך כל ה-modules עובדים על אותו מערך בזיכרון והנתונים תמיד עקביים — הוספת תלמיד מתבצעת על אותו מערך שממנו קוראים את רשימת התלמידים.

**studentsCount מחושב דינמית**
`ClassesService.findAll()` סופר את התלמידים בפועל בכל קריאה במקום להסתמך על הערך ב-JSON. כך לאחר הוספת תלמיד, מספר התלמידים בכיתה מתעדכן אוטומטית ללא כל לוגיקה נוספת.

**RTK Query עם tagTypes**
כל mutation מגדיר `invalidatesTags` מדויק. הוספת תלמיד מבטלת גם את ה-cache של הכיתה (כדי לרענן את `studentsCount`) וגם את ה-cache של רשימת התלמידים. כך הנתונים תמיד מעודכנים ללא קריאות מיותרות.

**QueryWrapper גנרי**
קומפוננטה אחת מטפלת במצבי Loading ו-Error בכל המסכים. כל page מעביר `isLoading` ו-`isError` מ-RTK Query ומקבל Spinner או Alert בהתאם — ללא כפילות קוד.

**useDebounce מופרד**
ה-hook מופרד לקובץ עצמאי ומשמש לשני שדות החיפוש במסך התלמידים. הפילטר רץ client-side על הנתונים הקיימים — אין קריאת API לכל הקלדה.

**Modal גנרי לפי מצב**
`StudentFormModal` ו-`ClassFormModal` מזהים לבד אם הם במצב הוספה או עריכה לפי האם קיבלו `student`/`cls` prop. אותה קומפוננטה, שני שימושים.

**CRUD מלא לכיתות (בונוס)**
אותו pattern בדיוק כמו תלמידים — `Popconfirm` למחיקה, Modal לעריכה/הוספה, invalidation אוטומטי.

---

## שיפורים עתידיים

**Pagination**
הטבלאות כרגע מציגות את כל הנתונים. עם נתונים גדולים (מאות כיתות, אלפי תלמידים) יש צורך ב-pagination — עדיף server-side עם `?page=&limit=` כדי לא לטעון הכל לזיכרון.

**Validation מתקדם**
כרגע הvalidation הוא רק "שדה חובה". ראוי להוסיף: בדיקת ת.ז. תקינה (ספרת ביקורת), פורמט טלפון ישראלי, ייחודיות ת.ז. במערכת.

**Persistence — מסד נתונים**
המעבר ל-PostgreSQL + TypeORM יאפשר שמירת נתונים בין הפעלות. ה-DataService יוחלף ב-TypeORM repositories, ה-interfaces יהפכו ל-entities.

**Authentication**
הגנה על ה-API עם JWT. כרגע כל אחד יכול לקרוא ולשנות נתונים. יש להוסיף `AuthGuard` על ה-endpoints הרגישים.

**Error Boundary גלובלי**
`QueryWrapper` מטפל בשגיאות ברמת הקומפוננטה, אבל שגיאות JavaScript לא צפויות יקרסו את האפליקציה. Error Boundary גלובלי ב-React יתפוס אותן ויציג מסך שגיאה ידידותי.

**E2E Tests**
הבדיקות הקיימות הן unit tests. Playwright או Cypress יאפשרו בדיקת זרימות מלאות: ניווט לכיתה, הוספת תלמיד, בדיקה שהוא מופיע ברשימה ושה-studentsCount התעדכן.

**Optimistic Updates**
כרגע לאחר mutation ממתינים לתשובת השרת לפני עדכון ה-UI. עם optimistic updates ה-UI יתעדכן מיד ויחזור אחורה רק אם השרת החזיר שגיאה — חוויה חלקה יותר.
