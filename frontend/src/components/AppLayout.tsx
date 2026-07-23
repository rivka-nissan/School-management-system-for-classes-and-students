import { Layout, Menu } from 'antd';
import { BookOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Sider, Content } = Layout;

const MENU_ITEMS = [
  { key: '/classes', icon: <BookOutlined />, label: 'כיתות' },
  { key: '/about', icon: <InfoCircleOutlined />, label: 'אודות' },
];

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = MENU_ITEMS.find((item) => location.pathname.startsWith(item.key))?.key ?? '/classes';

  return (
    <Layout style={{ minHeight: '100vh' }} dir="rtl">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '0 32px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(102,126,234,0.4)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
          }}>
            🏫
          </div>
          <div>
            <div style={{ color: 'white', fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>
              בית ספר בית יעקב
            </div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>
              מערכת ניהול תלמידים וכיתות
            </div>
          </div>
        </div>
      </div>

      <Layout>
        <Sider
          width={200}
          style={{
            background: '#fff',
            boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={MENU_ITEMS}
            onClick={({ key }) => navigate(key)}
            style={{ height: '100%', borderRight: 0, paddingTop: 16 }}
          />
        </Sider>

        <Content style={{
          padding: 32,
          background: '#f0f2f5',
          minHeight: 'calc(100vh - 64px)',
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
