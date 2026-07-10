import { useState } from 'react';

export function useForm(initialValues, onSubmit) {
  const [form, setForm] = useState(initialValues);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function setFormError(errorMessage) {
    setError(errorMessage);
  }

  return {
    form,
    setForm,
    error,
    setError: setFormError,
    loading,
    handleChange,
    handleSubmit,
  };
}