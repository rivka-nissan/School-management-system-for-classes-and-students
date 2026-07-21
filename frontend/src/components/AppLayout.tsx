import { Layout, Menu } from 'antd';
import { BookOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

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
      <Header style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>בית ספר בית יעקב</span>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={MENU_ITEMS}
            onClick={({ key }) => navigate(key)}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>
        <Content style={{ padding: 24, background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
