import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParamProps } from "@/types/appNode";
import { useEffect, useId, useRef } from "react";

const StringParam = ({ param, value, updateNodeParamValue }: ParamProps) => {
  const id = useId();
  const internalValueRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (internalValueRef.current && value !== undefined) internalValueRef.current.value = value;
  }, [value]);

  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <span className="text-red-400 px-2">*</span>}
      </Label>
      <Input
        id={id}
        type="text"
        placeholder={param.description}
        ref={internalValueRef}
        onBlur={(e) => updateNodeParamValue(e.target.value)}
      />
      {param.helperText && <p className="text-muted-foreground px-2">{param.helperText}</p>}
    </div>
  );
};

export default StringParam;
