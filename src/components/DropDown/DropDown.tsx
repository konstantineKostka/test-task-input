import React, {useRef} from "react";
import classNames from "classnames";

import useOnClickOutside from "../../hooks/useOnClickOutside";

import s from "./DropDown.module.css";

interface Props {
  open?: boolean;
  onClose: () => void;
}

const DropDown: React.FC<Props> = ({children, open = false, onClose}) => {
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, onClose);

  return (
    <div className={classNames(s.dropdown, open && s.expanded)} ref={ref}>
      {children}
    </div>
  )
}

export default DropDown;