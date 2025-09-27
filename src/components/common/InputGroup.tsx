import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface InputGroupProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  id,
  value,
  onChange,
  ...rest
}) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value as any} onChange={onChange} {...rest} />
    </div>
  );
};

export default InputGroup;
