import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import heIL from 'antd/locale/he_IL';
import { store } from './store';
import { AppLayout } from './components/AppLayout';
import { ClassesPage } from './pages/Classes/ClassesPage';
import { StudentsPage } from './pages/Students/StudentsPage';
import { AboutPage } from './pages/About/AboutPage';

export default function App() {
  return (
    <Provider store={store}>
      <ConfigProvider locale={heIL} direction="rtl">
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/classes" replace />} />
              <Route path="/classes" element={<ClassesPage />} />
              <Route path="/classes/:classId/students" element={<StudentsPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  );
}
