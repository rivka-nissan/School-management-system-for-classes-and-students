# GoodAsik — Architecture & Flow Documentation

## תוכן עניינים
1. [סקירה כללית](#סקירה-כללית)
2. [מבנה הפרויקט](#מבנה-הפרויקט)
3. [Backend — שכבות ותהליכים](#backend)
4. [Frontend — שכבות ותהליכים](#frontend)
5. [זרימת נתונים מלאה](#זרימת-נתונים-מלאה)
6. [ממשקי API](#ממשקי-api)

---

## סקירה כללית

GoodAsik היא אפליקציית Full Stack לניהול כיתות ותלמידים.

```
Browser (React)
     │  HTTP (fetch via RTK Query)
     ▼
NestJS Server :3000
     │  In-Memory (loaded from JSON on startup)
     ▼
classes.json / students.json
```

- ה-Backend טוען את קבצי ה-JSON **פעם אחת** בעת עליית השרת לזיכרון.
- כל שינוי (הוספה/עריכה/מחיקה) מתבצע **בזיכרון בלבד** — לא נשמר לדיסק.
- ה-Frontend מתקשר עם ה-Backend דרך **RTK Query** ומרענן אוטומטית לאחר כל mutation.

---

## מבנה הפרויקט

```
GoodAsik/
├── backend/
│   └── src/
│       ├── data/
│       │   ├── classes.json          ← נתוני התחלה לכיתות
│       │   └── students.json         ← נתוני התחלה לתלמידים
│       ├── classes/
│       │   ├── classes.module.ts     ← רישום providers ו-controllers
│       │   ├── classes.controller.ts ← HTTP routing (GET/POST/PATCH/DELETE)
│       │   ├── classes.service.ts    ← לוגיקה עסקית
│       │   └── classes.service.spec.ts ← unit tests
│       ├── students/
│       │   ├── students.module.ts
│       │   ├── students.controller.ts
│       │   ├── students.service.ts
│       │   └── students.service.spec.ts
│       ├── data.service.ts           ← טעינת JSON לזיכרון (singleton)
│       ├── types.ts                  ← interfaces משותפים לכל ה-backend
│       ├── app.module.ts             ← root module
│       └── main.ts                   ← bootstrap + CORS
│
└── frontend/
    └── src/
        ├── api/
        │   └── index.ts              ← כל ה-RTK Query endpoints
        ├── components/
        │   ├── AppLayout.tsx         ← Layout גנרי (Header + Sidebar + Content)
        │   ├── QueryWrapper.tsx      ← טיפול גנרי ב-Loading/Error
        │   ├── StudentForm/
        │   │   └── StudentFormModal.tsx ← Modal הוספה/עריכת תלמיד
        │   └── ClassForm/
        │       └── ClassFormModal.tsx   ← Modal הוספה/עריכת כיתה
        ├── hooks/
        │   └── useDebounce.ts        ← debounce גנרי לחיפוש
        ├── pages/
        │   ├── Classes/ClassesPage.tsx   ← מסך כיתות + CRUD
        │   ├── Students/StudentsPage.tsx ← מסך תלמידים + חיפוש + CRUD
        │   └── About/AboutPage.tsx       ← עמוד סטטי
        ├── store/index.ts            ← Redux store
        ├── types/index.ts            ← TypeScript interfaces
        ├── __tests__/
        │   ├── useDebounce.test.ts
        │   └── QueryWrapper.test.ts
        └── App.tsx                   ← Router + Provider + ConfigProvider
```

---

## Backend

### שכבת הנתונים — DataService

```
┌─────────────────────────────────────────────┐
│               DataService                   │
│  (OnModuleInit — רץ פעם אחת בעת עליית שרת) │
│                                             │
│  classes: Class[]   ← classes.json          │
│  students: Student[] ← students.json        │
└─────────────────────────────────────────────┘
```

- `DataService` הוא **singleton** — מוזרק לכל ה-services דרך Dependency Injection.
- כל ה-services עובדים על **אותו מערך בזיכרון**, כך שהנתונים תמיד עקביים.
- `studentsCount` בכיתה **מחושב דינמית** בכל קריאה — לא נשמר, תמיד מדויק.

### שכבת הלוגיקה — Services

```
ClassesService                    StudentsService
─────────────────────────         ─────────────────────
findAll()                         create(dto)
  → map classes                     → push to students[]
  → count students per class        → return new student
  → return with studentsCount
                                  update(id, dto)
findOne(id)                         → find by id
  → find or throw 404               → merge with dto
                                    → return updated
create(dto)
  → generate new id
  → push to classes[]

update(id, dto)
  → find or throw 404
  → merge with dto

remove(id)
  → find or throw 404
  → splice from classes[]

getStudents(id)
  → validate class exists
  → filter students by classId
```

### שכבת ה-HTTP — Controllers

```
HTTP Request
     │
     ▼
┌─────────────────────────────────────────────────────┐
│                  ClassesController                  │
│                                                     │
│  GET    /classes           → findAll()              │
│  GET    /classes/:id       → findOne(id)            │
│  GET    /classes/:id/students → getStudents(id)     │
│  POST   /classes           → create(body)           │
│  PATCH  /classes/:id       → update(id, body)       │
│  DELETE /classes/:id       → remove(id)             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                 StudentsController                  │
│                                                     │
│  POST   /students          → create(body)           │
│  PATCH  /students/:id      → update(id, body)       │
└─────────────────────────────────────────────────────┘
```

- `ParseIntPipe` מוודא שה-`:id` הוא מספר תקין לפני שמגיע ל-service.
- שגיאות `NotFoundException` מוחזרות אוטומטית כ-404 על ידי NestJS.

---

## Frontend

### שכבת ה-State — Redux + RTK Query

```
┌──────────────────────────────────────────────────────────┐
│                      Redux Store                         │
│                                                          │
│  api.reducer                                             │
│  ├── cache: { Classes: [...], Students: { 1: [...] } }   │
│  ├── loading states                                      │
│  └── error states                                        │
└──────────────────────────────────────────────────────────┘
```

כל ה-API calls מוגדרים בקובץ אחד (`api/index.ts`):

```
Queries (GET):                    Mutations (POST/PATCH/DELETE):
──────────────────────────        ──────────────────────────────
useGetClassesQuery()              useCreateClassMutation()
  providesTags: ['Classes']         invalidatesTags: ['Classes']

useGetClassQuery(id)              useUpdateClassMutation()
  providesTags: [{Classes, id}]     invalidatesTags: ['Classes']

useGetStudentsByClassQuery(id)    useDeleteClassMutation()
  providesTags: [{Students, id}]    invalidatesTags: ['Classes']

                                  useCreateStudentMutation()
                                    invalidatesTags: [{Students,classId}, 'Classes']
                                    ↑ מרענן גם את מספר התלמידים בכיתה!

                                  useUpdateStudentMutation()
                                    invalidatesTags: [{Students, classId}]
```

**tagTypes** מבטיחים שאחרי כל mutation הנתונים הרלוונטיים מתרעננים אוטומטית.

### שכבת הקומפוננטות — ארכיטקטורה

```
App.tsx
├── Provider (Redux)
├── ConfigProvider (Ant Design RTL + Hebrew)
└── BrowserRouter
    └── Routes
        └── AppLayout (Header + Sidebar + Outlet)
            ├── /classes        → ClassesPage
            ├── /classes/:id/students → StudentsPage
            └── /about          → AboutPage
```

#### קומפוננטות גנריות (שימוש חוזר)

```
QueryWrapper
─────────────────────────────────────────
Props: { isLoading, isError, errorMessage, children }

isLoading=true  → <Spin />
isError=true    → <Alert type="error" />
else            → {children}

משמש ב: ClassesPage, StudentsPage
─────────────────────────────────────────

StudentFormModal
─────────────────────────────────────────
Props: { open, classId, student?, onSubmit, onCancel, loading }

student=undefined → מצב הוספה (POST /students)
student=Student   → מצב עריכה (PATCH /students/:id)

Form fields: identityNumber, firstName, lastName, parentPhone, status
─────────────────────────────────────────

ClassFormModal
─────────────────────────────────────────
Props: { open, cls?, onSubmit, onCancel, loading }

cls=undefined → מצב הוספה
cls=Class     → מצב עריכה

Form fields: name, grade, homeroomTeacher
─────────────────────────────────────────

useDebounce<T>(value, delay=400)
─────────────────────────────────────────
מחזיר ערך מעוכב — מונע קריאות API מיותרות
משמש ב: StudentsPage (חיפוש שם + חיפוש ת.ז.)
```

### זרימת מסך התלמידים — חיפוש ופילטר

```
User types in search box
        │
        ▼
nameSearch state (updates immediately — UI responsive)
        │
        ▼
useDebounce(nameSearch, 400ms)
        │  ← מחכה 400ms מהקלדה אחרונה
        ▼
debouncedName
        │
        ▼
useMemo filter (runs only when debouncedName/debouncedId/statusFilter change)
        │
        ▼
filtered students array → Table
```

הפילטר רץ **client-side** על הנתונים שכבר נטענו — אין קריאת API נוספת לכל הקלדה.

---

## זרימת נתונים מלאה

### דוגמה: הוספת תלמיד חדש

```
1. User clicks "הוסף תלמיד"
        │
        ▼
2. StudentFormModal opens (student=undefined → Add mode)
        │
        ▼
3. User fills form → clicks "הוסף"
        │
        ▼
4. form.validateFields() → values object
        │
        ▼
5. createStudent({ ...values, classId }) [RTK Query mutation]
        │  POST /students
        ▼
6. NestJS StudentsController.create(dto)
        │
        ▼
7. StudentsService.create(dto)
   → newId = max(ids) + 1
   → push to data.students[]
   → return new student
        │
        ▼
8. RTK Query receives 201 response
   → invalidates tag: { Students, classId }
   → invalidates tag: 'Classes'  ← מרענן את studentsCount!
        │
        ▼
9. useGetStudentsByClassQuery re-fetches automatically
   useGetClassesQuery re-fetches automatically
        │
        ▼
10. Table updates with new student
    Classes table shows updated studentsCount
        │
        ▼
11. message.success('התלמיד נוסף בהצלחה')
    Modal closes
```

### דוגמה: ניווט לכיתה

```
1. User clicks on class row in ClassesPage
        │
        ▼
2. onRow onClick → navigate(`/classes/${record.id}/students`)
        │
        ▼
3. React Router renders StudentsPage
   useParams() → { classId: "1" }
        │
        ▼
4. useGetClassQuery(1)        → GET /classes/1
   useGetStudentsByClassQuery(1) → GET /classes/1/students
        │
        ▼
5. RTK Query checks cache:
   - HIT  → returns cached data immediately
   - MISS → fetches from server, caches result
        │
        ▼
6. Table renders with students
   Header shows class name
```

---

## ממשקי API

### Types משותפים

```typescript
interface Class {
  id: number;
  name: string;          // "כיתה א1"
  grade: string;         // "א"
  homeroomTeacher: string;
  studentsCount: number; // מחושב דינמית
}

interface Student {
  id: number;
  classId: number;
  identityNumber: string;
  firstName: string;
  lastName: string;
  parentPhone: string;
  status: 'ACTIVE' | 'INACTIVE';
}
```

### Endpoints

| Method | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/classes` | — | `Class[]` |
| GET | `/classes/:id` | — | `Class` |
| GET | `/classes/:id/students` | — | `Student[]` |
| POST | `/classes` | `{ name, grade, homeroomTeacher }` | `Class` |
| PATCH | `/classes/:id` | `Partial<{ name, grade, homeroomTeacher }>` | `Class` |
| DELETE | `/classes/:id` | — | `void` |
| POST | `/students` | `Omit<Student, 'id'>` | `Student` |
| PATCH | `/students/:id` | `Partial<Omit<Student, 'id'>>` | `Student` |
