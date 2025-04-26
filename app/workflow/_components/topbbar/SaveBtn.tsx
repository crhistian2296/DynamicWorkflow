import { Button } from "@/components/ui/button";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon, SaveIcon } from "lucide-react";
import { useState } from "react";

const SaveBtn = () => {
  const [clicked, setClicked] = useState(false);
  const { toObject } = useReactFlow();
  return (
    <Button
      variant={"outline"}
      disabled={clicked}
      onClick={() => {
        console.log("@Flow", toObject());
        setClicked(true);
        // alert("Save");
        setTimeout(() => {
          setClicked(false);
        }, 3000);
      }}
    >
      Save
      {/* Contenedor para los iconos */}
      <span className="relative overflow-hidden h-5 w-5">
        <SaveIcon
          className={`absolute inset-0.5 h-5 w-5 transition-opacity duration-300 ease-in-out ${
            !clicked ? "opacity-100" : "opacity-0"
          }`}
        />
        <CheckIcon
          className={`absolute inset-0.5 h-5 w-5 stroke-green-400 transition-opacity duration-300 ease-in-out ${
            clicked ? "opacity-100" : "opacity-0"
          }`}
        />
      </span>
    </Button>
  );
};

export default SaveBtn;
