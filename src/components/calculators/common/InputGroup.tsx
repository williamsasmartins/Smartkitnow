import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface InputGroupProps {
  label: string;
  id: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

export const InputGroup = ({ label, id, type = 'text', value, onChange, placeholder, required = false }: InputGroupProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} />
    </div>
  );
};