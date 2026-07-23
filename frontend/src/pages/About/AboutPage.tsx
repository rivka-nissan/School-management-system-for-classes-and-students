import { Card, Typography, Divider } from 'antd';

const { Title, Paragraph, Text } = Typography;

export function AboutPage() {
  return (
    <Card
      style={{ maxWidth: 640, margin: '0 auto', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}
      styles={{ body: { padding: 40 } }}
    >
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 4 }}>בית ספר בית יעקב</Title>
        <Text type="secondary" style={{ fontSize: 16 }}>מוסד חינוך לבנות על שם הרבנית מרים שניאורסון</Text>
      </div>

      <Divider />

      <Paragraph style={{ fontSize: 15, lineHeight: 2 }}>
        בית ספר בית יעקב הוא מוסד חינוכי ייחודי הפועל למען חינוך הבנים על פי ערכי התורה והמסורת היהודית.
      המערכת אופיינה ופותחה על ידי רבקה מערכות בע"מ
      </Paragraph>

      <Paragraph style={{ fontSize: 15, lineHeight: 2 }}>
        אנו מציעים סביבה לימודית חמה ותומכת, שבה כל תלמיד מקבל את הכלים הדרושים לו — הן בלימודי
        קודש והן בלימודי חול — כדי לצמוח ולהתפתח .
      </Paragraph>

      <Divider />

      <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
        <div>
          <Title level={3} style={{ color: '#1677ff', marginBottom: 4 }}>4</Title>
          <Text type="secondary">כיתות</Text>
        </div>
        <div>
          <Title level={3} style={{ color: '#1677ff', marginBottom: 4 }}>24</Title>
          <Text type="secondary">תלמידות</Text>
        </div>
        <div>
          <Title level={3} style={{ color: '#1677ff', marginBottom: 4 }}>4</Title>
          <Text type="secondary">מחנכות</Text>
        </div>
      </div>
    </Card>
  );
}
