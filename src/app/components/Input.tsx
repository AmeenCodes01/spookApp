import React from "react";

type Props = {
  plc: string;
};

function Input({plc}: Props) {
  return (
    <div>
      <input placeholder={plc} />
    </div>
  );
}

export default Input;
