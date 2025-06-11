import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Alert,
  Space,
  Avatar,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  LoginOutlined,
  SafetyOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface LoginFormProps {
  onLogin: (username: string, password: string) => boolean;
}

interface LoginValues {
  username: string;
  password: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [form] = Form.useForm<LoginValues>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (values: LoginValues) => {
    setLoading(true);
    setError("");

    try {
      // Simulate async login
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const success = onLogin(values.username, values.password);

      if (!success) {
        setError("Невалидно корисничко име или лозинка");
      }
    } catch {
      setError("Настана грешка при најавување");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Avatar
            size={80}
            icon={<SafetyOutlined />}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 mb-4"
          />
          <Title level={2} className="text-gray-800 mb-2">
            Админ панел
          </Title>
          <Text className="text-gray-600">
            Најавете се за пристап до системот
          </Text>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl rounded-2xl border-0 bg-white/90 backdrop-blur-sm">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            size="large"
            autoComplete="off"
          >
            <Space direction="vertical" size="large" className="w-full">
              {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  className="rounded-lg"
                />
              )}

              <Form.Item
                label="Корисничко име"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Ве молиме внесете корисничко име",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="admin"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                label="Лозинка"
                name="password"
                rules={[
                  { required: true, message: "Ве молиме внесете лозинка" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Внесете лозинка"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<LoginOutlined />}
                  className="w-full h-12 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 border-0 text-lg font-semibold"
                >
                  Најави се
                </Button>
              </Form.Item>
            </Space>
          </Form>
        </Card>

        {/* Footer */}
      </div>
    </div>
  );
};
