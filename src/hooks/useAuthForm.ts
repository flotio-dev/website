import { useState } from 'react';

export interface AuthFormFields {
  email: string;
  username?: string;
  password: string;
  confirmPassword?: string;
}

export type AuthMode = 'login' | 'register';

export const useAuthForm = (mode: AuthMode) => {
  const [formData, setFormData] = useState<AuthFormFields>({
    email: '',
    username: '',
    password: '',
    ...(mode === 'register' && { confirmPassword: '' }),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof AuthFormFields, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (
    e: React.FormEvent,
    onSubmit: (data: AuthFormFields) => Promise<any>
  ) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err: any) {
       setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      username: '',
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
    error,
  };
};
