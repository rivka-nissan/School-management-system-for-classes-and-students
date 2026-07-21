import { Form, Input, Select, Modal } from 'antd';
import type { Student, CreateStudentDto, UpdateStudentDto } from '../../types';

interface Props {
  open: boolean;
  classId: number;
  student?: Student;
  onSubmit: (values: CreateStudentDto | UpdateStudentDto) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'פעיל' },
  { value: 'INACTIVE', label: 'לא פעיל' },
];

export function StudentFormModal({ open, classId, student, onSubmit, onCancel, loading }: Props) {
  const [form] = Form.useForm();
  const isEdit = !!student;

  const handleOk = async () => {
    const values = await form.validateFields();
    await onSubmit(isEdit ? values : { ...values, classId });
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      title={isEdit ? 'עריכת תלמיד' : 'הוספת תלמיד'}
      onOk={handleOk}
      onCancel={() => { form.resetFields(); onCancel(); }}
      confirmLoading={loading}
      okText={isEdit ? 'שמור' : 'הוסף'}
      cancelText="ביטול"
    >
      <Form form={form} layout="vertical" initialValues={student} dir="rtl">
        <Form.Item name="identityNumber" label="תעודת זהות" rules={[{ required: true, message: 'שדה חובה' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="firstName" label="שם פרטי" rules={[{ required: true, message: 'שדה חובה' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="lastName" label="שם משפחה" rules={[{ required: true, message: 'שדה חובה' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="parentPhone" label="טלפון הורה" rules={[{ required: true, message: 'שדה חובה' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="status" label="סטטוס" rules={[{ required: true, message: 'שדה חובה' }]}>
          <Select options={STATUS_OPTIONS} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
