import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InputGroupProps {
  label: string;
  id: string;
  type?: 'text' | 'number' | 'select';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  step?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  min?: number;
  max?: number;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  step,
  options = [],
  required = false,
  min,
  max
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      
      {type === 'select' ? (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id={id}>
            <SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          step={step}
          min={min}
          max={max}
          required={required}
        />
      )}
    </div>
  );
};