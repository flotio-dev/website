import { useState } from 'react';

export interface AuthFormFields {
  email: string;
  password: string;
  confirmPassword?: string;
}

export type AuthMode = 'login' | 'register';

export const useAuthForm = (mode: AuthMode) => {
  const [formData, setFormData] = useState<AuthFormFields>({
    email: '',
    password: '',
    ...(mode === 'register' && { confirmPassword: '' }),
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof AuthFormFields, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Add authentication logic here
    setTimeout(() => setLoading(false), 1000);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      ...(mode === 'register' && { confirmPassword: '' }),
    });
  };

  return {
    formData,
    loading,
    handleChange,
    handleSubmit,
    resetForm,
  };
};
