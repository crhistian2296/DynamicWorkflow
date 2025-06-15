import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ParamProps } from "@/types/appNode";
import { useEffect, useId, useRef } from "react";

const StringParam = ({ param, value, updateNodeParamValue, disabled }: ParamProps) => {
  const id = useId();
  const internalValueRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (internalValueRef.current) {
      if (value === undefined) internalValueRef.current.value = "";
      if (value !== undefined) internalValueRef.current.value = value;
    }
  }, [value]);

  let Component: any = Input;
  if (param.variant === "textarea") Component = Textarea;

  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <span className="text-red-400 px-2">*</span>}
      </Label>
      <Component
        id={id}
        type="text"
        disabled={disabled}
        placeholder={param.description}
        ref={internalValueRef}
        onBlur={(e: any) => updateNodeParamValue(e.target?.value)}
        onDoubleClick={(e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          if (internalValueRef.current) {
            internalValueRef.current.select();
          }
        }}
      />
      {param.helperText && <p className="text-muted-foreground px-2">{param.helperText}</p>}
    </div>
  );
};

export default StringParam;
