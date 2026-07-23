import { Table, Button, Popconfirm, Space, message, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  useGetClassesQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} from '../../api';
import { QueryWrapper } from '../../components/QueryWrapper';
import { ClassFormModal } from '../../components/ClassForm/ClassFormModal';
import type { Class, CreateClassDto, UpdateClassDto } from '../../types';

const ROW_COLORS = ['#f0f5ff', '#f6ffed', '#fff7e6', '#fff0f6'];

export function ClassesPage() {
  const navigate = useNavigate();
  const { data: classes, isLoading, isError } = useGetClassesQuery();
  const [createClass, { isLoading: creating }] = useCreateClassMutation();
  const [updateClass, { isLoading: updating }] = useUpdateClassMutation();
  const [deleteClass] = useDeleteClassMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | undefined>();

  const openAdd = () => { setEditingClass(undefined); setModalOpen(true); };
  const openEdit = (cls: Class, e: React.MouseEvent) => { e.stopPropagation(); setEditingClass(cls); setModalOpen(true); };

  const handleSubmit = async (values: CreateClassDto | UpdateClassDto) => {
    if (editingClass) {
      await updateClass({ id: editingClass.id, body: values as UpdateClassDto }).unwrap();
      message.success('הכיתה עודכנה בהצלחה');
    } else {
      await createClass(values as CreateClassDto).unwrap();
      message.success('הכיתה נוספה בהצלחה');
    }
    setModalOpen(false);
  };

  const handleDelete = async (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    await deleteClass(id).unwrap();
    message.success('הכיתה נמחקה');
  };

  const columns = [
    { title: 'שם הכיתה', dataIndex: 'name', key: 'name', width: '25%' },
    { title: 'שכבה', dataIndex: 'grade', key: 'grade', width: '15%' },
    { title: 'מחנכת', dataIndex: 'homeroomTeacher', key: 'homeroomTeacher', width: '30%' },
    {
      title: 'מספר תלמידות',
      dataIndex: 'studentsCount',
      key: 'studentsCount',
      width: '15%',
      render: (count: number) => (
        <span style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          borderRadius: 12,
          padding: '2px 12px',
          fontWeight: 600,
          fontSize: 13,
        }}>
          {count}
        </span>
      ),
    },
    {
      title: 'פעולות',
      key: 'actions',
      width: '15%',
      render: (_: unknown, record: Class) => (
        <Space onClick={(e) => e.stopPropagation()}>
          <Button
            icon={<EditOutlined />}
            size="small"
            style={{ borderColor: '#667eea', color: '#667eea' }}
            onClick={(e) => openEdit(record, e)}
          />
          <Popconfirm title="למחוק את הכיתה?" onConfirm={(e) => handleDelete(record.id, e as React.MouseEvent)} okText="כן" cancelText="לא">
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>כיתות</h2>
          <p style={{ margin: 0, color: '#888', fontSize: 13 }}>לחצי על כיתה לצפייה בתלמידים</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openAdd}
          style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            border: 'none',
            borderRadius: 8,
            height: 38,
            fontWeight: 600,
          }}
        >
          הוסף כיתה
        </Button>
      </div>

      <Card style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: 'none' }}>
        <QueryWrapper isLoading={isLoading} isError={isError}>
          <Table
            dataSource={classes}
            columns={columns}
            rowKey="id"
            rowClassName={(_, index) => `row-${index % 4}`}
            onRow={(record) => ({
              onClick: () => navigate(`/classes/${record.id}/students`),
              style: {
                cursor: 'pointer',
                background: ROW_COLORS[(classes?.indexOf(record) ?? 0) % ROW_COLORS.length],
              },
            })}
            pagination={false}
          />
        </QueryWrapper>
      </Card>

      <ClassFormModal
        open={modalOpen}
        cls={editingClass}
        onSubmit={handleSubmit}
        onCancel={() => setModalOpen(false)}
        loading={creating || updating}
      />
    </div>
  );
}
